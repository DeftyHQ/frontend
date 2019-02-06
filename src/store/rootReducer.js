import { combineReducers } from 'redux'
import { default as maker } from 'store/makerReducer'
import { default as network } from 'store/networkReducer'

export default combineReducers({
  maker,
  network
})
