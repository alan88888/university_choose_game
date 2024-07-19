from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import logging
import pymysql
from transformers import pipeline

logging.basicConfig(level=logging.DEBUG)

app = FastAPI()
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

def get_adj():
    try:
        conn = connect_to_mysql()
        with conn.cursor() as cursor:
            cursor.execute("SELECT adj FROM adj_table")
            adj = cursor.fetchall()
        data = [data[0] for data in adj]
        return data
    except Exception as e:
        logging.error(f"Failed to fetch locations from database: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch locations from database")

class DialogData(BaseModel):
    dialog: str

classifier = pipeline("zero-shot-classification", model="MoritzLaurer/mDeBERTa-v3-base-mnli-xnli")
def save_dialog_to_sequence(dialog: str):
    sequence_to_classify=""
    sequence_to_classify += dialog + " "
    print(sequence_to_classify.strip())
    return sequence_to_classify
#sequence_to_classify="這是一個測試"
candidate_labels = []
def analysis(sequence_to_classify:str):
    output = classifier(sequence_to_classify, get_adj(), multi_label=False)
    print(output)

#force_download = True 強迫再次下載model
#"接受陌生人加入隊伍"
#要跑30s, 會根據label影響速度, if label less than 10, run 10s
#結果是dict, 由大至小排
#要載transformrs and pytorch