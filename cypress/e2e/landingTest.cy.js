describe("Landing → Get Started", () => {
  it("When clicking on Get Started, navigate to /login page", () => {
    // 1. Load the Landing page
    cy.visit("/");

    // 2. Click the button
    cy.contains("Get Started").click();

    // 3. Verify the URL changed to /login
    cy.url().should("include", "/login");
  });
});
