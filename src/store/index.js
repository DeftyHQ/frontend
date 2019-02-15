import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { default as maker } from 'store/makerReducer'
import { default as network } from 'store/networkReducer'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ shouldHotReload: false }) || compose;

export default function configureStore(initialState={}) {
  return createStore(
    combineReducers({
      maker,
      network
    }),
    composeEnhancers(
      applyMiddleware(thunk)
    ),
  )
}
