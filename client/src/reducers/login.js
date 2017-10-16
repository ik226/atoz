const INITIAL_STATE = {
  isFetching: false,
  isAuthenticated: false
}

export const loginReducer = (state=INITIAL_STATE, action) => {
  switch(action.type){
    case 'LOGIN_REQUEST':
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
      }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true
      }
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false
      }
    default:
      return state
  }
}
