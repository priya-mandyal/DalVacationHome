import json
import boto3
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Rooms')

def lambda_handler(event, context):
    room_number = event['queryStringParameters']['roomNumber']
    
    try:
        response = table.delete_item(
            Key={
                'roomNumber': int(room_number)
            }
        )
        print(f"DeleteItem succeeded: {response}")
        
        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": f"Room {room_number} deleted successfully"
            })
        }
    
    except ClientError as e:
        print(f"Error deleting room: {e}")
        
        return {
            "statusCode": 500,
            "body": json.dumps({
                "message": f"Error deleting room: {e}"
            })
        }
