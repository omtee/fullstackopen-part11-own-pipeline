import loginService from '../services/login'
import blogService from '../services/blogs'
import { setNotification } from './notificationReducer'

const userReducer = (state=null, action) => {
  switch (action.type) {
    case 'SET_SESSION_USER': {
      return action.data
    }
    case 'LOGOUT': {
      return null
    }
    default: return state
  }
}

export const setUser = (user) => {
  return dispatch => {
    dispatch({ type: 'SET_SESSION_USER', data: user })
  }
}

export const userLogin = (loginInfo) => {
  return async dispatch => {
    try {
      const user = await loginService.login(loginInfo)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch(setUser(user))
    } catch (e) {
      dispatch(setNotification('Wrong username or password'))
    }
  }
}

export const userLogout = () => {
  return dispatch => {
    dispatch({ type: 'LOGOUT' })
  }
}


export default userReducer