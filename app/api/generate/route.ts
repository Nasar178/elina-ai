import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialise OpenAI (seulement si la clé existe)
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function POST(request: NextRequest) {
  try {
    console.log("🤖 API Elina AI avec OpenAI...");
    
    const { prompt } = await request.json();
    
    if (!prompt) {
      return NextResponse.json(
        { success: false, error: "Le prompt est requis" },
        { status: 400 }
      );
    }
    
    console.log("📝 Prompt reçu:", prompt);
    
    // Détection du type d'application
    const lowerPrompt = prompt.toLowerCase();
    const appType = detectAppType(lowerPrompt);
    
    console.log("🎯 Type détecté:", appType);
    
    let htmlCode = '';
    
    // async function generateWithOpenAI(prompt: string, appType: 
string): Promise<string> {
  if (!openai) throw new Error("OpenAI non configuré");
  
  console.log("🔍 Début de generateWithOpenAI");
  
  // ... ton code existant ...
  
  try {
    console.log("📤 Envoi requête à OpenAI...");
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      // ... reste du code
    });
    
    console.log("📥 Réponse reçue d'OpenAI");
    console.log("Tokens utilisés:", completion.usage?.total_tokens);
    
    let html = completion.choices[0]?.message?.content || '';
    console.log("Longueur HTML reçu:", html.length);
    
    return html;
  } catch (error) {
    console.error("❌ ERREUR OpenAI détaillée:", error);
    throw error; // Important : propager l'erreur
  }
}) {
      try {
        htmlCode = await generateWithOpenAI(prompt, appType);
        console.log("✅ HTML généré avec OpenAI");
      } catch (aiError) {
        console.warn("⚠️ OpenAI échoué, fallback aux templates:", aiError);
        htmlCode = generateWithTemplate(prompt, appType);
      }
    } else {
      console.log("ℹ️ OpenAI non configuré, utilisation des templates");
      htmlCode = generateWithTemplate(prompt, appType);
    }
    
    return NextResponse.json({
      success: true,
      html: htmlCode,
      type: appType,
      message: `Application "${appType}" générée avec IA !`,
      hasAI: openai !== null
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

// Détection du type d'application
function detectAppType(prompt: string): string {
  if (prompt.includes('portfolio') || prompt.includes('cv')) return 'portfolio';
  if (prompt.includes('e-commerce') || prompt.includes('boutique') || prompt.includes('shop')) return 'ecommerce';
  if (prompt.includes('blog') || prompt.includes('article')) return 'blog';
  if (prompt.includes('restaurant') || prompt.includes('menu')) return 'restaurant';
  if (prompt.includes('dashboard') || prompt.includes('admin')) return 'dashboard';
  if (prompt.includes('forum') || prompt.includes('discussion')) return 'forum';
  if (prompt.includes('vitrine') || prompt.includes('présentation')) return 'vitrine';
  if (prompt.includes('application mobile')) return 'mobile';
  if (prompt.includes('sas') || prompt.includes('entreprise')) return 'sas';
  return 'website';
}

// Génération avec OpenAI
async function generateWithOpenAI(prompt: string, appType: string): Promise<string> {
  if (!openai) throw new Error("OpenAI non configuré");
  
  // Construire le prompt pour GPT
  const systemPrompt = `Tu es Elina AI, un assistant de génération de code HTML/CSS/JS.
Tu génères des applications web complètes, modernes et fonctionnelles.
Tu réponds UNIQUEMENT avec du code HTML valide (avec CSS et JS intégrés).
N'inclus aucune explication, seulement le code.
Utilise Tailwind CSS via CDN et des polices Google Fonts.
Le code doit être responsive et moderne.`;
  
  const userPrompt = `Génère une application web de type "${appType}" avec ce thème: "${prompt}"
  
  Exigences:
  1. Design moderne et professionnel
  2. Code HTML5 valide avec Tailwind CSS
  3. Sections pertinentes pour le type d'application
  4. Contenu en français
  5. Inclure des fonctionnalités interactives
  6. Mobile-first et responsive
  7. Inclure un header, footer et au moins 3 sections
  8. Utiliser des images d'Unsplash via CDN
  9. Ajouter des commentaires dans le code
  10. Inclure un message "Généré par Elina AI"
  
  Retourne seulement le code HTML complet.`;
  
  // Appel à l'API OpenAI
  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.7,
    max_tokens: 4000,
  });
  
  let html = completion.choices[0]?.message?.content || '';
  
  // Nettoyer le code (retirer les backticks de markdown)
  html = html.replace(/```html|```/g, '').trim();
  
  // S'assurer que c'est du HTML valide
  if (!html.includes('<!DOCTYPE html>')) {
    html = `<!DOCTYPE html>\n${html}`;
  }
  
  return html;
}

