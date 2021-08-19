import os
import subprocess

INFRA_DIR = f"{os.environ['REPO_DIR']}/back_end/infrastructure"

def deploy_amplify_app(app_name, github_token, github_repository):
  environment = {
    "APP_NAME": app_name,
    "GH_TOKEN": github_token,
    "GH_REPO": github_repository
  }

  deploy(
    f"{INFRA_DIR}/app.yml",
    environment
  )

def deploy_auth(app_name):
  environment = {
    "APP_NAME": app_name
  }

  deploy(
    f"{INFRA_DIR}/auth.yml",
    environment
  )


def deploy(template, env):

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
            cwd=INFRA_DIR
        )
    except subprocess.CalledProcessError as e:
        print(
            f"Error deploying service. Reason: '{e}'"
        )
        exit(1)
