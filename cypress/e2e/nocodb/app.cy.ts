/* eslint-disable */

describe("navigation", () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit("http://localhost:3000");
  });

  it("shoud navigate", () => {
    cy.visit("http://localhost:3000");

    cy.url().should("include", ":3000");
  });
});

// Prevent TypeScript from reading file as legacy script
export {};