// Fallback aux templates si OpenAI échoue
function generateWithTemplate(prompt: string, appType: string): string {
  switch (appType) {
    case 'portfolio':
      return generatePortfolioTemplate(prompt);
    case 'ecommerce':
      return generateEcommerceTemplate(prompt);
    case 'blog':
      return generateBlogTemplate(prompt);
    case 'restaurant':
      return generateRestaurantTemplate(prompt);
    case 'dashboard':
      return generateDashboardTemplate(prompt);
    case 'forum':
      return generateForumTemplate(prompt);
    case 'vitrine':
      return generateVitrineTemplate(prompt);
    case 'mobile':
      return generateMobileAppTemplate(prompt);
    case 'sas':
      return generateSASTemplate(prompt);
    default:
      return generateWebsiteTemplate(prompt);
  }
}

// ============= NOUVEAUX TEMPLATES =============

// Template Forum
function generateForumTemplate(prompt: string): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Forum - ${prompt}</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
    <div class="container mx-auto p-6">
        <h1 class="text-4xl font-bold mb-2">💬 ${prompt}</h1>
        <p class="text-gray-600 mb-8">Votre forum communautaire généré par Elina AI</p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="bg-white rounded-xl shadow p-6">
                <h3 class="text-xl font-bold mb-3">Catégories</h3>
                <ul class="space-y-2">
                    <li class="p-3 bg-blue-50 rounded-lg">📢 Annonces</li>
                    <li class="p-3 bg-green-50 rounded-lg">💻 Développement</li>
                    <li class="p-3 bg-purple-50 rounded-lg">🎨 Design</li>
                </ul>
            </div>
            
            <div class="bg-white rounded-xl shadow p-6 md:col-span-2">
                <h3 class="text-xl font-bold mb-4">Dernières discussions</h3>
                <div class="space-y-4">
                    <div class="border-b pb-4">
                        <h4 class="font-bold">Comment débuter en programmation ?</h4>
                        <p class="text-gray-600 text-sm">Par Jean • 12 réponses • 5 min</p>
                    </div>
                    <div class="border-b pb-4">
                        <h4 class="font-bold">Meilleurs frameworks 2024</h4>
                        <p class="text-gray-600 text-sm">Par Marie • 24 réponses • 18 min</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="mt-8 text-center text-gray-500">
            <p>✨ Forum généré automatiquement par Elina AI</p>
        </div>
    </div>
</body>
</html>`;
}

// Template Site Vitrine
function generateVitrineTemplate(prompt: string): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>${prompt} - Site Vitrine</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gradient-to-br from-blue-50 to-purple-50">
    <div class="max-w-6xl mx-auto p-6">
        <h1 class="text-5xl font-bold text-center mb-4">🏢 ${prompt}</h1>
        <p class="text-center text-gray-600 text-xl mb-10">Votre site vitrine professionnel généré par Elina AI</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
                <h2 class="text-3xl font-bold mb-6">Présentation</h2>
                <p class="text-gray-700 text-lg mb-6">
                    Nous sommes spécialisés dans ${prompt.toLowerCase()}. 
                    Notre mission est de fournir des services de qualité avec une approche innovante.
                </p>
                <ul class="space-y-3 text-gray-700">
                    <li class="flex items-center">✓ Service personnalisé</li>
                    <li class="flex items-center">✓ Expertise professionnelle</li>
                    <li class="flex items-center">✓ Résultats garantis</li>
                </ul>
            </div>
            
            <div class="bg-white rounded-2xl shadow-xl p-8">
                <h3 class="text-2xl font-bold mb-6">📞 Contactez-nous</h3>
                <form class="space-y-4">
                    <input type="text" placeholder="Votre nom" class="w-full p-3 border rounded-lg">
                    <input type="email" placeholder="Votre email" class="w-full p-3 border rounded-lg">
                    <textarea placeholder="Votre message" rows="4" class="w-full p-3 border rounded-lg"></textarea>
                    <button type="submit" class="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700">
                        Envoyer le message
                    </button>
                </form>
            </div>
        </div>
        
        <div class="mt-16 text-center">
            <div class="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-full font-bold">
                ✨ Site généré par Elina AI
            </div>
        </div>
    </div>
</body>
</html>`;
}

