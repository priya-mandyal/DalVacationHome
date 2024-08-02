import json
import boto3

dynamodb = boto3.client('dynamodb')
table_name = "Rooms"

def lambda_handler(event, context):
    try:
        room_number = event['queryStringParameters']['roomNumber']
        
        response = dynamodb.get_item(
            TableName=table_name,
            Key={
                'roomNumber': {'N': room_number}
            }
        )
        
        if 'Item' in response:
            room_details = response['Item']
            room_details_json = {key: list(value.values())[0] for key, value in room_details.items()}
            
            return {
                'statusCode': 200,
                'body': json.dumps(room_details_json)
            }
        else:
            return {
                'statusCode': 404,
                'body': json.dumps({'message': 'Room not found'})
            }
    
    except KeyError as e:
        return {
            'statusCode': 400,
            'body': json.dumps({'message': f'Missing query string parameter: {str(e)}'})
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'message': str(e)})
        }
