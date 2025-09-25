import io
import cv2
import numpy as np
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from ultralytics import YOLO
from PIL import Image

app = FastAPI()

# CORS - allow your frontend
origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load YOLO model
model = YOLO("best.pt")

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        # Read image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        image_np = np.array(image)

        # Run YOLO inference
        results = model(image_np)

        # Annotate
        annotated = results[0].plot()  # BGR numpy array
        annotated_rgb = cv2.cvtColor(annotated, cv2.COLOR_BGR2RGB)
        pil_img = Image.fromarray(annotated_rgb)

        # Convert to bytes
        img_bytes = io.BytesIO()
        pil_img.save(img_bytes, format="JPEG")
        img_bytes.seek(0)

        return StreamingResponse(img_bytes, media_type="image/jpeg")

    except Exception as e:
        return {"error": str(e)}

