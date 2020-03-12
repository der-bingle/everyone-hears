const graph = require("./graph");
const week = require("./weeks");
const cards = require("./cards");

let test = async () => {
  let imagePath = await cards.single("PDF", "2020-03-08", "e0572a77-401f-4a71-9d48-33848b2bd8ef")
  return imagePath
}

test()
.then(imagePath => console.log(`The card was created at ./${imagePath}`))
.catch(err => console.log(err))