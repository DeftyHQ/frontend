import React from 'react'
import { Link } from 'react-router-dom'

const CdpCard = () => (
  <div>
    <div className="logo">
      <h1><Link to="/">CRA Starter Kit</Link></h1>
    </div>
  </div>
)

export default CdpCard

//
// {
//   "id": 4845,
//   "lad": "0x1940a230BbB225d928266339e93237eD77F37b56",
//   "art": "40",
//   "ink": "0.9998436012365433",
//   "ratio": "427.656249999999994611672305494212314100",
//   "actions": {
//     "nodes": [
//       {
//         "act": "DRAW",
//         "time": "2019-02-01T14:54:48+00:00"
//       },
//       {
//         "act": "LOCK",
//         "time": "2019-02-01T14:54:48+00:00"
//       },
//       {
//         "act": "OPEN",
//         "time": "2019-02-01T14:54:48+00:00"
//       }
//     ]
//   },
//   "isLegacy": false,
//   "debtValue": {
//     "_amount": "40",
//     "symbol": "USD"
//   },
//   "collateralValue": {
//     "_amount": "0.9999999999999999513946985976163104",
//     "symbol": "ETH"
//   },
//   "collateralizationRatio": 2.7005,
//   "liquidationPrice": {
//     "_amount": "60.00000000000000291632",
//     "symbol": "USD/ETH"
//   },
//   "isSafe": true
// }
