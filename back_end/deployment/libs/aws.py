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


def get_stack_outputs(stack_name):
    outputs = {}
    session = boto3.Session(
        profile_name=os.environ['AWS_PROFILE'], region_name=os.environ['REGION'])

    cf_client = session.client("cloudformation")
    stacks_info = cf_client.describe_stacks(
        StackName=stack_name
    )

    if len(stacks_info["Stacks"]) > 0:
        stack_info = stacks_info["Stacks"][0]

        outputs = {output["OutputKey"]: output["OutputValue"]
                   for output in stack_info["Outputs"]}
    
    return outputs

def app_url(app_id, branch):
    return f"https://{branch}.{app_id}.amplifyapp.com"

def api_endpoint(api_id, aws_region):
    return f"https://{api_id}.execute-api.{aws_region}.amazonaws.com/api"