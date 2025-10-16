#!/bin/bash

echo "🚀 Tests de l'API Fastify"
echo "========================="
echo ""

BASE_URL="http://localhost:3000"

# 1. Signup
echo "1️⃣  Test Signup (création de compte)..."
SIGNUP_RESPONSE=$(curl -s -X POST $BASE_URL/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","username":"testuser"}')

echo "Réponse: $SIGNUP_RESPONSE"
echo ""

# 2. Login et récupération du token
echo "2️⃣  Test Login (connexion)..."
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}')

# Extraire le token (simple grep)
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Réponse: $LOGIN_RESPONSE"
echo ""
echo "🔑 Token récupéré: $TOKEN"
echo ""

# 3. Créer un post SANS token (doit échouer)
echo "3️⃣  Test POST /posts SANS token (doit échouer avec 401)..."
RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST $BASE_URL/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Mon post","content":"Contenu","published":true}')

echo "$RESPONSE"
echo ""

# 4. Créer un post AVEC token (doit réussir)
echo "4️⃣  Test POST /posts AVEC token (doit réussir avec 201)..."
RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST $BASE_URL/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Mon premier post","content":"Contenu du post","published":true}')

echo "$RESPONSE"
echo ""

# 5. Créer un autre post avec MAUVAIS token (doit échouer)
echo "5️⃣  Test POST /posts avec MAUVAIS token (doit échouer avec 401)..."
RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST $BASE_URL/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer faux_token_invalide_123" \
  -d '{"title":"Un autre post","content":"Contenu","published":true}')

echo "$RESPONSE"
echo ""

# 6. Récupérer tous les posts (route publique)
echo "6️⃣  Test GET /posts (route publique, sans token)..."
RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" $BASE_URL/posts)
echo "$RESPONSE"
echo ""

# 7. Voir mon profil SANS token (doit échouer)
echo "7️⃣  Test GET /me SANS token (doit échouer avec 401)..."
RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" $BASE_URL/me)
echo "$RESPONSE"
echo ""

# 8. Voir mon profil AVEC token (doit réussir)
echo "8️⃣  Test GET /me AVEC token (doit réussir avec 200)..."
RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" $BASE_URL/me \
  -H "Authorization: Bearer $TOKEN")

echo "$RESPONSE"
echo ""

echo "✅ Tests terminés !"
echo ""
echo "📝 Résumé:"
echo "- Routes publiques (signup, login, GET posts) : fonctionnent sans token"
echo "- Routes protégées (POST/PUT/DELETE posts, /me) : nécessitent un token"
echo "- Token invalide ou absent : erreur 401"

