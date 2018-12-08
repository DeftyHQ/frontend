import React from 'react'
import { Link } from 'react-router-dom'

import Routes from 'routes'

const Home = () => (
  <div>
    <ul>
      <li><Link to={Routes.demo.path}>{Routes.demo.name}</Link></li>
      <li><Link to={Routes.home.path}>{Routes.home.name}</Link></li>
    </ul>
  </div>
)

export default Home
