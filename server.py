from flask import Flask
from flask import request
from flask import jsonify
from flask import render_template
import random
import requests
import json
import mongoengine as me
import twilio.twiml
from uber import uber_get_ride
from freebase import person_search
from zen import zen
from wolfram import wolfram_math
#import calendar

app = Flask(__name__, static_folder='static', static_url_path='')

me.connect('jarvis')
callers = {}

affirmative = [
    "Roger that.",
    "Gotcha. Gonna get on that."
]

negative = [
    "I couldn't quite catch that.",
    "Say what?",
    "Could you repeat that?"
]

callbacks = {
    'uber_get_ride': uber_get_ride,
    'shots_fired': lambda x, y : 'Pew pew',
    'person_search': person_search,
    'zen': zen,
    'math': wolfram_math
}

@app.route("/")
def landing_page():
    print 'On landing page'
    return render_template('index.html')

@app.route("/api/uber/eta")
def uber_eta():
    result = requests.get(('https://api.uber.com/v1/estimates/time?' +
            'start_latitude=37.7759792&start_longitude=-122.41823'),
            headers = {
              'Authorization': 'Token YLv-x792Tyq5YVjsyqVbqWqaqHo5OM5FhH9PU06V'
            }
            )
    print result.text
    return jsonify(result.json())

@app.route('/callback/wit', methods=['POST'])
def route_request():
    data = request.json
    print data
    intent = data.get('outcome').get('intent')
    entities = data.get('outcome').get('entities')
    print data
    print intent
    if intent in callbacks:
        print 'Intent known'
        return jsonify(response=callbacks[intent](entities, 'voice'))
    return ''

@app.route('/callback/twilio/onCall')
def on_call():
    resp = twilio.twiml.Response()
    resp.say("Hello, this is your Robot.")
    resp.record(
            action='/callback/twilio/onRecord',
            method='GET',
            maxLength=10,
            timeout=1
    )
    return str(resp)


@app.route('/callback/twilio/onRecord')
def on_record():
    if request.values.get('Digits', None) == 'timeout':
        return ''

    if request.values.get('Digits', None) == 'hangup':
        return ''

    url = request.values.get('RecordingUrl', None)
    resp = twilio.twiml.Response()

    if url == None:
        resp.hangup()
        return str(resp)

    waveform_request = requests.get(url)
    wit_response = requests.post(
            url='https://api.wit.ai/speech?v=20140920',
            data=waveform_request.content,
            headers={
                'Authorization': 'Bearer PRHP2YAIXJJVQZRJNV2CSSKUM2NI5SWJ',
                'Content-Type': 'audio/wav'
            }
    )

    wit_dict = json.loads(wit_response.text)
    print wit_dict

    intent = wit_dict.get('outcomes')[0].get('intent')
    entities = wit_dict.get('outcomes')[0].get('entities')

    resp.say(random.choice(affirmative))
    resp.pause()

    if intent in callbacks:
        resp.say(callbacks[intent](entities, 'voice'))

    resp.record(
            action='/callback/twilio/onRecord',
            method='GET',
            maxLength=10,
            timeout=1
    )
    return str(resp)


@app.route('/callback/twilio/onText')
def on_text():
    wit_response = requests.get(
            url='https://api.wit.ai/message?v=20140920&q=' + request.values.get('Body', None),
            headers={
                'Authorization': 'Bearer PRHP2YAIXJJVQZRJNV2CSSKUM2NI5SWJ'
            }
    )

    wit_dict = json.loads(wit_response.text)
    print wit_dict

    intent = wit_dict.get('outcomes')[0].get('intent')
    entities = wit_dict.get('outcomes')[0].get('entities')

    resp = twilio.twiml.Response()
    if intent in callbacks:
        resp.message(callbacks[intent](entities, 'text'))
    else:
        resp.message(random.choice(negative))

    return str(resp)


if __name__ == "__main__":
    app.run(debug=True)
