declare namespace Cypress {
  interface Chainable {
    login({
      email,
      password,
    }: { email?: string; password?: string } = {}): void;
    typeSearch(searchTerm: string): void;
    clearSearch(): void
  }
}
