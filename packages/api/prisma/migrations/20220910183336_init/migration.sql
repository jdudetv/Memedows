-- CreateEnum
CREATE TYPE "TwitchSubscription" AS ENUM ('Tier1', 'Tier2', 'Tier3', 'Prime');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('Audio', 'Video');

-- CreateTable
CREATE TABLE "User" (
    "twitchId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "votes" INTEGER NOT NULL DEFAULT 0,
    "timeouts" INTEGER NOT NULL DEFAULT 0,
    "subscription" "TwitchSubscription",

    CONSTRAINT "User_pkey" PRIMARY KEY ("twitchId")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,
    "redemptions" INTEGER NOT NULL DEFAULT 0,
    "type" "MediaType" NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JoshStats" (
    "id" SERIAL NOT NULL,
    "pushupsCompleted" INTEGER NOT NULL DEFAULT 0,
    "pushupsTotal" INTEGER NOT NULL DEFAULT 0,
    "squatsCompleted" INTEGER NOT NULL DEFAULT 0,
    "squatsTotal" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "JoshStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SecretBit" (
    "bit" INTEGER NOT NULL,
    "state" BOOLEAN NOT NULL,

    CONSTRAINT "SecretBit_pkey" PRIMARY KEY ("bit")
);
