import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Configuration Bonsai
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.trybons.ai/v1',
}) : null;

export async function POST(request: NextRequest) {
  console.log("=== NOUVELLE VERSION ELINA AI ===");
  console.log("Timestamp:", new Date().toISOString());
  
  try {
    const { prompt } = await request.json();
    console.log("Prompt:", prompt);
    
    let html = '';
    let usedAI = false;
    
    // Essayer Bonsai
    if (openai) {
      try {
        console.log("Tentative Bonsai...");
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { 
              role: "system", 
              content: "Génère du code HTML avec Tailwind CSS. Réponds uniquement avec du code HTML." 
            },
            { 
              role: "user", 
              content: `Crée une page HTML pour: ${prompt}. Utilise Tailwind CSS via CDN.` 
            }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        });
        
        html = completion.choices[0]?.message?.content || '';
        usedAI = true;
        console.log("Bonsai SUCCÈS - HTML généré:", html.length, "caractères");
        console.log("Extrait:", html.substring(0, 100));
        
      } catch (error: any) {
        console.log("Bonsai ÉCHEC:", error.message);
        usedAI = false;
      }
    }
    
    // Template de fallback SIMPLE
    if (!html || !usedAI) {
      console.log("Utilisation template simple");
      html = `<h1>Template fallback pour: ${prompt}</h1>`;
    }
    
    return NextResponse.json({
      success: true,
      html: html,
      hasAI: usedAI,
      message: usedAI ? "Généré avec Bonsai AI" : "Généré avec template",
      version: "2.0"
    });
    
  } catch (error) {
    console.error("Erreur globale:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
