import argparse
from libs.repository import clone_repository
import os
from libs.deploy import deploy_amplify_app


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

    arguments = parser.parse_args()

    return arguments


def run(args):
    os.environ['AWS_PROFILE'] = args.aws_profile
    os.environ['REGION'] = args.aws_region
    clone_repository(args.github_repo, args.github_token, args.github_branch)
    deploy_amplify_app(args.app_name, args.github_token, args.github_repo)


def main():
    args = parse_args()
    run(args)


if __name__ == "__main__":
    main()
