import argparse
from libs.repository import clone_repository
import os

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
        "--githu-branch",
        help="Repository's branch",
        default="master"
    )

    arguments = parser.parse_args()

    return arguments


def run(args):
    os.environ['AWS_PROFILE'] = args.aws_profile
    os.environ['REGION'] = args.aws_region
    clone_repository(args.github_repo, args.github_token, args.github_branch)


def main():
    args = parse_args()
    run(args)


if __name__ == "__main__":
    main()
