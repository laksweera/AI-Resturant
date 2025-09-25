 frontend:

cd frontend
npm install
npm run dev

backend
python -m venv venv
venv\Scripts\activate     # Windows
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
Open http://127.0.0.1:8000/docs to test /predict from Swagger UI.
