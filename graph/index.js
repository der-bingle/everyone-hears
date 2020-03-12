const got = require("got");
const weeks = require("./weeks");
const lights = require("./lights");
const neighbors = require("./neighbors");
const connections = require("./connections");
const { bold } = require('kleur');

const errHead = bold().bgRed("GRAPHQL ERROR:");

let gotOpts = {
  url: "https://ukrvjtwgfbf2vfeyrnqv4dss7e.appsync-api.us-east-2.amazonaws.com/graphql",
  headers: { "x-api-key": "da2-bt2qcf5uxvh2jd2doeqxcd2gmy" },
  method: "POST",
  responseType: "json",
  resolveBodyOnly: true,
}

let test = async (query, variables) => {
  gotOpts.json = { query, variables };
  let response = await got(gotOpts);
  if (response.errors) {
    console.log(errHead)
    console.log(response.errors[0].message)
  }
}

let handleError = res => {
  if (res.errors) {
    console.log(errHead)
    console.log(res.errors[0].message)
    throw ("GraphQL Error")
  }
  return res
}


// ## LIGHTS ##
let allLightsWithNeighbors = async () => {
  gotOpts.json = { query: lights.allWithNeighbors };
  let response = await got(gotOpts).then(res => handleError(res));

  return response.data.listLights.items
}

let oneLightWithNeighbors = async (id) => {
  let variables = { input: { id: "e0572a77-401f-4a71-9d48-33848b2bd8ef }" } };
  let query = lights.oneWithNeighbors;

  gotOpts.json = { query, variables };
  let response = await got(gotOpts).then(res => handleError(res));

  return response.data.getLight
}



// ## WEEKS ##
let createWeek = async (input) => {
  gotOpts.json = { query: weeks.create, variables: { input } };
  let response = await got(gotOpts).then(res => handleError(res));

  return response.data.createWeek.id
}

let getWeeksByDate = async (date) => {
  let variables = { date };
  let query = weeks.getByDate;

  gotOpts.json = { query, variables };
  let response = await got(gotOpts).then(res => handleError(res));
  let corrected = response.data.listWeeks.items.map(week => ({...week, neighbors: week.neighbors.items.map(it => it.neighbor)} ));
  return corrected
}

let getByDateAndLight = async (date, lightID) => {
  let variables = { date, lightID };
  let query = weeks.getByDateAndLight;

  gotOpts.json = { query, variables };
  let response = await got(gotOpts).then(res => handleError(res));
  let week = response.data.listWeeks.items[0];
  let neighbors = week.neighbors.items.map(it => it.neighbor)
  return {...week, neighbors}
}

// ## CONNECTIONS ##

// ↓ Creates a connection between 1 week and 1 neighbor.
let createWeekNeighbor = async (input) => {
  let variables = { input };
  let query = connections.create.weekAndNeighbor;

  gotOpts.json = { query, variables };
  let response = await got(gotOpts).then(res => handleError(res));

  return response
}

let updatePrayerCount = async (input) => {
  try {
    gotOpts.json = { query: connections.update.lightAndNeighbor, variables: { input } };
    let response = await got(gotOpts).then(res => handleError(res));
    return response.data.updateLightNeighborConnection
  } catch (error) {
    console.log(error.response.body);
  }
}

module.exports.get = {
  allLightsWithNeighbors,
  oneLightWithNeighbors,
  weeksByDate: getWeeksByDate,
  weekByDateAndLight: getByDateAndLight,
}

module.exports.create = {
  week: createWeek,
}

module.exports.update = {
  week: createWeek,
  prayerCount: updatePrayerCount,
}

module.exports.connect = {
  weekAndNeighbor: createWeekNeighbor,
};