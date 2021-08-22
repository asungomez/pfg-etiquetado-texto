import os
import subprocess
from libs.aws import get_stack_outputs

INFRA_DIR = f"{os.environ['REPO_DIR']}/back_end/infrastructure"
LAMBDA_DIR = f"{os.environ['REPO_DIR']}/back_end/lambda"
API_DIR = f"{os.environ['REPO_DIR']}/back_end/api"

def deploy_amplify_app(
  app_name, 
  github_token, 
  github_repository, 
  github_branch
  ):

  environment = {
    "APP_NAME": app_name,
    "GH_TOKEN": github_token,
    "GH_REPO": github_repository,
    "GH_BRANCH": github_branch
  }

  deploy(
    INFRA_DIR,
    environment,
    template="app.yml"
  )

  app_outputs = get_stack_outputs(f"{app_name}-amplify-app")

  return app_outputs

def deploy_api(app_name, user_pool_id, user_pool_client):
    environment = {
        "APP_NAME": app_name,
        "COGNITO_USER_POOL_CLIENT_ID": user_pool_client,
        "COGNITO_USER_POOL": user_pool_id
    }

    deploy(
        API_DIR,
        environment
    )


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

def deploy_custom_message(app_name, app_url):
  environment = {
    "APP_NAME": app_name,
    "APP_BASE_URL": app_url
  }

  deploy(
    f"{LAMBDA_DIR}/custom_message",
    environment
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
