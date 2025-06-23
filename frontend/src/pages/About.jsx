import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  ArrowLeft, 
  Stethoscope, 
  Brain, 
  Heart, 
  Shield, 
  Users, 
  Target,
  Lightbulb,
  Award,
  Globe
} from 'lucide-react';

const About = () => {
  const teamMembers = [
    {
      name: "Dr. Alessandro Rossi",
      role: "Direttore Medico",
      description: "Specialista in medicina digitale con 15 anni di esperienza in telemedicina",
      expertise: ["Medicina interna", "Digital health", "AI in medicina"]
    },
    {
      name: "Maria Bianchi",
      role: "Lead AI Engineer",
      description: "Esperta in intelligenza artificiale applicata alla sanità e natural language processing",
      expertise: ["Machine Learning", "NLP", "Healthcare AI"]
    },
    {
      name: "Prof. Luca Verdi",
      role: "Consulente Etico",
      description: "Bioeticista e consulente per la privacy digitale in ambito sanitario",
      expertise: ["Bioetica", "GDPR", "Privacy digitale"]
    }
  ];

  const milestones = [
    {
      year: "2023",
      title: "Concezione del progetto",
      description: "Nascita dell'idea di democratizzare l'accesso all'orientamento sanitario"
    },
    {
      year: "2024",
      title: "Sviluppo e testing",
      description: "Creazione dell'architettura AI e test con oltre 1000 utenti beta"
    },
    {
      year: "2025",
      title: "Lancio pubblico",
      description: "Rilascio della versione 1.0 con supporto multilingua e moduli specialistici"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Stethoscope className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                MedAgent
              </span>
            </Link>
            <Link to="/">
              <Button variant="ghost" className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Torna alla home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Chi siamo e{' '}
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              la nostra missione
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            MedAgent nasce dalla visione di democratizzare l'accesso all'orientamento sanitario, 
            combinando intelligenza artificiale, design etico e usabilità pragmatica per supportare 
            chiunque abbia bisogno di chiarezza nel dialogo tra cittadini e salute.
          </p>
        </div>

        {/* Missione */}
        <Card className="mb-16 border-0 shadow-xl bg-gradient-to-r from-blue-600 to-green-600 text-white">
          <CardContent className="p-12">
            <div className="text-center">
              <Target className="h-16 w-16 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-6">La nostra missione</h2>
              <p className="text-xl leading-relaxed max-w-4xl mx-auto opacity-95">
                Offrire un supporto intelligente, adattivo e accessibile a tutti quei cittadini che, 
                pur non essendo professionisti della salute, si trovano quotidianamente ad affrontare 
                problemi concreti di interpretazione sintomatica, gestione dell'ansia sanitaria e 
                comprensione delle possibili azioni da intraprendere.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Valori fondamentali */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">I nostri valori fondamentali</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-8 text-center">
                <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Intelligenza Adattiva</h3>
                <p className="text-gray-600 text-sm">
                  Ogni interazione è personalizzata e si adatta progressivamente al profilo dell'utente
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-8 text-center">
                <Heart className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Empatia Digitale</h3>
                <p className="text-gray-600 text-sm">
                  Un approccio umano e rassicurante, senza allarmismi, con supporto emotivo integrato
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-8 text-center">
                <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Privacy e Sicurezza</h3>
                <p className="text-gray-600 text-sm">
                  Conformità GDPR completa, dati pseudonimizzati e controllo totale sulla privacy
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-orange-50 to-orange-100">
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Accessibilità Universale</h3>
                <p className="text-gray-600 text-sm">
                  Progettato per essere fruibile da tutti, indipendentemente dall'alfabetizzazione digitale
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Il nostro percorso</h2>
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-center space-x-8">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {milestone.year}
                  </div>
                </div>
                <Card className="flex-1 border-0 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                    <p className="text-gray-600">{milestone.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Il nostro team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <CardHeader className="text-center pb-2">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <Badge variant="secondary" className="mx-auto">{member.role}</Badge>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-4 text-sm">{member.description}</p>
                  <div className="flex flex-wrap justify-center gap-1">
                    {member.expertise.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tecnologia */}
        <Card className="mb-16 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <Lightbulb className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
            <CardTitle className="text-3xl text-gray-900">Tecnologia all'avanguardia</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Architettura AI</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    Modelli linguistici di ultima generazione (Gemini 2.0-flash)
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    Logica multi-step adattiva con orchestrazione dinamica
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    Moduli specialistici attivabili automaticamente
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    Sistema di intent detection ottimizzato per il dominio sanitario
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Design Inclusivo</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                    Interfaccia accessibile con alto contrasto visivo
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                    Adattamento automatico basato sul profilo utente
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                    Supporto per dispositivi a bassa potenza
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                    Output duale per utenti normali e operatori sanitari
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Riconoscimenti */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Riconoscimenti e Partnership</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-8">
                <Award className="h-12 w-12 text-gold-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Digital Health Award 2024</h3>
                <p className="text-gray-600 text-sm">Miglior innovazione in AI sanitaria</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-8">
                <Globe className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Certificazione GDPR</h3>
                <p className="text-gray-600 text-sm">Conformità completa alla privacy europea</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-8">
                <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Partner ISS</h3>
                <p className="text-gray-600 text-sm">Collaborazione con Istituto Superiore di Sanità</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-600 to-green-600 text-white text-center">
          <CardContent className="p-12">
            <h2 className="text-3xl font-bold mb-6">Inizia il tuo percorso con MedAgent</h2>
            <p className="text-xl mb-8 opacity-95">
              Unisciti a migliaia di utenti che hanno già scelto MedAgent per un supporto sanitario intelligente e personalizzato
            </p>
            <Link to="/valutazione">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-12 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                Inizia la tua valutazione
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;