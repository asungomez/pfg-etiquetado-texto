import os
from pathlib import Path
from git import Repo
import logging

REPO_DIR = f"{Path.cwd()}/repository"
os.environ["REPO_DIR"] = REPO_DIR

def clone_repository(token, repo_config):
  repo_remote_url = f"https://{token}:x-oauth-basic@{repo_config['url'].replace('https://', '')}"
  print("Cloning GH repository", flush=True)
  Repo.clone_from(repo_remote_url, REPO_DIR, depth=1, branch=repo_config["branch"])
  print("Successfully cloned GH repository", flush=True)