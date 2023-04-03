/*
  Warnings:

  - You are about to drop the column `privacity` on the `User` table. All the data in the column will be lost.
  - Added the required column `private` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "privacity",
ADD COLUMN     "private" BOOLEAN NOT NULL;
