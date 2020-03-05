#!/usr/bin/env node

const program = require("commander");

program
  .version('0.0.1')
  .description("Fake package manager");

program
  .command("new <kind> [date]")
  .description("Add a new (house, light, week, etc) ")
  .action(async (kind, date) => {
    if (command === "create") {
      return bulletin.create(date)
    }
    return console.log(`Will be adding create ${kind} command soon.`);
  });