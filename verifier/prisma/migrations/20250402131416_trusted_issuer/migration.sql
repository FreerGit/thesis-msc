/*
  Warnings:

  - Added the required column `didDocument` to the `TrustedIssuer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `keyType` to the `TrustedIssuer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `metadata` to the `TrustedIssuer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `TrustedIssuer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicKey` to the `TrustedIssuer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `validFrom` to the `TrustedIssuer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `validTo` to the `TrustedIssuer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `verificationMethod` to the `TrustedIssuer` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TrustedIssuer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "did" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "keyType" TEXT NOT NULL,
    "verificationMethod" TEXT NOT NULL,
    "validFrom" DATETIME NOT NULL,
    "validTo" DATETIME NOT NULL,
    "didDocument" TEXT NOT NULL,
    "metadata" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_TrustedIssuer" ("createdAt", "did", "id", "updatedAt") SELECT "createdAt", "did", "id", "updatedAt" FROM "TrustedIssuer";
DROP TABLE "TrustedIssuer";
ALTER TABLE "new_TrustedIssuer" RENAME TO "TrustedIssuer";
CREATE UNIQUE INDEX "TrustedIssuer_did_key" ON "TrustedIssuer"("did");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
