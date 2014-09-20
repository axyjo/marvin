import requests
import json

def uber_get_ride(entities, client):
    def format_voice(data):
        return (data.get('localized_display_name') + ' is available in ' +
                str((data.get('estimate') + 60) / 60) + ' minutes')
    result = requests.get(('https://api.uber.com/v1/estimates/time?' +
            'start_latitude=37.7759792&start_longitude=-122.41823'),
            headers = {
              'Authorization': 'Token YLv-x792Tyq5YVjsyqVbqWqaqHo5OM5FhH9PU06V'
            }
            )

    print result.json()
    if client == 'web':
        return result.text
    elif client == 'voice':
        print json.loads(result.text)
        return ', '.join(map(format_voice,
                json.loads(result.text).get('times')))
