let create = /* GraphQl */ `
mutation CreateWeek($input: CreateWeekInput!) {
  createWeek(input: $input) {
    id
  }
}
`;

let getByDateAndLight = /* GraphQl */ `
query GetWeekByDateAndLight($date: String, $lightID: ID!) {
  listWeeks(limit: 1000, filter: {date: {eq: $date}, and: {lightID: {eq: $lightID}}}) {
    items {
      date
      num
      light {
        name
        numberOfCards
      }
      neighbors {
        items {
          id
        }
      }
    }
  }
}
`;

module.exports = {
  create,
  getByDateAndLight
}