// Template Application Mobile
function generateMobileAppTemplate(prompt: string): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>${prompt} - App Mobile</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <style>
        @media (max-width: 640px) {
            .mobile-frame {
                max-width: 375px;
                margin: 0 auto;
                border-radius: 40px;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                overflow: hidden;
                position: relative;
            }
        }
    </style>
</head>
<body class="bg-gray-900">
    <div class="container mx-auto p-6">
        <h1 class="text-3xl font-bold text-white mb-2">📱 ${prompt}</h1>
        <p class="text-gray-400 mb-8">Interface d'application mobile générée par Elina AI</p>
        
        <div class="mobile-frame bg-white">
            <!-- Barre de statut -->
            <div class="bg-gray-800 text-white p-4 flex justify-between">
                <span>9:41</span>
                <div class="flex space-x-1">
                    <span>📶</span>
                    <span>🔋</span>
                </div>
            </div>
            
            <!-- Contenu de l'app -->
            <div class="p-6">
                <h2 class="text-2xl font-bold mb-6">Bienvenue</h2>
                
                <div class="space-y-4">
                    <div class="flex items-center p-4 bg-blue-50 rounded-xl">
                        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                            <span class="text-blue-600 text-2xl">📊</span>
                        </div>
                        <div>
                            <h3 class="font-bold">Tableau de bord</h3>
                            <p class="text-gray-600 text-sm">Vue d'ensemble de vos données</p>
                        </div>
                    </div>
                    
                    <div class="flex items-center p-4 bg-green-50 rounded-xl">
                        <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                            <span class="text-green-600 text-2xl">🔔</span>
                        </div>
                        <div>
                            <h3 class="font-bold">Notifications</h3>
                            <p class="text-gray-600 text-sm">12 nouvelles notifications</p>
                        </div>
                    </div>
                    
                    <div class="flex items-center p-4 bg-purple-50 rounded-xl">
                        <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                            <span class="text-purple-600 text-2xl">⚙️</span>
                        </div>
                        <div>
                            <h3 class="font-bold">Paramètres</h3>
                            <p class="text-gray-600 text-sm">Personnalisez l'application</p>
                        </div>
                    </div>
                </div>
                
                <!-- Barre de navigation -->
                <div class="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-around">
                    <button class="text-blue-600">🏠</button>
                    <button class="text-gray-400">🔍</button>
                    <button class="text-gray-400">➕</button>
                    <button class="text-gray-400">💬</button>
                    <button class="text-gray-400">👤</button>
                </div>
            </div>
        </div>
        
        <div class="mt-8 text-center text-gray-500">
            <p>✨ Application mobile générée par Elina AI</p>
            <div class="flex justify-center space-x-4 mt-4">
                <button class="px-4 py-2 bg-green-600 text-white rounded-lg">Télécharger iOS</button>
                <button class="px-4 py-2 bg-blue-600 text-white rounded-lg">Télécharger Android</button>
            </div>
        </div>
    </div>
