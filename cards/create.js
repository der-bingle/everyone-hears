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
  cardWidth: 1100,
  cardHeight: 2550,
  margin: 36,
};

dim.width = dim.cardWidth - dim.margin * 2;

let textOpts = { width: dim.width }


let getFilename = (kind, week) => {
  let name = week.light.name.replace(/\s?[,&]?\s/g, "-").toLowerCase();
  if (kind === "PDF") {
    return `${name}-week-${week.num}.pdf`
  } else {
    return `${name}-week-${week.num}.png`
  }
}

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

let addTitle = (week, doc) => {
  doc.font(font.title).fontSize(font.size.title)
  doc.text(`${week.light.name}, Week ${week.num}`, textOpts)
}

let main = async (kind, week) => {
  try {
    let filename = getFilename(kind, week);
    let doc = newDocument(filename)

    addTitle(week, doc)
    doc.end()
    return filename
  } catch (error) {
    console.error(error)
  }
}

module.exports = main;