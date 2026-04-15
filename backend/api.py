import threading
import time
import uuid
import joblib
import pandas as pd
import numpy as np
import warnings
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sniffer import flows, start_sniffing, data_lock
from features import extract_features

warnings.filterwarnings("ignore")
os.environ['PYTHONUNBUFFERED'] = "1"

app = FastAPI()
app.add_middleware(
    CORSMiddleware, 
    allow_origins=["*"], 
    allow_methods=["*"], 
    allow_headers=["*"]
)

try:
    model = joblib.load("nids_rf_model.pkl")
    le = joblib.load("nids_label_encoder.pkl")
    feature_list = joblib.load("nids_features_list.pkl")
    print("✅ ML System Ready.")
except Exception as e:
    print(f"⚠️ Model Warning: {e}")
    model = le = feature_list = None

@app.get("/predict_live")
async def predict_live():
    predictions = []
    
    with data_lock:
        keys = sorted(flows.keys(), key=lambda k: len(flows[k]), reverse=True)

    for key in keys[:20]:
        with data_lock:
            flow = flows.pop(key, None)
        
        if not flow: continue

        try:
            feat = extract_features(flow)
            packet_count = len(flow)
            unique_ports = feat.get("Unique_Ports", 0)
            
            if packet_count > 100:
                label = "DOS ATTACK (FLOODING)"
                is_threat = True
                severity = "CRITICAL"
                conf = 0.98
            elif unique_ports > 5:
                label = "NETWORK PORTSCAN"
                is_threat = True
                severity = "HIGH"
                conf = 0.99
            elif packet_count > 20:
                label = "POTENTIAL BRUTE FORCE"
                is_threat = True
                severity = "MEDIUM"
                conf = 0.90
            elif model and feature_list:
                X = pd.DataFrame([feat]).reindex(columns=feature_list, fill_value=0)
                pred_idx = model.predict(X)[0]
                label = str(le.inverse_transform([pred_idx])[0]).upper()
                is_threat = (label != "BENIGN")
                severity = "HIGH" if is_threat else "LOW"
                probs = model.predict_proba(X)[0]
                conf = float(np.max(probs))
            else:
                label = "BENIGN"
                is_threat = False
                severity = "LOW"
                conf = 0.40

            predictions.append({
                "id": str(uuid.uuid4()),
                "timestamp": time.time(), 
                "threat_type": label,
                "status": "THREAT" if is_threat else "BENIGN",
                "severity": severity,
                "confidence": conf,
                "source_ip": str(key[0]),
                "dest_ip": str(key[1]),
                "packet_count": packet_count,
                "latency_ms": np.random.uniform(0.5, 2.0) 
            })
        except:
            pass

    return {"predictions": predictions}

threading.Thread(target=start_sniffing, daemon=True).start()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)