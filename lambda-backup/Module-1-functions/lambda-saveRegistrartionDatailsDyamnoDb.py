import json
import boto3

cognito = boto3.client('cognito-idp')
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('UserDetails')

def lambda_handler(event, context):
    try:
        # Parse the JSON body from the event
        body = json.loads(event['body'])
        username = body['username']
        user_pool_id = 'us-east-1_jNNbqjBtY'  # Update with your user pool ID

        # Fetch user details from Cognito
        response = cognito.admin_get_user(
            UserPoolId=user_pool_id,
            Username=username
        )
        
        # Parse user attributes
        user_attributes = {attr['Name']: attr['Value'] for attr in response['UserAttributes']}
        
        # Store user details in DynamoDB
        table.put_item(
            Item={
                'username': username,
                **user_attributes
            }
        )
        
        return {
            'statusCode': 200,
            # 'headers': {
            #     'Access-Control-Allow-Origin': '*',  # Ensure CORS settings if necessary
            #     'Access-Control-Allow-Methods': 'POST, OPTIONS',
            #     'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            # },
            'body': json.dumps('User details successfully stored in DynamoDB')
        }
    except Exception as e:
        return {
            'statusCode': 500,
            # 'headers': {
            #     'Access-Control-Allow-Origin': '*',  # Ensure CORS settings if necessary
            #     'Access-Control-Allow-Methods': 'POST, OPTIONS',
            #     'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            # },
            'body': json.dumps(str(e))
        }
