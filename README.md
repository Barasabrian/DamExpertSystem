# README

A sensor data and prediction system designed to interpret dam-related sensor readings and provide actionable insights. The service integrates with the **Google Generative AI** platform and uses machine learning model predictions to assess dam status based on sensor data trends.

---

## Features

- **Sensor Data Integration**: Handles data from ultrasonic, seismic, tilt, load cell, pressure, and sound sensors.
- **ML Model Predictions**: Utilizes a pre-trained model to predict dam status (`Normal`, `Warning`, `Critical`) corresponding to integers 0, 1, and 2.
- **Automated Response Framework**: Responds to queries using predefined guidelines with keywords (`BACK`, `NEXT`, `END`).
- **Contextual Responses**: Generates responses based on user inputs, sensor data, and model predictions.

---

## Installation

### Prerequisites

- Node.js
- npm or yarn
- A database (e.g., SQLite)
- Google Generative AI SDK configured with API credentials.

### Steps

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   # Navigate to the frontend folder
   cd nextjs-gemini
   npm install

   # Navigate to the backend folder
   cd ../exsystem
   npm install
   ```

---

## Running the Application

### Backend (NestJS)

1. Configure environment variables in `exsystem/.env`:
   ```env
   GEMINI_API=AIzaSyCrYzUApm8dxwr_X9MDI9aBIlWyFrmIbGA
   DATABASE_URL="file:./dev.db"
   ```

2. Start the NestJS backend:
   ```bash
   cd exsystem
   npm run start:dev
   ```

### Frontend (Next.js)

1. Configure environment variables in `frontend/.env.local`:
   ```env
   
   ```

2. Start the Next.js frontend:
   ```bash
   cd nextjs-gemini
   npm run dev
   ```

---

## Endpoints

### Sensor Data Controller

The following endpoints are available to interact with the sensor data:

#### **Create Sensor Data**
- **Endpoint**: `POST /sensor-data`
- **Description**: Adds a new sensor data record.
- **Body**:
  ```json
  {
    "ultrasonic": 10,
    "seismic": 5,
    "tilt": 3,
    "load": 15,
    "pressure": 20,
    "sound": 8,
    "status": 1
  }
  ```
- **Response**: Newly created sensor data.

---

#### **Get All Sensor Data**
- **Endpoint**: `GET /sensor-data`
- **Description**: Retrieves all sensor data records.
- **Response**: Array of sensor data objects.

---

#### **Get Sensor Data by ID**
- **Endpoint**: `GET /sensor-data/:id`
- **Description**: Retrieves a single sensor data record by its ID.
- **Params**:
  - `id`: The ID of the sensor data record.
- **Response**: Sensor data object.

---

#### **Update Sensor Data**
- **Endpoint**: `PATCH /sensor-data/:id`
- **Description**: Updates specific fields in a sensor data record.
- **Params**:
  - `id`: The ID of the sensor data record.
- **Body**:
  ```json
  {
    "ultrasonic": 12,
    "status": 2
  }
  ```
- **Response**: Updated sensor data object.

---

#### **Delete Sensor Data**
- **Endpoint**: `DELETE /sensor-data/:id`
- **Description**: Deletes a sensor data record by its ID.
- **Params**:
  - `id`: The ID of the sensor data record.
- **Response**: Confirmation of deletion.

---

## Folder Structure

### Backend

- `src/gemini`: Contains the core logic for the **System**.
- `src/sensor-data`: Manages sensor data retrieval and storage.
- `src/prediction`: Handles ML model integration and predictions.

### Frontend

- `pages/`: Includes the main application routes.
- `components/`: Contains reusable UI components.

---

## Usage

1. **Start the Services**: Run the backend and frontend services.
2. **Access the App**: Navigate to the frontend URL (e.g., `http://localhost:3000`).
3. **Interact**: Use the app interface to query sensor data and get predictions.

---

## Response Guidelines for Gemini Service

- **BACK**: Requests clarification or more details.
- **NEXT**: Proceeds to fetch and process data or predictions.
- **END**: Concludes the response with actionable insights.

### Example Responses

- **BACK**: _"I need more details. Can you specify which sensors or the time range for the data?"_
- **NEXT**: _"I will fetch the latest data and run the prediction."_
- **END**: _"Based on the database data, the water level is 8.2."_

---

## Dependencies

### Backend
- `@nestjs`
- `@google/generative-ai`

### Frontend
- `next`
- `react`

---

