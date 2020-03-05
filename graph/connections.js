let createWeekNeighbor = `
mutation CreateWeekNeighborConnection($input: CreateWeekNeighborConnectionInput!) {
  createWeekNeighborConnection(input: $input) {
    weekID
    neighborID
  }
}
`;

let updateLightNeighbor = `
mutation UpdatePrayerCount($input: UpdateLightNeighborConnectionInput!) {
  updateLightNeighborConnection(input: $input) {
    prayerCount
  }
}
`;


module.exports = {
    create: {
      weekAndNeighbor: createWeekNeighbor,
    },
    update: {
      lightAndNeighbor: updateLightNeighbor,
    }
}