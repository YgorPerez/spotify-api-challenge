/// <reference types="cypress" />

Cypress.Commands.add(
  'login',
  ({
    email = '55122zaza@gmail.com',
    password = 'Pass@1234',
  }: { email?: string; password?: string } = {}) => {
    cy.session([{ email }, { password }], () => {
      cy.visit('/auth/sign-in', { failOnStatusCode: false });
      cy.get('.cl-socialButtonsBlockButton', { timeout: 6000 }).click();
      cy.origin(
        'https://accounts.spotify.com',
        { args: { email, password } },
        ({ email, password }) => {
          cy.get('#login-username', { timeout: 6000 }).type(
            email ?? '55122zaza@gmail.com',
          );
          cy.get('#login-password').type(password ?? 'Pass@1234');
          cy.get('#login-button').click();
        },
      );
      cy.url().should('contain', Cypress.config().baseUrl);
    });
  },
);

Cypress.Commands.add('typeSearch', (searchTerm: string) => {
  cy.url().should('contain', Cypress.config().baseUrl);
  cy.get('[data-cy=search-input]').type(searchTerm);
});
