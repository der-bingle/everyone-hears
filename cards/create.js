const { createCanvas, loadImage } = require('canvas')
const canvas = createCanvas(200, 1100)
const ctx = canvas.getContext('2d')

// Convert from 72 pt/in to 300 px/in
let pointsToPixels = n => n / 72 * 300;

let dimensions = {
  width: 264,
  height: 576,
  margin: 18,
  smallSectionsHeight: 159,
  bigsectionHeight: 258,
  heading: 14,
  details: 12,
  leading: 2,
  headingFontSize: 15,
  detailFontSize: 12,
  mapWidth: 228,
}

Object.entries(dimensions).forEach(([key, value]) => console.log(`${key}: ${pointsToPixels(value)}`));

// var cardWidth = 264;
// var height = 576;
// ctx.fillStyle = "white";
// ctx.fillRect(0, 0, 1242, 2688);
// ctx.font = titleFont;
// ctx.fillStyle = "black";
// ctx.textAlign = "center";
// ctx.fillText(card.title, 621, 675, 1170);
// ctx.textAlign = "left";
// // Write "Awesome!"
// ctx.font = '30px Impact'
// ctx.rotate(0.1)
// ctx.fillText('Awesome!', 50, 100)

// // Draw line under text
// var text = ctx.measureText('Awesome!')
// ctx.strokeStyle = 'rgba(0,0,0,0.5)'
// ctx.beginPath()
// ctx.lineTo(50, 102)
// ctx.lineTo(50 + text.width, 102)
// ctx.stroke()

// // Draw cat with lime helmet
// loadImage('examples/images/lime-cat.jpg').then((image) => {
//   ctx.drawImage(image, 50, 0, 70, 70)

//   console.log('<img src="' + canvas.toDataURL() + '" />')
// })