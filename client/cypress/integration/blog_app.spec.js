describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user1 = { name: 'super root', username: 'root', password: 'sekret' }
    const user2 = { name: 'olli tee', username: 'olli', password: 'passu' }
    cy.request('POST', 'http://localhost:3003/api/users/', user1)
    cy.request('POST', 'http://localhost:3003/api/users/', user2)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('root')
      cy.get('#password').type('sekret')
      cy.get('#login-button').click()

      cy.contains('super root logged-in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('root')
      cy.get('#password').type('sker')
      cy.get('#login-button').click()

      cy.get('.notification').contains('Wrong username or password')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'root', password: 'sekret' })
    })

    it('User can logout', function() {
      cy.logout()
      cy.contains('Log in to application')
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('a blog created by cypress')
      cy.get('#author').type('cypress tester')
      cy.get('#url').type('cypress.com')
      cy.get('#submit-blog-button').click()
      cy.contains('a new blog "a blog created by cypress" by cypress tester added')
    })

    describe('Blog exists', function() {
      beforeEach(function() {
        cy.createBlog({ title: 'another blog', author: 'blogger', url: 'anotherblog.com' })
        cy.createBlog({ title: 'classic blog', author: 'classic guy', url: 'classicblog.com' })
        cy.createBlog({ title: 'not much', author: 'loser', url: '.com' })
      })

      it('Correct blog likes can be increased', function() {
        cy.get('.blog-list').contains('classic blog').find('.toggle-info-button').click()
        cy.get('.blog-list').contains('classic blog').parent().find('.like-button').click()
      })

      it('User can remove own blogs', function() {
        cy.get('.blog-list').contains('not much').then(($div) => {
          const blogId = Cypress.$($div).attr('id').toString()
          cy.removeBlog(blogId)
        })
      })
    })
  })

  describe('Multiple users and blogs', function() {
    beforeEach(function() {
      cy.login({ username: 'root', password: 'sekret' })
      cy.createBlog({ title: 'root1 blog', author: 'blogger', url: 'root1blog.com' })
      cy.createBlog({ title: 'root2 blog', author: 'root2 guy', url: 'root2blog.com' })
      cy.logout()
      cy.login({ username: 'olli', password: 'passu' })
      cy.createBlog({ title: 'olli1 blog', author: 'blogger', url: 'olli1blog.com' })
      cy.createBlog({ title: 'olli2 blog', author: 'olli2 guy', url: 'olli2blog.com' })
    })

    it('User has remove button for own blogs but not others', function() {
      cy.get('.blog-list').contains('olli1 blog').find('.toggle-info-button').click()
      cy.get('.blog-list').contains('olli1 blog').parent().find('.remove-button').should('exist')

      cy.get('.blog-list').contains('root1 blog').find('.toggle-info-button').click()
      cy.get('.blog-list').contains('root1 blog').parent().find('.remove-button').should('not.exist')
    })

    it('Blogs are ordered by likes', function() {
      cy.get('.blog-list').as('blogList')

      cy.get('@blogList').contains('olli1 blog').as('olli1')
      cy.get('@olli1').find('.toggle-info-button').click()
      cy.get('@olli1').parent().find('.like-button').click()
      cy.get('@olli1').parent().find('.like-button').click()

      cy.get('@blogList').contains('root2 blog').as('root2')
      cy.get('@root2').find('.toggle-info-button').click()
      cy.get('@root2').parent().find('.like-button').click()
      cy.get('@root2').parent().find('.like-button').click()
      cy.get('@root2').parent().find('.like-button').click()
      cy.get('@root2').parent().find('.like-button').click()

      cy.get('@blogList').contains('olli2 blog').as('olli2')
      cy.get('@olli2').find('.toggle-info-button').click()
      cy.get('@olli2').parent().find('.like-button').click()

      cy.wait(500)

      cy.get('.likes').then($elements => {
        const likes = [...$elements].map(el => el.innerText)
        expect(likes).to.deep.equal([...likes].sort().reverse())
      })
    })
  })
})