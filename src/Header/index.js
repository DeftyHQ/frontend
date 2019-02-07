import React from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Button
} from '@material-ui/core';

import styles from './styles.module.css'
import deftySVG from './logo.svg'

const Header = () => (
  <AppBar position="static">
    <Toolbar variant="dense">
      {/*<img alt='defty' src={deftySVG} className={styles.logo}></img>*/}
      <Typography variant="h6" color="inherit">
        Defty
      </Typography>
      <div className={styles.between}></div>
      {/*<Button color="inherit">Login</Button>*/}
    </Toolbar>
  </AppBar>
)

export default Header
