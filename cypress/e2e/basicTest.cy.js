describe("Login and Dashboard Test", () => {
  it("should login with valid credentials and navigate to the dashboard", () => {
    // Visit the login page
    cy.visit("/login"); // Adjust the path if necessary

    // Enter email
    cy.get('input[type="email"]').type("kobialen77@gmail.com"); // Replace with test email

    // Enter password
    cy.get('input[type="password"]').type("123456"); // Replace with test password

    // Click the login button
    cy.get('button[type="submit"]').click();

    // Verify redirection to the dashboard
    cy.url().should("include", "/dashboard"); // Ensure the URL includes /dashboard

    // Verify the dashboard content
  });
});
