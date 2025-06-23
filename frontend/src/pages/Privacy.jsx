import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Separator } from '../components/ui/separator';
import { 
  ArrowLeft, 
  Stethoscope, 
  Shield, 
  Lock, 
  Eye, 
  Database, 
  UserCheck,
  AlertCircle,
  CheckCircle,
  Clock,
  Mail
} from 'lucide-react';

const Privacy = () => {
  const gdprRights = [
    {
      title: "Diritto di accesso",
      description: "Puoi richiedere informazioni sui dati personali che trattiamo",
      icon: <Eye className="h-5 w-5" />
    },
    {
      title: "Diritto di rettifica",
      description: "Puoi richiedere la correzione di dati inesatti o incompleti",
      icon: <UserCheck className="h-5 w-5" />
    },
    {
      title: "Diritto alla cancellazione",
      description: "Puoi richiedere l'eliminazione dei tuoi dati in determinate circostanze",
      icon: <Database className="h-5 w-5" />
    },
    {
      title: "Diritto di limitazione",
      description: "Puoi richiedere la limitazione del trattamento dei tuoi dati",
      icon: <Lock className="h-5 w-5" />
    }
  ];

  const dataTypes = [
    {
      category: "Dati di profilo",
      items: ["Età (fascia)", "Genere", "Sintomi riportati", "Intensità e durata"],
      retention: "30 giorni dopo la sessione",
      purpose: "Personalizzazione dell'esperienza"
    },
    {
      category: "Dati di conversazione", 
      items: ["Messaggi scambiati", "Timestamp", "ID sessione temporaneo"],
      retention: "7 giorni",
      purpose: "Miglioramento del servizio"
    },
    {
      category: "Dati tecnici",
      items: ["Indirizzo IP anonimizzato", "Browser", "Timestamp accesso"],
      retention: "24 ore",
      purpose: "Sicurezza e analisi di utilizzo"
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Privacy e{' '}
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Sicurezza
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            La tua privacy è la nostra priorità. Ecco come proteggiamo i tuoi dati personali 
            e garantiamo la massima sicurezza nelle tue interazioni con MedAgent.
          </p>
        </div>

        {/* Principi fondamentali */}
        <Card className="mb-8 border-0 shadow-xl bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <CardContent className="p-8">
            <div className="text-center">
              <Shield className="h-16 w-16 mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-4">I nostri principi fondamentali</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="bg-white/10 p-4 rounded-lg">
                  <Lock className="h-8 w-8 mb-3" />
                  <h3 className="font-bold mb-2">Privacy by Design</h3>
                  <p className="text-sm opacity-90">La privacy è integrata fin dalla progettazione del sistema</p>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <Database className="h-8 w-8 mb-3" />
                  <h3 className="font-bold mb-2">Minimizzazione dati</h3>
                  <p className="text-sm opacity-90">Raccogliamo solo i dati strettamente necessari</p>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <UserCheck className="h-8 w-8 mb-3" />
                  <h3 className="font-bold mb-2">Controllo utente</h3>
                  <p className="text-sm opacity-90">Hai sempre il controllo sui tuoi dati</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer medico prominente */}
        <Alert className="mb-8 border-red-200 bg-red-50">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Importante disclaimer medico:</strong> MedAgent è uno strumento di supporto educativo e orientativo. 
            Non fornisce diagnosi mediche, non sostituisce il parere di un medico qualificato e non deve essere utilizzato 
            per decisioni cliniche. In caso di emergenza medica, contatta immediatamente il 118 o recati al pronto soccorso.
          </AlertDescription>
        </Alert>

        {/* Tipi di dati trattati */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Che dati raccogliamo</h2>
          <div className="space-y-6">
            {dataTypes.map((dataType, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Database className="h-6 w-6 mr-3 text-blue-600" />
                    {dataType.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Dati inclusi:</h4>
                      <ul className="space-y-1">
                        {dataType.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-sm text-gray-600 flex items-center">
                            <CheckCircle className="h-3 w-3 text-green-600 mr-2" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Finalità:</h4>
                      <p className="text-sm text-gray-600">{dataType.purpose}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Conservazione:</h4>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-orange-600 mr-2" />
                        <p className="text-sm text-gray-600">{dataType.retention}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* I tuoi diritti GDPR */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">I tuoi diritti (GDPR)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {gdprRights.map((right, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      {right.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">{right.title}</h3>
                      <p className="text-sm text-gray-600">{right.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sicurezza tecnica */}
        <Card className="mb-12 border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Lock className="h-6 w-6 mr-3 text-green-600" />
              Misure di sicurezza
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Sicurezza tecnica</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-gray-700">Comunicazioni cifrate HTTPS/TLS</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-gray-700">Pseudonimizzazione automatica dei dati</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-gray-700">ID sessione temporanei e rotativi</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-gray-700">Cancellazione automatica programmata</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Sicurezza organizzativa</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-gray-700">Accesso limitato su base need-to-know</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-gray-700">Audit trail di tutte le operazioni</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-gray-700">Formazione continua del personale</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-gray-700">Valutazioni di impatto privacy (DPIA)</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cookie e tracking */}
        <Card className="mb-12 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Cookie e tracciamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">✅ Cookie essenziali</h4>
                <p className="text-sm text-green-700">
                  Utilizziamo solo cookie tecnici necessari per il funzionamento del servizio (gestione sessione, preferenze lingua)
                </p>
              </div>
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">❌ Nessun tracking</h4>
                <p className="text-sm text-red-700">
                  Non utilizziamo cookie di profilazione, analytics di terze parti o pixel di tracciamento
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Condivisione dati */}
        <Card className="mb-12 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Condivisione dei dati</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4 border-blue-200 bg-blue-50">
              <Shield className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Principio fondamentale:</strong> I tuoi dati sanitari non vengono mai condivisi con terze parti 
                per scopi commerciali o pubblicitari.
              </AlertDescription>
            </Alert>
            <div className="space-y-3">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                <div>
                  <strong>Provider AI (Google Gemini):</strong> Solo per l'elaborazione delle risposte, 
                  con dati pseudonimizzati e contratti specifici di protezione dati
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                <div>
                  <strong>Autorità competenti:</strong> Solo se richiesto per legge e nei limiti strettamente necessari
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                <div>
                  <strong>Consenso esplicito:</strong> Per qualsiasi altra condivisione, richiediamo sempre il tuo consenso informato
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Consenso e controllo */}
        <Card className="mb-12 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl">Il tuo controllo sui dati</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Durante l'uso:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <UserCheck className="h-4 w-4 text-blue-600 mr-2" />
                    Puoi modificare o eliminare il profilo in qualsiasi momento
                  </li>
                  <li className="flex items-center">
                    <UserCheck className="h-4 w-4 text-blue-600 mr-2" />
                    Puoi interrompere la conversazione senza salvare dati
                  </li>
                  <li className="flex items-center">
                    <UserCheck className="h-4 w-4 text-blue-600 mr-2" />
                    Puoi scegliere il livello di anonimato desiderato
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Dopo l'uso:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <UserCheck className="h-4 w-4 text-blue-600 mr-2" />
                    Cancellazione automatica dei dati secondo i tempi indicati
                  </li>
                  <li className="flex items-center">
                    <UserCheck className="h-4 w-4 text-blue-600 mr-2" />
                    Possibilità di richiedere cancellazione immediata
                  </li>
                  <li className="flex items-center">
                    <UserCheck className="h-4 w-4 text-blue-600 mr-2" />
                    Esportazione dati in formato leggibile (JSON/PDF)
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contatti per privacy */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-600 to-green-600 text-white">
          <CardContent className="p-8 text-center">
            <Mail className="h-12 w-12 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">Hai domande sulla privacy?</h2>
            <p className="text-lg mb-6 opacity-95">
              Il nostro Data Protection Officer è sempre disponibile per chiarimenti
            </p>
            <div className="space-y-2">
              <p className="text-lg font-semibold">privacy@medagent.com</p>
              <p className="opacity-90">Risponderemo entro 72 ore</p>
            </div>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {/* Footer legale */}
        <div className="text-center text-sm text-gray-600 space-y-2">
          <p>
            <strong>Ultimo aggiornamento:</strong> Gennaio 2025
          </p>
          <p>
            Questo documento è conforme al Regolamento UE 2016/679 (GDPR) e al Codice Privacy italiano (D.Lgs. 196/2003)
          </p>
          <p>
            <strong>Titolare del trattamento:</strong> MedAgent S.r.l. - Via della Salute, 123 - 00100 Roma
            <br />
            <strong>Partita IVA:</strong> 12345678901
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;