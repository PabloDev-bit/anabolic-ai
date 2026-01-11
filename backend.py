from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from smolagents import CodeAgent, InferenceClientModel, DuckDuckGoSearchTool
from huggingface_hub import login

# --- CONFIGURATION IA ---
# ⚠️ Remets ton token ici
import os
from huggingface_hub import login

# On récupère le token depuis les variables sécurisées du serveur
token = os.getenv("HF_TOKEN")
if token:
    login(token)
else:
    print("⚠️ Pas de token détecté !")

model = InferenceClientModel()
search_tool = DuckDuckGoSearchTool()

# On crée l'agent (variable globale pour le garder en mémoire)
agent = CodeAgent(tools=[search_tool], model=model)

# --- CONFIGURATION API ---
app = FastAPI()

# Autoriser React à parler à Python (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # En prod, on mettrait l'URL précise du site
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Format des données reçues (JSON)
class UserRequest(BaseModel):
    query: str

@app.post("/chat")
def chat_endpoint(request: UserRequest):
    print(f"📩 Question reçue : {request.query}")
    try:
        # L'agent exécute la tâche
        response = agent.run(request.query)
        return {"response": response}
    except Exception as e:
        return {"response": f"Erreur : {str(e)}"}

# Pour lancer : uvicorn backend:app --reload