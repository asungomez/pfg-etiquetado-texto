from flask import Flask
from flask_cors import CORS

from routes.accounts import accounts_endpoint

# Flask
app = Flask(__name__)

CORS(app)
app.config["CORS_HEADERS"] = \
    "authorization,x-api-key,x-amz-date,x-amz-security-token,x-pfg-access-token,content-type"
app.config["CORS_ALWAYS_SEND"] = True
app.config["CORS_ORIGINS"] = "*"

app.register_blueprint(accounts_endpoint)