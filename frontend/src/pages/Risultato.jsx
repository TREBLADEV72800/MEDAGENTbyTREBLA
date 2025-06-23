import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Separator } from '../components/ui/separator';
import { Alert, AlertDescription } from '../components/ui/alert';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  User, 
  FileText, 
  Stethoscope,
  Heart,
  Shield,
  RefreshCw
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Risultato = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sessionData, setSessionData] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [conversationData, setConversationData] = useState([]);
  const [activeTab, setActiveTab] = useState('user');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSessionData();
  }, [navigate]);

  const loadSessionData = async () => {
    try {
      // Recupera l'ID sessione
      const sessionId = localStorage.getItem('medagent_session_id');
      const sessionCompleted = localStorage.getItem('medagent_session_completed');
      
      if (!sessionId) {
        navigate('/');
        return;
      }

      // Carica il riassunto della sessione dal backend
      const summaryResponse = await axios.get(`${API}/chat/summary/${sessionId}`);
      setSummaryData(summaryResponse.data);

      // Carica la conversazione
      const historyResponse = await axios.get(`${API}/chat/history/${sessionId}`);
      setConversationData(historyResponse.data);

      // Carica i dati della sessione completata
      if (sessionCompleted) {
        setSessionData(JSON.parse(sessionCompleted));
      }

    } catch (error) {
      console.error('Errore caricamento dati sessione:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare i risultati della valutazione.",
        variant: "destructive"
      });
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const getUrgencyColor = (level) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyIcon = (level) => {
    switch (level) {
      case 'high': return <AlertCircle className="h-5 w-5" />;
      case 'medium': return <Clock className="h-5 w-5" />;
      case 'low': return <CheckCircle className="h-5 w-5" />;
      default: return <CheckCircle className="h-5 w-5" />;
    }
  };

  const getUrgencyMessage = (level) => {
    switch (level) {
      case 'high': return 'Situazione che richiede attenzione immediata';
      case 'medium': return 'Situazione da monitorare - Consigliato controllo medico';
      case 'low': return 'Situazione normale - Nessuna urgenza particolare';
      default: return 'Valutazione completata';
    }
  };

  const generateUserRecommendations = (urgencyLevel, symptoms) => {
    const baseRecommendations = [
      "Continua a monitorare i tuoi sintomi",
      "Mantieni un'adeguata idratazione",
      "Riposa quando necessario"
    ];

    if (urgencyLevel === 'high') {
      return [
        "Contatta immediatamente il tuo medico o il 118",
        "Non ignorare i sintomi se peggiorano",
        "Tieni monitorate le tue condizioni",
        "Preparati a fornire dettagli sui tuoi sintomi"
      ];
    } else if (urgencyLevel === 'medium') {
      return [
        "Considera di contattare il tuo medico",
        "Monitora l'evoluzione dei sintomi",
        "Mantieni un diario dei sintomi",
        "Evita automedicazione senza consulto medico"
      ];
    }

    return baseRecommendations;
  };

  const generateTechnicalSummary = (summaryData, conversationData) => {
    const userMessages = conversationData.filter(msg => msg.message_type === 'user');
    const assistantMessages = conversationData.filter(msg => msg.message_type === 'assistant');
    
    return {
      clinicalNotes: [
        `Consultazione digitale completata in data ${new Date(summaryData.start_time).toLocaleDateString()}`,
        `Durata della valutazione: ${Math.floor((new Date(summaryData.end_time) - new Date(summaryData.start_time)) / 60000)} minuti`,
        `Numero di interazioni: ${userMessages.length} messaggi utente`,
        `Sintomi riferiti: ${summaryData.symptoms_mentioned.join(', ') || 'Non specificati'}`,
        `Livello di urgenza massimo rilevato: ${summaryData.max_urgency_level}`
      ],
      recommendations: [
        "Valutazione basata su auto-segnalazione del paziente",
        "Raccomandata supervisione medica per conferma diagnostica",
        "Follow-up consigliato entro 48-72 ore se sintomi persistenti",
        "Documentazione completa della conversazione disponibile"
      ],
      riskFactors: summaryData.user_profile?.condizioni_note?.length > 0 
        ? summaryData.user_profile.condizioni_note 
        : ["Nessun fattore di rischio specifico identificato"],
      followUp: "Rivalutazione consigliata se persistenza o peggioramento sintomatologico"
    };
  };

  const handleDownloadReport = () => {
    toast({
      title: "Report scaricato",
      description: "Il tuo report di valutazione è stato preparato per il download",
    });
  };

  const handleShareReport = () => {
    if (navigator.share) {
      navigator.share({
        title: 'MedAgent - Report di Valutazione',
        text: 'Ho completato una valutazione sanitaria con MedAgent',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copiato",
        description: "Il link al report è stato copiato negli appunti",
      });
    }
  };

  const handleNewEvaluation = () => {
    localStorage.removeItem('medagent_conversation');
    localStorage.removeItem('medagent_session_id');
    localStorage.removeItem('medagent_session_completed');
    localStorage.removeItem('medagent_profile');
    navigate('/valutazione');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento risultati...</p>
        </div>
      </div>
    );
  }

  if (!summaryData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Nessun risultato trovato</h2>
          <p className="text-gray-600 mb-4">Non sono stati trovati risultati di valutazione.</p>
          <Link to="/valutazione">
            <Button className="mt-4">Nuova valutazione</Button>
          </Link>
        </div>
      </div>
    );
  }

  const technicalSummary = generateTechnicalSummary(summaryData, conversationData);
  const userRecommendations = generateUserRecommendations(summaryData.max_urgency_level, summaryData.symptoms_mentioned);

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
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Valutazione completata
              </Badge>
              <Link to="/chat">
                <Button variant="ghost" className="flex items-center">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Torna alla chat
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            I tuoi{' '}
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              risultati
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ecco un riepilogo della tua valutazione con raccomandazioni personalizzate
          </p>
        </div>

        {/* Session Info */}
        <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{summaryData.session_id.slice(-8)}</div>
                <div className="text-sm text-gray-600">ID Sessione</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {new Date(summaryData.start_time).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-600">Data valutazione</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.floor((new Date(summaryData.end_time) - new Date(summaryData.start_time)) / 60000)} min
                </div>
                <div className="text-sm text-gray-600">Durata</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{summaryData.message_count}</div>
                <div className="text-sm text-gray-600">Messaggi scambiati</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Button onClick={handleDownloadReport} className="bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Scarica PDF
          </Button>
          <Button onClick={handleShareReport} variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Condividi
          </Button>
          <Button onClick={handleNewEvaluation} variant="outline" className="bg-green-50 hover:bg-green-100">
            <RefreshCw className="h-4 w-4 mr-2" />
            Nuova valutazione
          </Button>
        </div>

        {/* Results Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="user" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Per te</span>
            </TabsTrigger>
            <TabsTrigger value="technical" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Tecnico</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab per l'utente */}
          <TabsContent value="user" className="space-y-6">
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center text-2xl">
                  <Heart className="h-6 w-6 mr-3" />
                  Riassunto della tua valutazione
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Sintomi rilevati */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2 text-blue-600" />
                      Sintomi rilevati
                    </h3>
                    <div className="space-y-2">
                      {summaryData.symptoms_mentioned && summaryData.symptoms_mentioned.length > 0 ? (
                        summaryData.symptoms_mentioned.map((symptom, index) => (
                          <Badge key={index} variant="outline" className="mr-2 mb-2 p-2 text-sm">
                            {symptom}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-gray-600">Nessun sintomo specifico registrato</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600">Durata conversazione</div>
                        <div className="font-semibold">{Math.floor((new Date(summaryData.end_time) - new Date(summaryData.start_time)) / 60000)} minuti</div>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600">Urgenza rilevata</div>
                        <div className="font-semibold capitalize">{summaryData.max_urgency_level}</div>
                      </div>
                    </div>
                  </div>

                  {/* Livello di urgenza */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-green-600" />
                      Valutazione
                    </h3>
                    <Alert className={`${getUrgencyColor(summaryData.max_urgency_level)} border-l-4`}>
                      <div className="flex items-center">
                        {getUrgencyIcon(summaryData.max_urgency_level)}
                        <AlertDescription className="ml-2 font-medium">
                          {getUrgencyMessage(summaryData.max_urgency_level)}
                        </AlertDescription>
                      </div>
                    </Alert>
                  </div>
                </div>

                <Separator className="my-8" />

                {/* Raccomandazioni */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                    Cosa puoi fare
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userRecommendations.map((recommendation, index) => (
                      <div key={index} className="bg-green-50 border border-green-200 p-4 rounded-lg">
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-green-800">{recommendation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab tecnico */}
          <TabsContent value="technical" className="space-y-6">
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-t-lg">
                <CardTitle className="flex items-center text-2xl">
                  <FileText className="h-6 w-6 mr-3" />
                  Valutazione tecnica per operatori sanitari
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {/* Note cliniche */}
                <div className="space-y-4 mb-8">
                  <h3 className="text-xl font-semibold text-gray-900">Note cliniche</h3>
                  <div className="bg-gray-50 p-6 rounded-lg space-y-3">
                    {technicalSummary.clinicalNotes.map((note, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <p className="text-sm text-gray-700">{note}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fattori di rischio e Follow-up */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900">Fattori di rischio</h3>
                    <div className="space-y-2">
                      {technicalSummary.riskFactors.map((factor, index) => (
                        <div key={index} className="bg-blue-50 border border-blue-200 p-3 rounded">
                          <p className="text-sm text-blue-800">{factor}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900">Follow-up</h3>
                    <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                      <p className="text-sm text-purple-800 font-medium">
                        {technicalSummary.followUp}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator className="my-8" />

                {/* Raccomandazioni tecniche */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">Raccomandazioni cliniche</h3>
                  <div className="space-y-3">
                    {technicalSummary.recommendations.map((recommendation, index) => (
                      <div key={index} className="bg-green-50 border-l-4 border-green-400 p-4">
                        <p className="text-sm text-green-800">{recommendation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Disclaimer */}
        <Alert className="mt-8 border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Disclaimer medico:</strong> Questa valutazione è puramente informativa e non sostituisce 
            il parere di un medico qualificato. Per diagnosi e trattamenti, consulta sempre un professionista sanitario.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default Risultato;