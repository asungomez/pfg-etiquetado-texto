import boto3
import os

def create_deployment_bucket(app_name):
  session = boto3.Session(profile_name=os.environ['AWS_PROFILE'], region_name=os.environ['REGION'])
  s3_client = session.client('s3')

  s3_client.create_bucket(
    Bucket=f"{app_name}-deployment-bucket"
  )