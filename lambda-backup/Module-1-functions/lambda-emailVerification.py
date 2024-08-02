import json
import boto3

cognito = boto3.client('cognito-idp')

def lambda_handler(event, context):
    body = json.loads(event['body'])
    username = body['username']
    code = body['code']

    user_pool_id = 'us-east-1_jNNbqjBtY'

    try:
        response = cognito.confirm_sign_up(
            ClientId='6i6vijpb25iv6k95jhmpkhgmb7',
            Username=username,
            ConfirmationCode=code,
            ForceAliasCreation=False
        )
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Email verification successful.'})
        }
    except cognito.exceptions.CodeMismatchException as e:
        return {
            'statusCode': 400,
            'body': json.dumps({'message': 'Invalid verification code provided, please try again.'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'message': str(e)})
        }
