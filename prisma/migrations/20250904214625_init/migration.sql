-- CreateTable
CREATE TABLE "Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "price_usd" REAL NOT NULL,
    "price_ksa" REAL NOT NULL,
    "discount_usd" REAL NOT NULL,
    "discount_ksa" REAL NOT NULL,
    "image_url" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ProductDetail" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "product_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "features" TEXT NOT NULL,
    "language_id" INTEGER NOT NULL,
    "company" TEXT,
    CONSTRAINT "ProductDetail_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProductDetail_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "Language" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Language" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Language_code_key" ON "Language"("code");
