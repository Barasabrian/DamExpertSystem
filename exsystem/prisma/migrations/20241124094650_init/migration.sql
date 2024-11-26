-- CreateTable
CREATE TABLE "SensorData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ultrasonic" REAL NOT NULL,
    "seismic" REAL NOT NULL,
    "tilt" REAL NOT NULL,
    "load" REAL NOT NULL,
    "pressure" REAL NOT NULL,
    "sound" REAL NOT NULL,
    "status" INTEGER NOT NULL
);
