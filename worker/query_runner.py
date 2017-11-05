import json, datetime, decimal, redis, os, hashlib, math, requests
from celery import Celery
from sqlalchemy import create_engine
from sqlalchemy.sql import text
from sqlalchemy.engine import RowProxy
from sqlalchemy.engine import reflection


app = Celery('tasks', backend='redis', broker='redis://')
redis_obj = redis.Redis.from_url('redis://localhost:6379/0')
global_expiry = os.environ.get("AG_GLOBAL_CACHE_EXPIRY") or 3600

connections = {}
per_page_results = os.environ.get("AG_PER_PAGE_RESULTS_CACHED") or 200

@app.task
def test_connection(db_url):
    try:
        get_connection(db_url)
        return {"success" : True }
    except Exception as e:
        return { "success" : False, "error" : str(e.args) }

@app.task
def run(db_url, query, query_key, expiry=global_expiry):
    connection = get_connection(db_url)
    result = connection.execute(text(query))
    save_results_to_redis(query_key, result.keys(), result.fetchall(), expiry)
    results = get_result_object(query_key)
    hit_webhook(results)
    return None

@app.task
def get_schema(db_url):
    engine = create_engine(db_url)
    insp = reflection.Inspector.from_engine(engine)
    schema = {}
    for t in insp.get_table_names():
        schema[t] = get_serializable_columns(insp, t)
    return schema

@app.task
def get_tables(db_url):
    engine = create_engine(db_url)
    insp = reflection.Inspector.from_engine(engine)
    return insp.get_table_names()

@app.task
def get_columns(db_url, table_name):
    engine = create_engine(db_url)
    insp = reflection.Inspector.from_engine(engine)
    columns = get_serializable_columns(insp, table_name)
    return columns

def get_serializable_columns(insp, table_name):
    columns = insp.get_columns(table_name)
    for column in columns:
        column["type"] = str(column["type"])
    return columns


def hit_webhook(obj):
    requests.post('http://localhost:4000/api/v1/completed_query', data = obj)


def alchemyencoder(obj):
    if isinstance(obj, datetime.date):
        return obj.isoformat()
    elif isinstance(obj, decimal.Decimal):
        return float(obj)
    elif isinstance(obj, RowProxy):
        return obj.values()

def save_results_to_redis(key, columns, data, expiry):
    total_count = len(data)
    expiry = int(expiry)
    total_pages = math.ceil(total_count/per_page_results)
    pipe = redis_obj.pipeline()
    for i in range(total_pages):
        d = data[(i*per_page_results): ((i+1)*per_page_results)]
        pipe.setex(key + "::" + str(i+1), json.dumps(d, default=alchemyencoder), expiry)
    pipe.setex(key + "::" +  "total_results", total_count, expiry)
    pipe.setex(key + "::" +  "columns", json.dumps(columns), expiry)
    pipe.setex(key + "::" +  "per_page_results", per_page_results, expiry)
    pipe.execute()
    return True

def get_result_object(query_key):
    return {
        "query_key" : query_key,
        "columns" : query_key + "::" + "columns",
        "total_results_key" : query_key + "::" +  "total_results",
        "per_page_results_key" : query_key + "::" + "per_page_results"
    }

def sha_key(key):
    dk = hashlib.new("sha256")
    dk.update(key.encode('utf-8'))
    return dk.hexdigest()

def get_connection(db_url):
    key = sha_key(db_url) 
    if connections.get(key):
        return connections[key]
    else:
        engine = create_engine(db_url)
        connection = engine.connect()
        connections[key] = connection
        return connection



