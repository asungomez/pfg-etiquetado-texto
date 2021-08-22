import os

from flask import Blueprint, jsonify, request, redirect
from resources.utils import account_verification, error_handling
from resources import cognito

accounts_endpoint = Blueprint("accounts", __name__)


@accounts_endpoint.route("/accounts/_validate", methods=["GET"])
@error_handling
def validate_account():
    verification_code = request.args["code"]
    email = request.args["email"]
    cognito.confirm_sign_up(email, verification_code)
    return redirect(f"{os.environ['APP_URL']}/iniciar-sesion/?message=confirmed")

