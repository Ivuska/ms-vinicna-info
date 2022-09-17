from flask import Flask, flash, render_template, redirect, url_for, request
import os
import requests
from flask_recaptcha import ReCaptcha


app = Flask(__name__)
app.secret_key = 'rbYPVS3hLzIToOJ'

app.config['RECAPTCHA_SITE_KEY'] = os.environ.get('RECAPTCHA_SITE_KEY') # <-- Add your site key
app.config['RECAPTCHA_SECRET_KEY'] = os.environ.get('RECAPTCHA_SECRET_KEY') # <-- Add your secret key
recaptcha = ReCaptcha(app) # Create a ReCaptcha object by passing in 'app' as parameter

worker_url = os.environ.get('WORKER_URL')

@app.route('/')
def get_main_page():
    return render_template('index.html')

@app.route('/', methods=['POST'])
def submit_new_email():
    email_address = request.form['input_email'] 
    r = requests.post(worker_url + '/email', json={ "email": email_address })
    if r.status_code == 409:
        flash('Tenhle email už známe.')
        return redirect(url_for('get_main_page'))
    if request.method == 'POST': # Check to see if flask.request.method is POST
        if not recaptcha.verify(): # Use verify() method to see if ReCaptcha is filled out
            flash('Potvrďte prosím, že nejste robot.')
            return redirect(url_for('get_main_page'))
    return redirect(url_for('show_thank_you_landing_page'))

@app.route('/thank_you')
def show_thank_you_landing_page():
    return render_template('thank_you_lp.html')

@app.route('/gdpr')
def show_gdpr_page():
    return render_template('gdpr.html')

if __name__ == '__main__':
    app.run()