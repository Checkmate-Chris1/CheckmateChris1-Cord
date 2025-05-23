import os
import uuid

from flask import Flask, render_template, jsonify, request, url_for
from flask_socketio import SocketIO
from werkzeug.utils import secure_filename

app = Flask(__name__)
sio = SocketIO(app, cors_allowed_origins="*")

# ----- image upload config -----
UPLOAD_DIR = os.path.join(app.static_folder, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.route("/")
def home():
    return render_template("admin_console.html")


# ----- control buttons -----
@app.post("/code/AFK")
def stop():
    body = request.get_data(as_text=True)

    console_log(body)
    return "good"


@app.post("/code/BACK")
def start():
    body = request.get_data(as_text=True)

    console_log(body)
    return "good"


# ----- chat messages -----
@app.post("/message")
def send_message():
    console_log(request.get_data(as_text=True))
    return "good", 200


# ----- image upload -----
@app.post("/upload-image")
def upload_image():
    if 'image' not in request.files:
        return "no file", 400
    img = request.files['image']
    if img.filename == '':
        return "empty filename", 400
    if not img.filename.endswith(('.png', 'jpeg', '.jpg', '.gif', '.jfif')): # Only valid image extensions
        return "not an image", 400
    filename = f"{uuid.uuid4().hex}_{secure_filename(img.filename)}" # randomNumbers_fileName.EXTENSION
    path = os.path.join(UPLOAD_DIR, filename)
    img.save(path)
    url = url_for('static', filename=f"uploads/{filename}")
    sio.emit('image', url)  # push to all clients
    return "", 204


# ------------- web connection stuff ----------------
LOG_PATH = "logs.txt"


def console_log(msg: str):
    with open(LOG_PATH, 'a', encoding='utf-8') as file:
        file.write(msg + "\n")
    sio.emit("log", msg)


@app.get("/logs")
def logs():
    """Returns the stored console log"""
    with open(LOG_PATH, 'r', encoding='utf-8') as file:
        lines = file.readlines()
    return jsonify(lines[-500:])


@app.get("/images")
def images():
    """Returns stored images from oldest to newest"""
    files = []
    image_urls = []
    for file in os.listdir('static/uploads'):
        files.append(file)
    files.sort(key=lambda item: os.path.getmtime(os.path.join('static/uploads', item))) # Sort by date modified
    for file in files:
        image_urls.append(url_for('static', filename=f"uploads/{file}"))

    return jsonify(image_urls)


if __name__ == "__main__":
    sio.emit("log", "Starting server...")  # don't log to logs.txt
    sio.run(app, host="0.0.0.0", port=5000, allow_unsafe_werkzeug=True)
