const fs = require('fs')
const got = require("got");
const { createCanvas, registerFont, loadImage, Image } = require('canvas')

let url = "https://api.mapbox.com/styles/v1/derbingle/ck592nkp21rxz1cmblg7928zu/static/pin-s-hospital+d14747(-88.940882,37.904542),pin-l-1+d14747(-88.9408,37.90465),pin-l-2+d14747(-88.93981,37.90097),pin-l-3+d14747(-88.94023,37.90658),pin-l-4+d14747(-88.93616,37.90031),pin-l-5+d14747(-88.94201,37.89996)/-88.939,37.90351,15.35,0.2,50/1028x788@2x/?access_token=pk.eyJ1IjoiZGVyYmluZ2xlIiwiYSI6ImNqcXBoYW80MjAxazI0Mm50MDQ2c3c2OXEifQ.xbn1Fo14rkw3VQwnokYROQ&logo=false&attribution=false.png"

let gotOpts = {
  url,
  responseType: "buffer",
  resolveBodyOnly: true,
}

let run = async () => {
  const buff = await got(gotOpts);
  await fs.writeFile("map.png", buff, (err) => {
      // throws an error, you could also catch it here
    if (err) throw err;

    // success case, the file was saved
    console.log('Buffer saved!');
  })
}

let run = async () => {
  const out = fs.createWriteStream("test.png")
  const canvas = createCanvas(1100, 2550)
  const stream = canvas.createPNGStream()
  stream.pipe(out)
  const ctx = canvas.getContext('2d')
  const buff = await got(gotOpts);
  
  const img = new Image()
  img.onload = () => ctx.drawImage(img, 0, 0)
  img.onerror = err => { throw err }
  img.src = buff

  // const img = new Image()
  // img.onerror = err => { throw err }
  // img.onload = () => {
  //   img.src = buff
  //   ctx.drawImage(img, 36, 1726, 1028, 788)
  // }
}

run()

// loadImage(url,), (function (map) {
//   ctx.drawImage(map, 36, 36, 1028, 722);
// })
// const myimg = loadImage(url)

// ctx.fillText("Hello, world.", 100, 1275);
// myimg.then((map) => {
//   ctx.drawImage(map, 36, 36, 1028, 788)
// }).catch(err => {
//   console.log('oh no!', err)
// })

// or with async/await:
// const myimg = await loadImage('http://server.com/image.png')
// do something with image