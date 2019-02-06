import { MKR } from './makerAction'

export default (
  state = {
    cups: []
  },
  action
) => {
  switch (action.type) {
    case MKR.INIT_START:
      return {
        ...state,
        isLoading: true,
      }
    case MKR.CUPS_START:
      return {
        ...state,
        isLoading: true,
      }
    case MKR.INIT_SUCCESS:
      return {
        ...state,
        ...action.payload,
        isLoading: false,
      }
    case MKR.CUPS_SUCCESS:
      return {
        ...state,
        cups: action.payload.cups,
        isLoading: false,
      }
    default:
      return state
  }
}
