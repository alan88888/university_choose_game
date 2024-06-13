from fastapi import FastAPI
from pydantic import BaseModel
from llmfunc import save_dialog_to_sequence,analysis
import subprocess
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)
"""
def call_llmfunc_script():
    subprocess.run(["python","llmfunc.py"])
"""
class DialogData(BaseModel):
    dialog: str

@app.post("/receive-dialog")
async def receive_dialog(dialog_data: DialogData):
    dialog = dialog_data.dialog
    print(f"Successful received dialog: {dialog}")
    dialog =dialog_data.dialog
    sequence_to_classify = save_dialog_to_sequence(dialog)
    #call_llmfunc_script()
    analysis(sequence_to_classify)
    return {"message": f"Received dialog: {dialog}"}
