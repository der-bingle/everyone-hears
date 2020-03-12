const R = require("ramda")
const fs = require('fs')
const appRoot = require('app-root-path');
const addCard = require("./page")
const graph = require("../graph")
const PDFDocument = require('pdfkit');
const pEachSeries = require('p-each-series');
const pTimes = require('p-times');

let getLastName = R.pipe(
  R.prop("light"),
  R.prop("name"),
  R.replace(" Family", ""),
  R.split(" "),
  R.last,
  R.toLower,
)

let getFilename = date => `all-cards-${date}.pdf`;

let newDocument = filename => {
  let docOpts = {
    size: [264, 612],
    margin: 0,
    layout: "portrait",
    autoFirstPage: false,
  }

  const doc = new PDFDocument(docOpts);
  doc.pipe(fs.createWriteStream(filename));

  doc.registerFont("Source Serif Light Italic", `${appRoot}/assets/source-serif-light-italic.otf`)
  doc.registerFont("Source Sans Semibold", `${appRoot}/assets/source-sans-semibold.otf`);

  return doc
}

let main = async (date) => {
  let data = await graph.get.weeksByDate(date);
  let sorted = R.sortBy(getLastName, data);
  let doc = newDocument(getFilename(date));

  const iterator = async week => {
    let times = week.light.numberOfCards;
    return pTimes(times, i => addCard(doc, week))
  };

  await pEachSeries(sorted, iterator)

  doc.end()
}

main("2020-03-08");