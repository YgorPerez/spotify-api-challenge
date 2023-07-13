/// <reference types="cypress" />

describe('Test track page', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('track/7G0gBu6nLdhFDPRLc0HdDG');
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
