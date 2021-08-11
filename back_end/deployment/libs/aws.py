import boto3
import os


def create_deployment_bucket(app_name):
    session = boto3.Session(
        profile_name=os.environ['AWS_PROFILE'], region_name=os.environ['REGION'])
    s3_client = session.client('s3')

    print("Creating S3 bucket")
    try:
        s3_client.create_bucket(
            Bucket=f"{app_name}-deployment-bucket",
            CreateBucketConfiguration={
                'LocationConstraint': os.environ['REGION']
            }
        )
    except s3_client.exceptions.BucketAlreadyExists as e:
        raise e
    except s3_client.exceptions.BucketAlreadyOwnedByYou:
        print("Skipping bucket creation")
