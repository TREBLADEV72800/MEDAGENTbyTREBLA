import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Heart, Brain, Shield, Users, ArrowRight, Stethoscope } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Stethoscope className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                MedAgent
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
                Chi siamo
              </Link>
              <Link to="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors">
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-green-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl lg:text-7xl font-black text-gray-900 mb-8 leading-tight">
              Un assistente digitale per{' '}
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                capire meglio
              </span>{' '}
              come stai
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              MedAgent ti guida attraverso un processo di auto-valutazione intelligente e personalizzato, 
              offrendo supporto cognitivo e orientamento sanitario con empatia e precisione.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/valutazione">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  Inizia la valutazione
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="border-2 border-gray-300 hover:border-blue-500 px-8 py-4 text-lg rounded-xl">
                Accesso educatori
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Perché scegliere MedAgent?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Un approccio innovativo che combina intelligenza artificiale, design etico e usabilità pragmatica
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Intelligenza Adattiva</h3>
                <p className="text-gray-600">
                  Ogni risposta modifica il percorso logico, creando un'esperienza personalizzata e progressiva
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Approccio Empatico</h3>
                <p className="text-gray-600">
                  Interazioni naturali e rassicuranti, senza allarmismi, con supporto emotivo integrato
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Privacy Garantita</h3>
                <p className="text-gray-600">
                  Conformità GDPR completa, dati pseudonimizzati e controllo totale sulla privacy
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-orange-50 to-orange-100">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Output Duale</h3>
                <p className="text-gray-600">
                  Spiegazioni semplici per l'utente e valutazioni tecniche per operatori sanitari
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-bold mb-8">
            Inizia il tuo percorso di salute consapevole
          </h2>
          <p className="text-xl mb-10 opacity-90">
            Nessuna diagnosi, solo supporto intelligente per comprendere meglio il tuo corpo
          </p>
          <Link to="/valutazione">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              Inizia ora gratuitamente
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Stethoscope className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold">MedAgent</span>
            </div>
            <div className="flex space-x-8">
              <Link to="/about" className="hover:text-blue-400 transition-colors">Chi siamo</Link>
              <Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy</Link>
              <a href="mailto:info@medagent.com" className="hover:text-blue-400 transition-colors">Contatti</a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 MedAgent. Tutti i diritti riservati. Questo strumento non sostituisce il parere medico professionale.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;