import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ListGroup } from 'react-bootstrap'
import userServices from '../services/users'

const User = ({ id }) => {
  const [ user, setUser ] = useState()

  useEffect(() => {
    userServices.getAll().then(users => {
      const foundUser = users.find(user => user.id === id)
      setUser(foundUser)
    })
  }, [])

  if (!user) {
    return null
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      {user.blogs.length > 0
        ?
        <ListGroup>
          {user.blogs.map(blog => <ListGroup.Item action key={blog.id}><Link to={`/blogs/${blog.id}`}>{blog.title}</Link></ListGroup.Item>)}
        </ListGroup>
        :
        <p>No blogs</p>
      }
    </div>
  )
}

export default User