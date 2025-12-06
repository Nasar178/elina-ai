import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log("🔄 API appelée");
  
  try {
    const { prompt } = await request.json();
    
    const html = `<h1>Test: ${prompt}</h1><p>API fonctionnelle</p>`;
    
    return NextResponse.json({
      success: true,
      html: html,
      hasAI: false,
      message: "Version test"
    });
    
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erreur" },
      { status: 500 }
    );
  }
}
