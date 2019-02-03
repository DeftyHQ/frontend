import Maker from '@makerdao/dai'
import { request } from 'graphql-request'

const config = {
  staging: 'https://sai-kovan.makerfoundation.com/v1',
  production: 'https://sai-mainnet.makerfoundation.com/v1'
}

const URL = config.staging

const getCupsQuery = `
  query AllCups($lad: String!) {
    allCups(
      first: 50,
      condition: {
        deleted: false,
        lad: $lad
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
        tab
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

export function getCups(ownerAddress) {
  return request(URL, getCupsQuery, { lad: ownerAddress })
    .then(data => data.allCups.nodes)
}
