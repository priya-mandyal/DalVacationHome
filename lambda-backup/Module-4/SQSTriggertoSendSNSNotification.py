import json
import boto3

sns = boto3.client('sns')

def lambda_handler(event, context):
    for record in event['Records']:
        try:
            message = json.loads(record['body'])
            username = message['username']
            email = message['email']
            action = message['action']
            topic_arn = message['topic_arn']
            
            print(f"Received message: {message}")

            send_message(topic_arn, username, email, action)

        except Exception as e:
            print(f"Error processing record: {record}")
            print(e)
            continue

    return {
        'statusCode': 200,
        'body': json.dumps({'message': 'Messages sent successfully'})
    }

def send_message(topic_arn, username, email, action):
    
    if(action=="register"):
        subject = "Registration Confirmation"  # Since action is hardcoded to Registration
        body = f"Hello {username},\n\nYou have successfully registered to our system." 
    elif action == "bookingsuccess":
        subject = "Booking Successful"
        body = f"Hello {username} your booking was successful."
    elif action == "bookingfailure":
        subject = "Booking Successful"
        body = f"Hello {username} your booking was successful."
    else:
        subject = "Login Confirmation"  # Since action is hardcoded to Registration
        body = f"Hello {username},\n\nYou have successfully logged in to our system."
    

    response = sns.publish(
        TopicArn=topic_arn,
        Subject=subject,
        Message=body
    )
    print(f"Message sent to {email} via topic {topic_arn}, Response: {response}")

