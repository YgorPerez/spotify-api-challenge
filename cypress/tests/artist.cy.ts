/// <reference types="cypress" />

describe('Test artist page', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('albums/06HL4z0CvFAxyc27GXpf02');
  });
  it('Should have spotify card', () => {
    {
      cy.get('[data-cy=card] [data-cy=card-title]').should(
        'contain.text',
        'Taylor',
      );
    }
  });
  it('Should have the albums of the artist', () => {
    {
      cy.get('[data-cy=album] [data-cy=album-name]');
    }
  });
});
