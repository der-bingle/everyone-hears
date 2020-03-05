const graph = require("./graph");
const week = require("./weeks");
const cards = require("./cards");

let test = async () => {
  let week = await cards.single("2020-03-08", "e0572a77-401f-4a71-9d48-33848b2bd8ef")
  console.log(week)
}

test()
.then(result => console.log(result))
.catch(err => console.log(err))