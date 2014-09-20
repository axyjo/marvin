from flask import Flask
import mongoengine as me

app = Flask(__name__)

me.connect('jarvis')

@app.route("/")
def landing_page():
    return "Landing page"

if __name__ == "__main__":
    app.run()
