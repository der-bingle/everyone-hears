const graph = require("../graph");

graph.get.lightsAndNeighbors()
.then(res => console.dir(res, {depth: 5}))
.catch(err => console.error(err))