/// <reference types="cypress" />

describe('Test album page', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/').then(() => {
      cy.url().should('contain', '/');
    });
    cy.visit('album/5AEDGbliTTfjOB8TSm1sxt').then(() => {
      cy.url().should('contain', 'album/5AEDGbliTTfjOB8TSm1sxt');
    });
  });

  it('Should have spotify card', () => {
    {
      cy.get('[data-cy=card] [data-cy=card-title]');
    }
  });
  it('Should have the songs of the album', () => {
    {
      cy.get('[data-cy=track] [data-cy=track-title]');
    }
  });
});
