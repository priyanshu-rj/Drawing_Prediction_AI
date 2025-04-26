from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware 
from tensorflow.keras.models import load_model
import numpy as np
from PIL import Image
from io import BytesIO


model = load_model("model/drawing_model.h5")
with open("classname/class_names.txt", "r") as f:
    class_names = [line.strip() for line in f]


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"], 
)


def predict_image(img: Image.Image):

    img = img.convert("L").resize((28, 28))
    img_array = np.array(img)
    img_inverted = 255 - img_array  
    img_normalized = img_inverted.reshape(1, 28, 28, 1).astype("float32") / 255.0  

 
    prediction = model.predict(img_normalized)
    

    top_3_indices = prediction[0].argsort()[-3:][::-1]
    top_3_classes = [class_names[i] for i in top_3_indices]
    top_3_scores = [float(prediction[0][i]) for i in top_3_indices]
    

    return {top_3_classes[i]: top_3_scores[i] for i in range(3)}


@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    img_bytes = await file.read()  
    img = Image.open(BytesIO(img_bytes))  
    
    # Predict the image class
    predictions = predict_image(img)
    
   
    return {"predictions": predictions}


@app.get("/test_predict/")
async def test_predict():
   
    img_path = "102.png" 
    img = Image.open(img_path)  
    
  
    predictions = predict_image(img)
    
   
    return {"predictions": predictions}
