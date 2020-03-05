const create = require("./create");
const graph = require("../graph");

let singleCard = async (date, lightID) => {
  let week = await graph.get.weekByDateAndLight(date, lightID)
  return week
}

module.exports = singleCard;