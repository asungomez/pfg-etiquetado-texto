def local_env_file(aws_region, auth_config, api_url):
    return f"REACT_APP_DEBUG=true\n" \
           f"REACT_APP_IDENTITY_POOL_ID={auth_config['IdentityPoolId']}\n" \
           f"REACT_APP_AWS_REGION={aws_region}\n" \
           f"REACT_APP_USER_POOL_ID={auth_config['UserPoolId']}\n" \
           f"REACT_APP_USER_POOL_CLIENT={auth_config['UserPoolClientWeb']}\n" \
           f"REACT_APP_API_URL={api_url}"