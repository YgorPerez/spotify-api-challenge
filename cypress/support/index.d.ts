declare namespace Cypress {
  interface Chainable {
    typeSearch(searchTerm: string): void;
    clearSearch(): void;
  }
}
