import React, { useState } from 'react'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Form, ListGroup } from 'react-bootstrap'
import { commentBlog, deleteBlog, likeBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'

const BlogView = ({ id }) => {
  const [newComment, setNewComment] = useState('')
  const blog = useSelector(state => state.blogs).find(blog => blog.id === id)
  const sessionUser = useSelector(state => state.user)

  const dispatch = useDispatch()
  const history = useHistory()

  const handleLike = (blog) => {
    dispatch(likeBlog(blog.id))
    dispatch(setNotification(`you liked '${blog.title}'`, 5))
  }

  const handleDelete = () => {
    if (window.confirm(`Delete blog "${blog.title}" by ${blog.author}?`)) {
      dispatch(deleteBlog(blog.id))
      dispatch(setNotification(`blog "${blog.title}" by ${blog.author} deleted`, 5))
      history.push('/')
    }
  }

  const addComment = async (event) => {
    event.preventDefault()
    dispatch(commentBlog(blog.id, newComment))
    dispatch(setNotification(`added comment ${newComment} for ${blog.title}`))
    setNewComment('')
  }

  if (!blog) {
    return null
  }

  return (
    <div>
      <h2>{blog.title} {blog.author}</h2>
      <a href={blog.url}>{blog.url}</a>
      <div>
        {blog.likes} likes
        <Button variant="success" size="sm" className="like-button" onClick={() => handleLike(blog)}>like</Button>
      </div>
      <p>added by <Link to={`/users/${blog.user.id}`}>{blog.user.name}</Link></p>
      {blog.user.username === sessionUser.username ? <Button variant="warning" className="remove-button" onClick={handleDelete}>remove</Button> : ''}
      <h3>Comments</h3>
      <div>
        <Form onSubmit={addComment}>
          <Form.Group>
            <Form.Control as="textarea" placeholder="New comment" id="new-comment" value={newComment} onChange={({ target }) => setNewComment(target.value)} />
          </Form.Group>
          <Form.Group>
            <Button variant="primary" type="submit" id="submit-comment-button">Add comment</Button>
          </Form.Group>
        </Form>
      </div>
      {blog.comments.length > 0
        ?
        <ListGroup>
          {blog.comments.map((comment, i) => <ListGroup.Item key={i}>{comment}</ListGroup.Item>)}
        </ListGroup>
        :
        <p>No comments</p>
      }
    </div>
  )
}

export default BlogView