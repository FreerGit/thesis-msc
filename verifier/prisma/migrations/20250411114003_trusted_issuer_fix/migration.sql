/*
  Warnings:

  - You are about to drop the column `didDocument` on the `TrustedIssuer` table. All the data in the column will be lost.
  - You are about to drop the column `keyType` on the `TrustedIssuer` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `TrustedIssuer` table. All the data in the column will be lost.
  - You are about to drop the column `publicKey` on the `TrustedIssuer` table. All the data in the column will be lost.
  - You are about to drop the column `validFrom` on the `TrustedIssuer` table. All the data in the column will be lost.
  - You are about to drop the column `validTo` on the `TrustedIssuer` table. All the data in the column will be lost.
  - You are about to drop the column `verificationMethod` on the `TrustedIssuer` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TrustedIssuer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "did" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_TrustedIssuer" ("createdAt", "did", "id", "name", "updatedAt") SELECT "createdAt", "did", "id", "name", "updatedAt" FROM "TrustedIssuer";
DROP TABLE "TrustedIssuer";
ALTER TABLE "new_TrustedIssuer" RENAME TO "TrustedIssuer";
CREATE UNIQUE INDEX "TrustedIssuer_did_key" ON "TrustedIssuer"("did");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
