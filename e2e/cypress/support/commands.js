// Cypress.Commands.add("addApplication", (id) => {
//   let root = Cypress.env("BACKEND_URL") || "localhost:8081";
//   cy.request(
//     'POST',
//     `${root}/user`,
//     {
//       accept: false,
//       client_id: '',
//       email,
//       password,
//       username
//     })
// })

// Sepcific timeout used for somes tests cases, which are known to be flaky
const FLAKY_CONTAINS_TIMEOUT = 6000;


// This command is run before every test suite (this allow to execute tests in parallel)
// It should directly perform a backend POST request and the bot creation from the frontend
// should be another test. But since it's a real pain to deal with application creation
// and client_id it use the already created and deployed frontend application.
Cypress.Commands.add("createUser", (email, username, password) => {
  // let root = Cypress.env("BACKEND_URL") || "localhost:8081";
  // cy.request(
  //   'POST',
  //   `${root}/user`,
  //   {
  //     accept: false,
  //     client_id: '',
  //     email,
  //     password,
  //     username
  //   })
  let root = Cypress.env("FRONTEND_URL") || "localhost:8081";
  cy.contains("Create my first assistant").click();
  cy.get("#signup-form-username").type(username);
  cy.get("#signup-form-email").type(email);
  cy.get("#signup-form-password").type(password);
  cy.contains("Register").click()
    .then(() => {
      cy.contains(".userbox_name", username, { timeout: FLAKY_CONTAINS_TIMEOUT }).should('be.visible');
    });
})

Cypress.Commands.add("createBot", (botEmail, botName) => {
  cy.contains("Informations needed");
  cy.get("#create-assistant-name").type(botName);
  cy.get("#create-assistant-email").type(botEmail);
  cy.contains("button", "Create").click()
  .then(() => {
    cy.url().should("include", "factory");
  });
});

Cypress.Commands.add("login", (username, password)  => {
  cy.contains("button", "SignIn").click();
  cy.get("#signin-form-username").type(username);
  cy.get("#signin-form-password").type(password);
  cy.contains("Sign in").click()
    .then(() => {
      cy.contains(".userbox_name", username, { timeout: FLAKY_CONTAINS_TIMEOUT }).should('be.visible');
    });
});

// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
