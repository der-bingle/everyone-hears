const fs = require('fs')
const R = require("ramda")
const got = require("got");
const PDFDocument = require('pdfkit');
const { createCanvas, registerFont, loadImage, Image } = require('canvas')

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
  cardHeight: 2550,
  margin: 36,
  smallSectionsHeight: 668,
  bigsectionHeight: 1075,
  neighbors: {
    sectionHeight: 1020,
    headingHeight: 58,
    detailsHeight: 50,
    leading: 2,
    headingFontSize: 62.5,
    detailFontSize: 50,
  },
  mapWidth: 950
}

dim.width = dim.cardWidth - dim.margin * 2;
dim.center = dim.cardWidth / 2;


// # Register Fonts
registerFont("./assets/source-serif-light-italic.otf", { family: "Source Serif Pro", weight: "light", style: "italic" });
registerFont("./assets/source-sans-semibold.otf", { family: "Source Sans Pro", weight: "semibold", style: "regular" });

let titleFont = "light italic 64px Source Serif Pro";
let headingFont = "semibold regular 64px Source Sans Pro";
let detailsFont = "light italic 48px Source Serif Pro";

let getTitle = week => `${week.light.name}, Week ${week.num}`;

let newDocument = filename => {
  let docOpts = {
  size: [264, 612],
  margin: 0,
  layout: "portrait",
  }

  const doc = new PDFDocument(docOpts);
  doc.pipe(fs.createWriteStream(filename));
  return doc
}

let addLogo = async (doc) => {
  const logo = "./assets/logo.png";
 
  return doc.image(path, 24, 18, { width })
}

let addTitle = (week, doc) => {
  doc.font = titleFont;
  doc.fillStyle = "black";
  doc.textAlign = "center";
  return doc.fillText(getTitle(week), dim.center, 600);
}

let getNeighborTitle = (i, neighbor) => {
  let { firstName, lastName, secondPersonName } = neighbor;
  let { maritalStatus } = neighbor.details;

  if (secondPersonName) {
    if (maritalStatus === true) {
      return `${i}. ${firstName} & ${secondPersonName} ${lastName},`
    } else {
      return `${i}. ${firstName} ${lastName}, ${secondPersonName}`
    }
  } else {
    return `${i}. ${firstName} ${lastName}`
  }
}

let getNeighborDetail = (ne) => {
  let { number, street } = ne.address;
  let { householdSize, age } = ne.details;
  let numberOfPeople = householdSize > 1 ? `${householdSize} people` : `${householdSize} person`;
  return `${number} ${street}, ${age.min}–${age.max}, ${numberOfPeople}`
}

let addNeighbors = (week, ctx) => {
  let { headingHeight, detailsHeight, leading, sectionHeight } = dim.neighbors;
  let headLead = headingHeight + leading;
  let perHouse = headingHeight + detailsHeight + leading;
  let allHouses = perHouse * 5;
  let diff = sectionHeight - allHouses;
  let space = diff / 6; // Like flexbox space-around
  let start = dim.smallSectionsHeight + (headingHeight / 2);

  ctx.textAlign = "left";
  week.neighbors.forEach((n, i) => {
    let x = dim.margin;
    let headingY = start + space;
    let detailsY = start + space + headLead;
    if (i === 0) {
      ctx.font = headingFont;
      ctx.fillText(getNeighborTitle(i + 1, n), x, headingY);
      ctx.font = detailsFont;
      ctx.fillText(getNeighborDetail(n), x, detailsY);
    } else {
      headingY = headingY + (perHouse * i) + (space * i)
      detailsY = detailsY + (perHouse * i) + (space * i)

      ctx.font = headingFont;
      ctx.fillText(getNeighborTitle(i + 1, n), x, headingY);
      ctx.font = detailsFont;
      ctx.fillText(getNeighborDetail(n), x, detailsY);
    }
  })
}

let createURL = (week) => {
  let createPoint = (i, neighbor) => {
    let { lat, lon } = neighbor.location;
    return `pin-l-${i}+d14747(${lon},${lat})`
  };

  let base = "https://api.mapbox.com/styles/v1/derbingle/ck592nkp21rxz1cmblg7928zu/static";
  let params = "?access_token=pk.eyJ1IjoiZGVyYmluZ2xlIiwiYSI6ImNqcXBoYW80MjAxazI0Mm50MDQ2c3c2OXEifQ.xbn1Fo14rkw3VQwnokYROQ&logo=false&attribution=false";
  // let center = "-88.939,37.90351,15.35,0.2,50";
  let center = "-88.939,37.90351,15.2,-0.3,40";
  let size = "1028x788@2x";
  // let size = "1028x788";
  let churchPin = "pin-s-hospital+d14747(-88.940882,37.904542)";

  let pins = week.neighbors.reduce((acc, ne, i) => [...acc, createPoint(i + 1, ne)], [churchPin]).join(",")
  return `${base}/${pins}/${center}/${size}/${params}.png`;
};

let addMap = async (week, ctx) => {
  let url = createURL(week);
  // console.log(url);
  const map = await got(url, {responseType: "buffer", resolveBodyOnly: true});
  loadImage(map).then(map => ctx.drawImage(map, 36, 1726, 1028, 788))
   
  // return ctx.drawImage(map, 36, 1726);
}

let main = async (kind, week) => {
  try {
    let filename = getFilename(kind, week);
    let doc = newDocument(filename)

    addTitle(week, doc)
    addNeighbors(week, doc)
    await addLogo(doc)
    await addMap(week, doc)
    return filename
  } catch (error) {
    console.error(error)
  }
}

module.exports = main;