from flask import Blueprint
from resources.utils import account_verification, error_handling

accounts_endpoint = Blueprint("accounts", __name__)


@accounts_endpoint.route("/accounts/_validate", methods=["GET"])
@error_handling
@account_verification
def validate_account():
    print("Holi")
