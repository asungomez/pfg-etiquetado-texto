import os
from pathlib import Path
from git import Repo

REPO_DIR = f"{Path.cwd()}/repository"
os.environ["REPO_DIR"] = REPO_DIR

def clone_repository(repository, token, branch = 'master'):
  repo_remote_url = f"https://{token}:x-oauth-basic@{repository.replace('https://', '')}"
  print("Cloning GH repository")
  Repo.clone_from(repo_remote_url, REPO_DIR, depth=1, branch=branch)
  print("Successfully cloned GH repository")