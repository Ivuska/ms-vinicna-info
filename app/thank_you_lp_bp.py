from flask import Blueprint, render_template
blueprint = Blueprint('than_you_lp_bp', __name__)
@blueprint.route('/thank_you')
def show_thank_you_landing_page():
	return render_template('thank_you_lp.html')