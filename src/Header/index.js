import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => (
  <div>
    <div className="logo">
      <h1><Link style={{ textDecoration: 'none' }} to="/">Defty</Link></h1>
    </div>
  </div>
)

export default Header
