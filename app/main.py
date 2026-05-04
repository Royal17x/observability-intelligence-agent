from groq import Groq
from fastapi import FastAPI
from app.config.config import settings


client = Groq(api_key=settings.groq_api_key)

# chat_completion = client.chat.completions.create(
#     model="llama-3.3-70b-versatile",
#     messages=[
#         {"role": "user", "content": "Hello"}
#     ],
#     max_tokens=1024 
# )

# print(chat_completion.choices[0].message.content)
app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello FastAPI"}

@app.post("/analyze")
def analyze_stat():
    return {"status:":"ok"}

