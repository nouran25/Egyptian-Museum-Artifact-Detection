from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import cv2
import numpy as np
from io import BytesIO
from PIL import Image
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Egyptian Museum Artifact Detection API",
    description="YOLO-based artifact detection for Egyptian museum exhibits",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*"
    ],  # In production, replace with specific origins like ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load YOLO model
MODEL_PATH = "best.pt"  # Your custom trained model

try:
    model = YOLO(MODEL_PATH)
    logger.info(f"✅ YOLO model loaded successfully from {MODEL_PATH}")
except Exception as e:
    logger.error(f"❌ Failed to load YOLO model: {e}")
    model = None

# Egyptian Artifact ID mapping - 84 classes from your data.yaml
ARTIFACT_MAPPING = {
    0: "Akhenaten",
    1: "Amenhotep III",
    2: "Amenhotep III and Tiye",
    3: "Amenhotep III with Plate",
    4: "Augustus",
    5: "Bent Pyramid of King Sneferu",
    6: "Black Granite Bust of Mentuemhat",
    7: "Bust of Isis",
    8: "Clossal Head of the god Serapis",
    9: "Clossal head of Senwosret 1",
    10: "Coffin of Ahmose I",
    11: "Colossal Statue of Amenhotep III",
    12: "Colossal Statue of God Ptah",
    13: "Colossal Statue of Hormoheb",
    14: "Colossal Statue of King Senwosret IlI",
    15: "Colossal Statue of Middle Kingdom King",
    16: "Colossal Statue of Queen Hatshepsut",
    17: "Colossal Statue of Ramesses II",
    18: "Colossal Statue of Ramesses II beloved of Ptah",
    19: "Colossoi of Memnon",
    20: "Colossus of Senuseret I",
    21: "Column of Merenptah",
    22: "Granite Statue of Osiris",
    23: "Granite Statue of Tutankhamun",
    24: "Great Pyramids of Giza",
    25: "Grey Granite of Ramesses II",
    26: "Hathor Capital",
    27: "Hatshepsut face",
    28: "Head Statue of Amenhotep III",
    29: "Head Statue of Amenhotep iii",
    30: "Head of Userkaf",
    31: "Hor I",
    32: "Isis with her child",
    33: "King Amenemhat 3",
    34: "King Thutmose III",
    35: "Mask of Thuya",
    36: "Mask of Tutankhamun",
    37: "Mask of Yuya",
    38: "Menkaure Statue",
    39: "Mentuhotep Nebhetpre",
    40: "Naos of Senwosert I",
    41: "Nefertiti",
    42: "Obelsik Tip of Hatshepsut",
    43: "Offering table of Amenemhat 6",
    44: "Pyramid of Djoser",
    45: "Rhetorical Stela of King Ramesses ll",
    46: "Seated Statue of Amenhotep III",
    47: "Seated Statue of Djoser",
    48: "Seated Statue of God Sekhmet",
    49: "Seated Statue of Ramesses II",
    50: "Seated Statue of Ramesses II and God Ptah",
    51: "Seated Statue of Thutmose III",
    52: "Senwosret III",
    53: "Sphinx",
    54: "Sphinx of Amenmhat III",
    55: "Sphinx of Kings Ramesses ll - Merenptah",
    56: "Standing Statue of King Ramses II",
    57: "Standing Statue of Thutmose III",
    58: "Statue Head of Akhenaten",
    59: "Statue of Amenhotep III and God Re-Horakhty",
    60: "Statue of Amenmhat I",
    61: "Statue of Amun and King",
    62: "Statue of Ankhesenamun",
    63: "Statue of Carcala",
    64: "Statue of God Ptah Ramesses ll Goddess Sekhmet",
    65: "Statue of God Ra-Horakhty",
    66: "Statue of Khafre",
    67: "Statue of Khufu",
    68: "Statue of King Ramesses ll - Goddess Anath",
    69: "Statue of King Ramses II Grand Egyptian Museum",
    70: "Statue of King Ramses II Luxor Temple",
    71: "Statue of King Sety Il Holding Standards",
    72: "Statue of King Zoser",
    73: "Statue of Mentuhotep II",
    74: "Statue of Merenptah as standard Bearer",
    75: "Statue of Osiris",
    76: "Statue of Queen Metnoforet",
    77: "Statue of Ramesses III as standard Bearer",
    78: "Statue of Snefru",
    79: "Statue of Sobekhotep V",
    80: "Statue of Tutankhamun",
    81: "Stela of king Snefero",
    82: "bust of Ramesses II",
    83: "kneeling statue of queen hatshibsut",
}

# Confidence threshold for detection
CONFIDENCE_THRESHOLD = 0.5

logger.info(f"📋 Loaded {len(ARTIFACT_MAPPING)} Egyptian artifact classes")


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "online",
        "service": "Egyptian Museum Artifact Detection API",
        "model_loaded": model is not None,
        "model_path": MODEL_PATH,
        "num_artifacts": len(ARTIFACT_MAPPING),
        "confidence_threshold": CONFIDENCE_THRESHOLD,
    }


