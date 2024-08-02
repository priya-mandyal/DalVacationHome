import json
import boto3

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('UserDetails')  # Replace with your DynamoDB table name

def lambda_handler(event, context):
    try:
        # Scan the table to get items where custom:isAgent is "true"
        response = table.scan(
            FilterExpression="#isAgent = :isAgent",
            ExpressionAttributeValues={
                ":isAgent": "true"  # =
            ExpressionAttributeNames={
                "#isAgent": "custom:isAgent"  #
            },
            ProjectionExpression="username, #isAgent, email",  # Use the expression attribute name in the projection as well
        )
        
        # Extract items from the response
        agents = response.get('Items', [])

        # If agents are found, return them
        if agents:
            return {
                'statusCode': 200,
                'body': json.dumps({'message': 'Agents found', 'data': agents})
            }
        else:
            return {
                'statusCode': 404,
                'body': json.dumps({'message': 'No agents found'})
            }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'message': str(e)})
        }
