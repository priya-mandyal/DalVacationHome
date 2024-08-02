import boto3
import json
from boto3.dynamodb.conditions import Attr

def lambda_handler(event, context):
    # Initialize the DynamoDB client
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
    
    # Specify your DynamoDB table name
    table_name = 'bookings'
    table = dynamodb.Table(table_name)

    try:
        body = json.loads(event.get('body', '{}'))  # Default to empty JSON if body is None
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'body': json.dumps('Invalid JSON in request body')
        }
    
    
    username = body.get('username')
    
    if not username:
        return {
            'statusCode': 400,
            'body': json.dumps('You must provide a username.')
        }
    
    
    response = table.scan(
        FilterExpression=Attr('username').eq(username)
    )
    
    
    if 'Items' in response:
        bookings = response['Items']
        return {
            'statusCode': 200,
            'body': json.dumps(bookings)
        }
    else:
        return {
            'statusCode': 404,
            'body': json.dumps('No bookings found for the specified username.')
        }