</body>
</html>`;
}

// Template SAS (Software as a Service)
function generateSASTemplate(prompt: string): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>${prompt} - Plateforme SaaS</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gradient-to-br from-gray-50 to-gray-100">
    <div class="min-h-screen">
        <!-- Navigation -->
        <nav class="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
            <div class="container mx-auto px-6 py-4 flex justify-between items-center">
                <div class="flex items-center space-x-2">
                    <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded"></div>
                    <span class="font-bold text-xl">${prompt.split(' ')[0]}</span>
                </div>
                <div class="hidden md:flex space-x-8">
                    <a href="#" class="font-medium">Fonctionnalités</a>
                    <a href="#" class="font-medium">Tarifs</a>
                    <a href="#" class="font-medium">Documentation</a>
                    <a href="#" class="font-medium">Contact</a>
                </div>
                <button class="bg-black text-white px-6 py-2 rounded-lg font-medium">
                    Essai gratuit
                </button>
            </div>
        </nav>

        <!-- Hero -->
        <section class="py-20 md:py-32">
            <div class="container mx-auto px-6 text-center">
                <h1 class="text-4xl md:text-6xl font-bold mb-6">
                    ${prompt}
                    <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">.SaaS</span>
                </h1>
                <p class="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
                    La plateforme tout-en-un pour ${prompt.toLowerCase()}. 
                    Augmentez votre productivité de 200% avec nos outils intelligents.
                </p>
                <div class="flex flex-col md:flex-row justify-center gap-4">
                    <button class="bg-black text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 text-lg">
                        🚀 Démarrer l'essai gratuit
                    </button>
                    <button class="border-2 border-gray-300 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 text-lg">
                        📺 Voir la démo
                    </button>
                </div>
            </div>
        </section>

        <!-- Features -->
        <section class="py-20">
            <div class="container mx-auto px-6">
                <h2 class="text-3xl font-bold text-center mb-4">Fonctionnalités puissantes</h2>
                <p class="text-gray-600 text-center mb-16 max-w-2xl mx-auto">
                    Tout ce dont vous avez besoin pour transformer votre workflow
                </p>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div class="bg-white p-8 rounded-2xl shadow-lg">
                        <div class="text-4xl mb-4">🤖</div>
                        <h3 class="text-xl font-bold mb-4">IA Intégrée</h3>
                        <p class="text-gray-600">Automatisez vos tâches avec notre intelligence artificielle avancée.</p>
                    </div>
                    
                    <div class="bg-white p-8 rounded-2xl shadow-lg">
                        <div class="text-4xl mb-4">📊</div>
                        <h3 class="text-xl font-bold mb-4">Analytics en temps réel</h3>
                        <p class="text-gray-600">Suivez vos performances avec des tableaux de bord personnalisables.</p>
                    </div>
                    
                    <div class="bg-white p-8 rounded-2xl shadow-lg">
                        <div class="text-4xl mb-4">🔒</div>
                        <h3 class="text-xl font-bold mb-4">Sécurité Entreprise</h3>
                        <p class="text-gray-600">Données cryptées et conformité RGPD garanties.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Pricing -->
        <section class="py-20 bg-white">
            <div class="container mx-auto px-6">
                <h2 class="text-3xl font-bold text-center mb-4">Tarifs transparents</h2>
                <p class="text-gray-600 text-center mb-12">Choisissez le plan qui correspond à vos besoins</p>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <div class="border rounded-2xl p-8">
                        <h3 class="text-2xl font-bold mb-4">Starter</h3>
                        <div class="mb-6">
                            <span class="text-4xl font-bold">29€</span>
                            <span class="text-gray-600">/mois</span>
                        </div>
                        <ul class="space-y-3 mb-8">
                            <li>✓ 1 utilisateur</li>
                            <li>✓ 10GB stockage</li>
                            <li>✓ Support de base</li>
                        </ul>
                        <button class="w-full border-2 border-black text-black py-3 rounded-lg font-bold">
                            Commencer
                        </button>
                    </div>
                    
                    <div class="border-2 border-black rounded-2xl p-8 bg-black text-white">
                        <div class="inline-block px-4 py-1 bg-white text-black rounded-full text-sm font-bold mb-4">
                            POPULAIRE
                        </div>
                        <h3 class="text-2xl font-bold mb-4">Pro</h3>
                        <div class="mb-6">
                            <span class="text-4xl font-bold">79€</span>
                            <span class="text-gray-400">/mois</span>
                        </div>
                        <ul class="space-y-3 mb-8">
                            <li>✓ 10 utilisateurs</li>
                            <li>✓ 100GB stockage</li>
                            <li>✓ Support prioritaire</li>
                            <li>✓ Fonctionnalités avancées</li>
                        </ul>
                        <button class="w-full bg-white text-black py-3 rounded-lg font-bold">
                            Essai gratuit 14 jours
                        </button>
                    </div>
                    
                    <div class="border rounded-2xl p-8">
                        <h3 class="text-2xl font-bold mb-4">Enterprise</h3>
                        <div class="mb-6">
                            <span class="text-4xl font-bold">Contact</span>
                        </div>
                        <ul class="space-y-3 mb-8">
                            <li>✓ Utilisateurs illimités</li>
                            <li>✓ Stockage illimité</li>
                            <li>✓ Support 24/7</li>
                            <li>✓ Personnalisation complète</li>
                        </ul>
                        <button class="w-full border-2 border-black text-black py-3 rounded-lg font-bold">
                            Nous contacter
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="bg-gray-900 text-white py-12">
            <div class="container mx-auto px-6 text-center">
                <p class="text-gray-400">© 2024 ${prompt}. Tous droits réservés.</p>
                <p class="mt-4 text-gray-500">
                    🚀 Plateforme SaaS générée par Elina AI • 
                    <span class="text-green-400">Serveur: 99.9% uptime</span>
                </p>
            </div>
        </footer>
    </div>
</body>
</html>`;
}

