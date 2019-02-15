import React from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
} from '@material-ui/core';

import styles from './styles.module.css'

const Header = () => (
  <AppBar position="static">
    <Toolbar variant="dense">
      <Typography variant="h6" color="inherit">
        Defty
      </Typography>
      <div className={styles.between}></div>
    </Toolbar>
  </AppBar>
)

export default Header
