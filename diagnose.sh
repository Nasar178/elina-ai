#!/bin/bash
echo "=== DIAGNOSTIC ELINA AI ==="
echo "1. Test API..."
RESPONSE=$(curl -s -X POST "https://elina-ai.vercel.app/api/generate" \
  -H "Content-Type: application/json" \
  -d '{"prompt":"TEST DIAG '$(date +%s)'"}')
echo "hasAI: $(echo $RESPONSE | jq -r '.hasAI')"
echo "message: $(echo $RESPONSE | jq -r '.message')"
echo "html length: $(echo $RESPONSE | jq -r '.html | length')"
echo ""
echo "2. Vérification contenu HTML..."
HTML=$(echo $RESPONSE | jq -r '.html')
if echo "$HTML" | grep -q "Généré par Elina AI"; then
  echo "✅ Contient 'Généré par Elina AI' (probablement template)"
else
  echo "❌ Ne contient PAS 'Généré par Elina AI' (probablement IA)"
fi
if echo "$HTML" | grep -q "tailwindcss.com"; then
  echo "✅ Inclut Tailwind CSS"
else
  echo "❌ N'inclut PAS Tailwind CSS"
fi
