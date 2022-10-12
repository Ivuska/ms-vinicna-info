describe('Got to the web app and check the main page is loaded correctly.', () => {
  it('Visits novinky-ze-skolky and check the content.', () => {
    cy.visit('http://127.0.0.1:5000/')

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
    cy.visit('http://127.0.0.1:5000/')
  })
  it('Sign up without checked recaptcha is not possible.', () => {
    cy.get('[data-testid=input_email]').type('imatsion@seznam.cz')

    cy.get('[data-testid=submit_btn]').click()

    cy.get('[data-testid=flash_message]').contains('Potvrďte prosím, že nejste robot.')
  
    cy.get('[data-testid=close_flash_message]').click()

    cy.get('[data-testid=flash_message]').should('not.be.visible')
  })

  it('Sign up without proper email address is not possible.', () => {
    cy.get('[data-testid=input_email]').type('imatsion')

    cy.get('[style="width: 304px; height: 78px;"] > div > iframe').click()

    cy.get('[data-testid=submit_btn]').click()

    cy.get('[data-testid=flash_message]').contains('Emailová adresa nemá správný formát.')
  
    cy.get('[data-testid=close_flash_message]').click()

    cy.get('[data-testid=flash_message]').should('not.be.visible')
  })
})