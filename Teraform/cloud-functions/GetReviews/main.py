import json
from flask import Flask, request, jsonify
from google.cloud import firestore
import logging

app = Flask(__name__)
db = firestore.Client()

# Setup basic logging
logging.basicConfig(level=logging.DEBUG)

@app.route('/get_reviews', methods=['GET', 'OPTIONS'])
def get_reviews(request):  # Add the request parameter here
    if request.method == 'OPTIONS':
        return handle_cors_preflight()

    if request.method == 'GET':
        return handle_get_reviews(request)  # Pass request to the function

def handle_cors_preflight():
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '3600'
    }
    return '', 204, headers

def handle_get_reviews(request):  # Accept request parameter here
    headers = {'Access-Control-Allow-Origin': '*'}
    room_number = request.args.get('roomNumber')

    if not room_number:
        return jsonify({"error": "Room number query parameter is required"}), 400, headers

    try:
        reviews_ref = db.collection('rooms').document(room_number).collection('reviews')
        reviews = reviews_ref.stream()
        reviews_list = [review.to_dict() for review in reviews]
        return jsonify(reviews_list), 200, headers
    except Exception as e:
        logging.exception("Failed to fetch reviews:")
        return jsonify({"error": str(e)}), 500, headers

if __name__ == '__main__':
    app.run(debug=True)
