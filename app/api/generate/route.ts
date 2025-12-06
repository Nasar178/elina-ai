import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function POST(request: NextRequest) {
  try {
    console.log("🤖 Requête reçue");
    const { prompt, appType = 'web' } = await request.json();
    
    console.log("🔑 OpenAI configuré?", openai ? "OUI" : "NON");
    
    let html = '';
    let usedAI = false;
    
    // Essayer OpenAI si disponible
    if (openai) {
      try {
        console.log("🚀 Tentative avec OpenAI...");
        
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { 
              role: "system", 
              content: "Tu es un générateur de code HTML. Réponds uniquement avec du code HTML/CSS/JS valide. Utilise Tailwind CSS via CDN. Contenu en français." 
            },
            { 
              role: "user", 
              content: `Crée une application web pour: ${prompt}. Retourne uniquement le code HTML complet.` 
            }
          ],
          temperature: 0.7,
          max_tokens: 1500,
        });
        
        html = completion.choices[0]?.message?.content || '';
        usedAI = true;
        console.log("✅ OpenAI réussi, tokens:", completion.usage?.total_tokens);
        
      } catch (aiError: any) {
        console.log("⚠️ OpenAI échoué:", aiError.message);
        usedAI = false;
      }
    }
    
    // Fallback si OpenAI échoue ou n'est pas disponible
    if (!html) {
      console.log("🔄 Utilisation du template");
      html = `<!DOCTYPE html>
<html>
<head>
  <title>${prompt}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="p-6">
  <h1 class="text-3xl font-bold">${prompt}</h1>
  <p class="mt-4">Généré par Elina AI ${usedAI ? 'avec IA' : 'avec template'}</p>
</body>
</html>`;
    }
    
    return NextResponse.json({
      success: true,
      html: html,
      hasAI: usedAI,
      message: `Application générée ${usedAI ? 'avec IA' : 'avec template'}`
    });

  } catch (error) {
    console.error("❌ Erreur API:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Erreur de génération",
        details: error instanceof Error ? error.message : "Erreur inconnue"
      },
      { status: 500 }
    );
  }
}
