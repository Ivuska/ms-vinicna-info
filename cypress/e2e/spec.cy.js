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