/// <reference types="cypress" />

describe('Test album page', () => {
  beforeEach(() => {
    cy.visit('/album/5AEDGbliTTfjOB8TSm1sxt');
    cy.location('pathname').should('eq', '/album/5AEDGbliTTfjOB8TSm1sxt');
    cy.on('uncaught:exception', err => {
      if (
        err.message.includes('hydrating') ||
        err.message.includes('Hydration') ||
        err.message.includes('Minified React')
      )
        return false;
    });
  });

  it('Should have spotify card', () => {
    {
      cy.get('[data-cy=card] [data-cy=card-title]');
    }
  });
  it('Should have the songs of the album', () => {
    {
      cy.get('[data-cy=track] [data-cy=track-name]');
    }
  });
});
