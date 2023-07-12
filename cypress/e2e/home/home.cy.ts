/// <reference types="cypress" />

describe('example to-do app', () => {
  beforeEach(() => {
    cy.visit('https://music-api-challenge.vercel.app');
  });

  it('displays two todo items by default', () => {
    cy.get('input').should('be.visible');
  });
});
