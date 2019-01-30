export default (
  state = {
    cups: []
  },
  action
) => {
  switch (action.type) {
    case 'MKR_GET_CUPS':
      return {
        ...state,
        cups: action.payload
      }
    default:
      return state
  }
}
