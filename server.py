from flask import Flask
from flask import jsonify
from flask import render_template
import requests
import json
import mongoengine as me

app = Flask(__name__, static_folder='static', static_url_path='')

me.connect('jarvis')

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

if __name__ == "__main__":
    app.run(debug=True)
