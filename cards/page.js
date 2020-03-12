const fs = require('fs')
const R = require("ramda")
const got = require("got");
const PDFDocument = require('pdfkit');
const appRoot = require('app-root-path');


let font = {
  title: "Source Serif Light Italic",
  heading: "Source Sans Semibold",
  details: "Source Serif Light Italic",
  size: {
    title: 16,
    heading: 15,
    details: 12
  }
}

let dim = {
  cardWidth: 264,
  cardHeight: 612,
  margin: 18,
  topSectionHeight: 159,
  neighbors: {
    sectionHeight: 235,
    headingHeight: 14,
    detailsHeight: 12,
    leading: 2,
  },
  map: {
    top: 159 + 235 + 18,
  }
};

dim.width = dim.cardWidth - (dim.margin * 2);

let textOpts = { width: dim.width }




let getTitle = week => `${week.light.name}, Week ${week.num}`;

let newDocument = filename => {
  let docOpts = {
    size: [264, 612],
    margin: 0,
    layout: "portrait",
  }

  const doc = new PDFDocument(docOpts);
  doc.pipe(fs.createWriteStream(filename));

  doc.registerFont("Source Serif Light Italic", `${appRoot}/assets/source-serif-light-italic.otf`)
  doc.registerFont("Source Sans Semibold", `${appRoot}/assets/source-sans-semibold.otf`);

  return doc
}

let addTitle = (doc, week) => {
  let opts = {align: "center", width: dim.width }
  doc.font(font.title).fontSize(font.size.title)
  doc.text(`${week.light.name}, Week ${week.num}`, dim.margin, 132, opts )
}

let addLogo = (doc) => {
  const logo = "./assets/logo.png";
  doc.image(logo, 18, 18, textOpts)
}

let getNeighborTitle = (i, neighbor) => {
  let { firstName, lastName, secondPersonName } = neighbor;
  let { maritalStatus } = neighbor.details;

  if (secondPersonName) {
    if (maritalStatus === true) {
      return `${i}. ${firstName} & ${secondPersonName} ${lastName}`
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

let addNeighbors = (doc, week) => {
  let { headingHeight, detailsHeight, leading, sectionHeight } = dim.neighbors;
  let headLead = headingHeight + leading;
  let perHouse = headingHeight + detailsHeight + leading;
  let allHouses = perHouse * 5;
  let diff = sectionHeight - allHouses;
  let space = diff / 5; // Like flexbox space-around
  let start = dim.topSectionHeight + 9;

  let opts = {align: "left", width: dim.width }
  week.neighbors.forEach((n, i) => {
    let x = dim.margin;
    let headingY = start;
    let detailsY = start + headLead;
    if (i === 0) {
      doc.font(font.heading).fontSize(font.size.heading)
      doc.text(getNeighborTitle(i + 1, n), x, headingY, opts);
      doc.font(font.details).fontSize(font.size.details)
      doc.text(getNeighborDetail(n), x, detailsY, opts);
    } else {
      headingY = headingY + (perHouse * i) + (space * i)
      detailsY = detailsY + (perHouse * i) + (space * i)

      doc.font(font.heading).fontSize(font.size.heading)
      doc.text(getNeighborTitle(i + 1, n), x, headingY, opts);
      doc.font(font.details).fontSize(font.size.details)
      doc.text(getNeighborDetail(n), x, detailsY, opts);
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
  let churchPin = "pin-s-hospital+d14747(-88.940882,37.904542)";

  let pins = week.neighbors.reduce((acc, ne, i) => [...acc, createPoint(i + 1, ne)], [churchPin]).join(",")
  return `${base}/${pins}/${center}/${size}/${params}.png`;
};

let addMap = async (doc, week) => {
}

let main = async (doc, week) => {
  try {
    let map = await got(createURL(week), {responseType: "buffer", resolveBodyOnly: true})
    doc.addPage()
    addLogo(doc)
    addTitle(doc, week)
    addNeighbors(doc, week)
    doc.image(map, 18, dim.map.top, textOpts)

    return doc
  } catch (error) {
    console.error(error)
  }
}

module.exports = main;