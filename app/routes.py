from app import app
import urllib2
from flask import send_from_directory


@app.route('/')
def index():
    return send_static("index.html")


@app.route('/api')
def api():
    return "{ data: "+urllib2.urlopen("http://iparking-ws.pwr.edu.pl/dajWolneMiejsca").read()[5:-1]+"}"


@app.route('/<path:path>')
def send_static(path):
    return send_from_directory('static', path)




