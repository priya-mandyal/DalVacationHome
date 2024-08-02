import json
import boto3
import uuid

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('BookingDetails')

def lambda_handler(event, context):
    try:
        if 'body' in event and isinstance(event['body'], str):
            body = json.loads(event['body'])
        else:
            body = event
        
        startDate = body.get('startDate', '')
        endDate = body.get('endDate', '')
        username = body.get('username', '')
        emailId = body.get('emailId', '')
        comment = body.get('comment', '')
        roomNumber = int(body.get('roomNumber', 0))
        
        bookingCode = str(uuid.uuid4()) # creating random generated code
        
        response = table.put_item(
            Item={
                'booking_reference': bookingCode,
                'roomNumber': roomNumber,
                'startDate': startDate,
                'endDate': endDate,
                'username': username,
                'emailId': emailId,
                'comment': comment
            }
        )
        
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Booking details saved successfully'})
        }
    except Exception as e:
        print(f"Error saving booking details: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Failed to save booking details'})
        }
