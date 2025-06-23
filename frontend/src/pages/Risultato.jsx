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
import { mockResultData } from '../mock/mockData';
import { useToast } from '../hooks/use-toast';

const Risultato = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [conversationData, setConversationData] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [activeTab, setActiveTab] = useState('user');

  useEffect(() => {
    // Carica i dati della conversazione
    const savedConversation = localStorage.getItem('medagent_conversation');
    const savedSession = localStorage.getItem('medagent_session');
    
    if (savedConversation) {
      setConversationData(JSON.parse(savedConversation));
    }
    
    if (savedSession) {
      setSessionData(JSON.parse(savedSession));
    } else {
      // Se non ci sono dati, reindirizza alla home
      navigate('/');
    }
  }, [navigate]);

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

  const handleDownloadReport = () => {
    toast({
      title: "Report scaricato",
      description: "Il tuo report di valutazione è stato scaricato come PDF",
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
    localStorage.removeItem('medagent_session');
    localStorage.removeItem('medagent_profile');
    navigate('/valutazione');
  };

  if (!sessionData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Caricamento risultati...</h2>
          <p className="text-gray-600">Se il problema persiste, inizia una nuova valutazione.</p>
          <Link to="/valutazione">
            <Button className="mt-4">Nuova valutazione</Button>
          </Link>
        </div>
      </div>
    );
  }

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
                <div className="text-2xl font-bold text-blue-600">{sessionData.sessionId.slice(-8)}</div>
                <div className="text-sm text-gray-600">ID Sessione</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {new Date(sessionData.startTime).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-600">Data valutazione</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.floor((new Date(sessionData.endTime) - new Date(sessionData.startTime)) / 60000)} min
                </div>
                <div className="text-sm text-gray-600">Durata</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{sessionData.messageCount}</div>
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
                  {mockResultData.userSummary.title}
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
                      {mockResultData.userSummary.symptoms.map((symptom, index) => (
                        <Badge key={index} variant="outline" className="mr-2 mb-2 p-2 text-sm">
                          {symptom}
                        </Badge>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600">Durata</div>
                        <div className="font-semibold">{mockResultData.userSummary.duration}</div>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600">Intensità</div>
                        <div className="font-semibold">{mockResultData.userSummary.intensity}</div>
                      </div>
                    </div>
                  </div>

                  {/* Livello di urgenza */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-green-600" />
                      Valutazione
                    </h3>
                    <Alert className={`${getUrgencyColor(mockResultData.userSummary.urgencyLevel)} border-l-4`}>
                      <div className="flex items-center">
                        {getUrgencyIcon(mockResultData.userSummary.urgencyLevel)}
                        <AlertDescription className="ml-2 font-medium">
                          {mockResultData.userSummary.urgencyMessage}
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
                    {mockResultData.userSummary.recommendations.map((recommendation, index) => (
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
                  {mockResultData.technicalSummary.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {/* Codici ICD-10 */}
                <div className="space-y-4 mb-8">
                  <h3 className="text-xl font-semibold text-gray-900">Codici ICD-10</h3>
                  <div className="flex flex-wrap gap-2">
                    {mockResultData.technicalSummary.icd10Codes.map((code, index) => (
                      <Badge key={index} variant="secondary" className="font-mono text-sm p-2">
                        {code}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator className="my-8" />

                {/* Note cliniche */}
                <div className="space-y-4 mb-8">
                  <h3 className="text-xl font-semibold text-gray-900">Note cliniche</h3>
                  <div className="bg-gray-50 p-6 rounded-lg space-y-3">
                    {mockResultData.technicalSummary.clinicalNotes.map((note, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <p className="text-sm text-gray-700">{note}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fattori di rischio */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900">Fattori di rischio</h3>
                    <div className="space-y-2">
                      {mockResultData.technicalSummary.riskFactors.map((factor, index) => (
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
                        {mockResultData.technicalSummary.followUp}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator className="my-8" />

                {/* Raccomandazioni tecniche */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">Raccomandazioni cliniche</h3>
                  <div className="space-y-3">
                    {mockResultData.technicalSummary.recommendations.map((recommendation, index) => (
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