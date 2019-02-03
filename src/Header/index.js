import React from 'react'
import { Link } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Typography,
  // IconButton,
  Button
} from '@material-ui/core';
// import MenuIcon from '@material-ui/icons/Menu';

import styles from './styles.module.css'

const Header = () => (
  <AppBar position="static">
    <Toolbar variant="dense">
      {/*<IconButton color="inherit" aria-label="Menu">
        <MenuIcon />
      </IconButton>*/}
      <Typography variant="h6" color="inherit">
        Defty
      </Typography>
      <div className={styles.between}></div>
      <Button color="inherit">Login</Button>
    </Toolbar>
  </AppBar>
)

export default Header
