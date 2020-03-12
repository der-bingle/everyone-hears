let create = /* GraphQl */ `
mutation CreateWeek($input: CreateWeekInput!) {
  createWeek(input: $input) {
    id
  }
}
`;

let getByDate = /* GraphQl */ `
query GetWeeksByDate($date: String) {
  listWeeks(limit: 1000, filter: {date: {eq: $date}}) {
    items {
      date
      num
      light {
        name
        numberOfCards
      }
      neighbors {
        items {
          neighbor {
            firstName
            lastName
            secondPersonName
            address {
              number
              street
            }
            location {
              lat
              lon
            }
            details {
              maritalStatus
              householdSize
              age {
                min
                max
              }
            }
          }
        }
      }
    }
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
          neighbor {
            firstName
            lastName
            secondPersonName
            address {
              number
              street
            }
            location {
              lat
              lon
            }
            details {
              maritalStatus
              householdSize
              age {
                min
                max
              }
            }
          }
        }
      }
    }
  }
}
`;

module.exports = {
  create,
  getByDate,
  getByDateAndLight
}