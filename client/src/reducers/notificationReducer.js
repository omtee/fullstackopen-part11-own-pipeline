let notificationTimer = null

const notificationReducer = (state=null, action) => {
  switch(action.type) {
    case 'SET_NOTIFICATION': {
      return action.notification
    }
    case 'REMOVE_NOTIFICATION': {
      return null
    }
    default: {
      return state
    }
  }
}

export const setNotification = (notification, timeout=5) => {
  return dispatch => {
    dispatch({
      type: 'SET_NOTIFICATION',
      notification
    })
    if (notificationTimer) { clearTimeout(notificationTimer) }
    notificationTimer = setTimeout(() => {
      dispatch(removeNotification())
    }, timeout * 1000)
  }
}

const removeNotification = () => {
  return {
    type: 'REMOVE_NOTIFICATION'
  }
}

export default notificationReducer