import werkzeug
import traceback
import logging
from flask import request, abort, g, make_response

from resources.exception import APIException
from resources import cognito

def error_handling(function):
    def wrapper(*args, **kwargs):

        try:
            return function(*args, **kwargs)

        # Intentionally aborted
        except werkzeug.exceptions.HTTPException as aborted:
            raise aborted

        # Backend API request returned error
        except APIException as backend_error:
            abort(make_response(
                {
                    "message": backend_error.msg,
                    "status_code": backend_error.code
                },
                backend_error.code
            ))
        # Unexpected error in frontend API
        except Exception as e:
            formatted_lines = traceback.format_exc().splitlines()
            logging.error("Unexpected error: {} - {} - '{}''".format(
                e.__class__.__name__,
                e,
                formatted_lines[-2]
            ))
            abort(make_response(
                {
                    "message": "Error in '{} {}'".format(request.method, request.path),
                    "status_code": 500
                },
                500
            ))

    wrapper.__name__ = function.__name__
    return wrapper


def account_verification(function):
    def wrapper(*args, **kwargs):
        g.account = get_account_from_token(
            request.headers["x-pfg-access-token"])
        return function(*args, **kwargs)

    wrapper.__name__ = function.__name__
    return wrapper

def get_account_from_token(token):
    try:
        account = cognito.get_user_from_token(token)
        return account
    except Exception as e:
        raise APIException(401, "Token is invalid or expired.", e)