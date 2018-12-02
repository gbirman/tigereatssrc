from flask import Flask, jsonify, request
from flask.json import JSONEncoder
from flask_pymongo import PyMongo
from flask_cors import CORS
from pymongo import MongoClient 
from urllib.parse import quote_plus
from pymongo.errors import ConnectionFailure
import sys 
from bson import ObjectId


class MyJSONEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return super(MyJSONEncoder, self).default(obj)

app = Flask(__name__)
app.json_encoder = MyJSONEncoder
app.config['MONGO_DBNAME'] = 'tiger_eats_db'
app.config['MONGO_URI'] = 'mongodb://pfrazao:y7gnykTXHj8j7EK@ds053380.mlab.com:53380/tiger_eats_db'

mongo = PyMongo(app)

CORS(app)


@app.route('/api/addUser', methods=['POST'])
def addUser():
    users = mongo.db.users
    user = request.get_json()['user']

    user_id = users.insert({'name': user})
    new_user = users.find_one({'_id': user_id})

    result = {'user': new_user['name']}

    return jsonify({'result': result})


# @app.route('/api/findUsers', methods=['GET'])
# def findUsers():
#     users = mongo.db.users
#
#     result = []
#
#     for user in users.find({}):
#         result.append({'name': user['name']})
#
#     return jsonify(result)


@app.route('/api/getUsers', methods=['GET'])
def get_users():

    cursor = mongo.db.users.find()
    users = []
    for user in cursor:
        users.append(user)
    return jsonify(users)

def _get_user(id: str)
    return mongo.db.users.find({"_id": ObjectId(id)})[0]


@app.route('/api/get_user_email', methods=['GET'])
def get_user_email(id: str):
    user = _get_user(id)
    return user['email']


@app.route('/api/get_user_firstname', methods=['GET'])
def get_user_firstname(id: str):
    user = mongo.db.users.find({"_id": ObjectId(id)})[0]
    return user['firstname']


@app.route('/api/get_user_lastname', methods=['GET'])
def get_user_lastname(id: str):
    user = mongo.db.users.find({"_id": ObjectId(id)})[0]
    return user['lastname']


@app.route('/api/get_user_gender', methods=['GET'])
def get_user_gender(id: str):
    user = mongo.db.users.find({"_id": ObjectId(id)})[0]
    return user['gender']


@app.route('/api/get_user_height', methods=['GET'])
def get_user_lastname(id: str):
    user = mongo.db.users.find({"_id": ObjectId(id)})[0]
    return user['height']


@app.route('/api/get_user_weight', methods=['GET'])
def get_user_weight(id: str):
    user = mongo.db.users.find({"_id": ObjectId(id)})[0]
    return user['weight']


@app.route('/api/get_user_restrictions', methods=['GET'])
def get_user_restrictions(id: str):
    user = mongo.db.users.find({"_id": ObjectId(id)})[0]
    return user['restrictions']


@app.route('/api/get_user_calorie_goal', methods=['GET'])
def get_user_calorie_goal(id: str):
    user = mongo.db.users.find({"_id": ObjectId(id)})[0]
    return user['calorie_goal']


@app.route('/api/get_user_protein_goal', methods=['GET'])
def get_user_protein_goal(id: str):
    user = mongo.db.users.find({"_id": ObjectId(id)})[0]
    return user['protein_goal']


@app.route('/api/get_user_fats_goal', methods=['GET'])
def get_user_fats_goal(id: str):
    user = mongo.db.users.find({"_id": ObjectId(id)})[0]
    return user['fats_goal']

if __name__ == '__main__':
    print(get_user_email("5bf8ca12e7179a56e21592c5"))
    app.run(debug=True)