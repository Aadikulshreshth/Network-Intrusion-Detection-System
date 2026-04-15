# 🚀 Network Intrusion Detection System (NIDS)

A real-time Network Intrusion Detection System built using **Machine Learning (Random Forest)** with a **FastAPI backend** and **Next.js frontend dashboard**.

---

## 📌 Overview

This project monitors live network traffic, extracts features, and classifies flows as **BENIGN or THREAT** using a trained ML model based on the **CIC-IDS-2017 dataset**.

---

## ⚙️ Tech Stack

* **Backend:** FastAPI (Python)
* **Frontend:** Next.js + Tailwind CSS
* **State Management:** Zustand
* **ML Model:** Random Forest (scikit-learn)
* **Packet Processing:** Scapy (Multi-threaded Ingestion)
* **Data:** CIC-IDS-2017
* **Deployment:** ngrok

---

## 🔥 Features

* 📡 Real-time traffic sniffing
* 🧠 ML-based intrusion detection
* ⚡ Live predictions API
* 📊 Interactive dashboard (charts + logs)
* 🔄 Auto polling from frontend
* 🌐 ngrok public endpoint support
* 🔍 XAI Integration: Uses SHAP values to explain predictions

---

## 🧠 Detection Logic

Our system uses a **Hybrid Detection Pipeline** for maximum efficiency:

1. **Heuristic Tier**

   * High-speed rule-based detection
   * Examples:

     * DoS → more than 100 packets
     * Port Scan → more than 5 unique ports

2. **ML Tier**

   * Random Forest classifier trained on CIC-IDS-2017
   * Detects complex attack patterns

3. **Priority Engine**

   * Flows sorted by packet density
   * High-severity threats processed with minimal latency

---

## 📂 Project Structure

```
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

## 📦 Model Download (IMPORTANT)

The trained model is not included due to size limitations.

Download it from:
https://drive.google.com/uc?id=1HF5gDrxY99h2YLllnDL_I-t16OVluKcH

Place the files inside:

```
backend/
```

Required files:

* `nids_rf_model.pkl`
* `nids_label_encoder.pkl`
* `nids_features_list.pkl`

---

## 🖥️ Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

### Run Server

```bash
python -m uvicorn api:app --reload
```

### ⚠️ Linux / WSL Users

Scapy requires root privileges:

```bash
sudo python api.py
```

---

## 🌐 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open:

```
http://localhost:3000
```

---

## 🌍 Connect via ngrok

```bash
ngrok http 8000
```

Copy the HTTPS URL and paste into frontend settings:

```
https://your-ngrok-url.ngrok-free.dev
```

⚠️ Note: Increase polling interval in frontend settings to handle ngrok latency.

---

## 🔗 API Endpoints

| Endpoint        | Method | Description        |
| --------------- | ------ | ------------------ |
| `/health`       | GET    | Check API status   |
| `/predict_live` | GET    | Get predictions    |
| `/live_detect`  | GET    | Raw detection data |

---

## 🧪 Testing the NIDS

Run these from another terminal (Linux/WSL):

### 🔥 DoS Simulation

```bash
sudo hping3 -S -p 80 --flood [YOUR_IP]
```

### 🔍 Port Scan

```bash
sudo nmap -sS --top-ports 100 [YOUR_IP]
```

### 🔐 Brute Force Simulation

```bash
sudo hping3 -S -p 80 --count 50 --interval u50000 [YOUR_IP]
```

---

## ⚠️ Notes

* Model files are not included due to size limits
* Do not upload `.pkl` files to GitHub
* Run backend before frontend
* Use ngrok for frontend-backend connection

---

## 👨‍💻 Author

**Aadi Kulshreshth**

---

## ⭐ Future Improvements

* SHAP visualization enhancements
* Docker deployment
* Cloud hosting (AWS / Render)
* Real-time alert system

---

## 📌 License

This project is for educational purposes.
