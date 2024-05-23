from flask import Flask, redirect, url_for, render_template, request, session, jsonify, send_from_directory
from translatepy.translators.google import GoogleTranslate, Language
import main
app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def start():
    return render_template('index.html')
@app.route('/translate', methods=['POST'])
def translate():
    sentence = "Hello World"
    input_data = main.detect()
    gtranslate = GoogleTranslate()
    result = gtranslate.translate(input_data, "English")
    print(result)
    response = {
        "result": "result"
    }
    
    return jsonify(response)
@app.route('/download/<filename>')
def download_file(filename):
    directory = 'path/to/files'
    return send_from_directory(directory, filename, as_attachment=True)
if __name__ == '__main__':
    app.run(debug=True, use_reloader=True, host="0.0.0.0")