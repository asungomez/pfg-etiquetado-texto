import argparse

from libs.repository import clone_repository
import os
from libs.deploy import deploy_amplify_app, deploy_auth, deploy_custom_message
from libs.aws import aws_client_config, create_deployment_bucket
import logging
import json

logging.basicConfig()
logger = logging.getLogger("deployment")


def parse_args():
    parser = argparse.ArgumentParser()

    parser.add_argument(
        "--aws-profile",
        help="Profile",
        required=True
    )

    parser.add_argument(
        "--aws-region",
        help="AWS region",
        required=True
    )

    parser.add_argument(
        "--app-name",
        help="App name",
        required=True
    )

    parser.add_argument(
        "--github-token",
        help="Github token",
        required=True
    )

    parser.add_argument(
        "--github-repo",
        help="Github token",
        required=True
    )

    parser.add_argument(
        "--github-branch",
        help="Repository's branch",
        default="master"
    )

    parser.add_argument(
        "--domain-name",
        help="Domain name",
        required=True
    )

    arguments = parser.parse_args()

    return arguments


def run(args):
    os.environ['AWS_PROFILE'] = args.aws_profile
    os.environ['REGION'] = args.aws_region
    create_deployment_bucket(args.app_name)
    clone_repository(args.github_repo, args.github_token, args.github_branch)
    deploy_amplify_app(
        args.app_name,
        args.github_token,
        args.github_repo,
        args.github_branch,
        args.domain_name
    )
    deploy_custom_message(args.app_name, args.domain_name)
    deploy_auth(args.app_name)

    print(json.dumps(
        aws_client_config(args.app_name, args.aws_region),
        sort_keys=True,
        indent=4,
        separators=(',', ': ')
    ))


def main():
    args = parse_args()
    run(args)


if __name__ == "__main__":
    main()
