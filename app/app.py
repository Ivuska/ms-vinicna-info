from flask import Flask, render_template

import email_addresses_bp

app = Flask(__name__)

app.register_blueprint(email_addresses_bp.blueprint)

@app.route('/')
def get_main_page():
    return render_template('index.html')