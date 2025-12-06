import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Configuration Bonsai
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.bonsai.ai/v1',
}) : null;

export async function POST(request: NextRequest) {
  console.log("🚀 API appelée");
  
  try {
    const { prompt } = await request.json();
    console.log("📝 Prompt:", prompt);
    
    let html = '';
    let usedAI = false;
    let errorMessage = '';
    
    // Essayer Bonsai si configuré
    if (openai) {
      try {
        console.log("🤖 Tentative Bonsai...");
        
        const completion = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            { 
              role: "system", 
              content: "Tu es un générateur de code HTML. Réponds 
UNIQUEMENT avec du code HTML/CSS/JS valide. Utilise Tailwind CSS via CDN. 
Contenu en français. Ne met aucun texte explicatif, seulement du code." 
            },
            { 
              role: "user", 
              content: `Crée une page HTML complète pour: ${prompt}. 
Inclus Tailwind CSS via CDN.` 
            }
          ],
          temperature: 0.7,
          max_tokens: 2000,
        });
        
        html = completion.choices[0]?.message?.content || '';
        usedAI = true;
        console.log("✅ Bonsai réussi. HTML longueur:", html.length);
        
        // Vérifier si c'est vraiment du HTML
        if (!html.includes('<!DOCTYPE') && !html.includes('<html')) {
          console.log("⚠️ Bonsai n'a pas retourné de HTML valide");
          usedAI = false;
        }
        
      } catch (error: any) {
        errorMessage = error.message;
        console.error("❌ Erreur Bonsai:", errorMessage);
        usedAI = false;
      }
    } else {
      console.log("❌ Bonsai non configuré");
    }
    
    // Fallback si échec
    if (!html || !usedAI) {
      console.log("🔄 Utilisation du template (fallback)");
      html = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${prompt}</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 min-h-screen">
    <nav class="bg-white shadow-lg">
        <div class="container mx-auto px-4 py-3">
            <div class="flex justify-between items-center">
                <h1 class="text-2xl font-bold 
text-blue-600">${prompt}</h1>
                <div class="space-x-4">
                    <a href="#" class="text-gray-700 
hover:text-blue-600">Accueil</a>
                    <a href="#" class="text-gray-700 
hover:text-blue-600">Services</a>
                    <a href="#" class="text-gray-700 
hover:text-blue-600">Contact</a>
                </div>
            </div>
        </div>
    </nav>
    
    <main class="container mx-auto px-4 py-12">
        <div class="text-center mb-12">
            <h2 class="text-4xl font-bold text-gray-800 mb-4">Bienvenue 
sur ${prompt}</h2>
            <p class="text-gray-600 text-lg max-w-2xl mx-auto">
                Ce site a été généré automatiquement par Elina AI. 
Personnalisez-le selon vos besoins.
            </p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8 mb-12">
            <div class="bg-white p-6 rounded-xl shadow-md">
                <div class="text-blue-500 text-2xl mb-4">✨</div>
                <h3 class="text-xl font-bold mb-2">Design responsive 
moderne</h3>
                <p class="text-gray-600">Adapté à tous les appareils</p>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-md">
                <div class="text-green-500 text-2xl mb-4">✅</div>
                <h3 class="text-xl font-bold mb-2">Optimisé SEO</h3>
                <p class="text-gray-600">Meilleur référencement</p>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-md">
                <div class="text-red-500 text-2xl mb-4">🔒</div>
                <h3 class="text-xl font-bold mb-2">Sécurité intégrée</h3>
                <p class="text-gray-600">Protection des données</p>
            </div>
        </div>
        
        <div class="bg-blue-50 p-8 rounded-2xl text-center">
            <h3 class="text-2xl font-bold text-blue-700 mb-4">🚀 Généré 
par Elina AI ✨</h3>
            <p class="text-blue-600">${usedAI ? 'Avec intelligence 
artificielle' : 'Avec template'}</p>
            ${errorMessage ? `<p class="text-red-500 mt-2">Erreur: 
${errorMessage}</p>` : ''}
        </div>
    </main>
    
    <footer class="bg-gray-800 text-white py-8 mt-12">
        <div class="container mx-auto px-4 text-center">
            <p>&copy; 2024 ${prompt}. Tous droits réservés.</p>
            <p class="mt-2 text-gray-400">Développé avec Next.js et 
Tailwind CSS</p>
        </div>
    </footer>
</body>
</html>`;
    }
    
    return NextResponse.json({
      success: true,
      html: html,
      hasAI: usedAI,
      message: usedAI ? "Généré avec Bonsai AI" : "Généré avec template 
(fallback)"
    });
    
  } catch (error) {
    console.error("❌ Erreur globale:", error);
    return NextResponse.json(
      { success: false, error: "Erreur de traitement" },
      { status: 500 }
    );
  }
}
