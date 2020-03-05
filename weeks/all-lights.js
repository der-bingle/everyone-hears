const graph = require("../graph");
const addWeek = require("./add-week");

// ↓ Download all the lights and their neighbors
const getLights = async () => {
  let rawLights = await graph.get.allLightsWithNeighbors();
  return rawLights.map(light => ({ ...light, neighbors: light.neighbors.items }))
}

// ↓ Create new week for each light in EH campaign.
let main = async (date) => {
  let lights = await getLights();

  const promises = lights.map(async (light) => {
    return addWeek(date, light)
  });

  return Promise.all(promises);
}

main("2020-03-08")
  .then(result => console.log(result))
  .catch(err => console.log(err))