/*
  Warnings:

  - The primary key for the `OAuthAccount` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `provider` on the `OAuthAccount` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "OAuthProviders" AS ENUM ('google', 'github', 'discord');

-- AlterTable
ALTER TABLE "OAuthAccount" DROP CONSTRAINT "OAuthAccount_pkey",
DROP COLUMN "provider",
ADD COLUMN     "provider" "OAuthProviders" NOT NULL,
ADD CONSTRAINT "OAuthAccount_pkey" PRIMARY KEY ("provider", "providerId");

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verifyToken" TEXT,
ADD COLUMN     "verifyTokenExpires" TIMESTAMP(3);

-- DropEnum
DROP TYPE "OAuthProvider";
