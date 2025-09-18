from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

DB_NAME = "realestate.db"

app = Flask(__name__)
CORS(app)  # Allow frontend to call backend

def get_db():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

# ---------------- ROOT ROUTE ---------------- #
@app.route("/")
def home():
    return "✅ Real Estate DApp Backend is running!"

# ---------------- API ENDPOINTS ---------------- #

@app.route("/properties", methods=["GET"])
def get_properties():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM properties")
    rows = cursor.fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])

@app.route("/properties", methods=["POST"])
def add_property():
    data = request.json
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT OR REPLACE INTO properties (id, name, location, value) VALUES (?, ?, ?, ?)", 
        (data["id"], data["name"], data["location"], data["value"])
    )
    conn.commit()
    conn.close()
    return jsonify({"message": "Property added"}), 201

@app.route("/properties/<int:property_id>", methods=["DELETE"])
def delete_property(property_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM properties WHERE id=?", (property_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Property deleted"})

# ---------------- MAIN ---------------- #
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
