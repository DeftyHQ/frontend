import { MKR } from './makerAction'

export default (
  state = {
    cups: []
  },
  action
) => {
  switch (action.type) {
    case MKR.INIT_SUCCESS:
      return {
        ...state,
        instance: action.payload.instance
      }
    case MKR.CUPS_SUCCESS:
      return {
        ...state,
        cups: action.payload.cups
      }
    default:
      return state
  }
}
