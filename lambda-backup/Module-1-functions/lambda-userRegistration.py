import json
import boto3

cognito = boto3.client('cognito-idp')

def lambda_handler(event, context):
  
    
    body = json.loads(event['body'])
    username = body['username']
    email = body['email']
    password = body['password']
    is_agent = body['isAgent']

    user_pool_id = 'us-east-1_jNNbqjBtY'
    client_id = '6i6vijpb25iv6k95jhmpkhgmb7'

    try:
        response = cognito.sign_up(
            ClientId=client_id,
            Username=username,
            Password=password,
            UserAttributes=[
                {'Name': 'email', 'Value': email},
                {'Name': 'custom:isAgent', 'Value': 'true' if is_agent else 'false'}
            ]
        )
        return {
            'statusCode': 200,
           
            'body': json.dumps({'message': 'Registration successful', 'username': response['UserSub']})
        }
    except cognito.exceptions.UsernameExistsException as e:
        return {
            'statusCode': 400,
        
            'body': json.dumps({'message': str(e)})
        }
    except Exception as e:
        return {
            'statusCode': 400,
           
            'body': json.dumps({'message': str(e)})
        }