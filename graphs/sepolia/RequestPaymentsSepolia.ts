const { request, gql } = require("graphql-request")

const endpoint = "https://gateway.thegraph.com/api/subgraphs/id/6e8Dcwt3cvsgNU3JYBtRQQ9Sj4P9VVVnXaPjJ3jUpYpY"

const query = `{
  payments(first: 5) {
    id
    contractAddress
    tokenAddress
    to
  }
  escrows(first: 5) {
    id
    contractAddress
    paymentProxyAddress
    reference
  }
}`

const headers = {
    Authorization: "Bearer {api-key}",
}

async function fetchData() {
    try {
        const data = await request(endpoint, query, {}, headers)
        console.log(data)
    } catch (error) {
        console.error("Error fetching data:", error)
    }
}

fetchData()
