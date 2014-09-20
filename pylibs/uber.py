import requests

def uber_get_ride(entities, client):
    result = requests.get(('https://api.uber.com/v1/estimates/time?' +
            'start_latitude=37.7759792&start_longitude=-122.41823'),
            headers = {
              'Authorization': 'Token YLv-x792Tyq5YVjsyqVbqWqaqHo5OM5FhH9PU06V'
            }
            )
    if client == 'web':
        return result.text
