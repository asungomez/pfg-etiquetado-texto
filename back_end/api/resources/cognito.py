import boto3
import os
from botocore.config import Config

# Environment vars
cognito_user_pool_client_id = os.environ["COGNITO_USER_POOL_CLIENT_ID"]
cognito_user_pool = os.environ["COGNITO_USER_POOL"]

# Set botocore global config
config = Config(connect_timeout=10, read_timeout=5, retries={"max_attempts": 10})


def get_user_from_token(token):
    client = boto3.client("cognito-idp", config=config)
    user = client.get_user(
        AccessToken=token
    )
    return user

def confirm_sign_up(username, code):
    client = boto3.client("cognito-idp", config=config)
    user = client.confirm_sign_up(
        ClientId=cognito_user_pool_client_id,
        Username=username,
        ConfirmationCode=code
    )
    return user