import blogService from '../services/blogs'

const blogReducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_BLOGS': {
      return action.data
    }
    case 'NEW_BLOG': {
      return state.concat(action.data)
    }
    case 'LIKE': {
      const id = action.data.id
      const blogToChange = state.find(n => n.id === id)
      const changedBlog = {
        ...blogToChange,
        likes: blogToChange.likes + 1
      }
      return state.map(blog => blog.id !== id ? blog : changedBlog)
    }
    case 'COMMENT': {
      const id = action.data.id
      const blogToChange = state.find(n => n.id === id)
      const changedBlog = {
        ...blogToChange,
        comments: blogToChange.comments.concat(action.data.comment)
      }
      return state.map(blog => blog.id !== id ? blog : changedBlog)
    }
    case 'DELETE': {
      const id = action.data.id
      return state.filter(blog => blog.id !== id)
    }
    default: {
      return state
    }
  }
}

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs
    })
  }
}

export const createBlog = (content) => {
  return async dispatch => {
    const newBlog = await blogService.create(content)
    dispatch({
      type: 'NEW_BLOG',
      data: newBlog
    })
  }
}

export const likeBlog = (id) => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    const blogToChange = blogs.find(n => n.id === id)
    const modifiedBlog = { ...blogToChange, likes: blogToChange.likes + 1 }
    const updatedBlog = await blogService.update(id, modifiedBlog)
    dispatch({
      type: 'LIKE',
      data: { id: updatedBlog.id }
    })
  }
}

export const commentBlog = (id, comment) => {
  return async dispatch => {
    const commentObject = { comment }
    const commentedBlog = await blogService.comment(id, commentObject)
    dispatch({
      type: 'COMMENT',
      data: { id: commentedBlog.id, comment: comment }
    })
  }
}

export const deleteBlog = (id) => {
  return async dispatch => {
    try {
      await blogService.remove(id)
    } catch (exception) {
      console.log(exception)
    } finally {
      dispatch({ type: 'DELETE', data: { id } })
    }
  }
}

export default blogReducer