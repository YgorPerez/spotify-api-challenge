/// <reference types="cypress" />

Cypress.Commands.add('typeSearch', (searchTerm: string) => {
  cy.location('pathname').should('eq', '/');
  cy.get('[data-cy=search-input]').type(searchTerm);
});

Cypress.Commands.add('clearSearch', () => {
  cy.location('pathname').should('eq', '/');
  cy.get('[data-cy=search-input]').clear();
});
