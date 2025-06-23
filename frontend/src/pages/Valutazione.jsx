import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Checkbox } from '../components/ui/checkbox';
import { Slider } from '../components/ui/slider';
import { ArrowLeft, ArrowRight, Stethoscope, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';

const Valutazione = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    eta: '',
    genere: '',
    sintomoPrincipale: '',
    durata: '',
    intensita: [5],
    sintomiAssociati: [],
    condizioniNote: [],
    familiarita: ''
  });

  const sintomiComuni = [
    'Febbre', 'Mal di testa', 'Dolore toracico', 'Dolore addominale', 'Nausea', 
    'Vomito', 'Diarrea', 'Costipazione', 'Tosse', 'Difficoltà respiratorie',
    'Dolore muscolare', 'Dolore articolare', 'Rash cutaneo', 'Prurito',
    'Vertigini', 'Svenimento', 'Ansia', 'Insonnia', 'Stanchezza'
  ];

  const condizioniMediche = [
    'Asma', 'Diabete', 'Ipertensione', 'Ipotiroidismo', 'Ipertiroidismo',
    'Malattie cardiache', 'Allergie', 'Artrite', 'Depressione', 'Ansia'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Salva i dati in localStorage per simulare il passaggio al chat
    localStorage.setItem('medagent_profile', JSON.stringify(formData));
    navigate('/chat');
  };

  const handleSintomiAssociatiChange = (sintomo, checked) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        sintomiAssociati: [...prev.sintomiAssociati, sintomo]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        sintomiAssociati: prev.sintomiAssociati.filter(s => s !== sintomo)
      }));
    }
  };

  const handleCondizioniChange = (condizione, checked) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        condizioniNote: [...prev.condizioniNote, condizione]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        condizioniNote: prev.condizioniNote.filter(c => c !== condizione)
      }));
    }
  };

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
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Iniziamo la tua{' '}
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              valutazione
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Fornisci alcune informazioni di base per personalizzare la tua esperienza. 
            Tutti i campi sono opzionali e possono essere modificati durante il dialogo.
          </p>
        </div>

        <Alert className="mb-8 border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Importante:</strong> MedAgent non fornisce diagnosi mediche. 
            In caso di emergenza, contatta immediatamente il 118 o recati al pronto soccorso.
          </AlertDescription>
        </Alert>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-8">
            <CardTitle className="text-2xl text-center text-gray-900">
              Profilo di Valutazione
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Informazioni di base */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="eta" className="text-lg font-medium">Età</Label>
                  <Select value={formData.eta} onValueChange={(value) => setFormData(prev => ({...prev, eta: value}))}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Seleziona la tua fascia d'età" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="<12">Sotto i 12 anni</SelectItem>
                      <SelectItem value="12-18">12-18 anni</SelectItem>
                      <SelectItem value="19-30">19-30 anni</SelectItem>
                      <SelectItem value="31-50">31-50 anni</SelectItem>
                      <SelectItem value="51-70">51-70 anni</SelectItem>
                      <SelectItem value=">70">Oltre 70 anni</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="genere" className="text-lg font-medium">Genere</Label>
                  <Select value={formData.genere} onValueChange={(value) => setFormData(prev => ({...prev, genere: value}))}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Seleziona il genere" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maschio">Maschio</SelectItem>
                      <SelectItem value="femmina">Femmina</SelectItem>
                      <SelectItem value="altro">Altro</SelectItem>
                      <SelectItem value="preferisco-non-dire">Preferisco non dire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Sintomo principale */}
              <div className="space-y-2">
                <Label htmlFor="sintomoPrincipale" className="text-lg font-medium">Sintomo principale</Label>
                <Input
                  id="sintomoPrincipale"
                  value={formData.sintomoPrincipale}
                  onChange={(e) => setFormData(prev => ({...prev, sintomoPrincipale: e.target.value}))}
                  placeholder="es. febbre, mal di testa, dolore addominale..."
                  className="h-12 text-lg"
                />
              </div>

              {/* Durata e intensità */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="durata" className="text-lg font-medium">Durata del sintomo</Label>
                  <Select value={formData.durata} onValueChange={(value) => setFormData(prev => ({...prev, durata: value}))}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Da quanto tempo?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-giorno">1 giorno</SelectItem>
                      <SelectItem value="2-3-giorni">2-3 giorni</SelectItem>
                      <SelectItem value="piu-3-giorni">Più di 3 giorni</SelectItem>
                      <SelectItem value="cronico">Cronico (settimane/mesi)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label className="text-lg font-medium">Intensità percepita</Label>
                  <div className="px-4">
                    <Slider
                      value={formData.intensita}
                      onValueChange={(value) => setFormData(prev => ({...prev, intensita: value}))}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>Lieve (1)</span>
                      <span className="font-medium">Attuale: {formData.intensita[0]}</span>
                      <span>Grave (10)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sintomi associati */}
              <div className="space-y-4">
                <Label className="text-lg font-medium">Sintomi associati (opzionale)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {sintomiComuni.map((sintomo) => (
                    <div key={sintomo} className="flex items-center space-x-2">
                      <Checkbox
                        id={sintomo}
                        checked={formData.sintomiAssociati.includes(sintomo)}
                        onCheckedChange={(checked) => handleSintomiAssociatiChange(sintomo, checked)}
                      />
                      <Label htmlFor={sintomo} className="text-sm cursor-pointer">
                        {sintomo}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Condizioni mediche note */}
              <div className="space-y-4">
                <Label className="text-lg font-medium">Condizioni mediche già note (opzionale)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {condizioniMediche.map((condizione) => (
                    <div key={condizione} className="flex items-center space-x-2">
                      <Checkbox
                        id={condizione}
                        checked={formData.condizioniNote.includes(condizione)}
                        onCheckedChange={(checked) => handleCondizioniChange(condizione, checked)}
                      />
                      <Label htmlFor={condizione} className="text-sm cursor-pointer">
                        {condizione}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Familiarità */}
              <div className="space-y-2">
                <Label htmlFor="familiarita" className="text-lg font-medium">Familiarità o predisposizione ereditaria (opzionale)</Label>
                <Textarea
                  id="familiarita"
                  value={formData.familiarita}
                  onChange={(e) => setFormData(prev => ({...prev, familiarita: e.target.value}))}
                  placeholder="es. diabete in famiglia, malattie cardiache, allergie..."
                  className="min-h-[100px]"
                />
              </div>

              {/* Submit button */}
              <div className="flex justify-center pt-8">
                <Button 
                  type="submit" 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-12 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Inizia la conversazione
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Valutazione;