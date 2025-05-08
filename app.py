from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import subprocess

app = Flask(__name__)
CORS(app)

# —————— Database setup ——————
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///chats.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Chat(db.Model):
    id         = db.Column(db.Integer, primary_key=True)
    title      = db.Column(db.String(128), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    messages   = db.relationship('Message', backref='chat', cascade='all, delete-orphan')

class Message(db.Model):
    id        = db.Column(db.Integer, primary_key=True)
    chat_id   = db.Column(db.Integer, db.ForeignKey('chat.id'), nullable=False)
    sender    = db.Column(db.String(10), nullable=False)  # 'user' or 'bot'
    text      = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

def generate_title(text: str) -> str:
    """Create a chat title from the first line (up to ~40 chars)."""
    first_line = text.strip().split('\n')[0]
    if len(first_line) <= 40:
        return first_line
    truncated = first_line[:40]
    return truncated.rsplit(' ', 1)[0] + '…'

# Ensure tables exist
with app.app_context():
    db.create_all()

AVAILABLE_MODELS = [
    "deepseek-r1:1.5b",
    "qwen2.5-coder:latest",
    "deepseek-r1:7b",
    "llama3.2:latest"
]

# — Models endpoint —
@app.route("/models", methods=["GET"])
def list_models():
    return jsonify({"models": AVAILABLE_MODELS})

# — Chat sessions —
@app.route('/chats', methods=['GET', 'POST'])
def manage_chats():
    if request.method == 'GET':
        chats = Chat.query.order_by(Chat.created_at.desc()).all()
        return jsonify([
            {
                'id':         c.id,
                'title':      c.title or "New Chat",
                'created_at': c.created_at.isoformat()
            }
            for c in chats
        ])
    else:  # create new chat
        chat = Chat()
        db.session.add(chat)
        db.session.commit()
        return jsonify({
            'id':         chat.id,
            'title':      chat.title or "New Chat",
            'created_at': chat.created_at.isoformat()
        }), 201

@app.route('/chats/<int:chat_id>', methods=['DELETE'])
def delete_chat(chat_id):
    chat = Chat.query.get_or_404(chat_id)
    db.session.delete(chat)
    db.session.commit()
    return '', 204

# — Messages —
@app.route('/chats/<int:chat_id>/messages', methods=['GET', 'DELETE'])
def manage_messages(chat_id):
    chat = Chat.query.get_or_404(chat_id)
    if request.method == 'GET':
        msgs = Message.query.filter_by(chat_id=chat.id).order_by(Message.timestamp).all()
        return jsonify([
            {'id': m.id, 'sender': m.sender, 'text': m.text, 'timestamp': m.timestamp.isoformat()}
            for m in msgs
        ])
    else:  # DELETE
        Message.query.filter_by(chat_id=chat.id).delete()
        db.session.commit()
        return '', 204

# — Generate (sends user prompt, stores both sides, sets title on first message) —
@app.route("/generate", methods=["POST"])
def generate():
    data    = request.get_json()
    model   = data.get("model")
    prompt  = data.get("prompt", "").strip()
    chat_id = data.get("chat_id")

    if model not in AVAILABLE_MODELS:
        return jsonify({"error": f"Model '{model}' not supported."}), 400
    if not prompt:
        return jsonify({"error": "Missing 'prompt' field."}), 400

    chat = Chat.query.get_or_404(chat_id)
    # set title if first user message
    if chat.title is None:
        chat.title = generate_title(prompt)
        db.session.add(chat)
        db.session.commit()

    # store user message
    user_msg = Message(chat_id=chat.id, sender='user', text=prompt)
    db.session.add(user_msg)
    db.session.commit()

    try:
        # call local Ollama model
        result = subprocess.run(
            ["ollama", "run", model],
            input=prompt,
            capture_output=True,
            text=True,
            check=True
        )
        response_text = result.stdout.strip()

        # store bot message
        bot_msg = Message(chat_id=chat.id, sender='bot', text=response_text)
        db.session.add(bot_msg)
        db.session.commit()

        return jsonify({"model": model, "response": response_text})
    except subprocess.CalledProcessError as e:
        return jsonify({
            "error":   "Ollama call failed",
            "details": e.stderr.strip()
        }), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

