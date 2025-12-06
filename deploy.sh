#!/bin/bash

echo "🚀 Déploiement d'Elina AI..."

# Vérification des dépendances
echo "📦 Vérification des dépendances..."
npm install

# Vérification de la clé OpenAI
if [ -z "$OPENAI_API_KEY" ]; then
  echo "⚠️  OPENAI_API_KEY non définie dans .env.local"
  echo "ℹ️  OpenAI sera désactivé, utilisation des templates"
fi

# Construction de l'application
echo "🔨 Construction de l'application..."
npm run build

# Déploiement sur Vercel
echo "🌐 Déploiement sur Vercel..."
vercel --prod

echo "✅ Déploiement terminé !"
echo "🌍 Visitez: https://elina-ai.vercel.app"
