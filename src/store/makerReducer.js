import { MKR } from './makerAction'
import { DEFTY } from './deftyAction'

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
    case MKR.INIT_SUCCESS:
    return {
      ...state,
      ...action.payload,
      isLoading: false,
    }
    case MKR.CUPS_START:
      return {
        ...state,
        isLoading: true,
      }
    case MKR.CUPS_SUCCESS:
      return {
        ...state,
        cups: action.payload.cups,
        isLoading: false,
      }
    case DEFTY.PROOF_START:
      const { cup } = action
      const except = state.cups.filter(c => c.cupData.id !== cup.cupData.id)
      return {
        ...state,
        cups: [ ...except, cup ]
      }
    case DEFTY.PROOF_ERROR:
      return {
        ...state,
        isLoading: true,
      }
    case DEFTY.PROOF_SUCCESS:
      return {
        ...state,
      }
    case DEFTY.TRANSFER_START:
      return {
        ...state,
      }
    case DEFTY.TRANSFER_ERROR:
      return {
        ...state,
      }
    case DEFTY.TRANSFER_SUCCESS:
      return {
        ...state,
      }
    case DEFTY.WRAP_START:
      return {
        ...state,
      }
    case DEFTY.WRAP_ERROR:
      return {
        ...state,
      }
    case DEFTY.WRAP_SUCCESS:
      return {
        ...state,
      }
    default:
      return state
  }
}
