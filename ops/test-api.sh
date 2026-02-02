#!/bin/bash
# Quick API tests for shop

BASE_URL="http://localhost:3000"

echo "=== Testing Shop API ==="

# Health check
echo -n "Health check: "
curl -s "$BASE_URL/api/health" | jq -r '.status' || echo "FAIL"

# Get categories
echo -n "Categories: "
curl -s "$BASE_URL/api/categories" | jq 'length' | xargs -I{} echo "{} categories"

# Get products
echo -n "Products: "
curl -s "$BASE_URL/api/products" | jq 'length' | xargs -I{} echo "{} products"

# Payment settings
echo -n "Payment settings: "
curl -s "$BASE_URL/api/settings/payment" | jq -r '.active' || echo "FAIL"

echo "=== Done ==="
