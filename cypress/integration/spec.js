describe('Sapper template app', () => {
	beforeEach(() => {
		cy.visit('/')
	});

	it('has the correct <h1>', () => {
		cy.contains('h1', 'SAGA')
	});

	it('navigates to /about', () => {
		cy.get('nav a').contains('About').click();
		cy.url().should('include', '/about');
	});

	it('navigates to /login', () => {
		cy.get('nav a').contains('Login').click();
		cy.url().should('include', '/login');
	});
});