/// <reference types="cypress" />

describe('Test search', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });
  it('Should display search results', () => {
    {
      cy.typeSearch('Taylor Swift');
      cy.get('[data-cy=artist-0] [data-cy=card-title]').should(
        'contain.text',
        'Taylor',
      );
    }
  });
  it('Infinite scrolling should work', () => {
    {
      cy.typeSearch('Taylor Swift');
      cy.get('[data-cy=artist-0] [data-cy=card-title]');
      cy.get('footer').scrollIntoView();
      cy.get('[data-cy*=artist-0] [data-cy=card-title]').eq(1);
    }
  });
});
