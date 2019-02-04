import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';

import styles from './styles.module.css'

class Orders extends React.Component {
  render() {
    return (
      <div className={styles.placeholderAnchor}>
        <Table className={styles.spaceUnder}>
          <TableHead>
            <TableRow>
              <TableCell>CDP #</TableCell>
              <TableCell>Price (USD)</TableCell>
              <TableCell>Collateral (ETH)</TableCell>
              <TableCell>Ratio (%)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow className={styles.minHeight}>
              {/*<TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>*/}
            </TableRow>
          </TableBody>
        </Table>
        <div className={styles.placeholder}>
          <Typography>No active orders</Typography>
        </div>
      </div>
    )
  }
}

export default Orders
