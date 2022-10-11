describe('Got to the web app and check the main page is loaded correctly.', () => {
  it('Visits novinky-ze-skolky and check the content.', () => {
    cy.visit('https://novinky-ze-skolky.ifischerova.cz/')

    cy.get('[data-testid=set_mode_icon]')

    cy.get('[data-testid=subscribe_form]')

    cy.get('[data-testid=input_email]')

    cy.get('div[class*=recaptcha]')

    cy.get('[data-testid=submit_btn]').contains('Chci články')

    cy.get('[data-testid=gdpr_link]').contains('Informovaný souhlas')
  })
})

describe('Sign up for articles.', () => {
  beforeEach(() => {
    Cypress.Cookies.preserveOnce('session')
    cy.visit('https://novinky-ze-skolky.ifischerova.cz/')
  })
  it('Sign up without checked recaptcha is not possible.', () => {
    cy.get('[data-testid=input_email]').type('imatsion@seznam.cz')

    cy.get('[data-testid=submit_btn]').click()

    cy.get('[data-testid=flash_message]').contains('Potvrďte prosím, že nejste robot.')
  
    cy.get('[data-testid=close_flash_message]').click()

    cy.get('[data-testid=flash_message]').should('not.be.visible')
  })
})


/*
describe('Sign up without email address ends with error message.', () => {
  beforeEach(() => {
    Cypress.Cookies.preserveOnce('session')
  })
  it('Visits the app.', () => {
    cy.visit('https://novinky-ze-skolky.ifischerova.cz/')
  })
  it('Clicks on submit button.', () => {
    cy.get('[id=submitbtn]')
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
  it('Check recaptcha field.', () => {
    cy.get('recaptcha-checkbox')
      .check()
  })
  it('Clicks on submit button.', () => {
    cy.get('[id=submitbtn]')
      .click()
  })
  it('Error flash message about email address is visible.', () => {
    cy.get('[id=flashmessage]')
      .contains('Vyplňte prosím emailovou adresu.')
  })
  it('Closes the error flash message.', () => {
    cy.get('[id=closeflashmessage]')
      .click()
  })
  it('Error message should not be visible.', () => {
    cy.get('[id=flashmessage]')
      .should('not.be.visible')
  })
})*/