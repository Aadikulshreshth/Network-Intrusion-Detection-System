# 🚀 Network Intrusion Detection System (NIDS)

![Python](https://img.shields.io/badge/Python-3.10-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green?logo=fastapi)
![Next.js](https://img.shields.io/badge/Next.js-Frontend-black?logo=next.js)
![Scikit-Learn](https://img.shields.io/badge/ML-RandomForest-orange?logo=scikit-learn)
![Status](https://img.shields.io/badge/Status-Active-success)

A real-time Network Intrusion Detection System built using Machine Learning (Random Forest) with a FastAPI backend and Next.js frontend dashboard.

---

## Overview

This project monitors live network traffic, extracts features, and classifies flows as BENIGN or THREAT using a trained ML model based on the CIC-IDS-2017 dataset.

---

## Tech Stack

* Backend: FastAPI (Python)
* Frontend: Next.js + Tailwind CSS
* State Management: Zustand
* ML Model: Random Forest (scikit-learn)
* Packet Processing: Scapy (multi-threaded ingestion)
* Dataset: CIC-IDS-2017
* Deployment: ngrok

---

## Features

* Real-time network traffic sniffing
* Machine learning-based intrusion detection
* Live prediction API
* Interactive dashboard with charts and logs
* Automatic polling from frontend
* Public API access using ngrok
* SHAP-based explainability (XAI integration)

---

## Detection Logic

The system uses a hybrid detection pipeline:

1. Heuristic Tier
   High-speed rule-based detection

   * DoS: more than 100 packets
   * Port scan: more than 5 unique ports

2. ML Tier
   Random Forest classifier trained on CIC-IDS-2017
   Detects complex attack patterns

3. Priority Engine
   Flows sorted by packet density
   Ensures high-severity processing with minimal latency

---

## Project Structure

```id="k3b2pq"
NIDS_PROJECT/
│
├── backend/
│   ├── api.py
│   ├── sniffer.py
│   ├── features.py
│   ├── requirements.txt
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   ├── package.json
│
├── .gitignore
├── README.md
```

---

## Model Download

Download model files from:
https://drive.google.com/uc?id=1HF5gDrxY99h2YLllnDL_I-t16OVluKcH

Place them inside:

```
backend/
```

---

## Backend Setup

```bash id="j7nqnp"
cd backend
pip install -r requirements.txt
python -m uvicorn api:app --reload
```

### Linux / WSL

```bash id="e3d9fx"
sudo python api.py
```

---

## Frontend Setup

```bash id="0h6d8j"
cd frontend
npm install
npm run dev
```

Open:

```
http://localhost:3000
```

---

## ngrok Setup

```bash id="q3r4hf"
ngrok http 8000
```

Use the generated HTTPS URL in frontend settings.

---

## API Endpoints

| Endpoint      | Method | Description |
| ------------- | ------ | ----------- |
| /health       | GET    | API status  |
| /predict_live | GET    | Predictions |
| /live_detect  | GET    | Raw data    |

---

## Testing

```bash id="2nkj2k"
# DoS
sudo hping3 -S -p 80 --flood [YOUR_IP]

# Port scan
sudo nmap -sS --top-ports 100 [YOUR_IP]

# Brute force
sudo hping3 -S -p 80 --count 50 --interval u50000 [YOUR_IP]
```

---

## Notes

* Model files are not included due to size limits
* Do not upload `.pkl` files
* Run backend before frontend
* Use ngrok for connection

---

## Author

Aadi Kulshreshth

---

## Future Improvements

* Advanced SHAP visualization
* Docker deployment
* Cloud hosting
* Real-time alerts

---

## License

Educational use only
