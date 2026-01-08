#!/bin/bash
# API Testing Examples for DonorHub
# These examples demonstrate how to test all endpoints

BASE_URL="http://localhost:5000/api"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== DonorHub API Testing Examples ===${NC}\n"

# 1. Register a new user
echo -e "${BLUE}1. Register User${NC}"
REGISTER_RESPONSE=$(curl -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@donorhub.com",
    "password": "SecurePassword123",
    "name": "Admin User"
  }')

echo "$REGISTER_RESPONSE" | jq .
TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.token')
echo -e "${GREEN}Token saved: $TOKEN${NC}\n"

# 2. Login with credentials
echo -e "${BLUE}2. Login User${NC}"
LOGIN_RESPONSE=$(curl -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@donorhub.com",
    "password": "SecurePassword123"
  }')

echo "$LOGIN_RESPONSE" | jq .
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')
echo ""

# 3. Create a donor
echo -e "${BLUE}3. Create Donor${NC}"
CREATE_DONOR=$(curl -X POST "$BASE_URL/donors" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "email": "john@example.com",
    "phone": "+1-555-0123",
    "status": "active",
    "notes": "Major donor - annual gala attendee"
  }')

echo "$CREATE_DONOR" | jq .
DONOR_ID=$(echo "$CREATE_DONOR" | jq -r '.data.id')
echo -e "${GREEN}Created donor with ID: $DONOR_ID${NC}\n"

# 4. Get all donors
echo -e "${BLUE}4. Get All Donors (with pagination)${NC}"
curl -X GET "$BASE_URL/donors?limit=10&offset=0" \
  -H "Authorization: Bearer $TOKEN" | jq .
echo ""

# 5. Get all donors with search
echo -e "${BLUE}5. Search Donors by Name${NC}"
curl -X GET "$BASE_URL/donors?search=john&status=active" \
  -H "Authorization: Bearer $TOKEN" | jq .
echo ""

# 6. Get single donor with history
echo -e "${BLUE}6. Get Single Donor (with donation history)${NC}"
curl -X GET "$BASE_URL/donors/$DONOR_ID" \
  -H "Authorization: Bearer $TOKEN" | jq .
echo ""

# 7. Update donor
echo -e "${BLUE}7. Update Donor${NC}"
UPDATE_DONOR=$(curl -X PATCH "$BASE_URL/donors/$DONOR_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "active",
    "phone": "+1-555-0456",
    "notes": "Updated: Has committed to monthly giving"
  }')

echo "$UPDATE_DONOR" | jq .
echo ""

# 8. Create another donor to test filtering
echo -e "${BLUE}8. Create Another Donor${NC}"
CREATE_DONOR_2=$(curl -X POST "$BASE_URL/donors" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+1-555-0789",
    "status": "new",
    "notes": "New donor from referral"
  }')

echo "$CREATE_DONOR_2" | jq .
DONOR_ID_2=$(echo "$CREATE_DONOR_2" | jq -r '.data.id')
echo ""

# 9. Filter by status
echo -e "${BLUE}9. Filter Donors by Status${NC}"
curl -X GET "$BASE_URL/donors?status=new" \
  -H "Authorization: Bearer $TOKEN" | jq .
echo ""

# 10. Delete donor
echo -e "${BLUE}10. Delete Donor${NC}"
curl -X DELETE "$BASE_URL/donors/$DONOR_ID_2" \
  -H "Authorization: Bearer $TOKEN" | jq .
echo ""

# 11. Logout
echo -e "${BLUE}11. Logout${NC}"
curl -X POST "$BASE_URL/auth/logout" \
  -H "Authorization: Bearer $TOKEN" | jq .
echo ""

echo -e "${GREEN}=== All tests completed ===${NC}"
