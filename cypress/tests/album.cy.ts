/// <reference types="cypress" />

describe('Test album page', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/album/5AEDGbliTTfjOB8TSm1sxt').then(() => {
      cy.url().should('contain', '/auth');
      cy.location('pathname').should('eq', '/');
    });
    cy.visit('/album/5AEDGbliTTfjOB8TSm1sxt');
    cy.location('pathname').should('eq', '/album/5AEDGbliTTfjOB8TSm1sxt');
    cy.on('uncaught:exception', err => {
      if (
        err.message.includes('hydration') ||
        err.message.includes('Minified React')
      )
        return false;
    });
    cy.visit('/album/5AEDGbliTTfjOB8TSm1sxt');
    cy.url().should('contain', 'album/5AEDGbliTTfjOB8TSm1sxt');
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
