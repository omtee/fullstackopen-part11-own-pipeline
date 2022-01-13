const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const user = request.user
  if (!user) { response.status(401).json({ error: 'token missing or invalid' }) }

  const body = request.body

  if (!body.title || !body.author || !body.url) {
    response.status(400).end()
  } else {
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id,
      comments: body.comments || []
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    comments: body.comments
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true }).exec()
  response.status(200).json(updatedBlog)
})

blogsRouter.put('/:id/comments', async (request, response, next) => {
  try {
    const body = request.body
    if (!body.comment) {
      response.status(400).json({ error: 'no comment' })
    } else {
      const blogToUpdate = await Blog.findById(request.params.id)
      blogToUpdate.set({ comments: blogToUpdate.comments.concat(body.comment) })
      const updatedBlog = await blogToUpdate.save()
      response.status(200).json(updatedBlog)
    }
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const user = request.user
    const blog = await Blog.findById(request.params.id)

    if (blog.user.toString() === user.id.toString()) {
      await blog.remove()
      response.status(204).end()
    } else {
      response.status(403).json({ error: 'access denied' })
    }
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter