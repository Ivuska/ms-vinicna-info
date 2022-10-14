describe('Go to the app and check content.', () => {
  beforeEach(() => {
    Cypress.Cookies.preserveOnce('session')
    cy.visit('http://127.0.0.1:5000/')
  })
  it('Get main page and check the content.', () => {
    cy.get('[data-testid=set_mode_icon]')

    cy.get('[data-testid=subscribe_form]')

    cy.get('[data-testid=input_email]')

    cy.get('[data-testid=submit_btn]').contains('Chci články')

    cy.get('[data-testid=gdpr_link]').contains('Informovaný souhlas')
  })

  it('Get from main page to GDPR.', () => {
    cy.get('[data-testid=gdpr_link]').click()

    cy.url().should('include', '/gdpr')

    cy.get('h1').contains('Informovaný souhlas')

    cy.get('.cursor-pointer > .fa-solid').click()

    cy.url().should('eq', 'http://127.0.0.1:5000/')
  })

  it('Get from main page to thank you landing page.', () => {
    cy.visit('http://127.0.0.1:5000/thank_you')

    cy.get('h1').contains('Úspěšně odesláno')

    cy.get('p').contains('Potvrďte prosím emailovou adresu klikem na link v zaslaném emailu.')
  })
})

describe('Sign up for articles.', () => {
  beforeEach(() => {
    Cypress.Cookies.preserveOnce('session')
    cy.visit('http://127.0.0.1:5000/')
  })
  it('Sign up without proper email address is not possible.', () => {
    cy.get('[data-testid=submit_btn]').click()

    cy.get('[data-testid=flash_message]').contains('Vyplňte prosím emailovou adresu.')
  
    cy.get('[data-testid=close_flash_message]').click()

    cy.get('[data-testid=flash_message]').should('not.be.visible')

    cy.get('[data-testid=input_email]').type('imatsion')

    cy.get('[data-testid=submit_btn]').click()

    cy.get('[data-testid=flash_message]').contains('Emailová adresa nemá správný formát.')
  
    cy.get('[data-testid=close_flash_message]').click()

    cy.get('[data-testid=flash_message]').should('not.be.visible')
  })
})