import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Configuration BONSAI
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.trybons.ai/v1',
}) : null;

export async function POST(request: NextRequest) {
  console.log("🚀 API /generate appelée");
  
  try {
    const { prompt } = await request.json();
    
    console.log("📝 Prompt:", prompt);
    console.log("🔑 Bonsai configuré?:", openai ? "OUI" : "NON");
    
    let html = '';
    let usedAI = false;
    let errorMessage = '';
    
    // Essayer Bonsai si configuré
    if (openai) {
      try {
        console.log("🤖 Tentative avec Bonsai AI...");
        
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo", // GPT-4 si disponible sur Bonsai
          messages: [
            { 
              role: "system", 
              content: "Génère UNIQUEMENT du code HTML/CSS/JS valide avec Tailwind CSS. Réponds seulement avec le code, pas d'explications." 
            },
            { 
              role: "user", 
              content: `Crée une page HTML pour: ${prompt}. Utilise Tailwind CSS via CDN. Code en français.` 
            }
          ],
          temperature: 0.7,
          max_tokens: 1500,
        });
        
        html = completion.choices[0]?.message?.content || '';
        usedAI = true;
        console.log("✅ Bonsai réussi! HTML généré:", html.length, "caractères");
        
      } catch (error: any) {
        errorMessage = error.message;
        console.error("❌ Erreur Bonsai:", errorMessage);
        usedAI = false;
      }
    }
    
    // Fallback template si Bonsai échoue
    if (!html || !usedAI) {
      console.log("🔄 Fallback au template");
      html = `<!DOCTYPE html>
<html>
<head>
  <title>${prompt}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="p-6">
  <h1 class="text-3xl font-bold">${prompt}</h1>
  <p>Généré par Elina AI ${usedAI ? 'avec Bonsai AI' : 'avec template'}</p>
</body>
</html>`;
    }
    
    return NextResponse.json({
      success: true,
      html: html,
      hasAI: usedAI,
      message: usedAI ? "Généré avec Bonsai AI" : "Généré avec template"
    });

  } catch (error) {
    console.error("❌ Erreur API:", error);
    return NextResponse.json(
      { success: false, error: "Erreur interne" },
      { status: 500 }
    );
  }
}
