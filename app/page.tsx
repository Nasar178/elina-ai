"use client";

import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [generatedHtml, setGeneratedHtml] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateApp = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      
      if (data.success) {
        setGeneratedHtml(data.html);
      } else {
        alert(`Erreur: ${data.error}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la génération');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'elina-ai-app.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-10 md:mb-16 pt-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🚀 Elina AI
          </h1>
          <p className="text-gray-600 text-lg md:text-xl">
            Générateur d'applications web intelligent
          </p>
        </header>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-3 text-lg">
              Décrivez votre application :
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Exemple: 'Je veux créer un portfolio pour photographe avec galerie d'images et formulaire de contact'"
              className="w-full p-4 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none resize-none h-40"
              rows={4}
            />
          </div>

          <button
            onClick={generateApp}
            disabled={isLoading || !prompt.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-xl hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-6 w-6 mr-3 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Génération en cours...
              </span>
            ) : (
              '✨ Générer l\'application'
            )}
          </button>

          {/* Quick Templates */}
          <div className="mt-8">
            <p className="text-gray-600 mb-4 font-medium">Templates rapides :</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { emoji: '🎨', text: 'Portfolio', prompt: 'portfolio développeur web moderne' },
                { emoji: '🛒', text: 'E-commerce', prompt: 'boutique en ligne de vêtements' },
                { emoji: '📝', text: 'Blog', prompt: 'blog de cuisine française' },
                { emoji: '🍝', text: 'Restaurant', prompt: 'site restaurant italien avec menu' }
              ].map((template, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setPrompt(template.prompt);
                    generateApp();
                  }}
                  className="flex flex-col items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <span className="text-2xl mb-2">{template.emoji}</span>
                  <span className="font-medium">{template.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Section */}
        {generatedHtml && (
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
                🎯 Application générée
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={handleCopy}
                  className="px-5 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  {copied ? '✅ Copié!' : '📋 Copier le code'}
                </button>
                <button
                  onClick={handleDownload}
                  className="px-5 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  💾 Télécharger
                </button>
              </div>
            </div>

            {/* Preview */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 text-gray-700">Prévisualisation :</h3>
              <div className="border-2 border-gray-300 rounded-xl overflow-hidden bg-white">
                <div className="bg-gray-100 px-4 py-3 border-b flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Preview</span>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>
                <div className="h-[500px]">
                  <iframe
                    srcDoc={generatedHtml}
                    className="w-full h-full border-0"
                    title="Generated App Preview"
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>
              </div>
            </div>

            {/* Code */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-700">Code source HTML :</h3>
              <div className="relative">
                <textarea
                  value={generatedHtml}
                  readOnly
                  className="w-full h-[300px] font-mono text-sm p-4 bg-gray-900 text-gray-100 rounded-xl resize-none focus:outline-none"
                  spellCheck="false"
                />
                <div className="absolute bottom-4 right-4 text-gray-400 text-sm">
                  {generatedHtml.length.toLocaleString()} caractères
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500">
          <p className="text-lg">
            ✨ Généré avec ❤️ par Elina AI
          </p>
          <p className="mt-2 text-sm">
            Une application 100% fonctionnelle • Déployable immédiatement
          </p>
        </footer>
      </div>
    </div>
  );
}
