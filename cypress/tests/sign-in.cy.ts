/// <reference types="cypress" />

describe('Test sign in page', () => {
  it('Should be on the sign in page', () => {
    {
      cy.visit('/', { failOnStatusCode: false });
      cy.url().should('contain', '/auth/sign-in');
    }
  });

  it('Should be able to sign in', () => {
    {
      cy.login();
    }
  });
});
