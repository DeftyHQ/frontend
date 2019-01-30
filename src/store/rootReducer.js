import { combineReducers } from 'redux'
import { default as cups } from 'store/cupsReducer'
import { default as auth } from 'store/web3Reducer'

export default combineReducers({
  cups,
  auth
})
