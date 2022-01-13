const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

let TOKEN

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', name: 'super root', passwordHash: passwordHash })

    await user.save()
  })

  describe('login handling', () => {
    test('login success', async () => {

      const loginInfo = {
        username: 'root',
        password: 'sekret'
      }

      const result = await api
        .post('/api/login').send(loginInfo)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(result.body.username).toBe('root')
      expect(result.body.name).toBe('super root')
      expect(result.body.token).toBeDefined()
    })
    test('login fail wrong password', async () => {

      const loginInfo = {
        username: 'root',
        password: 'sekretti'
      }

      const result = await api
        .post('/api/login').send(loginInfo)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('invalid username or password')
    })
    test('login fail wrong username', async () => {

      const loginInfo = {
        username: 'roottti',
        password: 'sekret'
      }

      const result = await api
        .post('/api/login').send(loginInfo)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('invalid username or password')
    })
    test('login fail empty input', async () => {

      const loginInfo = {
        username: '',
        password: ''
      }

      const result = await api
        .post('/api/login').send(loginInfo)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('invalid username or password')
    })
  })

  describe('user management', () => {
    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

      const usernames = usersAtEnd.map(u => u.username)
      expect(usernames).toContain(newUser.username)
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'salainen',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('`username` to be unique')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if password is under min length', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'testiukko',
        name: 'Testi Ukko',
        password: 'sa',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('password must be at least 3 characters long')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if username is under min length', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'te',
        name: 'Testi Ukko',
        password: 'salasana',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('Path `username` (`te`) is shorter than the minimum allowed length (3).')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
  })
})

describe('blog handling', () => {
  beforeEach(async () => {
    const loginResponse = await api.post('/api/login').send({
      username: 'root',
      password: 'sekret'
    })
    TOKEN = loginResponse.body.token
  })

  describe('add blog handling', () => {

    test('blog can be added', async () => {
      const blogsAtStart = await helper.blogsInDb()

      const newBlog = {
        title: 'async/await blog',
        author: 'Master Coder',
        url: 'www.mastercode.com',
        likes: 500
      }

      await api
        .post('/api/blogs')
        .set('Authorization', 'bearer ' + TOKEN)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)

      const titles = blogsAtEnd.map(r => r.title)
      expect(titles).toContain(newBlog.title)
    })

    test('new blog likes count defaults to 0 if missing', async () => {
      const blogsAtStart = await helper.blogsInDb()

      const newBlog = {
        title: 'testing missing likes count',
        author: 'Master Coder',
        url: 'www.mastercode.com'
      }

      await api
        .post('/api/blogs')
        .set('Authorization', 'bearer ' + TOKEN)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)

      const addedBlog = blogsAtEnd.find(r => r.title === newBlog.title)
      expect(addedBlog.likes).toBe(0)
    })

    test('new blog missing title, author or url', async () => {
      const blogsAtStart = await helper.blogsInDb()

      const newBlog = {
        author: 'Master Coder'
      }

      await api
        .post('/api/blogs')
        .set('Authorization', 'bearer ' + TOKEN)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
    })
  })

  describe('when there is initial blogs in db', () => {
    beforeEach(async () => {
      const loginResponse = await api.post('/api/login').send({  username: 'root', password: 'sekret' })
      TOKEN = loginResponse.body.token

      await Blog.deleteMany({})

      const firstBlog = { title: 'first initial blog', author: 'Master Coder', url: 'www.mastercode.com', likes: 10 }
      await api.post('/api/blogs').set('Authorization', 'bearer ' + TOKEN).send(firstBlog)
      const secondBlog = { title: 'second initial blog', author: 'Master Coder Junior', url: 'www.mastercodejr.com', likes: 20 }
      await api.post('/api/blogs').set('Authorization', 'bearer ' + TOKEN).send(secondBlog)

    })
    test('blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    /*
    test('all blogs returned', async () => {
      const response = await api.get('/api/blogs')
      expect(response.body).toHaveLength(helper.initialBlogs.length)
    })
    */

    test('blog identifier is named as id', async () => {
      const response = await api.get('/api/blogs')
      expect(response.body[0].id).toBeDefined()
    })

    test('a specific blog is within returned blogs', async () => {
      const response = await api.get('/api/blogs')
      const titles = response.body.map(r => r.title)
      expect(titles).toContain('first initial blog')
    })

    test('remove blog by id', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[blogsAtStart.length - 1]

      await api
        .delete('/api/blogs/' + blogToDelete.id)
        .set('Authorization', 'bearer ' + TOKEN)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
    })

    test('increase blog likes', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const newBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 }

      await api
        .put('/api/blogs/' + blogToUpdate.id)
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(blogsAtStart.length)

      const updatedBlog = blogsAtEnd.find(r => r.id === blogToUpdate.id)
      expect(updatedBlog.likes).toBe(newBlog.likes)
    })

  })
})

afterAll(() => {
  mongoose.connection.close()
})