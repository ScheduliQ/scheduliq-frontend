describe("Login → Forgot Password Modal", () => {
  it("opens and closes the forgot‑password modal", () => {
    // 1. Go to the login page
    cy.visit("/login");

    // 2. Click "Forgot password?"
    cy.contains("Forgot password?").click();

    // 3. The modal should be visible
    cy.get("div.modal.modal-open").should("be.visible");
    cy.get("h3").should("contain", "Forgot Password");

    // 4. Close the modal using the "Close" button
    cy.contains("Close").click();

    // 5. The modal should no longer exist
    cy.get("div.modal.modal-open").should("not.exist");
  });
});
