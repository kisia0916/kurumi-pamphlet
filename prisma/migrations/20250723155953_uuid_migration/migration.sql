-- CreateEnum
CREATE TYPE "FoodStatus" AS ENUM ('AVAILABLE', 'FEW', 'SOLDOUT');

-- CreateEnum
CREATE TYPE "FoodCategory" AS ENUM ('MAIN', 'SUB', 'DESSERT');

-- CreateEnum
CREATE TYPE "BuildingStatus" AS ENUM ('hard', 'middle', 'empty');

-- CreateEnum
CREATE TYPE "PinType" AS ENUM ('Building', 'Room');

-- CreateTable
CREATE TABLE "FoodData" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "category" "FoodCategory" NOT NULL,
    "photo" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "status" "FoodStatus" NOT NULL,
    "allergens" TEXT[],

    CONSTRAINT "FoodData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeTableContents" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "place" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "info" TEXT NOT NULL,
    "photo" TEXT NOT NULL,

    CONSTRAINT "TimeTableContents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StampPlace" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "maplink" TEXT NOT NULL,
    "place" TEXT NOT NULL,

    CONSTRAINT "StampPlace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserStamps" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "stamps" TEXT[],
    "exchanged" BOOLEAN NOT NULL,

    CONSTRAINT "UserStamps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Buildings" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "status" "BuildingStatus" NOT NULL,
    "picture" TEXT NOT NULL,

    CONSTRAINT "Buildings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Floor" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "building_id" TEXT NOT NULL,
    "floor_num" INTEGER NOT NULL,

    CONSTRAINT "Floor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Projects" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "tag" TEXT[],
    "picture" TEXT NOT NULL,
    "floor_id" TEXT NOT NULL,
    "building_id" TEXT NOT NULL,

    CONSTRAINT "Projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MapPin" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "PinType" NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "building_id" TEXT,
    "project_id" TEXT,

    CONSTRAINT "MapPin_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Floor" ADD CONSTRAINT "Floor_building_id_fkey" FOREIGN KEY ("building_id") REFERENCES "Buildings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Projects" ADD CONSTRAINT "Projects_floor_id_fkey" FOREIGN KEY ("floor_id") REFERENCES "Floor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Projects" ADD CONSTRAINT "Projects_building_id_fkey" FOREIGN KEY ("building_id") REFERENCES "Buildings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MapPin" ADD CONSTRAINT "MapPin_building_id_fkey" FOREIGN KEY ("building_id") REFERENCES "Buildings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MapPin" ADD CONSTRAINT "MapPin_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
