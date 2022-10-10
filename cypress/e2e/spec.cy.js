describe('Got to the web app and check the main page is loaded correctly.', () => {
  it('Visits novinky-ze-skolky and check the content.', () => {
    cy.visit('https://novinky-ze-skolky.ifischerova.cz/')
    cy.get('[id="darkmodeicon"]')
    cy.contains('form')
    cy.get('input')
    cy.get('div[class*="recaptcha"]')
    cy.get('button').contains('Chci články')
    cy.contains('Informovaný souhlas')
  })
})

describe('Sign up without confirmed recaptcha shows error message.', () => {
  beforeEach(() => {
    Cypress.Cookies.preserveOnce('session')
  })
  it('Visits the app.', () => {
    cy.visit('https://novinky-ze-skolky.ifischerova.cz/')
  })
  it('Gets an email field and type some email address in it.', () => {
    cy.get('[id=email]')
      .type('imatsion@seznam.cz')
  })
  it('Clicks on submit button.', () => {
    cy.get('button')
      .click()
  })
  it('Error flash message about missing recaptcha control is visible.', () => {
    cy.get('[id=flashmessage]')
      .contains('Potvrďte prosím, že nejste robot.')
  })
  it('Closes the error flash message.', () => {
    cy.get('[id=closeflashmessage]')
      .click()
  })
  it('Error message should not be visible.', () => {
    cy.get('[id=flashmessage]')
      .should('not.be.visible')
  })
})