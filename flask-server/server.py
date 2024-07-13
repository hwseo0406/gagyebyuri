from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_bcrypt import Bcrypt
import pymysql
import requests
import uuid
import time
import json
import os
from dotenv import load_dotenv
from openai import OpenAI
from datetime import timedelta

#환경변수
load_dotenv() 
GPT_API_KEY = os.environ["OPEN_API_KEY"]
DB_HOST = os.environ["DB_HOST"]
DB_USER = os.environ["DB_USER"]
DB_PASSWORD = os.environ["DB_PASSWORD"]
DB_NAME = os.environ["DB_NAME"]
NAVER_API_URL = os.environ["NAVER_API_URL"]
NAVER_API_KEY = os.environ["NAVER_API_KEY"]
SECRET_KEY = os.environ["SECRET_KEY"]

app = Flask(__name__)
#다른 도메인에서 요청을 허용
CORS(app, supports_credentials=True)
app.secret_key = SECRET_KEY
app.config['SESSION_KEY_PREFIX'] = 'gagye_byuri_'
bcrypt = Bcrypt(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


use_test_data = True  # 테스트 모드 플래그

# MySQL 데이터베이스 연결 설정
def get_db_connection():
    connection = pymysql.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME,
        cursorclass=pymysql.cursors.DictCursor
    )
    return connection

#가계부 관리기능
#파일을 업로드하면 저장하고, OCR 및 GPT API를 통해 텍스트를 분석
@app.route('/upload', methods=['POST'])
def upload_file():
    timestamp = int(time.time())
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file:
        rename = f"{os.path.splitext(file.filename)[0]}_{timestamp}{os.path.splitext(file.filename)[1]}"
        filename = os.path.join(UPLOAD_FOLDER, rename)
        file.save(filename)
        if use_test_data:
            with open('json_file.json', 'r', encoding='utf-8') as f:
                ocr_result = json.load(f)
            infer_text = receipt_form(ocr_result)
        else:
            infer_text = ocr_image(filename)
        
        gpt_result = gptapi(infer_text)
        
        return jsonify({'inferText': infer_text, 'gptResult': gpt_result})


# 수입 데이터를 업로드 받아 저장, OCR 및 GPT API로 텍스트 분석
@app.route('/income', methods = ['POST'])
def upload_income():
    timestamp = int(time.time())
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file:
        rename = f"{os.path.splitext(file.filename)[0]}_{timestamp}{os.path.splitext(file.filename)[1]}"
        filename = os.path.join(UPLOAD_FOLDER, rename)
        file.save(filename)
        if use_test_data:
            with open('json_file_income.json', 'r', encoding='utf-8') as f:
                ocr_result = json.load(f)
            infer_text = receipt_form(ocr_result)
        else:
            infer_text = ocr_image(filename)
        
        gpt_result_income = gptapi_income(infer_text)
        
        return jsonify({'inferText_income': infer_text, 'gptResult_income': gpt_result_income})

#GPT API로부터 받은 데이터를 MySQL 데이터베이스에 저장
@app.route('/save', methods=['POST'])
def save_data():
    data = request.json
    nickname = data.get('nickname')
    gpt_result = data.get('gptResult')

    connection = get_db_connection()
    with connection.cursor() as cursor:
        # 가계부 데이터 저장
        sql = """
        INSERT INTO receipts (nickname, store_name, purchase_date, total_cost)
        VALUES (%s, %s, %s, %s)
        """
        cursor.execute(sql, (nickname, gpt_result['store_name'], gpt_result['purchase_date'], gpt_result['total_cost']))
        receipt_id = cursor.lastrowid
        
        # 항목 데이터 저장
        for item in gpt_result['items']:
            sql = """
            INSERT INTO items (receipt_id, item_name, quantity, amount)
            VALUES (%s, %s, %s, %s)
            """
            cursor.execute(sql, (receipt_id, item['item_name'], item['quantity'], item['amount']))
        
    connection.commit()
    connection.close()
    return jsonify({'message': '데이터 저장 성공'})

