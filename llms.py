from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess

app = Flask(__name__)
CORS(app)

AVAILABLE_MODELS = [
    "deepseek-r1:1.5b",
    "qwen2.5-coder:latest",
    "deepseek-r1:7b",
    "llama3.2:latest"
]

@app.route("/models", methods=["GET"])
def list_models():
    return jsonify({"models": AVAILABLE_MODELS})

@app.route("/generate", methods=["POST"])
def generate():
    data = request.get_json()
    model = data.get("model")
    prompt = data.get("prompt", "")

    if model not in AVAILABLE_MODELS:
        return jsonify({"error": f"Model '{model}' not supported."}), 400
    if not prompt:
        return jsonify({"error": "Missing 'prompt' field."}), 400

    try:
        # Pipe prompt into ollama run
        result = subprocess.run(
            ["ollama", "run", model],
            input=prompt,
            capture_output=True,
            text=True,
            check=True
        )
        return jsonify({
            "model": model,
            "response": result.stdout.strip()
        })
    except subprocess.CalledProcessError as e:
        return jsonify({
            "error": "Ollama call failed",
            "details": e.stderr.strip()
        }), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
