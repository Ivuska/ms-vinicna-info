from flask import Flask, flash, render_template, redirect, url_for, request, session
from dotenv import load_dotenv
import os
import requests
from flask_recaptcha import ReCaptcha

# Load environment variables from .env file.
load_dotenv()

app = Flask(__name__)
app.secret_key = 'rbYPVS3hLzIToOJ'
app.templates_auto_reload = True

app.config['RECAPTCHA_SITE_KEY'] = os.environ.get('RECAPTCHA_SITE_KEY') 
app.config['RECAPTCHA_SECRET_KEY'] = os.environ.get('RECAPTCHA_SECRET_KEY') 
recaptcha = ReCaptcha(app) # Create a ReCaptcha object by passing in 'app' as parameter

worker_url = os.environ.get('WORKER_URL')

@app.route('/')
def get_main_page():
    email_address = session.pop('email_address', '')    
    return render_template('index.html', email_address=email_address)

@app.route('/', methods=['POST'])
def submit_new_email():
    email_address = request.form['input_email'] 
    if not recaptcha.verify(): # Use verify() method to see if ReCaptcha is filled out
        flash('Potvrďte prosím, že nejste robot.')
        session['email_address'] = email_address
        return redirect(url_for('get_main_page'))

    r = requests.post(worker_url + '/email', json={ "email": email_address })

    if r.status_code == 409:
        flash('Tenhle email už známe.')
        session['email_address'] = email_address
        return redirect(url_for('get_main_page'))

    session.pop('email_address', None)
    return redirect(url_for('show_thank_you_landing_page'))

@app.route('/thank_you')
def show_thank_you_landing_page():
    return render_template('thank_you_lp.html')

@app.route('/gdpr')
def show_gdpr_page():
    return render_template('gdpr.html')

if __name__ == '__main__':
    app.run()