@app.route('/incomesave', methods=['POST'])
def save_data_income():
    data = request.json
    nickname = data.get('nickname')
    gpt_result = data.get('gptResult_income')

    connection = get_db_connection()
    with connection.cursor() as cursor:
        # 가계부 데이터 저장
        sql = """
        INSERT INTO account (nickname, owner_name, account_balance)
        VALUES (%s, %s, %s)
        """
        cursor.execute(sql, (nickname, gpt_result['owner_name'], gpt_result['account_balance']))
        account_id = cursor.lastrowid
        
        # 항목 데이터 저장
        for income in gpt_result['income']:
            sql = """
            INSERT INTO income (account_id, sender_name, amount)
            VALUES (%s, %s, %s)
            """
            cursor.execute(sql, (account_id, income['sender_name'], income['amount'] ))
        
    connection.commit()
    connection.close()
    return jsonify({'message': '데이터 저장 성공'})

# 지출내역 보여주기
@app.route('/ExpenseList/<nickname>', methods=['GET'])
def get_receipts(nickname):
    connection = get_db_connection()
    with connection.cursor() as cursor:
        sql = """
        SELECT r.id, r.store_name, r.purchase_date, r.total_cost
        FROM receipts r
        WHERE r.nickname = %s
        """

        cursor.execute(sql, (nickname,))
        receipts = cursor.fetchall()
        
        sql2 = '''
        SELECT SUM(r.total_cost) as total
        FROM receipts r
        WHERE r.nickname = %s
        '''
        cursor.execute(sql2, (nickname,))
        total = cursor.fetchone()
        
    connection.close()
    return jsonify({"receipts": receipts,  "total": total["total"]})

# 수익 내역 보여주기
@app.route('/income_list/<nickname>', methods = ['GET'])
def get_income_list(nickname):

    connection = get_db_connection()
    with connection.cursor() as cursor:
        sql = '''
        select i.id, i.sender_name, i.amount
        from income i join account a 
        on i.account_id = a.id 
        where a.nickname = %s
        '''
        cursor.execute(sql, (nickname,))
        account = cursor.fetchall()
    
    connection.close()
    return jsonify(account)

# 수입 업데이트
@app.route('/update_income/<int:id>', methods=['PUT'])
def update_income(id):
    data = request.json
    sender_name = data.get('sender_name')
    amount = data.get('amount')

    connection = get_db_connection()
    with connection.cursor() as cursor:
        sql = """
        UPDATE income
        SET sender_name = %s, amount = %s
        WHERE id = %s
        """
        cursor.execute(sql, (sender_name, amount, id))
    
    connection.commit()
    connection.close()
    return jsonify({'message': '수입 내역 수정 성공'})

# 수익 삭제
@app.route('/delete_income/<int:id>', methods=['DELETE'])
def delete_income(id):
    connection = get_db_connection()
    with connection.cursor() as cursor:
        sql = "DELETE FROM income WHERE id = %s"
        cursor.execute(sql, (id,))
    
    connection.commit()
    connection.close()
    return jsonify({'message': '수입 내역 삭제 성공'})

# 영수증 수정
@app.route('/update_receipt/<int:id>', methods=['PUT'])
def update_receipt(id):
    data = request.json
    store_name = data.get('store_name')
    purchase_date = data.get('purchase_date')
    total_cost = data.get('total_cost')
    items = data.get('items', [])

    connection = get_db_connection()
    with connection.cursor() as cursor:
        sql = """
        UPDATE receipts
        SET store_name = %s, purchase_date = %s, total_cost = %s
        WHERE id = %s
        """
        cursor.execute(sql, (store_name, purchase_date, total_cost, id))

        for item in items:
            if 'id' in item:
                sql = """
                UPDATE items
                SET item_name = %s, quantity = %s, amount = %s
                WHERE id = %s
                """
                cursor.execute(sql, (item['item_name'], item['quantity'], item['amount'], item['id']))
            else:
                sql = """
                INSERT INTO items (receipt_id, item_name, quantity, amount)
                VALUES (%s, %s, %s, %s)
                """
                cursor.execute(sql, (id, item['item_name'], item['quantity'], item['amount']))

    connection.commit()
    connection.close()
    return jsonify({'message': '지출 내역 수정 성공'})

