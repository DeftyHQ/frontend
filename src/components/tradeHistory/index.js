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

class TradeHistory extends React.Component {
  render() {
    return (
      <div className={styles.placeholderAnchor}>
        <Table className={styles.spaceUnder}>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>CDP</TableCell>
              <TableCell align='right' colspan={2}>Price (ETH)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow className={styles.minHeight}>
              {/*<TableCell></TableCell>
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

export default TradeHistory
