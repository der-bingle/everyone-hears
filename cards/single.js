const create = require("./create");
const graph = require("../graph");

let singleCard = async (kind, date, lightID) => {
  let week = await graph.get.weekByDateAndLight(date, lightID)
  console.dir(week, {depth: 5})
  return create(kind, week)
}

module.exports = singleCard;