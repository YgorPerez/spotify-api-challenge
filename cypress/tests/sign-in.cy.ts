/// <reference types="cypress" />

describe('Test sign in page', () => {
  beforeEach(() => {
    cy.visit('/', { failOnStatusCode: false });
    cy.clearAllLocalStorage();
    cy.clearAllCookies();
    cy.visit('/', { failOnStatusCode: false });
  });

  it('Should be on the sign in page', () => {
    {
      cy.url().should('contain', '/auth/sign-in');
    }
  });
  it('Should redirect to auth if not logged in', () => {
    {
      cy.login();
    }
  });
});

describe('Test sign in page', () => {
  it('Should be able to sign in', () => {
    {
      cy.login();
    }
  });
});
