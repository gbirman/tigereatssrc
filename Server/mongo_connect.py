from flask import Flask, jsonify, request
from flask.json import JSONEncoder
from flask_pymongo import PyMongo
from flask_cors import CORS
from datetime import date, timedelta
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


@app.route('/api/getUsers', methods=['GET'])
def get_users():

    cursor = mongo.db.users.find()
    users = []
    for user in cursor:
        users.append(user)
    return jsonify(users)


def _get_user(args):
    id = args['user_id']
    return mongo.db.users.find({"_id": ObjectId(id)})[0]


@app.route('/api/get_user_email', methods=['GET'])
def get_user_email():
    user = _get_user(request.args)
    return jsonify(user['email'])


@app.route('/api/get_user_firstname', methods=['GET'])
def get_user_firstname():
    user = _get_user(request.args)
    return jsonify(user['firstname'])


@app.route('/api/get_user_lastname', methods=['GET'])
def get_user_lastname():
    user = _get_user(request.args)
    return jsonify(user['lastname'])


@app.route('/api/get_user_gender', methods=['GET'])
def get_user_gender():
    user = _get_user(request.args)
    return jsonify(user['gender'])


@app.route('/api/get_user_height', methods=['GET'])
def get_user_height():
    user = _get_user(request.args)
    return jsonify(user['height'])


@app.route('/api/get_user_weight', methods=['GET'])
def get_user_weight():
    user = _get_user(request.args)
    return jsonify(user['weight'])


@app.route('/api/get_user_restrictions', methods=['GET'])
def get_user_restrictions():
    user = _get_user(request.args)
    return jsonify(user['restrictions'])


@app.route('/api/get_user_calorie_goal', methods=['GET'])
def get_user_calorie_goal():
    user = _get_user(request.args)
    return jsonify(user['calorie_goal'])


@app.route('/api/get_user_protein_goal', methods=['GET'])
def get_user_protein_goal():
    user = _get_user(request.args)
    return jsonify(user['protein_goal'])


@app.route('/api/get_user_fats_goal', methods=['GET'])
def get_user_fats_goal():
    user = _get_user(request.args)
    return jsonify(user['fats_goal'])


@app.route('/api/get_user_carbs_goal', methods=['GET'])
def get_user_carbs_goal():
    user = _get_user(request.args)
    return jsonify(user['carbs_goal'])


@app.route('/api/get_user_nutrition_goals', methods=['GET'])
def get_user_nutrition_goals():
    user = _get_user(request.args)
    return jsonify([user['calorie_goal'], user['protein_goal'], user['fats_goal'], user['carbs_goal']])


@app.route('/api/get_user_weight_goal', methods=['GET'])
def get_user_weight_goal():
    user = _get_user(request.args)
    return jsonify(user['weight_goal'])


@app.route('/api/get_user_team', methods=['GET'])
def get_user_team():
    user = _get_user(request.args)
    return jsonify(user['team'])


@app.route('/api/get_user_year', methods=['GET'])
def get_user_year():
    user = _get_user(request.args)
    return jsonify(user['year'])


def _update_nutrients(nutrients: dict, food_data: dict, num_servings: float) -> None:
    nutrients['calories'] += num_servings*food_data['calories']
    nutrients['protein'] += num_servings*food_data['protein']
    nutrients['carbs'] += num_servings*food_data['carbs']
    nutrients['fat'] += num_servings*food_data['fat']


def _update_portions(portions: dict, food: str, serving_size: str, num_servings: float) -> None:
    num_portion, unit_portion = serving_size.split(' ')
    num_portion = float(num_portion)
    portion_taken = str(num_portion*num_servings) + ' ' + unit_portion
    portions[food] = portion_taken


def _get_user_meal_data(id: str, date: str, meal: str):

    """
    data = mongo.db.meal_log.aggregate([
        # match - "where" conditions
        {
            "$match": {
                "$and": [
                    {'userId' : ObjectId(id)},
                    {'meal' : meal},
                    {'date' : date}
                ]
            }
        },
        # # join
        # {
        #     "$lookup": {
        #         "from": 'users',
        #         "localField": 'userId',
        #         "foreignField": '_id',
        #         'as': 'user_meals'
        #     }
        # }
    ]).next()
    """

    nutrients = {'calories': 0, 'protein': 0, 'carbs': 0, 'fat': 0}
    portions = {}

    try:
        data = mongo.db.meal_log.find({
            "$and": [
                {'userId': ObjectId(id)},
                {'meal': meal},
                {'date': date},
            ]
        })[0]

    except IndexError:
        return [nutrients, portions]

    for food in data['choices']:
        try:
            food_data = mongo.db.food.find({
                "$and" : [
                    {'foodId' : food},
                    # {'meal' : meal},  # would need to input MUCH more food data to include this. Implies eggs at breakfast are diff than eggs at lunch
                    # {'date' : date},  # would need to input MUCH more food data to include this. Implies eggs on 9-1-18 are diff than 9-2-18
                    {'cafeteria' : data['cafeteriaId']}
                ]
            })[0]
        except IndexError:
            continue
        _update_nutrients(nutrients, food_data, data['choices'][food])
        _update_portions(portions, food, food_data['portion'], data['choices'][food])

    return [nutrients, portions]


@app.route('/api/get_user_meal_data', methods=['GET'])
def get_user_meal_data():
    args = request.args
    id = args['user_id']
    date = args['date']
    meal = args['meal']
    return jsonify(_get_user_meal_data(id, date, meal))


