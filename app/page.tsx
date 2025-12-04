'use client';

import { useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState('');

  const handleButtonClick = (template: string) => {
    const text = `Je veux créer un ${template}`;
    setMessage(text);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      alert('Décris ton idée d\'abord !');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: message }),
      });

      const data = await response.json();
      
      if (data.success) {
        setGeneratedHtml(data.html);
        alert('🎉 Application générée ! Regarde l\'aperçu ci-dessous.');
      } else {
        alert('Erreur lors de la génération');
      }
    } catch (error) {
      alert('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const templates = [
    { icon: "🛒", title: "Boutique", desc: "E-commerce complet" },
    { icon: "📝", title: "Blog", desc: "Articles & commentaires" },
    { icon: "📊", title: "Dashboard", desc: "Graphiques & stats" },
    { icon: "🎓", title: "Cours", desc: "Plateforme éducative" },
  ];

  const downloadApp = () => {
    if (!generatedHtml) return;
    
    const blob = new Blob([generatedHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mon-app-eliai.html';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 md:p-8">
      <header className="text-center mb-8">
        <div className="text-5xl mb-4 animate-bounce">🚀</div>
        <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Elina AI
        </h1>
        <p className="text-gray-300 text-lg">Transforme tes idées en applications en quelques secondes</p>
      </header>

      <main className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-700">
          <h2 className="text-xl font-bold mb-4">💬 Décris ton application</h2>
          <textarea 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ex: Je veux créer un site pour mon restaurant avec menu, réservations et avis clients..."
            className="w-full p-4 bg-gray-900 border border-gray-700 rounded-lg text-white mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            {templates.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleButtonClick(item.title.toLowerCase())}
                className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-center transition border border-gray-700 hover:border-blue-500"
              >
                <div className="text-2xl mb-1">{item.icon}</div>
                <div className="font-bold text-sm">{item.title}</div>
              </button>
            ))}
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-bold transition-all ${
              loading 
                ? 'bg-gray-700 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg'
            }`}
          >
            {loading ? '⚡ Génération en cours...' : '🚀 Générer avec IA'}
          </button>
        </form>

        {generatedHtml && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">✨ Aperçu de ton application</h2>
              <button
                onClick={downloadApp}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium"
              >
                📥 Télécharger
              </button>
            </div>
            
            <div className="border-2 border-gray-700 rounded-xl overflow-hidden">
              <iframe
                srcDoc={generatedHtml}
                className="w-full h-96 bg-white"
                title="Aperçu de l'application"
              />
            </div>
            
            <p className="text-gray-400 text-sm mt-3">
              L'application est prête ! Télécharge le fichier HTML et ouvre-le dans ton navigateur.
            </p>
          </div>
        )}

        <div className="text-center text-gray-400">
          <p className="mb-2">🎯 Comment ça marche ?</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-gray-800/30 rounded-lg">1. Décris ton idée</div>
            <div className="p-3 bg-gray-800/30 rounded-lg">2. IA génère le code</div>
            <div className="p-3 bg-gray-800/30 rounded-lg">3. Télécharge et utilise !</div>
          </div>
        </div>
      </main>

      <footer className="mt-12 pt-6 border-t border-gray-800 text-center text-gray-500">
        <p>Fait avec ❤️ par Nasar • Powered by Next.js 14 & AI</p>
        <p className="text-xs mt-2 text-gray-600">Serveur fonctionnel sur http://localhost:3000</p>
      </footer>
    </div>
  );
}
