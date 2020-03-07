const R = require("ramda")
const fs = require('fs')
const { createCanvas, registerFont, loadImage } = require('canvas')

let getFilename = (kind, week) => {
  let name = week.light.name.replace(/\s?[,&]?\s/g, "-").toLowerCase();
  if (kind === "PDF") {
    return `${name}-week-${week.num}.pdf`
  } else {
    return `${name}-week-${week.num}.png`
  }
}

let dim = {
  cardWidth: 1100,
  cardHeight: 2400,
  margin: 35,
  smallSectionsHeight: 662.5,
  bigsectionHeight: 1075,
  heading: 58.333333333333336,
  details: 50,
  leading: 8.333333333333332,
  headingFontSize: 62.5,
  detailFontSize: 50,
  mapWidth: 950
}
dim.width = dim.cardWidth - dim.margin * 2;
dim.center = dim.cardWidth / 2;


// # Register Fonts
registerFont("./assets/source-serif-light-italic.otf", { family: "Source Serif Pro", weight: "light", style: "italic" });
registerFont("./assets/source-sans-semibold.otf", { family: "Source Sans Pro", weight: "semibold", style: "regular" });

let titleFont = "light italic 68px Source Serif Pro";
let headingFont = "semibold regular 72px Source Sans Pro";
let detailsFont = "light italic 54px Source Serif Pro";

let getTitle = week => `${week.light.name}, Week ${week.num}`;

let newCanvas = filename => {
  const out = fs.createWriteStream(filename)
  const canvas = createCanvas(dim.cardWidth, dim.cardHeight)
  const stream = canvas.createPNGStream()
  stream.pipe(out)
  const context = canvas.getContext('2d')
  context.textDrawingMode = 'path';
  return context
}

let whiteBackground = (ctx) => {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, dim.cardWidth, dim.cardHeight);
}

let addLogo = async (ctx) => {
  const logo = await loadImage("./assets/logo.png");
  return ctx.drawImage(logo, 36, 36);
}

let addTitle = (week, ctx) => {
  ctx.font = titleFont;
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  return ctx.fillText(getTitle(week), dim.center, 626);
}

let addNeighbors = (ctx, week) => {
  ctx.textAlign = "left";
  ctx.font = titleFont;
}

let main = async (kind, week) => {
  let filename = getFilename(kind, week);
  let context = newCanvas(filename)

  whiteBackground(context)
  addTitle(week, context)
  
  await addLogo(context)

  return filename
}

module.exports = main;