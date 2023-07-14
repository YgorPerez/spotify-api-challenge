/// <reference types="cypress" />

Cypress.Commands.add(
  'login',
  ({ email, password }: { email?: string; password?: string } = {}) => {
    cy.session(
      [{ email }, { password }],
      () => {
        cy.visit('auth/sign-in', { failOnStatusCode: false });
        cy.get('.cl-socialButtonsBlockButton').click();
        cy.origin(
          'https://accounts.spotify.com',
          { args: { email, password } },
          ({ email, password }) => {
            cy.get('#login-username').type(email ?? 'meboros705@niback.com');
            cy.get('#login-password').type(password ?? 'Pass@1234');
            cy.get('#login-button').click();
          },
        );
        cy.location('pathname').should('eq', '/');
      },
      { cacheAcrossSpecs: true },
    );
  },
);

Cypress.Commands.add('typeSearch', (searchTerm: string) => {
  cy.location('pathname').should('eq', '/');
  cy.get('[data-cy=search-input]').type(searchTerm);
});

Cypress.Commands.add('clearSearch', () => {
  cy.location('pathname').should('eq', '/');
  cy.get('[data-cy=search-input]').clear();
});
