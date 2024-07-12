from flask import Flask, request, jsonify, session
from flask_cors import CORS

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = 'your_secret_key'

users = {
    "user1": "password1",
    "user2": "password2"
}

@app.route('/')
def home():
    if 'username' in session:
        return jsonify({'message': f'Logged in as {session["username"]}', 'username': session["username"]})
    return jsonify({'message': 'You are not logged in', 'username': None})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if username in users and users[username] == password:
        session['username'] = username
        return jsonify({'success': True, 'username': username})
    return jsonify({'success': False, 'error': 'Invalid username or password'})

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if username in users:
        return jsonify({'success': False, 'error': 'Username already exists'})
    users[username] = password
    session['username'] = username
    return jsonify({'success': True, 'username': username})

@app.route('/logout')
def logout():
    session.pop('username', None)
    return jsonify({'success': True})

@app.route('/session')
def session_status():
    if 'username' in session:
        return jsonify({'is_logged_in': True, 'username': session['username']})
    return jsonify({'is_logged_in': False})

if __name__ == '__main__':
    app.run(debug=True)