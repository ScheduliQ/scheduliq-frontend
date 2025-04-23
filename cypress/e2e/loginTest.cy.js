describe("Login and Dashboard Test", () => {
  it("should login with valid credentials and navigate to the dashboard", () => {
    // Visit the login page
    cy.visit("/login"); // Adjust the path if necessary

    // Enter email
    cy.get('input[type="email"]').type("kobialen77@gmail.com"); // Replace with test email

    // Enter password
    cy.get('input[type="password"]').type("admin123456"); // Replace with test password

    // Click the login button
    cy.get('button[type="submit"]').click();

    // Verify redirection to the dashboard
    cy.url().should("include", "/dashboard"); // Ensure the URL includes /dashboard

    // Verify the dashboard content
  });

  it("should not login with invalid credentials and stay on the login page", () => {
    // 1. Navigate to login
    cy.visit("/login");

    // 2. Enter wrong email/password
    cy.get('input[type="email"]').clear().type("wrong@example.com");
    cy.get('input[type="password"]').clear().type("wrongpassword");

    // 3. Attempt to submit
    cy.get('button[type="submit"]').click();

    // 4. Should remain on /login
    cy.url().should("include", "/login");

    // 5. Error message should be visible
    cy.get("p.text-red-500").should("be.visible").and("not.be.empty");
  });
});
