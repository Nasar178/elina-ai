echo "=== VÉRIFICATION POST-DÉPLOIEMENT ==="
echo "Test à: $(date)"
echo ""
RESPONSE=$(curl -s -X POST "https://elina-ai.vercel.app/api/generate" \
  -H "Content-Type: application/json" \
  -d '{"prompt":"page de login"}' \
  -w "HTTP Status: %{http_code}")
echo "$RESPONSE" | jq .
echo ""
echo "Logs récents:"
vercel logs elina-ai.vercel.app --limit=5 2>/dev/null | grep -A5 -B5 "NOUVELLE VERSION\|Bonsai"
