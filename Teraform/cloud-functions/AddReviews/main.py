import json
import uuid
from datetime import datetime
from flask import jsonify
from google.cloud import firestore, language_v1
from functions_framework import http

# Initialize Firestore and Natural Language clients
db = firestore.Client()
client = language_v1.LanguageServiceClient()

@http
def add_review(request):
    # Set CORS headers for the preflight request
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return '', 204, headers

    # Set CORS headers for the main request
    headers = {
        'Access-Control-Allow-Origin': '*'
    }

    if request.method != 'POST':
        return 'Method not allowed', 405, headers

    try:
        # Parse the incoming JSON data
        data = request.get_json()
        review_text = data.get('reviewText')
        room_number = str(data.get('roomNumber'))  # Convert room_number to string if needed
        start_date = data.get('startDate')
        end_date = data.get('endDate')
        username = data.get('username')

        # Logging input data
        print(f"Received data: {json.dumps(data)}")  # Using json.dumps for better logging

        if not review_text:
            return jsonify({"error": "Review text cannot be empty"}), 400, headers

        # Generate a unique ID for each review based on timestamp and UUID, ensuring all parts are strings
        review_id = datetime.now().isoformat() + '-' + str(uuid.uuid4())

        # Perform sentiment analysis
        document = language_v1.Document(content=review_text, type_=language_v1.Document.Type.PLAIN_TEXT)
        sentiment = client.analyze_sentiment(request={'document': document}).document_sentiment

        # Log sentiment analysis results
        print(f"Sentiment score: {sentiment.score}, magnitude: {sentiment.magnitude}")

        # Save the review to Firestore under rooms collection
        room_ref = db.collection('rooms').document(room_number)
        review_ref = room_ref.collection('reviews').document(review_id)
        review_ref.set({
            'reviewText': review_text,
            'startDate': start_date,
            'endDate': end_date,
            'username': username,
            'sentimentScore': sentiment.score,
            'sentimentMagnitude': sentiment.magnitude,
            'timestamp': firestore.SERVER_TIMESTAMP  # Adding a server timestamp for the review entry
        })

        # Log successful operation
        print("Review added successfully to Firestore.")

        return jsonify({"message": "Review added successfully!"}), 200, headers

    except Exception as e:
        # Log the exception
        print(f"Error occurred: {str(e)}")
        return jsonify({"error": str(e)}), 500, headers
