import { combineReducers } from 'redux'
import { default as maker } from 'store/makerReducer'
import { default as auth } from 'store/web3Reducer'

export default combineReducers({
  maker,
  auth
})
