const got = require("got");
const graph = require("../graph");
const R = require("ramda");
const format = require('date-fns/fp/format')
const { red, bold } = require("kleur")
const parseISO = require('date-fns/fp/parseISO')
const differenceInWeeks = require('date-fns/differenceInWeeks')


let mapNeighbors = n => ({
  connection: {
    id: n.id,
    prayerCount: n.prayerCount,
  },
  neighbor: { ...n.neighbor }
});


// ↓ Pick neighbors with the lowest prayer counts.
let pickNeighbors = neighbors => {
  let zeroPrayers = R.filter(R.propEq("prayerCount", 0), neighbors);
  let onePrayers = R.filter(R.propEq("prayerCount", 1), neighbors);
  let weekNeighbors = zeroPrayers;
  if (weekNeighbors.length >= 5) {
    return R.take(5, weekNeighbors)
  }
  if (weekNeighbors.length < 5) {
    return R.concat(zeroPrayers, R.take(R.subtract(5, weekNeighbors.length), onePrayers))
  }
}

// ↓ Returns the number of weeks since the beginning of EH campaign
let dateSinceStart = (date) => {
  let current = parseISO(date);
  let start = parseISO("2020-01-05")
  return differenceInWeeks(current, start)
}


// ↓ Creates a connection between 1 week and 1 neighbor.
// let makeConnection = async (weekID, neighborID) => {
//   gotOpts.json = { query: graph.createWeekNeighborConnection, variables: { input: { weekID, neighborID } } };
//   return got(gotOpts)
// }

// ↓ Creates the week on AppSync, returns new week ID
let makeWeek = async (date, light) => {
  let num = dateSinceStart(date);
  let lightID = light.id;
  let input = { num, lightID, date };
  let weekID = await graph.create.week(input)
  return weekID;
}

// ↓ Creates the connections for all 5 neighbors in a week.
let createConnections = async (weekID, neighbors) => {
  const promises = neighbors.map(async (neighbor) => {
    let neighborID = neighbor.neighbor.id;
    return graph.connect.weekAndNeighbor({ weekID, neighborID })
  });

  return Promise.all(promises);
}

// ↓ Increment the weekNeighborConnection prayerCount by 1
let updatePrayerCount = async (neighbors) => {
  const promises = neighbors.map(async (neighbor) => {
    let { id, prayerCount } = neighbor.connection;
    prayerCount = prayerCount + 1
    return graph.update.prayerCount({ id, prayerCount })
  });
  // let counts = await Promise.all(promises)
  return Promise.all(promises);
}

// ↓ Create new week and connect it's neighbors
let createNewWeek = async (date, light) => {
  try {
    let weekID = await makeWeek(date, light);
    let neighbors = pickNeighbors(light.neighbors).map(mapNeighbors)
    await createConnections(weekID, neighbors)
    return updatePrayerCount(neighbors)
  } catch (error) {
    console.log(error);
  }
}


module.exports = createNewWeek;