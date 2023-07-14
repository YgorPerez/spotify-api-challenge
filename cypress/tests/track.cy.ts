/// <reference types="cypress" />

describe('Test track page', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/').then(() => {
      cy.url().should('contain', '/auth');
    });
    cy.location('pathname').should('eq', '/');
    cy.visit('/track/7G0gBu6nLdhFDPRLc0HdDG');
    cy.on('uncaught:exception', err => {
      if (
        err.message.includes('hydration') ||
        err.message.includes('Minified React')
      )
        return false;
    });
    cy.visit('/track/7G0gBu6nLdhFDPRLc0HdDG');
    cy.url().should('contain', 'track/7G0gBu6nLdhFDPRLc0HdDG');
  });
  it('Should have spotify card', () => {
    {
      cy.get('[data-cy=card] [data-cy=card-title]');
    }
  });
  it('Should have the lyrics', () => {
    {
      cy.get('[data-cy=lyrics]');
    }
  });
});
