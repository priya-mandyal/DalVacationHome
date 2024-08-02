import datetime
from google.cloud import bigquery
import functions_framework

@functions_framework.http
def store_data(request):
    # Initialize BigQuery client
    client = bigquery.Client()

    # Define table ID
    table_id = "csci-5411.users_bigquery_t.users_login_table_t"

    # CORS headers for preflight and main requests
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Max-Age': '3600',  # 1 hour
        'Access-Control-Allow-Credentials': 'true'
    }

    # Handle OPTIONS request for CORS preflight
    if request.method == 'OPTIONS':
        # Send response to indicate CORS settings
        return ('', 204, headers)

    # Parse request JSON for actual data handling
    request_json = request.get_json(silent=True)
    if request_json and all(k in request_json for k in ('username', 'email', 'isAgent')):
        username = request_json['username']
        email = request_json['email']
        is_agent = request_json['isAgent']

        # Get the current date, day of the week, and timestamp
        now = datetime.datetime.now()
        day_of_week = now.strftime('%A')
        timestamp = now.isoformat()

        # Prepare the row to insert
        rows_to_insert = [
            {"username": username, "email": email, "isAgent": is_agent, "dayOfWeek": day_of_week, "timestamp": timestamp}
        ]

        # Insert data into BigQuery
        errors = client.insert_rows_json(table_id, rows_to_insert)  # Make an API request.
        if not errors:
            return ('Login data successfully stored in BigQuery', 200, headers)
        else:
            return ('Error: {}'.format(errors), 500, headers)
    else:
        return ('Invalid data', 400, headers)
