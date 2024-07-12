from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import logging
from typing import List
import pymysql
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

logging.basicConfig(level=logging.DEBUG)

app = FastAPI()
# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)
# MySQL
mysql_config = {
    "host": "localhost",
    "user": "root",
    "password": "a12345",
    "database": "project_db",
}

def connect_to_mysql():
    try:
        conn = pymysql.connect(**mysql_config)
        return conn
    except Exception as e:
        logging.error(f"Failed to connect to MySQL database: {e}")
        raise HTTPException(status_code=500, detail="Failed to connect to database")

# routing
@app.get("/")
def index():
    try:
        conn = connect_to_mysql()
        with conn.cursor() as cursor:
            cursor.execute("SELECT VERSION()")
            version = cursor.fetchone()
        logging.debug(f"Database connection successful! MySQL version: {version[0]}")
        return JSONResponse(content={"message": f"Database connection successful! MySQL version: {version[0]}"})
    except Exception as e:
        logging.error(f"Failed to connect to database: {e}")
        raise HTTPException(status_code=500, detail="Failed to connect to database")

# location
@app.get("/location")
def get_locations():
    try:
        conn = connect_to_mysql()
        with conn.cursor() as cursor:
            cursor.execute("SELECT DISTINCT main_campus FROM sql_school")
            locations = cursor.fetchall()
        data = [data[0] for data in locations]
        return data
    except Exception as e:
        logging.error(f"Failed to fetch locations from database: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch locations from database")

# env
@app.get("/env")
def get_envs():
    try:
        conn = connect_to_mysql()
        with conn.cursor() as cursor:
            cursor.execute("SELECT DISTINCT environment FROM sql_school")
            envs = cursor.fetchall()
        data = [data[0] for data in envs]
        return data
    except Exception as e:
        logging.error(f"Failed to fetch environments from database: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch environments from database")

# area
@app.get("/area")
def get_areas():
    try:
        conn = connect_to_mysql()
        with conn.cursor() as cursor:
            cursor.execute("SELECT DISTINCT domain_name FROM sql_combine")
            areas = cursor.fetchall()
        data = [data[0] for data in areas]
        return data
    except Exception as e:
        logging.error(f"Failed to fetch areas from database: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch areas from database")

# door
@app.get("/door")
def get_doors():
    try:
        conn = connect_to_mysql()
        with conn.cursor() as cursor:
            cursor.execute("SELECT DISTINCT discipline_name FROM sql_combine")
            doors = cursor.fetchall()
        data = [data[0] for data in doors]
        return data
    except Exception as e:
        logging.error(f"Failed to fetch doors from database: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch doors from database")

# group
@app.get("/group")
def get_groups():
    try:
        conn = connect_to_mysql()
        with conn.cursor() as cursor:
            cursor.execute("SELECT DISTINCT academic_category_name FROM sql_combine")
            groups = cursor.fetchall()
        data = [data[0] for data in groups]
        return data
    except Exception as e:
        logging.error(f"Failed to fetch groups from database: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch groups from database")

# uvicorn main:app --reload


