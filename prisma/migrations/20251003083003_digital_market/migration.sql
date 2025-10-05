-- CreateTable
CREATE TABLE "Service" (
    "id" SERIAL NOT NULL,
    "price_usd" DOUBLE PRECISION NOT NULL,
    "price_ksa" DOUBLE PRECISION NOT NULL,
    "discount_usd" DOUBLE PRECISION NOT NULL,
    "discount_ksa" DOUBLE PRECISION NOT NULL,
    "image_url" TEXT NOT NULL,
    "brand_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceDetail" (
    "id" SERIAL NOT NULL,
    "service_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "features" TEXT NOT NULL,
    "language_id" INTEGER NOT NULL,
    "company" TEXT,

    CONSTRAINT "ServiceDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Language" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" SERIAL NOT NULL,
    "customer_name" TEXT,
    "subscription_price" DOUBLE PRECISION,
    "client_mail" TEXT,
    "phone_number" TEXT,
    "notes" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "subscription_email" TEXT NOT NULL,
    "service_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "color" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "color" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceCategory" (
    "id" SERIAL NOT NULL,
    "service_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServiceCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceTag" (
    "id" SERIAL NOT NULL,
    "service_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServiceTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryTranslation" (
    "id" SERIAL NOT NULL,
    "category_id" INTEGER NOT NULL,
    "language_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CategoryTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TagTranslation" (
    "id" SERIAL NOT NULL,
    "tag_id" INTEGER NOT NULL,
    "language_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TagTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Language_code_key" ON "Language"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceCategory_service_id_category_id_key" ON "ServiceCategory"("service_id", "category_id");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceTag_service_id_tag_id_key" ON "ServiceTag"("service_id", "tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "CategoryTranslation_category_id_language_id_key" ON "CategoryTranslation"("category_id", "language_id");

-- CreateIndex
CREATE UNIQUE INDEX "TagTranslation_tag_id_language_id_key" ON "TagTranslation"("tag_id", "language_id");

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceDetail" ADD CONSTRAINT "ServiceDetail_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceDetail" ADD CONSTRAINT "ServiceDetail_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceCategory" ADD CONSTRAINT "ServiceCategory_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceCategory" ADD CONSTRAINT "ServiceCategory_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceTag" ADD CONSTRAINT "ServiceTag_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceTag" ADD CONSTRAINT "ServiceTag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryTranslation" ADD CONSTRAINT "CategoryTranslation_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryTranslation" ADD CONSTRAINT "CategoryTranslation_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagTranslation" ADD CONSTRAINT "TagTranslation_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagTranslation" ADD CONSTRAINT "TagTranslation_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;
