/// <reference types="cypress" />

describe('Test artist page', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/albums/06HL4z0CvFAxyc27GXpf02').then(() => {
      cy.url().should('contain', '/auth');
      cy.location('pathname').should('eq', '/');
    });
    cy.visit('/albums/06HL4z0CvFAxyc27GXpf02');
    cy.location('pathname').should('eq', '/albums/06HL4z0CvFAxyc27GXpf02');
    cy.on('uncaught:exception', err => {
      if (
        err.message.includes('hydration') ||
        err.message.includes('Minified React')
      )
        return false;
    });
    cy.visit('/albums/06HL4z0CvFAxyc27GXpf02');
    cy.url().should('contain', 'albums/06HL4z0CvFAxyc27GXpf02');
  });
  it('Should have spotify card', () => {
    {
      cy.get('[data-cy=card] [data-cy=card-title]');
    }
  });
  it('Should have the albums of the artist', () => {
    {
      cy.get('[data-cy=album] [data-cy=album-name]');
    }
  });
});
