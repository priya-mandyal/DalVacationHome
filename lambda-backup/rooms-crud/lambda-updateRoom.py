import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Rooms')

def lambda_handler(event, context):
    print(f"Received event: {json.dumps(event)}")
    
    try:
        room_number = int(event['queryStringParameters']['roomNumber'])
        
        body = json.loads(event['body'])
        
        price = Decimal(body.get('price', 0))
        discount = int(body.get('discount', 0))
        imageUrl = body.get('imageUrl', '')
        ac_boolean = body.get('ac_boolean', 'false') == 'true'
        parking_boolean = body.get('parking_boolean', 'false') == 'true'
        mini_fridge_boolean = body.get('mini_fridge_boolean', 'false') == 'true'
        no_smoking_boolean = body.get('no_smoking_boolean', 'false') == 'true'
        pet_friendly_boolean = body.get('pet_friendly_boolean', 'false') == 'true'
        roomType = body.get('roomType', '')
        discountCode = body.get('discountCode', '')
        
        response = table.update_item(
            Key={
                'roomNumber': room_number
            },
            UpdateExpression="SET price = :price, discount = :discount, discountCode = :discountCode, " +
                             "parking_boolean = :parking, ac_boolean = :ac, no_smoking_boolean = :no_smoking, " +
                             "pet_friendly_boolean = :pet_friendly, mini_fridge_boolean = :mini_fridge, " +
                             "imageUrl = :imageUrl, roomType = :roomType",
            ExpressionAttributeValues={
                ':price': price,
                ':discount': discount,
                ':discountCode': discountCode,
                ':parking': parking_boolean,
                ':ac': ac_boolean,
                ':no_smoking': no_smoking_boolean,
                ':pet_friendly': pet_friendly_boolean,
                ':mini_fridge': mini_fridge_boolean,
                ':imageUrl': imageUrl,
                ':roomType': roomType
            },
            ReturnValues="NONE"
        )
        
        print("UpdateItem succeeded")
        
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Room updated successfully'})
        }
    except ValueError as ve:
        print(f"Invalid room number value: {ve}")
        return {
            'statusCode': 400,
            'body': json.dumps({'message': 'Invalid room number value'})
        }
    except KeyError as ke:
        print(f"Missing required parameter: {ke}")
        return {
            'statusCode': 400,
            'body': json.dumps({'message': 'Missing required parameter'})
        }
    except Exception as e:
        print(f"Error updating room details: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Failed to update room details'})
        }
