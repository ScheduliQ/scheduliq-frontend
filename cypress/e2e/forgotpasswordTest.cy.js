describe("Login → Forgot Password Modal", () => {
  it("opens and closes the forgot-password modal", () => {
    // 1. Go to the login page
    cy.visit("/login");

    // 2. Click "Forgot?"
    cy.contains("Forgot?").click();

    // 3. The modal should be visible with all its components
    cy.get(".fixed.inset-0").should("exist").and("be.visible");
    cy.get(".bg-white.rounded-2xl").should("be.visible");
    cy.get("h3").contains("Reset Password").should("be.visible");
    cy.get('input[type="email"]').should("be.visible");
    cy.get('button[type="submit"]').should("be.visible");

    // 4. Close using the Cancel button
    cy.contains("Cancel").click();

    // 5. The modal should not be visible
    cy.get(".fixed.inset-0").should("not.exist");
  });

  it("does not show the forgot-password modal by default", () => {
    // 1. Load the login page
    cy.visit("/login");

    // 2. The modal should not exist initially
    cy.get(".fixed.inset-0").should("not.exist");
  });
});
