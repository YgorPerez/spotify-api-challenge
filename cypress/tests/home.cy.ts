/// <reference types="cypress" />

describe('Test search and spotify card', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.typeSearch('Taylor Swift');
  });
  it('Should display skeleton on search', () => {
    {
      cy.get('[data-cy=card-skeleton]').eq(0);
    }
  });
  it('Should display search results', () => {
    {
      cy.get('[data-cy=card-artist] [data-cy=card-title]')
        .eq(0)
        .should('contain.text', 'Taylor');
    }
  });
  it('Should display last searched albums results', () => {
    {
      cy.get('[data-cy=card-artist] [data-cy=card-title]').eq(0);
      cy.clearSearch();
      cy.get('[data-cy=card-last-album] [data-cy=card-title]').eq(0);
    }
  });
  it('Should fecth the next page if footer in view', () => {
    {
      cy.get('[data-cy=card-artist] [data-cy=card-title]').eq(0);
      cy.get('footer').scrollIntoView();
      cy.get('[data-cy*=card-artist] [data-cy=card-title]').eq(1);
    }
  });
  it('Artist card should link to artist page', () => {
    {
      cy.get('[data-cy=card-artist] [data-cy=card-title]').eq(0).click();
      cy.url().should('contain', '/albums/');
    }
  });
  it('Album card should link to album page', () => {
    {
      cy.get('[data-cy=card-album] [data-cy=card-title]').eq(0).click();
      cy.url().should('contain', '/album/');
    }
  });
  it('Track card should link to track page', () => {
    {
      cy.get('[data-cy=card-track] [data-cy=card-title]').eq(0).click();
      cy.url().should('contain', '/track/');
    }
  });
  it('Track card should have a link to the artist page', () => {
    {
      cy.get('[data-cy=card-track] [data-cy=card-subname]').eq(0).click();
      cy.url().should('contain', '/albums/');
    }
  });
  it('Album card should have a link to the artist page', () => {
    {
      cy.get('[data-cy=card-album] [data-cy=card-subname]').eq(0).click();
      cy.url().should('contain', '/albums/');
    }
  });
});
