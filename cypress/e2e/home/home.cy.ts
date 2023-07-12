/// <reference types="cypress" />

describe('Test middleware', () => {
  beforeEach(() => {
    cy.visit('/', { failOnStatusCode: false });
  });

  it('Should be on the auth page', () => {
    {
      cy.contains('Sign in');
    }
  });
});
