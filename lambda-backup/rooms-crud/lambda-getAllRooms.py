import json
import boto3
from boto3.dynamodb.types import Decimal

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Rooms')

def lambda_handler(event, context):
    try:
        response = table.scan()
        items = response.get('Items', [])
        
        responseBody = []
        for item in items:
            responseItem = {
                'roomNumber': int(item['roomNumber']),
                'price': float(item['price']),
                'image': item.get('imageUrl', ''),
                'type': item.get('roomType', ''),
                'discountCode': item.get('discountCode', ''),
                'discount': int(item.get('discount', 0)),
                'imageUrl': item.get('imageUrl', ''),
                'ac_boolean': bool(item.get('ac_boolean', False)),
                'parking_boolean': bool(item.get('parking_boolean', False)),
                'mini_fridge_boolean': bool(item.get('mini_fridge_boolean', False)),
                'no_smoking_boolean': bool(item.get('no_smoking_boolean', False)),
                'pet_friendly_boolean': bool(item.get('pet_friendly_boolean', False))
            }
            responseBody.append(responseItem)
        
        return {
            'statusCode': 200,
            'body': json.dumps(responseBody)
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
