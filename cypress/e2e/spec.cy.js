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

  it('Check all links on the page.', () => {
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
  it('I cannot sign up for articles after the link is deactivated.', () => {
    cy.mailtester().then(async (mailtester) => {
      cy.log('Create and confirm email address')
      const emailAddress = await mailtester.createAddress()
      assert.isDefined(emailAddress)  

      // sign up with inbox email address and the password
      cy.log('Sign up the email address and verify that the email is sent.')
      cy.get('[data-testid=input_email]').type(emailAddress);
      cy.get('[data-testid=submit_btn]').click();
      cy.url().should('eq', 'http://127.0.0.1:5000/thank_you').then(async () => {
        const email = await mailtester.waitForEmail(emailAddress)
        assert.isDefined(email);

        // verify that email contains the code
        console.log(email.body)
        assert.strictEqual(/Klikněte pro aktivaci/.test(email.body), true)

        cy.log('Visit the link with invalid token and check the flash message.')
        const link = "http://127.0.0.1:5000/activation/d76dfb72a329"

        cy.visit(link)
        cy.get('[data-testid=flash_message]').contains('Platnost linku vypršela.')
        cy.get('[data-testid=close_flash_message]').click()
        cy.get('[data-testid=flash_message]').should('not.be.visible')
      });
    });
  })
  it('Can generate a new email address and sign up for articles.', () => {
    cy.mailtester().then(async (mailtester) => {
      const emailAddress = await mailtester.createAddress()
      assert.isDefined(emailAddress)  

      // sign up with inbox email address and the password
      cy.get('[data-testid=input_email]').type(emailAddress);
      cy.get('[data-testid=submit_btn]').click();
      cy.url().should('eq', 'http://127.0.0.1:5000/thank_you').then(async () => {
        const email = await mailtester.waitForEmail(emailAddress)
        assert.isDefined(email);

        // verify that email contains the code
        assert.strictEqual(/Klikněte pro aktivaci/.test(email.body), true)
        

        //I cannot switch between two domains and then click the link so I explicitly parse the link from the href attr of anchor and then 
        // visit this link
        const parser = new DOMParser()
        const doc = parser.parseFromString(email.body, 'text/html')
        const link = doc.querySelector('a').getAttribute('href')
        assert.isDefined(link)

        cy.visit(link)

        cy.get('[data-testid=flash_message]').contains('Email byl úspěšně aktivován.')
  
        cy.get('[data-testid=close_flash_message]').click()
    
        cy.get('[data-testid=flash_message]').should('not.be.visible')
      });
    });
  });
  it.skip('I cannot sign up for articles with the same email address.', () => {
    cy.log('Submit valid email address.')
    cy.get('[data-testid=input_email]').type('testemail@email.cz')

    cy.get('[data-testid=submit_btn]').click()

    cy.log('Check the email address is successfully sent.')
    cy.url().should('eq', 'http://127.0.0.1:5000/thank_you')
    //need to set up next steps
  })
});

describe('Unsubscribe from getting articles.', () => {
  beforeEach(() => {
    Cypress.Cookies.preserveOnce('session')
    cy.visit('http://127.0.0.1:5000/unsubscribe')
  })
  it('Unsubscribe without proper email address is not possible.', () => {
    cy.log('Try to submit empty email field.')
    
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
  it('I cannot unsubscribe with email address that is not in db.', () => {
    cy.log('Try to submit email that is not in database.')
    cy.get('[data-testid=input_email]').type('testemail@seznam.cz');
    cy.get('[data-testid=submit_unsubscribe_btn]').click()

    cy.log('Flash message that the email address is not registered should be visible.')
    cy.get('[data-testid=flash_message]').contains('Odběr článků nejde zrušit - emailová adresa není registrována.')
    cy.get('[data-testid=close_flash_message]').click()
    cy.get('[data-testid=flash_message]').should('not.be.visible')

    cy.log('Clear the email input.')
    cy.get('[data-testid=input_email]').clear()
    cy.get('[data-testid=input_email]').should('have.value', '')
  })
  it.skip('I can unsubscribe from getting articles.', () => {

  })
});