-- CreateEnum
CREATE TYPE "Language" AS ENUM ('en', 'fa');

-- CreateEnum
CREATE TYPE "Theme" AS ENUM ('SYSTEM', 'LIGHT', 'DARK');

-- CreateEnum
CREATE TYPE "MaintenanceCategory" AS ENUM ('ENGINE', 'FILTERS', 'FLUIDS', 'BRAKES', 'TIRES', 'ELECTRICAL', 'SUSPENSION', 'TRANSMISSION', 'COOLING', 'EXTERIOR', 'INSPECTION', 'OTHER');

-- CreateEnum
CREATE TYPE "ExpenseCategory" AS ENUM ('MAINTENANCE', 'REPAIR', 'PARTS', 'TIRES', 'FUEL', 'INSURANCE', 'OTHER');

-- CreateEnum
CREATE TYPE "ReminderType" AS ENUM ('DATE', 'ODOMETER', 'COMBINED');

-- CreateEnum
CREATE TYPE "ReminderStatus" AS ENUM ('PENDING', 'TRIGGERED', 'DISMISSED', 'COMPLETED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "avatar_url" TEXT,
    "preferred_language" "Language" NOT NULL DEFAULT 'en',
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "theme" "Theme" NOT NULL DEFAULT 'SYSTEM',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER,
    "trim" TEXT,
    "fuel_type" TEXT,
    "transmission" TEXT,
    "plate_number" TEXT,
    "vin" TEXT,
    "current_odometer" INTEGER NOT NULL DEFAULT 0,
    "image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenance_items" (
    "id" TEXT NOT NULL,
    "vehicle_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "MaintenanceCategory" NOT NULL DEFAULT 'OTHER',
    "description" TEXT,
    "interval_km" INTEGER,
    "interval_days" INTEGER,
    "last_service_date" DATE,
    "last_service_odometer" INTEGER,
    "next_service_date" DATE,
    "next_service_odometer" INTEGER,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "maintenance_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenance_records" (
    "id" TEXT NOT NULL,
    "vehicle_id" TEXT NOT NULL,
    "maintenance_item_id" TEXT,
    "service_date" DATE NOT NULL,
    "odometer" INTEGER NOT NULL,
    "cost" DECIMAL(14,0),
    "provider" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "maintenance_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "odometer_records" (
    "id" TEXT NOT NULL,
    "vehicle_id" TEXT NOT NULL,
    "odometer" INTEGER NOT NULL,
    "recorded_at" DATE NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "odometer_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expenses" (
    "id" TEXT NOT NULL,
    "vehicle_id" TEXT NOT NULL,
    "category" "ExpenseCategory" NOT NULL DEFAULT 'MAINTENANCE',
    "amount" DECIMAL(14,0) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'TOMAN',
    "date" DATE NOT NULL,
    "description" TEXT,
    "maintenance_record_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reminders" (
    "id" TEXT NOT NULL,
    "vehicle_id" TEXT NOT NULL,
    "maintenance_item_id" TEXT NOT NULL,
    "reminder_type" "ReminderType" NOT NULL,
    "trigger_date" DATE,
    "trigger_odometer" INTEGER,
    "status" "ReminderStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reminders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "vehicles_user_id_idx" ON "vehicles"("user_id");

-- CreateIndex
CREATE INDEX "maintenance_items_vehicle_id_enabled_idx" ON "maintenance_items"("vehicle_id", "enabled");

-- CreateIndex
CREATE INDEX "maintenance_records_vehicle_id_service_date_idx" ON "maintenance_records"("vehicle_id", "service_date");

-- CreateIndex
CREATE INDEX "maintenance_records_maintenance_item_id_idx" ON "maintenance_records"("maintenance_item_id");

-- CreateIndex
CREATE INDEX "odometer_records_vehicle_id_recorded_at_idx" ON "odometer_records"("vehicle_id", "recorded_at");

-- CreateIndex
CREATE INDEX "odometer_records_odometer_idx" ON "odometer_records"("odometer");

-- CreateIndex
CREATE UNIQUE INDEX "expenses_maintenance_record_id_key" ON "expenses"("maintenance_record_id");

-- CreateIndex
CREATE INDEX "expenses_vehicle_id_date_idx" ON "expenses"("vehicle_id", "date");

-- CreateIndex
CREATE INDEX "reminders_vehicle_id_status_idx" ON "reminders"("vehicle_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "reminders_maintenance_item_id_key" ON "reminders"("maintenance_item_id");

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_items" ADD CONSTRAINT "maintenance_items_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_records" ADD CONSTRAINT "maintenance_records_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_records" ADD CONSTRAINT "maintenance_records_maintenance_item_id_fkey" FOREIGN KEY ("maintenance_item_id") REFERENCES "maintenance_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "odometer_records" ADD CONSTRAINT "odometer_records_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_maintenance_record_id_fkey" FOREIGN KEY ("maintenance_record_id") REFERENCES "maintenance_records"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_maintenance_item_id_fkey" FOREIGN KEY ("maintenance_item_id") REFERENCES "maintenance_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
