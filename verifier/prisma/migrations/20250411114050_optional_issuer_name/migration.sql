-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TrustedIssuer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "did" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_TrustedIssuer" ("createdAt", "did", "id", "name", "updatedAt") SELECT "createdAt", "did", "id", "name", "updatedAt" FROM "TrustedIssuer";
DROP TABLE "TrustedIssuer";
ALTER TABLE "new_TrustedIssuer" RENAME TO "TrustedIssuer";
CREATE UNIQUE INDEX "TrustedIssuer_did_key" ON "TrustedIssuer"("did");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
