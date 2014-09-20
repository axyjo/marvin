from flask import Flask
from flask import request
from flask import jsonify
from flask import render_template
import requests
import json
import mongoengine as me
import twilio.twiml

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

@app.route('/callback/twilio/onCall')
def on_call():
    resp = twilio.twiml.Response()
    resp.say("Hello, this is your Robot.")
    resp.record(
            action='/callback/twilio/onRecord',
            method='GET',
            playBeep=False,
            maxLength=10,
            timeout=2
    )
    return str(resp)


@app.route('/callback/twilio/onRecord')
def on_record():
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
                'Authorization': 'Bearer 5QX3F2PX2RTQI2DVWRLYV7VXVARO767B',
                'Content-Type': 'audio/wav'
            }
    )
    print wit_response.text

    resp.say("Roger that.")
    resp.record(
            action='/callback/twilio/onRecord',
            method='GET',
            playBeep=False,
            maxLength=10,
            timeout=2
    )
    return str(resp)


if __name__ == "__main__":
    app.run(debug=True)
