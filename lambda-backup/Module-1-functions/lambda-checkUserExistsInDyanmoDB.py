import json
import boto3

# Initialize DynamoDB resource
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('UserDetails')

def lambda_handler(event, context):
    try:
        # Parse the JSON body from the event
        body = json.loads(event['body'])
        username = body['username']

        # Retrieve user details from DynamoDB
        response = table.get_item(
            Key={
                'username': username
            }
        )
        
        # Check if user details are found
        if 'Item' in response:
            return {
                'statusCode': 200,
                'body': json.dumps({'message': 'User details found', 'data': response['Item']})
            }
        else:
            return {
                'statusCode': 404,
                'body': json.dumps({'message': 'No user details found for the provided username'})
            }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'message': str(e)})
        }
