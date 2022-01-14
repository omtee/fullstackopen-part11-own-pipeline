import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Form, Row, Col, Button } from 'react-bootstrap'
import { createBlog } from '../reducers/blogReducer'

const BlogForm = ({ toggleRef }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const dispatch = useDispatch()

  const addBlog = async (event) => {
    event.preventDefault()
    toggleRef.current.toggleVisibility()

    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }

    dispatch(createBlog(blogObject))

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <div className='formDiv'>
      <h2>Create new</h2>
      <Form onSubmit={addBlog}>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">Title</Form.Label>
          <Col sm="10">
            <Form.Control type="text" placeholder="title" value={newTitle} onChange={({ target }) => setNewTitle(target.value)} />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">Author</Form.Label>
          <Col sm="10">
            <Form.Control type="text" placeholder="author" value={newAuthor} onChange={({ target }) => setNewAuthor(target.value)} />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">URL</Form.Label>
          <Col sm="10">
            <Form.Control type="text" placeholder="url" value={newUrl} onChange={({ target }) => setNewUrl(target.value)} />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
          <Col sm={{ span: 10, offset: 2 }}>
            <Button variant="primary" type="submit" id="submit-blog-button">Create</Button>
          </Col>
        </Form.Group>
      </Form>
    </div>
  )
}

export default BlogForm