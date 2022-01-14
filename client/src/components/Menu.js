import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Nav, Navbar, Button } from 'react-bootstrap'
import blogService from '../services/blogs'
import { setNotification } from '../reducers/notificationReducer'
import { userLogout } from '../reducers/userReducer'

const Menu = () => {
  const dispatch = useDispatch()
  const handleLogout = () => {
    dispatch(setNotification('Logged out'))
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken('')
    dispatch(userLogout())
  }

  const sessionUser = useSelector(state => state.user)

  const padding = {
    paddingRight: 5
  }

  return (
    <div>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#" as="span">
              <Link to='/' style={padding}>blogs</Link>
            </Nav.Link>
            <Nav.Link href="#" as="span">
              <Link to='/users' style={padding}>users</Link>
            </Nav.Link>
            <Nav.Link href="#" as="span">
              <em style={padding}>{sessionUser.name} logged-in</em>
              <Button variant="outline-light" size="sm" onClick={() => handleLogout()}>logout</Button>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  )
}

export default Menu