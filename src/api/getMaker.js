import Maker from '@makerdao/dai'
import { request } from 'graphql-request'

const config = {
  staging: 'https://sai-kovan.makerfoundation.com/v1',
  production: 'https://sai-mainnet.makerfoundation.com/v1'
}

const URL = config.staging

const getCupsQuery = `
  query AllCups($lad: String!, $proxy: String!) {
    allCups(
      first: 50,
      condition: {
        deleted: false
      },
      filter: {
        lad: {
          in: [$proxy, $lad]
        }
      },
      orderBy: RATIO_ASC
    ) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
      }
      nodes {
        id
        lad
        art
        ink
        ratio
        actions(first: 5) {
          nodes {
            act
            time
          }
        }
      }
    }
  }
`

export function fetchCups(account, proxy) {
  const params = {
    lad: account,
    proxy: proxy
  }
  return request(URL, getCupsQuery, params)
    .then(data => data.allCups.nodes)
    .then(data => (
      data.map(node => {
        // Mark difference between CDP's belonging to an account or a proxy
        node.isLegacy = node.lad === params.lad ? true : false
        return node
      })
    ))
}
