import React, { useRef, useState } from "react";
import CanvasDraw from "react-canvas-draw";
import axios from "axios";
import "../home.css";

const Home = () => {
  const canvasRef = useRef(null);
  const [prediction, setPrediction] = useState(null);
  const [imageDataUrl, setImageDataUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    const drawingCanvas = canvasRef.current.canvas.drawing;

    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = 256;
    offscreenCanvas.height = 256;
    const ctx = offscreenCanvas.getContext("2d");

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 256, 256);
    ctx.drawImage(drawingCanvas, 0, 0, 256, 256);

    const smallCanvas = document.createElement("canvas");
    smallCanvas.width = 28;
    smallCanvas.height = 28;
    const smallCtx = smallCanvas.getContext("2d");
    smallCtx.drawImage(offscreenCanvas, 0, 0, 28, 28);

    const imageData = smallCtx.getImageData(0, 0, 28, 28);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      data[i] = data[i + 1] = data[i + 2] = gray;
    }
    smallCtx.putImageData(imageData, 0, 0);

    const savedImageDataUrl = smallCanvas.toDataURL("image/png");
    setImageDataUrl(savedImageDataUrl);

    smallCanvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("file", blob, "drawing.png");

      try {
        setLoading(true);
        const response = await axios.post("http://127.0.0.1:8000/predict/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setPrediction(response.data.predictions);
      } catch (error) {
        console.error("Error sending image to backend:", error);
      } finally {
        setLoading(false);
      }
    }, "image/png");
  };

  const handleErase = () => {
    canvasRef.current.clear();
    setPrediction(null);
    setImageDataUrl(null);
  };

  return (
    <div className="home-container">
      <h1 className="heading">Start Drawing</h1>
      <CanvasDraw
        ref={canvasRef}
        brushColor="black"
        brushRadius={8}
        canvasWidth={400}
        canvasHeight={400}
        style={{
          boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
          backgroundColor: "white",
        }}
      />

      <div className="button-group">
        <button className="predict-button" onClick={handleSave}>
          Predict
        </button>
        <button className="eraser-button" onClick={handleErase}>
          Erase
        </button>
      </div>

      {imageDataUrl && (
        <div className="image-preview">
          <h3>Saved Image:</h3>
          <img src={imageDataUrl} alt="Saved Drawing" width={150} height={150} />
        </div>
      )}

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Predicting...</p>
        </div>
      )}

      {prediction && (
        <div className="prediction-container">
          <h3>Top Predictions:</h3>
          <div className="prediction-list">
            {Object.entries(prediction)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([className, score]) => (
                <div className="prediction-card" key={className}>
                  <div className="label">{className}</div>
                  <div className="bar-background">
                    <div
                      className="bar-fill"
                      style={{ width: `${(score * 100).toFixed(2)}%` }}
                    ></div>
                  </div>
                  <div className="score">{(score * 100).toFixed(2)}%</div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
