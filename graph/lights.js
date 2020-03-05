let allWithNeighbors =  /* GraphQL */ `
{
  listLights(limit: 100) {
    items {
      id
      name
      neighbors(limit: 100) {
        items {
          id
          prayerCount
          neighbor {
            id
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
              householdSize
            }
          }
        }
      }
    }
  }
}
`;

let oneWithNeighbors = `
query GetLight($id: ID!) {
  getLight(id: $id) {
    name
    neighbors {
      items {
        prayerCount
        neighbor {
          id
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
            householdSize
          }
        }
      }
    }
  }
}
`

module.exports = {
  allWithNeighbors,
  oneWithNeighbors
}