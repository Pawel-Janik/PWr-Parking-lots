from app import app
try:
    import urllib.request as url
except ImportError:
    import urllib2 as url
from flask import send_from_directory


@app.route('/')
def index():
    return app.send_static_file("index.html")


@app.route('/api')
def api():
    data_json_array = url.urlopen("http://iparking-ws.pwr.edu.pl/dajWolneMiejsca").read()[5:-1]
    data_json_array = data_json_array.replace("liczba_miejsc", "place_count").replace("czas_pomiaru", "timestamp")
    return "{ \"data\": "+data_json_array+"}"


@app.route('/<path:path>')
def send_static(path):
    return send_from_directory('static', path)




