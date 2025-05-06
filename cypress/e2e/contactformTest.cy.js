describe("Contact Form", () => {
  beforeEach(() => {
    // מדמה שיש token תקף
    cy.setCookie("token", "fake-jwt-token");
  });
  it("sends a message and shows confirmation", () => {
    // Stub the contact endpoint
    cy.intercept("POST", "**/user/contact", { statusCode: 200 }).as(
      "sendContact"
    );

    cy.visit("/dashboard/contact");

    cy.get('input[name="name"]').type("Jane Doe");
    cy.get('input[name="email"]').type("jane@example.com");
    cy.get('select[name="subject"]').select("General Inquiry");
    cy.get('textarea[name="message"]').type("Hello, this is a test.");

    cy.get('button[type="submit"]').click();
    cy.wait("@sendContact");

    // The Swal success alert
    cy.contains("Thank you for contacting us!").should("be.visible");
  });
  it("shows an error alert when the server returns 500", () => {
    cy.intercept("POST", "**/user/contact", { statusCode: 500 }).as(
      "sendContactFail"
    );
    cy.visit("/dashboard/contact");
    cy.get('input[name="name"]').type("Jane Doe");
    cy.get('input[name="email"]').type("jane@example.com");
    cy.get('select[name="subject"]').select("Technical Support");
    cy.get('textarea[name="message"]').type("This will fail.");
    cy.get('button[type="submit"]').click();
    cy.wait("@sendContactFail");
    cy.contains(
      "There was an error sending your message. Please try again later."
    ).should("be.visible");
  });
});
