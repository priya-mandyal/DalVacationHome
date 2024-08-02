import boto3
import json

def lambda_handler(event, context):
    # Initialize the DynamoDB client
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
    
   
    table_name = 'bookings'
    table = dynamodb.Table(table_name)
    
    
    try:
        body = json.loads(event.get('body', '{}'))  
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'body': json.dumps('Invalid JSON in request body')
        }
    
    # Retrieve the booking_reference from the JSON body
    booking_reference = body.get('booking_reference')
    
    if not booking_reference:
        return {
            'statusCode': 400,
            'body': json.dumps('You must provide a booking_reference.')
        }
    
    try:
        response = table.get_item(
            Key={
                'booking_reference': booking_reference
            }
        )
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f"Error fetching booking: {str(e)}")
        }
    
   
    if 'Item' in response:
        return {
            'statusCode': 200,
            'body': json.dumps(response['Item'])
        }
    else:
        return {
            'statusCode': 404,
            'body': json.dumps('No booking found for the specified booking_reference.')
        }
