const graph = require("./graph");
const week = require("./weeks");
const cards = require("./cards");

let test = async () => {
  let image = await cards.single("PNG", "2020-03-08", "0dab367d-4a72-48cd-9c28-f17bdc04ed24")
  return image
}

test()
.then(filename => console.log(`The card was created at ./${filename}`))
.catch(err => console.log(err))