# 영수증 삭제
@app.route('/delete_receipt/<int:id>', methods=['DELETE'])
def delete_receipt(id):
    connection = get_db_connection()
    with connection.cursor() as cursor:
        sql = "DELETE FROM items WHERE receipt_id = %s"
        cursor.execute(sql, (id,))
        sql = "DELETE FROM receipts WHERE id = %s"
        cursor.execute(sql, (id,))
    
    connection.commit()
    connection.close()
    return jsonify({'message': '지출 내역 삭제 성공'})

@app.route('/delete_item/<int:id>', methods = ['DELETE'])
def delete_item(id):
    connection = get_db_connection()
    with connection.cursor() as cursor:
        sql = "DELETE FROM items WHERE id = %s"
        cursor.execute(sql, (id,))
    
    connection.commit()
    connection.close()
    return jsonify({'message': '삭제 성공'})

@app.route('/get_receipt/<int:id>', methods=['GET'])
def get_receipt(id):
    connection = get_db_connection()
    with connection.cursor() as cursor:
        sql = """
        SELECT r.store_name, r.purchase_date, r.total_cost, i.id as item_id, i.item_name, i.quantity, i.amount
        FROM receipts r
        LEFT JOIN items i ON r.id = i.receipt_id
        WHERE r.id = %s
        """
        cursor.execute(sql, (id,))
        rows = cursor.fetchall()
    
    if not rows:
        return jsonify({'error': 'Receipt not found'}), 404

    receipt = {
        'store_name': rows[0]['store_name'],
        'purchase_date': rows[0]['purchase_date'],
        'total_cost': rows[0]['total_cost'],
        'items': []
    }

    for row in rows:
        if row['item_id']:
            receipt['items'].append({
                'id': row['item_id'],
                'item_name': row['item_name'],
                'quantity': row['quantity'],
                'amount': row['amount']
            })

    connection.close()
    return jsonify(receipt)

# 네이버 OCR 텍스트 추출
def ocr_image(image_path):
    image_format = image_path.split('.')[-1].lower()
    request_json = {
        'images': [
            {
                'format': image_format,
                'name': 'demo'
            }
        ],
        'requestId': str(uuid.uuid4()),
        'version': 'V2',
        'timestamp': int(round(time.time() * 1000))
    }

    payload = {'message': json.dumps(request_json).encode('UTF-8')}
    with open(image_path, 'rb') as image_file:
        files = [('file', image_file)]
        headers = {'X-OCR-SECRET': NAVER_API_KEY}

        response = requests.post(NAVER_API_URL, headers = headers, data = payload, files = files)

    if response.status_code == 200:
        ocr_result = response.json()

        timestamp = int(time.time())
        result_file = os.path.join(UPLOAD_FOLDER, f'ocr_response_{timestamp}.json')
        with open(result_file, 'w', encoding='utf-8') as f:
            json.dump(ocr_result, f, ensure_ascii = False, indent = 4)
        
        text_list = receipt_form(ocr_result)
        return text_list
    else:
        return f"Error: {response.status_code}\n{response.text}"

# 영수증 폼 제작
def receipt_form(ocr_result):
    string_result = ''
    for i in ocr_result['images'][0]['fields']:
        if i["lineBreak"] == True:
            linebreak = "\n"
        else:
            linebreak = " "
        string_result = string_result + i["inferText"] + linebreak
    return string_result

