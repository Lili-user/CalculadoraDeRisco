from flask_migrate import Migrate
from flask import Flask, send_from_directory, jsonify, send_file
from flask_sqlalchemy import SQLAlchemy 
from flask_cors import CORS
import os
from io import BytesIO


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///userdata.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)
CORS(app)

# Importar modelos após a inicialização do app e db
from models import Userdata

app.app_context().push()

frontend_folder = os.path.join(os.getcwd(), "..", "frontend")
dist_folder = os.path.join(frontend_folder, "dist")

@app.route("/", defaults={"filename": ""})
@app.route("/<path:filename>")
def index(filename):
    if not filename:
        filename = "index.html"
    return send_from_directory(dist_folder, filename)

import routes

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)
