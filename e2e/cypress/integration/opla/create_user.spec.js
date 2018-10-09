/// <reference types="Cypress" />

context('Actions', () => {
  let root = Cypress.env('FRONTEND_URL');
  // https://on.cypress.io/interacting-with-elements


  let ts = Math.floor(Date.now() / 1000)
  let username = `cypress-${ts}`;
  // cy.visit(`${root}`)
  // let username = `cypress`;
  let password = `password`;

  beforeEach(() => {
    cy.visit(`${root}`)
  })

  it('Page loads properly', () => {
  cy.visit(`${root}`)
    cy.contains('.mdc-button', 'Create it')
    // TODO this is the place where to check other things to be on the page.
  })

  it('Create new bot', () => {
    cy.contains('Create it').click()
    cy.get('#create-assistant-name').type(`A wonderful bot: ${username}`)
    cy.get('#create-assistant-username').type(username)
    cy.get('#create-assistant-password').type(password, { force: true })
    cy.get('#create-assistant-email').type(`${username}@opla.ai`)
    cy.contains('Opla !').click()

  })

  let newIntentField = () => cy.contains('input').parents('.zui-expansion').last().find('[contenteditable]').first()

  let responseField = () => cy.contains('output').parents('.zui-expansion').last().find('[contenteditable]').first()

  it('Login as existing user via dialog and add intent', () => {
    let response = `something not very interesting but different from the rest of the page`

    // Login
    cy.contains('button', 'SignIn').click()
    cy.get('#signin-dialog-username').type(username)
    cy.get('#signin-dialog-password').type(password)
    cy.contains('Sign in').click()
    cy.contains('menu').click()
    cy.contains('Factory').click()
    cy.contains('Builder').click()

    cy.contains('button', 'Create').click()
    newIntentField().type('question')
    newIntentField().type('{enter}')

    responseField().type(response)
    responseField().type('{enter}')

    cy.contains('button', 'Save').click()
    cy.contains('.mdc-text-field', 'Your message').find('input').type('question{enter}')

    cy.contains('.message', response)

  })

  it('Create user and login via form', () => {
    let username = `cypress-form-${ts}`;

    cy.contains('Create it').click()
    cy.get('#create-assistant-name').type(`A wonderful bot: ${username}`)
    cy.get('#create-assistant-username').type(username)
    cy.get('#create-assistant-password').type(password, {force: true})
    cy.get('#create-assistant-email').type(`${username}@opla.ai`)
    cy.contains('Opla !').click()

    // Login
    cy.visit(`${root}factory`)
    cy.get('#signin-form-username').type(username)
    cy.get('#signin-form-password').type(password)
    cy.contains('Sign in').click()
    cy.contains('A wonderful bot')
  })
})