@app.post("/detect-artifact")
async def detect_artifact(file: UploadFile = File(...)):
    """
    Detect Egyptian artifacts in uploaded images using YOLO

    Args:
        file: Image file (JPG, PNG, etc.)

    Returns:
        JSON with artifact_id (artifact name) and confidence score
    """

    # Validate model is loaded
    if model is None:
        raise HTTPException(
            status_code=503,
            detail="YOLO model not loaded. Please check server configuration.",
        )

    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400, detail="Invalid file type. Please upload an image."
        )

    try:
        # Read image file
        contents = await file.read()
        logger.info(f"📸 Received image: {file.filename} ({len(contents)} bytes)")

        # Convert to numpy array
        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if image is None:
            raise HTTPException(
                status_code=400,
                detail="Failed to decode image. Please upload a valid image file.",
            )

        logger.info(f"🔍 Running inference on image shape: {image.shape}")

        # Run YOLO inference
        results = model(image, conf=CONFIDENCE_THRESHOLD)

        # Process results
        if len(results) == 0 or len(results[0].boxes) == 0:
            logger.info("❌ No artifacts detected in image")
            return {
                "artifact_id": None,
                "confidence": 0.0,
                "message": "No artifact detected in image. Try a clearer image or different angle.",
            }

        # Get the detection with highest confidence
        boxes = results[0].boxes
        confidences = boxes.conf.cpu().numpy()
        classes = boxes.cls.cpu().numpy().astype(int)

        logger.info(f"📊 Found {len(boxes)} detection(s)")

        # Find best detection
        best_idx = np.argmax(confidences)
        best_confidence = float(confidences[best_idx])
        best_class = int(classes[best_idx])

        # Map class to artifact name
        artifact_name = ARTIFACT_MAPPING.get(
            best_class, f"Unknown Artifact (Class {best_class})"
        )

        logger.info(f"✅ Detected: {artifact_name} (confidence: {best_confidence:.2%})")

        return {
            "artifact_id": artifact_name,
            "confidence": best_confidence,
            "class_id": best_class,
            "detections_count": len(boxes),
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Detection failed: {str(e)}")
        import traceback

        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Detection failed: {str(e)}")


@app.post("/detect-artifact-detailed")
async def detect_artifact_detailed(file: UploadFile = File(...)):
    """
    Detect artifacts with detailed information including all detections and bounding boxes

    Returns:
        JSON with all detected artifacts, their bounding boxes, and confidence scores
    """

    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    try:
        # Read and decode image
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if image is None:
            raise HTTPException(status_code=400, detail="Invalid image")

        # Run inference
        results = model(image, conf=CONFIDENCE_THRESHOLD)

        if len(results) == 0 or len(results[0].boxes) == 0:
            return {"detections": [], "count": 0, "message": "No artifacts detected"}

        # Extract all detections
        boxes = results[0].boxes
        detections = []

        for i in range(len(boxes)):
            box = boxes[i]
            class_id = int(box.cls.cpu().numpy()[0])
            confidence = float(box.conf.cpu().numpy()[0])
            bbox = box.xyxy.cpu().numpy()[0].tolist()  # [x1, y1, x2, y2]

            artifact_name = ARTIFACT_MAPPING.get(
                class_id, f"Unknown Artifact (Class {class_id})"
            )

            detections.append(
                {
                    "artifact_id": artifact_name,
                    "confidence": confidence,
                    "class_id": class_id,
                    "bbox": {
                        "x1": float(bbox[0]),
                        "y1": float(bbox[1]),
                        "x2": float(bbox[2]),
                        "y2": float(bbox[3]),
                    },
                }
            )

        # Sort by confidence (highest first)
        detections.sort(key=lambda x: x["confidence"], reverse=True)

        logger.info(f"✅ Returned {len(detections)} detection(s)")

        return {
            "detections": detections,
            "count": len(detections),
            "image_shape": {
                "height": image.shape[0],
                "width": image.shape[1],
                "channels": image.shape[2],
            },
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Detailed detection failed: {str(e)}")
        import traceback

        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/model-info")
async def model_info():
    """Get information about the loaded model and available artifacts"""
    if model is None:
        return {"loaded": False, "error": "Model not loaded"}

    return {
        "loaded": True,
        "model_path": MODEL_PATH,
        "num_classes": len(ARTIFACT_MAPPING),
        "confidence_threshold": CONFIDENCE_THRESHOLD,
        "model_type": str(type(model).__name__),
        "sample_artifacts": list(ARTIFACT_MAPPING.values())[:10],  # Show first 10
        "total_artifacts": len(ARTIFACT_MAPPING),
    }


@app.get("/artifacts")
async def list_artifacts():
    """Get complete list of all detectable artifacts"""
    artifacts_list = [
        {
            "class_id": class_id,
            "artifact_name": artifact_name,
        }
        for class_id, artifact_name in ARTIFACT_MAPPING.items()
    ]

    return {
        "artifacts": artifacts_list,
        "total": len(artifacts_list),
    }


@app.get("/artifacts/{class_id}")
async def get_artifact(class_id: int):
    """Get information about a specific artifact by class ID"""
    if class_id not in ARTIFACT_MAPPING:
        raise HTTPException(
            status_code=404, detail=f"Artifact with class_id {class_id} not found"
        )

    return {
        "class_id": class_id,
        "artifact_name": ARTIFACT_MAPPING[class_id],
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
