import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Switch, Route, useRouteMatch } from 'react-router-dom'

import blogService from './services/blogs'

import { initializeBlogs } from './reducers/blogReducer'
import { setUser } from './reducers/userReducer'

import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Toggleable'
import BlogList from './components/BlogList'
import BlogView from './components/BlogView'
import Users from './components/Users'
import User from './components/User'
import Menu from './components/Menu'


const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [])

  const blogFormRef = useRef()

  const sessionUser = useSelector(state => state.user)

  const userViewIdMatch = useRouteMatch('/users/:id')
  const userViewId = userViewIdMatch ? userViewIdMatch.params.id : null

  const blogViewIdMatch = useRouteMatch('/blogs/:id')
  const blogViewId = blogViewIdMatch ? blogViewIdMatch.params.id : null

  return (
    <div className="container">
      <Notification />
      {sessionUser === null ?
        <LoginForm /> :
        <div>
          <Menu />
          <h1>Blogs</h1>
          <Switch>
            <Route path="/users/:id">
              <User id={userViewId} />
            </Route>
            <Route path="/users">
              <Users />
            </Route>
            <Route path="/blogs/:id">
              <BlogView id={blogViewId} />
            </Route>
            <Route path="/">
              <Togglable buttonLabel="new blog" ref={blogFormRef}>
                <BlogForm toggleRef={blogFormRef}/>
              </Togglable>
              <BlogList />
            </Route>
          </Switch>
        </div>
      }
    </div>
  )
}

export default App