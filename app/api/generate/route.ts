import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log("=== TEST SIMPLE API ===");
  
  try {
    const { prompt } = await request.json();
    console.log("Prompt reçu:", prompt);
    
    // HTML de test
    const html = `<!DOCTYPE html>
<html>
<head>
  <title>${prompt}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="p-6 bg-gray-100">
  <h1 class="text-4xl font-bold text-blue-600">${prompt}</h1>
  <p class="mt-4 text-gray-700">Ceci est un test de l'API Elina AI</p>
  <p class="mt-2 text-sm text-gray-500">API Status: Fonctionnelle</p>
</body>
</html>`;
    
    return NextResponse.json({
      success: true,
      html: html,
      hasAI: false,
      message: "Test simple - pas d'IA pour l'instant",
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erreur de test" },
      { status: 500 }
    );
  }
}
