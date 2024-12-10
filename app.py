from flask import Flask, jsonify
from flask_cors import CORS
import os
import markdown

app = Flask(__name__)
CORS(app)

NOTES_DIR = "notes"


@app.route("/notes", methods=["GET"])
def list_notes():
    """Zwraca listę dostępnych notatek."""
    try:
        notes = [f for f in os.listdir(NOTES_DIR) if f.endswith(".md")]
        return jsonify(notes)
    except Exception as e:
        return jsonify({"error": "Failed to fetch notes", "details": str(e)}), 500


@app.route("/notes/<filename>", methods=["GET"])
def get_note_content(filename):
    """Zwraca zawartość wybranej notatki w HTML."""
    filepath = os.path.join(NOTES_DIR, filename)
    if os.path.exists(filepath) and filename.endswith(".md"):
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                markdown_content = f.read()
            html_content = markdown.markdown(markdown_content)
            return jsonify({"content": html_content})
        except Exception as e:
            return jsonify({"error": "Failed to read file", "details": str(e)}), 500
    return jsonify({"error": "File not found"}), 404


if __name__ == "__main__":
    if not os.path.exists(NOTES_DIR):
        os.makedirs(NOTES_DIR)
    app.run(debug=True, port=2317)
