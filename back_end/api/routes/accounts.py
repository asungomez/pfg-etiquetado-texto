from flask import Blueprint, jsonify
from resources.utils import account_verification, error_handling

accounts_endpoint = Blueprint("accounts", __name__)


@accounts_endpoint.route("/accounts/_validate", methods=["GET"])
@error_handling
def validate_account():
    print("Holi")
    return jsonify({})
