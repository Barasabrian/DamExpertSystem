-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SensorData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ultrasonic" REAL NOT NULL,
    "seismic" REAL NOT NULL,
    "tilt" REAL NOT NULL,
    "load" REAL NOT NULL,
    "pressure" REAL NOT NULL,
    "sound" REAL NOT NULL,
    "status" INTEGER
);
INSERT INTO "new_SensorData" ("id", "load", "pressure", "seismic", "sound", "status", "tilt", "timestamp", "ultrasonic") SELECT "id", "load", "pressure", "seismic", "sound", "status", "tilt", "timestamp", "ultrasonic" FROM "SensorData";
DROP TABLE "SensorData";
ALTER TABLE "new_SensorData" RENAME TO "SensorData";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
