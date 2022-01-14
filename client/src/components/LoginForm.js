import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Form, Button } from 'react-bootstrap'
import { userLogin } from '../reducers/userReducer'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  const submitLogin = (event) => {
    event.preventDefault()

    dispatch(userLogin({ username, password }))

    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <h2>Log in to application</h2>
      <Form onSubmit={submitLogin}>
        <Form.Group>
          <Form.Label>username:</Form.Label>
          <Form.Control type="text" name="username" value={username} onChange={({ target }) => setUsername(target.value)} />
          <Form.Label>password:</Form.Label>
          <Form.Control type="password" value={password} onChange={({ target }) => setPassword(target.value)} />
          <Button variant="primary" type="submit">login</Button>
        </Form.Group>
      </Form>
    </div>
  )
}

export default LoginForm