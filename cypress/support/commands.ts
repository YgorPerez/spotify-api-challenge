/// <reference types="cypress" />

Cypress.Commands.add(
  'login',
  ({
    email = 'music-cypress@gmail.com	',
    password = 'Pass@1234',
  }: { email?: string; password?: string } = {}) => {
    cy.session([{ email }, { password }], () => {
      cy.visit('auth/sign-in', { failOnStatusCode: false });
      cy.get('.cl-socialButtonsBlockButton').click();
      cy.origin(
        'https://accounts.spotify.com',
        { args: { email, password } },
        ({ email, password }) => {
          cy.get('#login-username').type(email);
          cy.get('#login-password').type(password);
          cy.get('#login-button').click();
        },
      );
      cy.location('pathname').should('eq', '/');
    });
  },
);

Cypress.Commands.add('typeSearch', (searchTerm: string) => {
  cy.location('pathname').should('eq', '/');
  cy.get('[data-cy=search-input]').type(searchTerm);
});
