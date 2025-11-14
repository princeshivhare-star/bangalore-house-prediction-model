from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import pickle
import json
import numpy as np
import os

app = Flask(__name__)
CORS(app)

# -----------------------------------------------------
# Load model & columns using relative paths (important)
# -----------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))   # /server

MODEL_PATH = os.path.join(BASE_DIR, "..", "model", "banglore_home_prices_model.pickle")
COLUMNS_PATH = os.path.join(BASE_DIR, "..", "model", "columns.json")

print("🚀 Loading model & columns...")

try:
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)
    print("✅ Model loaded successfully.")
except Exception as e:
    print("❌ Error loading model:", e)

try:
    with open(COLUMNS_PATH, "r") as f:
        data_columns = json.load(f)["data_columns"]
    print("✅ Columns loaded successfully.")
except Exception as e:
    print("❌ Error loading columns:", e)

# Extract location names
locations = data_columns[3:] if len(data_columns) > 3 else []


# -----------------------------------------------------
# Serve Frontend HTML
# -----------------------------------------------------
@app.route("/")
def home():
    return render_template("app.html")   # templates/app.html


# -----------------------------------------------------
# API Routes
# -----------------------------------------------------
@app.route("/get_location_names", methods=["GET"])
def get_location_names():
    return jsonify({"locations": locations})


@app.route("/predict_home_price", methods=["POST"])
def predict_home_price():
    try:
        total_sqft = float(request.form["total_sqft"])
        bhk = int(request.form["bhk"])
        bath = int(request.form["bath"])
        location = request.form["location"]

        x = np.zeros(len(data_columns))
        x[0] = total_sqft
        x[1] = bath
        x[2] = bhk

        if location in data_columns:
            loc_index = data_columns.index(location)
            x[loc_index] = 1

        estimated_price = round(model.predict([x])[0], 2)
        return jsonify({"estimated_price": estimated_price})

    except Exception as e:
        print("❌ Prediction error:", e)
        return jsonify({"error": str(e)}), 500


# -----------------------------------------------------
# Run Flask App on Render
# -----------------------------------------------------
if __name__ == "__main__":
    print("🚀 Starting Flask server...")
    app.run(host="0.0.0.0", port=5000)
