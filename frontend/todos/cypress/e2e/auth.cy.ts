describe('Authentication Component', () => {
  beforeEach(() => {
    cy.visit('https://task-frontend-six.vercel.app/');
  });

  it('Should display the login form by default', () => {
    cy.contains('Want to Register?').should('be.visible');
    cy.get('ion-button').contains('Login').should('be.visible');
  });

  it('Should toggle to the registration form when clicking "Want to Register?"', () => {
    cy.contains('Want to Register?').click();
    cy.contains('Want to Login?').should('be.visible');
    cy.get('ion-button').contains('Register').should('be.visible');
  });

  it('Should display validation error for invalid email format', () => {
    cy.get('ion-input[formControlName="email"]').type('invalidemail');
    cy.contains('Invalid email format.').should('be.visible');
  });

  it('Should login successfully with valid credentials', () => {
    cy.get('ion-input[formControlName="email"]').type('karanns.aero19@gmail.com');
    cy.get('ion-input[formControlName="password"]').type('qwertyuiop');
    cy.get('ion-button').contains('Login').click();
  });

  it('Should register successfully with valid credentials', () => {
    cy.contains('Want to Register?').click();
    cy.get('ion-input[formControlName="username"]').type('Test User');
    cy.get('ion-input[formControlName="email"]').type('karanns19@gmail.com');
    cy.get('ion-input[formControlName="password"]').type('asdfghjkl');
    cy.get('ion-button').contains('Register').click();
    cy.url().should('include', '/verification');
  });
});