# GPT API 호출 
def gptapi(infer_text):
    if use_test_data:
        with open('gpt_json.json', 'r', encoding='utf-8') as f:
            message = json.load(f)
    else:
        client = OpenAI(api_key = GPT_API_KEY)
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            response_format={"type": "json_object"},
            messages = [
                {"role": "system", "content": "You are a helpful assistant to analyze the purchase_date, items, (item_name, quantity, amount) and total sum from the receipt and output it in JSON format"},
                {"role": "user", "content": f'Please analyze the {infer_text}. Only include items, purchase date, store name and total_cost. If an item is free, set its cost to 0. If the store name is present in the receipt, include it; otherwise, set it to null.'},
            ]
        )
        message = response.choices[0].message.content

    timestamp = int(time.time())

    gpt_file_path = os.path.join(UPLOAD_FOLDER, f'gpt_json{timestamp}.json')
    with open(gpt_file_path, 'w', encoding='utf-8') as f:
        json.dump(message, f, ensure_ascii = False, indent = 4)
    
    data = json.loads(message)

    return data

# GPT API 호출
def gptapi_income(infer_text):
    timestamp = int(time.time())
    if use_test_data:
        with open('gpt_json_income.json', 'r', encoding='utf-8') as f:
            message = json.load(f)
    else:
        client = OpenAI(api_key = GPT_API_KEY)
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            response_format={"type": "json_object"},
            messages = [
                {"role": "system", "content": "You are a helpful assistant to analyze the owner_name, income (sender_name, amount also amount is number) and account balance from the account and output it in JSON format"},
                {"role": "user", "content": f'Please analyze the {infer_text}. Only include owner_name, income [] and account balance'},
            ]
        )
        message = response.choices[0].message.content

    data = json.loads(message)
    gpt_file_path = os.path.join(UPLOAD_FOLDER, f'gpt_json_income{timestamp}.json')
    with open(gpt_file_path, 'w', encoding='utf-8') as f:
        json.dump(message, f, ensure_ascii = False, indent = 4)

    return data

#로그인 기능

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    id = data.get('id')
    password = data.get('password')
    name = data.get('name') 

    # 비밀번호 해싱
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    # 데이터베이스 연결
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            # 사용자가 이미 존재하는지 확인
            sql = "SELECT * FROM users WHERE id=%s"
            cursor.execute(sql, (id,))
            result = cursor.fetchone()
            if result:
                return jsonify({'success': False, 'error': 'User already exists'})

            # 새로운 사용자 추가
            sql = "INSERT INTO users (id, password, name) VALUES (%s, %s, %s)"
            cursor.execute(sql, (id, hashed_password, name ))
            connection.commit()

            return jsonify({'success': True, 'name': name})
    finally:
        connection.close()

# 로그인
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    id = data.get('id')
    password = data.get('password')

    # 데이터베이스 연결
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            # 사용자 정보 가져오기
            sql = "SELECT * FROM users WHERE id=%s"
            cursor.execute(sql, (id,))
            
            user = cursor.fetchone()
            if user and bcrypt.check_password_hash(user['password'], password):
                # 비밀번호 일치 -> 로그인 성공
                session['id'] = user['id']
                session['name'] = user['name']
                return jsonify({'success': True, 'id': user['id'], 'name': user['name']})
            else:
                # 비밀번호 불일치 혹은 사용자가 존재하지 않음 -> 로그인 실패
                return jsonify({'success': False, 'error': 'Invalid id or password'})
    finally:
        connection.close()

# 로그아웃
@app.route('/logout')
def logout():
    id = session.get("id")
    if id:
        session.clear()
        return jsonify({'success': True})
    
    # 아이디 중복 검사
@app.route('/idcheck', methods=['POST'])
def login():
    data = request.get_json()
    id = data.get('id')

    # 데이터베이스 연결
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            # 사용자 정보 가져오기
            sql = "SELECT id FROM users WHERE id=%s"
            cursor.execute(sql, (id,))
            
            user = cursor.fetchone()
            if id and user[id]:
                # 아이디 일치 -> 중복
                return jsonify({'success': False, 'error': 'Invalid id'})
            else:
                # 아이디 불일치 -> 회원가입 가능
                return jsonify({'success': True, 'id': id})
    finally:
        connection.close()

if __name__ == '__main__':
    app.run(debug=True)