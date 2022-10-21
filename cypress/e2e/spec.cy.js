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

  it('Check all links on the page', () => {
    cy.get('a').each(page => {
      cy.request(page.prop('href'))
    })
  })

  it('Get from main page to GDPR.', () => {
    cy.get('[data-testid=gdpr_link]').click()

    cy.url().should('include', '/gdpr')

    cy.get('h1').contains('Informovaný souhlas')

    cy.get('.cursor-pointer > .fa-solid').click()

    cy.url().should('eq', 'http://127.0.0.1:5000/')
  })

  it('Get to thank you landing page.', () => {
    cy.visit('http://127.0.0.1:5000/thank_you')

    cy.get('h1').contains('Úspěšně odesláno')

    cy.get('p').contains('Potvrďte prosím emailovou adresu klikem na link v zaslaném emailu.')
  })

  it('Get to unsubscribe page and check it.', () => {
    cy.visit('http://127.0.0.1:5000/unsubscribe')

    cy.get('h1').contains('Nechci dostávat info ze školky')

    cy.get('p').contains('Vyplňte prosím email, který chcete odhlásit z odběru článků.')

    cy.get('[data-testid=submit_unsubscribe_btn]').contains('Nechci dostávat články')
  })
})

describe('Sign up for articles.', () => {
  beforeEach(() => {
    Cypress.Cookies.preserveOnce('session')
    cy.visit('http://127.0.0.1:5000/')
  })
  it('Sign up without proper email address is not possible.', () => {
    cy.log('Try to submit empty email field.')
    cy.get('[data-testid=submit_btn]').click()

    cy.get('[data-testid=flash_message]').contains('Vyplňte prosím emailovou adresu.')
  
    cy.get('[data-testid=close_flash_message]').click()

    cy.get('[data-testid=flash_message]').should('not.be.visible')

    cy.log('Try to submit email address in incorrect format.')
    cy.get('[data-testid=input_email]').type('imatsion')

    cy.get('[data-testid=submit_btn]').click()

    cy.get('[data-testid=flash_message]').contains('Emailová adresa nemá správný formát.')
  
    cy.get('[data-testid=close_flash_message]').click()

    cy.get('[data-testid=flash_message]').should('not.be.visible')

    cy.log('Clear the email input.')
    cy.get('[data-testid=input_email]').clear()

    cy.get('[data-testid=input_email]').should('have.value', '')
  })
  it('I cannot sign up for articles with the same email address.', () => {})
  it('I cannot activate the email address that is already in db.', () => {})
  it('I cannot sign up for articles after the link is deactivated.', () => {})
  it.skip('Can generate a new email address and sign up for articles.', () => {
    let inboxId;
    let emailAddress;
      // see commands.js custom commands
      cy.createInbox().then(inbox => {
      // verify a new inbox was created
      assert.isDefined(inbox)

      // save the inboxId for later checking the emails
      inboxId = inbox.id
      emailAddress = inbox.emailAddress;

      // sign up with inbox email address and the password
      cy.get('[data-testid=input_email]').type(emailAddress);

      cy.get('[data-testid=submit_btn]').click();

      cy.url().should('eq', 'http://127.0.0.1:5000/thank_you')

      // wait for an email in the inbox
      cy.waitForLatestEmail(inboxId).then(email => {
        // verify we received an email
        assert.isDefined(email);

        // verify that email contains the code
        assert.strictEqual(/Klikněte pro aktivaci/.test(email.body), true);
        console.log(email.body)
        cy.writeFile('./email.html', email.body, 'utf-8')
        cy.visit('./email.html')
      });
    });
  });
});

describe('Unsubscribe from getting articles.', () => {
  it('Unsubscribe without proper email address is not possible.', () => {
    cy.log('Try to submit empty email field.')
    cy.visit('http://127.0.0.1:5000/unsubscribe')
    
    cy.get('[data-testid=submit_unsubscribe_btn]').click()

    cy.get('[data-testid=flash_message]').contains('Vyplňte prosím emailovou adresu.')
  
    cy.get('[data-testid=close_flash_message]').click()

    cy.get('[data-testid=flash_message]').should('not.be.visible')

    cy.log('Try to submit email address in incorrect format.')
    cy.get('[data-testid=input_email]').type('imatsion')

    cy.get('[data-testid=submit_unsubscribe_btn]').click()

    cy.get('[data-testid=flash_message]').contains('Emailová adresa nemá správný formát.')
  
    cy.get('[data-testid=close_flash_message]').click()

    cy.get('[data-testid=flash_message]').should('not.be.visible')

    cy.log('Clear the email input.')
    cy.get('[data-testid=input_email]').clear()

    cy.get('[data-testid=input_email]').should('have.value', '')
  })
  it('I cannot unsubscribe with email address that is not in signed up.', () => {})
  it('I can unsubscribe from getting articles.', () => {})
})