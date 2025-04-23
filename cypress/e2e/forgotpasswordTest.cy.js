describe("Login → Forgot Password Modal", () => {
  it("opens and closes the forgot-password modal", () => {
    // 1. Go to the login page
    cy.visit("/login");

    // 2. Click "Forgot password?"
    cy.contains("Forgot password?").click();

    // 3. The modal should be visible with all its components
    cy.get(".modal").should("exist").and("be.visible");
    cy.get(".modal-box").should("be.visible");
    cy.get("h3").contains("Forgot Password").should("be.visible");
    cy.get('input[type="email"]').should("be.visible");
    cy.get('button[type="submit"]').should("be.visible");

    // 4. Close using the Close button
    cy.contains("Close").click();

    // 5. The modal should not be visible
    cy.get(".modal").should("not.exist");
  });

  it("does not show the forgot-password modal by default", () => {
    // 1. Load the login page
    cy.visit("/login");

    // 2. The modal should not exist initially
    cy.get(".modal").should("not.exist");
  });
});