def _update_total_nutrients(nutrients, breakfast, lunch, dinner):
    for macro in ['calories', 'protein', 'carbs', 'fat']:
        nutrients[macro] = breakfast[0][macro] + lunch[0][macro] + dinner[0][macro]


def _get_user_day_meal_data(id: str, date: str):
    nutrients = {'calories' : 0, 'protein' : 0, 'carbs' : 0, 'fat' : 0}
    breakfast = _get_user_meal_data(id, date, "breakfast")
    lunch = _get_user_meal_data(id, date, "lunch")
    dinner = _get_user_meal_data(id, date, "dinner")
    _update_total_nutrients(nutrients, breakfast, lunch, dinner)
    return [nutrients, breakfast, lunch, dinner]


@app.route('/api/get_user_day_meal_data', methods=['GET'])
def get_user_day_meal_data(id: str, date: str):
    args = request.args
    id = args['user_id']
    date = args['date']
    return jsonify(_get_user_day_meal_data(id, date))


def _convert_to_date(mydate: str):
    date_list = mydate.split('-')
    date_list = map(lambda x : int(x), date_list)
    date_list = list(date_list)
    return date(*date_list)


def _get_user_nutrient_progress(id: str, startdate: str, enddate: str):
    startdate = _convert_to_date(startdate)
    enddate = _convert_to_date(enddate)
    delta = enddate - startdate

    date_to_nutrition = {}
    for i in range(delta.days + 1):
        this_date = str(startdate + timedelta(i))
        date_to_nutrition[this_date] = _get_user_day_meal_data(id, this_date)[0]

    return date_to_nutrition


@app.route('/api/get_user_nutrient_progress', methods=['GET'])
def get_user_nutrient_progress():
    args = request.args
    id = args['user_id']
    startdate = args['startdate']
    enddate = args['enddate']
    return jsonify(_get_user_nutrient_progress(id, startdate, enddate))


def _prep_data_to_update(user_id: str):
    users = mongo.db.users
    data = _get_user(user_id)
    return users, data


def _update_data(collection, user_id: str, data: dict):
    try:
        collection.update_one({'_id': ObjectId(user_id)}, {"$set": data}, upsert=False)
        return jsonify(True)
    except:
        return jsonify(False)


@app.route('/api/change_nutrition_goals', methods=['POST'])
def change_nutrition_goals():

    args = request.get_json()
    user_id = args['user_id']
    try:
        new_calorie_goal = float(args['new_calorie_goal'])
        new_protein_goal = float(args['new_protein_goal'])
        new_carbs_goal = float(args['new_carbs_goal'])
        new_fats_goal = float(args['new_fats_goal'])
    except ValueError:
        return jsonify(False)

    if new_calorie_goal <= 0 or new_fats_goal <= 0 or new_carbs_goal <= 0 or new_protein_goal <= 0:
        return jsonify(False)
    if new_calorie_goal != 4*new_protein_goal + 4*new_carbs_goal + 9*new_fats_goal:
        return jsonify(False)

    users, data = _prep_data_to_update(user_id)
    data['calorie_goal'] = new_calorie_goal
    data['protein_goal'] = new_protein_goal
    data['carbs_goal'] = new_carbs_goal
    data['fats_goal'] = new_fats_goal

    return _update_data(users, user_id, data)


@app.route('/api/change_weight_goal', methods=['POST'])
def change_weight_goal():

    args = request.get_json()
    user_id = args['user_id']
    new_weight_goal = float(args['new_weight_goal'])

    users, data = _prep_data_to_update(user_id)
    data['weight_goal'] = new_weight_goal

    return _update_data(users, user_id, data)


@app.route('/api/change_name', methods=['POST'])
def change_name():

    args = request.get_json()
    user_id = args['user_id']
    new_name = args['new_name']

    users, data = _prep_data_to_update(user_id)
    new_name = new_name.split(' ')
    first_name = new_name[0]
    last_name = new_name[-1]
    data['firstname'] = first_name
    data['lastname'] = last_name

    return _update_data(users, user_id, data)


@app.route('/api/change_team', methods=['POST'])
def change_team():

    args = request.get_json()
    user_id = args['user_id']
    new_team = args['new_team']

    users, data = _prep_data_to_update(user_id)
    data['gender'] = new_team

    return _update_data(users, user_id, data)


@app.route('/api/change_gender', methods=['POST'])
def change_gender():

    args = request.get_json()
    user_id = args['user_id']
    new_gender = args['new_gender']

    if new_gender not in ['M', 'F']:
        return False

    users, data = _prep_data_to_update(user_id)
    data['gender'] = new_gender

    return _update_data(users, user_id, data)


@app.route('/api/change_year', methods=['POST'])
def change_year():

    args = request.get_json()
    user_id = args['user_id']
    new_year = int(args['new_year'])

    if new_year <= 2018:
        return False

    users, data = _prep_data_to_update(user_id)
    data['year'] = new_year

    return _update_data(users, user_id, data)


if __name__ == '__main__':
    # print(_get_user_meal_data("5bf8ca12e7179a56e21592c5", "2018-07-11", "lunch"))
    # print(_get_user_meal_data("5bf8ca12e7179a56e21592c5", "2018-07-11", "breakfast"))
    # print(_get_user_meal_data("5bf8ca12e7179a56e21592c5", "2018-07-13", "breakfast"))
    # print(_get_user_nutrient_progress("5bf8ca12e7179a56e21592c5", "2018-07-11", "2018-07-15"))
    # print(_get_user('5bf8ca12e7179a56e21592c5'))
    # print(change_nutrition_goals('5bf8ca12e7179a56e21592c5', 68, 4, 4, 4))
    app.run(debug=True)