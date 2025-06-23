import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { ArrowLeft, Send, User, Bot, Stethoscope, AlertCircle, CheckCircle, Clock, Download } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';
import { generateMockResponse, mockSessionData } from '../mock/mockData';
import { useToast } from '../hooks/use-toast';

const Chat = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [sessionId] = useState(mockSessionData.sessionId);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Carica il profilo utente dal localStorage
    const savedProfile = localStorage.getItem('medagent_profile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }

    // Messaggio di benvenuto
    const welcomeMessage = {
      id: Date.now(),
      type: 'assistant',
      message: 'Ciao! Sono il tuo assistente sanitario MedAgent. Ho già le informazioni che hai fornito e sono qui per aiutarti a capire meglio come stai. Iniziamo parlando del tuo sintomo principale. Come ti senti in questo momento?',
      timestamp: new Date().toISOString(),
      urgencyLevel: 'low'
    };
    
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simula il typing delay
    setTimeout(() => {
      const mockResponse = generateMockResponse(inputMessage, messages);
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        message: mockResponse.message,
        urgencyLevel: mockResponse.urgencyLevel,
        nextQuestions: mockResponse.nextQuestions,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickReply = (question) => {
    setInputMessage(question);
  };

  const handleFinishEvaluation = () => {
    // Salva la conversazione per la pagina risultati
    localStorage.setItem('medagent_conversation', JSON.stringify(messages));
    localStorage.setItem('medagent_session', JSON.stringify({
      sessionId,
      startTime: mockSessionData.startTime,
      endTime: new Date().toISOString(),
      messageCount: messages.length
    }));
    navigate('/risultato');
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
      case 'high': return <AlertCircle className="h-4 w-4" />;
      case 'medium': return <Clock className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col">
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
              <Badge variant="outline" className="bg-blue-50">
                Sessione: {sessionId.slice(-8)}
              </Badge>
              <Link to="/valutazione">
                <Button variant="ghost" className="flex items-center">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Modifica profilo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        {/* Sidebar con profilo utente */}
        <div className="w-80 bg-white/60 backdrop-blur-sm border-r p-6 space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center">
                <User className="h-5 w-5 mr-2" />
                Il tuo profilo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {userProfile && (
                <>
                  {userProfile.eta && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Età:</span>
                      <span className="text-sm font-medium">{userProfile.eta}</span>
                    </div>
                  )}
                  {userProfile.genere && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Genere:</span>
                      <span className="text-sm font-medium">{userProfile.genere}</span>
                    </div>
                  )}
                  {userProfile.sintomoPrincipale && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Sintomo:</span>
                      <span className="text-sm font-medium">{userProfile.sintomoPrincipale}</span>
                    </div>
                  )}
                  {userProfile.durata && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Durata:</span>
                      <span className="text-sm font-medium">{userProfile.durata}</span>
                    </div>
                  )}
                  {userProfile.intensita && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Intensità:</span>
                      <span className="text-sm font-medium">{userProfile.intensita[0]}/10</span>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          <Alert className="border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 text-sm">
              Ricorda: questo strumento non fornisce diagnosi mediche. In caso di emergenza, chiama il 118.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <Button 
              onClick={handleFinishEvaluation}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              disabled={messages.length < 3}
            >
              <Download className="h-4 w-4 mr-2" />
              Termina valutazione
            </Button>
            <p className="text-xs text-gray-500 text-center">
              Completa almeno 2 scambi per ottenere i risultati
            </p>
          </div>
        </div>

        {/* Area chat principale */}
        <div className="flex-1 flex flex-col">
          {/* Messaggi */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-6">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-2xl ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                    <div className={`flex items-start space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        message.type === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
                      }`}>
                        {message.type === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                      </div>
                      <div className={`flex-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                        <div className={`inline-block p-4 rounded-2xl ${
                          message.type === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white shadow-lg border'
                        }`}>
                          <p className="text-sm leading-relaxed">{message.message}</p>
                        </div>
                        
                        {/* Livello di urgenza per messaggi dell'assistente */}
                        {message.type === 'assistant' && message.urgencyLevel && (
                          <div className="mt-2">
                            <Badge className={`${getUrgencyColor(message.urgencyLevel)} text-xs`}>
                              {getUrgencyIcon(message.urgencyLevel)}
                              <span className="ml-1">
                                {message.urgencyLevel === 'high' ? 'Attenzione' : 
                                 message.urgencyLevel === 'medium' ? 'Monitoraggio' : 'Normale'}
                              </span>
                            </Badge>
                          </div>
                        )}

                        {/* Domande suggerite */}
                        {message.type === 'assistant' && message.nextQuestions && (
                          <div className="mt-4 space-y-2">
                            <p className="text-xs text-gray-500">Domande suggerite:</p>
                            {message.nextQuestions.map((question, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuickReply(question)}
                                className="text-xs hover:bg-blue-50 hover:border-blue-300"
                              >
                                {question}
                              </Button>
                            ))}
                          </div>
                        )}
                        
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Indicatore di typing */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-2xl">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-500 text-white flex items-center justify-center">
                        <Bot className="h-5 w-5" />
                      </div>
                      <div className="bg-white shadow-lg border p-4 rounded-2xl">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input area */}
          <div className="border-t bg-white/80 backdrop-blur-sm p-6">
            <div className="flex space-x-4">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Scrivi qui il tuo messaggio..."
                className="flex-1 h-12 text-base"
                disabled={isTyping}
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 px-6"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Premi Invio per inviare • Ctrl+Invio per andare a capo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;