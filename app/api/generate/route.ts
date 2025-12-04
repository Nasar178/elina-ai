import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    
    // Génère un code HTML simple
    const htmlCode = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>${prompt.substring(0, 50)}...</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 p-8">
    <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl font-bold text-gray-800 mb-6">Application générée par Elina AI</h1>
        <p class="text-gray-600 mb-8">Basée sur : "${prompt}"</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white p-6 rounded-xl shadow">
                <h2 class="text-xl font-bold mb-4">Fonctionnalité 1</h2>
                <p>Votre application inclura cette fonctionnalité.</p>
            </div>
            <div class="bg-white p-6 rounded-xl shadow">
                <h2 class="text-xl font-bold mb-4">Fonctionnalité 2</h2>
                <p>Une autre fonctionnalité utile pour votre projet.</p>
            </div>
        </div>
        
        <div class="mt-8 p-4 bg-blue-50 rounded-lg">
            <p class="text-blue-800">🎉 Cette application a été générée automatiquement par Elina AI !</p>
        </div>
    </div>
</body>
</html>`;

    return NextResponse.json({
      success: true,
      html: htmlCode,
      message: "Application générée avec succès !"
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erreur de génération" },
      { status: 500 }
    );
  }
}
