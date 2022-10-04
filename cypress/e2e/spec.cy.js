describe('Got to the web app and check the main page is loaded correctly.', () => {
  it('Visits novinky-ze-skolky.', () => {
    cy.visit('https://novinky-ze-skolky.ifischerova.cz/')
  })
  it('Checks that switch mode icon is present.', () => {
    cy.get('[id="darkmodeicon"]')
  })
  it('Checks that form is present.', () => {
    cy.contains('form')
  })
  it('Checks that email field is present.', () => {
    cy.get('input')
  })
  it('Checks that recaptcha is present.', () => {
    cy.get('div[class*="recaptcha"]')
  })
  it('Checks that button "Chci články" is present.', () => {
    cy.get('button').contains('Chci články')
  })
  it('Checks that link to GDPR page is present.', () => {
    cy.contains('Informovaný souhlas')
  })
})