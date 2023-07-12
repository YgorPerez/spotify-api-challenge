/// <reference types="cypress" />

describe('Test middleware', () => {
  beforeEach(() => {
    cy.visit('/', { failOnStatusCode: false });
  });

  it('Should be on the sign in page', () => {
    {
      cy.contains('Sign in');
    }
  });
});
