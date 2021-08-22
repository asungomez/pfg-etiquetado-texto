import os
import logging

from flask import Blueprint, jsonify, request, redirect
from resources.utils import account_verification, error_handling
from resources import cognito

accounts_endpoint = Blueprint("accounts", __name__)


@accounts_endpoint.route("/accounts/_validate", methods=["GET"])
@error_handling
def validate_account():
    email = request.args.get("email")
    try:
        verification_code = request.args["code"]
        cognito.confirm_sign_up(email, verification_code)
        return redirect(f"{os.environ['APP_URL']}/iniciar-sesion?message=confirmed", code=302)
    except Exception as e:
        logging.error(f"Unexpected error: '{e}'")
        return redirect(f"{os.environ['APP_URL']}/error?message=confirmacion_fallida&email="
                        f"{email}", code=302)


