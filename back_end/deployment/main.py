import argparse

from libs.repository import clone_repository
import os
from libs.deploy import deploy_amplify_app, deploy_auth, deploy_custom_message, deploy_api
from libs.aws import aws_client_config, create_deployment_bucket, app_url
import logging
import json
import yaml

logging.basicConfig()
logger = logging.getLogger("deployment")


def parse_args():
    parser = argparse.ArgumentParser()

    parser.add_argument(
        "--github-token",
        help="Github token",
        required=True
    )

    arguments = parser.parse_args()

    return arguments

def read_config():
    return yaml.load(open('config.yml'), Loader=yaml.FullLoader)

def set_credentials(credentials):
    os.environ["AWS_PROFILE"] = credentials["aws_profile"]
    os.environ["REGION"] = credentials["aws_region"]

def deploy(config):
    auth_outputs = deploy_auth(config["app"]["name"])
    app_outputs = deploy_amplify_app(
        config["app"]["name"],
        config["repository"],
        auth_outputs
    )
    deploy_custom_message(
        config["app"]["name"],
        app_url(app_outputs["AppId"], config["repository"]["branch"])
    )

    # deploy_api(
    #     config["app"]["name"],
    #     auth_outputs["UserPoolId"],
    #     auth_outputs["UserPoolClientWeb"]
    # )
    #
    # print(json.dumps(
    #     aws_client_config(credentials.aws_region, auth_outputs),
    #     sort_keys=True,
    #     indent=4,
    #     separators=(',', ': ')
    # ))

def main():
    args = parse_args()
    config = read_config()
    clone_repository(args.github_token, config["repository"])
    set_credentials(config["credentials"])
    create_deployment_bucket(config["app"]["name"])
    config["repository"]["token"] = args.github_token
    deploy(config)


if __name__ == "__main__":
    main()
