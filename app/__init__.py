from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__, static_url_path="/static")
app.config.from_object('config')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
db = SQLAlchemy(app)

from app import routes
