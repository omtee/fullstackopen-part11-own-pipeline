const _ = require('lodash')

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((max, blog) => max.likes > blog.likes ? max : blog)
}

const mostBlogs = (blogs) => {
  const blogsByAuthor = _.countBy(blogs, blog => blog.author)
  const maxBlogs = _.maxBy(_.keys(blogsByAuthor))
  return { 'author': maxBlogs, 'blogs': blogsByAuthor[maxBlogs] }
}

const mostLikes = (blogs) => {
  const authorBlogs = _.groupBy(blogs, 'author')
  const likesByAuthor = _.map(authorBlogs, (array, author) => ({ author, likes:_.sumBy(array, 'likes') }))
  //console.log('authors', likesByAuthor)
  const maxLikes = _.maxBy(_.values(likesByAuthor), 'likes')
  //console.log('max likes', maxLikes)
  return maxLikes
}

module.exports = { totalLikes, favoriteBlog, mostBlogs, mostLikes }