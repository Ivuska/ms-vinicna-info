from flask import Flask, flash, render_template, redirect, url_for, request
import os
import requests


app = Flask(__name__)
app.secret_key = 'rbYPVS3hLzIToOJ'

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
    return redirect(url_for('show_thank_you_landing_page'))

@app.route('/thank_you')
def show_thank_you_landing_page():
    return render_template('thank_you_lp.html')

@app.route('/gdpr')
def show_gdpr_page():
    return render_template('gdpr.html')
