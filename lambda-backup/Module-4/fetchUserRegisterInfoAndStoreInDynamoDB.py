import json
import boto3

sns = boto3.client('sns')
sqs = boto3.client('sqs')

def lambda_handler(event, context):
    print("Event Received:", event)
    username = event.get('username')
    email = event.get('email')
    action = event.get('action')

    if not username or not email:
        return {
            'statusCode': 400,
            'body': json.dumps({'message': 'Username and email are required'})
        }

    try:
        topic_name = f"user-{username}-actions"
        if(action == "register"):
            # Create SNS topic dynamically
            topic_arn = create_sns_topic(topic_name)
            # Subscribe email to this SNS topic
            subscribe_email_to_sns_topic(topic_arn, email)

        else:
            topic_arn = get_topic_arn(topic_name)    
        
        
        # Send user data to SQS queue
        send_to_sqs_queue(username, email, action, topic_arn)

        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'User data processed successfully',
                'username': username,
                'email': email,
                'topicArn': topic_arn
            })
        }
    except Exception as e:
        print(f"Error processing user data: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'message': str(e)})
        }

def create_sns_topic(topic_name):
    response = sns.create_topic(Name=topic_name)
    print(f"Created SNS topic: {topic_name}, ARN: {response['TopicArn']}")
    return response['TopicArn']
    
def subscribe_email_to_sns_topic(topic_arn, email):
    response = sns.subscribe(
        TopicArn=topic_arn,
        Protocol='email',
        Endpoint=email
    )
    print(f"Subscribed {email} to {topic_arn}, Subscription ARN: {response['SubscriptionArn']}")
    
def get_topic_arn(topic_name):
    response = sns.list_topics()
    for topic in response['Topics']:
        topic_arn = topic['TopicArn']
        if topic_arn.endswith(f":{topic_name}"):
            return topic_arn
    return None
    

def send_to_sqs_queue(username, email, action, topic_arn):
    queue_url = "https://sqs.us-east-1.amazonaws.com/603053634424/RegistrationQueu"  # Ensure this is the correct SQS URL
    message_body = json.dumps({
        'username': username,
        'email': email,
        'action': action,
        'topic_arn': topic_arn
    })
    second = 40 if action =="register" else 0
    response = sqs.send_message(
        QueueUrl=queue_url,
        MessageBody=message_body,
        DelaySeconds=second
    )
    print(f"Sent message to SQS queue: {queue_url}, Message ID: {response['MessageId']}")