// Template Website générique
function generateWebsiteTemplate(prompt: string): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>${prompt}</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
    <div class="min-h-screen">
        <nav class="bg-white shadow">
            <div class="container mx-auto px-6 py-4">
                <div class="flex justify-between items-center">
                    <h1 class="text-2xl font-bold">${prompt.split(' ')[0]}</h1>
                    <div class="space-x-6">
                        <a href="#" class="text-gray-600 hover:text-blue-600">Accueil</a>
                        <a href="#" class="text-gray-600 hover:text-blue-600">Services</a>
                        <a href="#" class="text-gray-600 hover:text-blue-600">Contact</a>
                    </div>
                </div>
            </div>
        </nav>
        
        <main class="container mx-auto px-6 py-16">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold mb-6">Bienvenue sur ${prompt}</h2>
                <p class="text-gray-600 text-lg max-w-2xl mx-auto">
                    Ce site a été généré automatiquement par Elina AI. Personnalisez-le selon vos besoins.
                </p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div class="bg-white p-8 rounded-xl shadow-lg">
                    <h3 class="text-2xl font-bold mb-4">✨ Fonctionnalités</h3>
                    <ul class="space-y-3 text-gray-700">
                        <li class="flex items-center">
                            <span class="mr-3">✅</span>
                            Design responsive moderne
                        </li>
                        <li class="flex items-center">
                            <span class="mr-3">✅</span>
                            Optimisé pour le référencement
                        </li>
                        <li class="flex items-center">
                            <span class="mr-3">✅</span>
                            Sécurité intégrée
                        </li>
                    </ul>
                </div>
                
                <div class="bg-white p-8 rounded-xl shadow-lg">
                    <h3 class="text-2xl font-bold mb-4">🎯 Avantages</h3>
                    <p class="text-gray-700 mb-4">
                        Notre solution vous permet de démarrer rapidement avec un site web professionnel.
                    </p>
                    <button class="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700">
                        Découvrir plus
                    </button>
                </div>
            </div>
            
            <div class="mt-20 text-center">
                <div class="inline-flex items-center space-x-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-full">
                    <span>🚀</span>
                    <span class="font-bold">Généré par Elina AI</span>
                    <span>✨</span>
                </div>
            </div>
        </main>
    </div>
</body>
</html>`;
}

// ============= ANCIENS TEMPLATES (simplifiés pour rester dans les limites) =============

function generatePortfolioTemplate(prompt: string): string {
  return `<!DOCTYPE html><html><head><title>Portfolio</title><script src="https://cdn.tailwindcss.com"></script></head><body class="p-6"><h1 class="text-3xl font-bold">🎨 ${prompt}</h1><p class="mt-4">Portfolio généré par Elina AI</p></body></html>`;
}

function generateEcommerceTemplate(prompt: string): string {
  return `<!DOCTYPE html><html><head><title>Boutique</title><script src="https://cdn.tailwindcss.com"></script></head><body class="p-6"><h1 class="text-3xl font-bold">🛒 ${prompt}</h1><p class="mt-4">Boutique générée par Elina AI</p></body></html>`;
}

function generateBlogTemplate(prompt: string): string {
  return `<!DOCTYPE html><html><head><title>Blog</title><script src="https://cdn.tailwindcss.com"></script></head><body class="p-6"><h1 class="text-3xl font-bold">📝 ${prompt}</h1><p class="mt-4">Blog généré par Elina AI</p></body></html>`;
}

function generateRestaurantTemplate(prompt: string): string {
  return `<!DOCTYPE html><html><head><title>Restaurant</title><script src="https://cdn.tailwindcss.com"></script></head><body class="p-6"><h1 class="text-3xl font-bold">🍽️ ${prompt}</h1><p class="mt-4">Restaurant généré par Elina AI</p></body></html>`;
}

function generateDashboardTemplate(prompt: string): string {
  return `<!DOCTYPE html><html><head><title>Dashboard</title><script src="https://cdn.tailwindcss.com"></script></head><body class="p-6"><h1 class="text-3xl font-bold">📊 ${prompt}</h1><p class="mt-4">Dashboard généré par Elina AI</p></body></html>`;
}
