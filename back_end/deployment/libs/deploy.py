import os
import subprocess
from libs.aws import get_stack_outputs

INFRA_DIR = f"{os.environ['REPO_DIR']}/back_end/infrastructure"
LAMBDA_DIR = f"{os.environ['REPO_DIR']}/back_end/lambda"
API_DIR = f"{os.environ['REPO_DIR']}/back_end/api"

def deploy_amplify_app(
  app_name, 
  repo_config,
  auth_config,
  api_url
  ):

  environment = {
    "APP_NAME": app_name,
    "GH_TOKEN": repo_config["token"],
    "GH_REPO": repo_config["url"],
    "GH_BRANCH": repo_config["branch"],
    "IDENTITY_POOL_ID": auth_config["IdentityPoolId"],
    "USER_POOL_ID": auth_config["UserPoolId"],
    "USER_POOL_CLIENT": auth_config["UserPoolClientWeb"],
    "API_URL": api_url
  }

  deploy(
    INFRA_DIR,
    environment,
    template="app.yml"
  )

  app_outputs = get_stack_outputs(f"{app_name}-amplify-app")

  return app_outputs

def deploy_api(app_name, auth_config, app_url = "still not existent!"):
    environment = {
        "APP_NAME": app_name,
        "COGNITO_USER_POOL_CLIENT_ID": auth_config["UserPoolClientWeb"],
        "COGNITO_USER_POOL": auth_config["UserPoolId"],
        "APP_URL": app_url
    }

    deploy(
        API_DIR,
        environment
    )

    api_outputs = get_stack_outputs(f"{app_name}-api")

    return api_outputs


def deploy_auth(app_name):
  environment = {
    "APP_NAME": app_name
  }

  deploy(
    INFRA_DIR,
    environment,
    template="auth.yml"
  )

  auth_outputs = get_stack_outputs(f"{app_name}-authentication")

  return auth_outputs

def deploy_custom_message(app_name, app_url, api_url, user_pool_id):
  environment = {
    "APP_NAME": app_name,
    "APP_BASE_URL": app_url,
    "API_BASE_URL": api_url,
    "USER_POOL_ID": user_pool_id
  }

  deploy(
    f"{LAMBDA_DIR}/custom_message",
    environment
  )

def deploy_storage(app_name, auth_role_arn):
  environment = {
    "APP_NAME": app_name,
    "AUTH_ROLE_ARN": auth_role_arn
  }

  deploy(
    INFRA_DIR,
    environment,
    template="storage.yml"
  )


def deploy(path, env, template="serverless.yml"):

    for name, value in env.items():
        os.environ[name] = value

    call_args = [
        "serverless",
        "deploy",
        "-c",
        template,
        "--aws-profile",
        os.environ['AWS_PROFILE'],
        "--region",
        os.environ['REGION']
    ]

    try:
        subprocess.check_call(
            call_args,
            cwd=path
        )
    except subprocess.CalledProcessError as e:
        print(
            f"Error deploying service. Reason: '{e}'"
        )
        exit(1)
