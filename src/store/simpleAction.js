export function simpleAction(value) {
  return (dispatch) => {
    console.log('actions')
    return {
      type: 'SIMPLE_ACTION',
      payload: 'result_of_simple_action'
    }
  }
}
