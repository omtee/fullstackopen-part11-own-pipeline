import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'
import userServices from '../services/users'

const Users = () => {
  const [ users, setUsers ] = useState([])

  useEffect(() => {
    userServices.getAll().then(users => setUsers(users))
  }, [])

  return (
    <div>
      <h2>Users</h2>
      <Table>
        <tbody>
          <tr>
            <th>User</th>
            <th>Blogs created</th>
          </tr>
          {users.map(user =>
            <tr key={user.name}>
              <td><Link to={`/users/${user.id}`}>{user.name}</Link></td>
              <td>{user.blogs.length}</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  )
}

export default Users