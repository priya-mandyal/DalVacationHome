import json
import base64
import boto3

cognito = boto3.client('cognito-idp')

def lambda_handler(event, context):
    body = json.loads(event['body'])
    username = body['username']
    password = body['password']

    client_id = '6i6vijpb25iv6k95jhmpkhgmb7'

    try:
        # Authenticate the user
        response = cognito.initiate_auth(
            ClientId=client_id,
            AuthFlow='USER_PASSWORD_AUTH',
            AuthParameters={
                'USERNAME': username,
                'PASSWORD': password,
            }
        )
        
        id_token = response['AuthenticationResult']['IdToken']
        access_token = response['AuthenticationResult']['AccessToken']
        
        # Parse JWT to extract the ID Token claims and the custom attribute
        id_token_payload = json.loads(base64.b64decode(id_token.split('.')[1] + '==').decode('utf-8'))
        is_agent = id_token_payload.get('custom:isAgent', 'false')
        
        return {
            'statusCode': 200,
          
            'body': json.dumps({
                'message': 'Login successful',
                'access_token': access_token,
                'id_token': id_token,
                'username': username,
                'isAgent': is_agent
            })
        }
    except cognito.exceptions.NotAuthorizedException as e:
        return {
            'statusCode': 400,
            
            'body': json.dumps({'message': 'Incorrect username or password'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'message': str(e)})
        }
