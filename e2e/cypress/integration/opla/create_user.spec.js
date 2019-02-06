// / <reference types="Cypress" />

context("Actions", () => {
  const root = Cypress.env("FRONTEND_URL") || "localhost:8080";
  // https://on.cypress.io/interacting-with-elements

  const ts = Math.floor(Date.now() + 1 / 1000);
  const username = `cypress-${ts}`;
  // cy.visit(`${root}`)
  // let username = `cypress`;
  const password = "password";
  const email = `${username}@opla.ai`;

  const botName = `A wonderful bot: ${username}`;

  beforeEach(() => {
    cy.visit(`${root}`);
  });

  it("Create new bot", () => {
    cy.createUser(email, username, password);
    cy.get("#create-assistant-name").type(botName);
    cy.get("#create-assistant-email").type(`${username}-contact@opla.ai`);
    cy.contains("button", "Create").click();
    cy.url().should("include", "/factory");
  });

  const newIntentField = () =>
    cy
      .contains("input")
      .parents(".zui-expansion")
      .last()
      .find("[contenteditable]")
      .first();

  const responseField = () =>
    cy
      .contains("output")
      .parents(".zui-expansion")
      .last()
      .find("[contenteditable]")
      .first();

  it("Login as existing user via dialog and add intent", () => {
    const response =
      "something not very interesting but different from the rest of the page";

    // Login
    cy.contains("button", "SignIn").click();
    cy.get("#signin-form-username").type(username);
    cy.get("#signin-form-password").type(password);
    cy.contains("Sign in").click();

    cy.contains("menu").click();
    cy.contains("Factory").click();
    cy.contains(botName).click();
    // Force click should avoid error launched when scrren resolution is too small to display "builder"
    cy.contains("Builder").click();

    cy.contains("button", "Create").click();

    newIntentField().type("question");
    newIntentField().type("{enter}");

    responseField().type(response);
    responseField().type("{enter}");

    cy.contains("button", "Save").click();
    cy.contains(".mdc-text-field", "Your message")
      .find("input")
      .type("question{enter}");

    cy.contains(".message", response);
  });
});
