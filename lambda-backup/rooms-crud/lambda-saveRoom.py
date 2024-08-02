import json
import boto3

dynamodb = boto3.client('dynamodb')

def lambda_handler(event, context):
    try:
        body = json.loads(event['body'])
        roomNumber = int(body['roomNumber'])
        discount = int(body['discount'])
        imageUrl = body['imageUrl']
        price = int(body['price'])
        ac_boolean = body['ac_boolean'] == 'true'
        parking_boolean = body['parking_boolean'] == 'true'
        mini_fridge_boolean = body['mini_fridge_boolean'] == 'true'
        no_smoking_boolean = body['no_smoking_boolean'] == 'true'
        pet_friendly_boolean = body['pet_friendly_boolean'] == 'true'
        roomType = body['type']
        discountCode = body['discountCode']

        item = {
            'roomNumber': {'N': str(roomNumber)},
            'price': {'N': str(price)},
            'roomType': {'S': roomType},
            'discountCode': {'S': discountCode},
            'discount': {'N': str(discount)},
            'imageUrl': {'S': imageUrl},
            'ac_boolean': {'BOOL': ac_boolean},
            'parking_boolean': {'BOOL': parking_boolean},
            'mini_fridge_boolean': {'BOOL': mini_fridge_boolean},
            'no_smoking_boolean': {'BOOL': no_smoking_boolean},
            'pet_friendly_boolean': {'BOOL': pet_friendly_boolean}
        }

        response = dynamodb.put_item(
            TableName='Rooms',
            Item=item
        )

        return {
            'statusCode': 200,
            'body': json.dumps('Room details saved successfully')
        }

    except KeyError as e:
        error_message = f'Missing required field: {str(e)}'
        return {
            'statusCode': 400,
            'body': json.dumps(error_message)
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(str(e))
        }
