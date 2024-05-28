from flask import Flask, redirect, url_for, render_template, jsonify, send_from_directory, current_app, request, session
from translatepy.translators.google import GoogleTranslate, Language
from flask_mail import Mail, Message
from pathlib import Path
import os
import config

app = Flask(__name__)

SECRET_KEY = os.urandom(32)
app.config['SECRET_KEY'] = SECRET_KEY
app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = 'your gmail'
app.config['MAIL_PASSWORD'] = 'your flask app password'
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
mail = Mail(app)

def create_app():
    return app

@app.route('/', methods=['GET', 'POST'])
def start():
    token = config.get_access_token() 
    data = {
        "token": token
    }
    return render_template('index.html', data=data)

@app.route('/translate', methods=['POST'])
def translate():
    src = ""
    result = ""
    req = request.get_json()
    src += req.get('to')
    gtranslate = GoogleTranslate()
    result += gtranslate.translate(src, "English", "Hebrew")
    response = {
        "result": "result"
    }
    return jsonify(response)

@app.route('/download/<filename>')
def download_file(filename):
    static_folder = os.path.join(current_app.root_path, 'static')
    return send_from_directory(static_folder, filename, as_attachment=True)

@app.route('/send_file', methods=['POST'])
def send_file():
    recipient_email = "recipient address"
    # file_path = Path("static/example.pdf")  # Replace with the actual file path
    # with file_path.open(mode="rb") as file:
    #     file_data = file.read()

    msg = Message("Email with File Attachment",
                  sender="sender mail",
                  recipients=[recipient_email])
    msg.body = "message has been sent by sender."
    # msg.html = "<b>testing</b>"
    # msg.attach(file_path.name, "application/pdf", file_data)  # Attach the file

    mail.send(msg)
    return "File sent successfully!"

if __name__ == '__main__':
    app.run(debug=True, use_reloader=True, host="0.0.0.0")