import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AccessibleButton } from '../components/ui/accessible-button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { AccessibleInput } from '../components/ui/accessible-input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Checkbox } from '../components/ui/checkbox';
import { Slider } from '../components/ui/slider';
import { AccessibleHeading } from '../components/ui/accessible-heading';
import { AccessibleLayout } from '../components/layout/AccessibleLayout';
import { ArrowLeft, ArrowRight, Stethoscope, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useAnnounce } from '../hooks/use-announce';

const AccessibleValutazione = () => {
  const navigate = useNavigate();
  const { announce } = useAnnounce();
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

  const [errors, setErrors] = useState({});

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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.sintomoPrincipale.trim()) {
      newErrors.sintomoPrincipale = 'Il sintomo principale è richiesto per procedere';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      announce('Ci sono errori nel modulo. Controlla i campi evidenziati.', 'assertive');
      return;
    }

    localStorage.setItem('medagent_profile', JSON.stringify(formData));
    announce('Profilo salvato. Reindirizzamento alla chat...', 'polite');
    navigate('/chat');
  };

  const handleSintomiAssociatiChange = (sintomo, checked) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        sintomiAssociati: [...prev.sintomiAssociati, sintomo]
      }));
      announce(`${sintomo} aggiunto ai sintomi associati`, 'polite');
    } else {
      setFormData(prev => ({
        ...prev,
        sintomiAssociati: prev.sintomiAssociati.filter(s => s !== sintomo)
      }));
      announce(`${sintomo} rimosso dai sintomi associati`, 'polite');
    }
  };

  const handleCondizioniChange = (condizione, checked) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        condizioniNote: [...prev.condizioniNote, condizione]
      }));
      announce(`${condizione} aggiunta alle condizioni note`, 'polite');
    } else {
      setFormData(prev => ({
        ...prev,
        condizioniNote: prev.condizioniNote.filter(c => c !== condizione)
      }));
      announce(`${condizione} rimossa dalle condizioni note`, 'polite');
    }
  };

  const handleIntensityChange = (value) => {
    setFormData(prev => ({ ...prev, intensita: value }));
    announce(`Intensità impostata a ${value[0]} su 10`, 'polite');
  };

  return (
    <AccessibleLayout>
      {/* Navigation */}
      <nav 
        className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50"
        role="navigation"
        aria-label="Navigazione principale"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link 
              to="/" 
              className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded-md p-1"
              aria-label="MedAgent - Torna alla homepage"
            >
              <Stethoscope className="h-8 w-8 text-blue-600" aria-hidden="true" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                MedAgent
              </span>
            </Link>
            <Link to="/">
              <AccessibleButton 
                variant="ghost" 
                className="flex items-center"
                aria-label="Torna alla homepage"
              >
                <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
                Torna alla home
              </AccessibleButton>
            </Link>
          </div>
        </div>
      </nav>

      <main id="main-content" role="main">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <AccessibleHeading level={1} className="text-gray-900 mb-6">
              Iniziamo la tua{' '}
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                valutazione
              </span>
            </AccessibleHeading>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Fornisci alcune informazioni di base per personalizzare la tua esperienza. 
              Tutti i campi sono opzionali tranne il sintomo principale e possono essere modificati durante il dialogo.
            </p>
          </div>

          <Alert className="mb-8 border-amber-200 bg-amber-50" role="alert">
            <AlertCircle className="h-4 w-4 text-amber-600" aria-hidden="true" />
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
              <form onSubmit={handleSubmit} className="space-y-8" noValidate>
                {/* Informazioni di base */}
                <fieldset className="space-y-6">
                  <legend className="text-lg font-semibold text-gray-900 mb-4">
                    Informazioni di base
                  </legend>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="eta" className="text-lg font-medium">
                        Età (opzionale)
                      </Label>
                      <Select 
                        value={formData.eta} 
                        onValueChange={(value) => {
                          setFormData(prev => ({...prev, eta: value}));
                          announce(`Età selezionata: ${value}`, 'polite');
                        }}
                      >
                        <SelectTrigger 
                          className="h-12"
                          aria-label="Seleziona la tua fascia d'età"
                        >
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
                      <Label htmlFor="genere" className="text-lg font-medium">
                        Genere (opzionale)
                      </Label>
                      <Select 
                        value={formData.genere} 
                        onValueChange={(value) => {
                          setFormData(prev => ({...prev, genere: value}));
                          announce(`Genere selezionato: ${value}`, 'polite');
                        }}
                      >
                        <SelectTrigger 
                          className="h-12"
                          aria-label="Seleziona il genere"
                        >
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
                </fieldset>

                {/* Sintomo principale */}
                <fieldset className="space-y-4">
                  <legend className="text-lg font-semibold text-gray-900">
                    Sintomo principale *
                  </legend>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sintomoPrincipale" className="text-lg font-medium">
                      Descrivi il tuo sintomo principale
                    </Label>
                    <AccessibleInput
                      id="sintomoPrincipale"
                      value={formData.sintomoPrincipale}
                      onChange={(e) => {
                        setFormData(prev => ({...prev, sintomoPrincipale: e.target.value}));
                        if (errors.sintomoPrincipale) {
                          setErrors(prev => ({...prev, sintomoPrincipale: ''}));
                        }
                      }}
                      placeholder="es. febbre, mal di testa, dolore addominale..."
                      className="h-12 text-lg"
                      aria-required="true"
                      aria-describedby={errors.sintomoPrincipale ? "sintomo-error" : "sintomo-help"}
                      error={errors.sintomoPrincipale}
                    />
                    {errors.sintomoPrincipale && (
                      <div id="sintomo-error" className="text-red-600 text-sm" role="alert">
                        {errors.sintomoPrincipale}
                      </div>
                    )}
                    <div id="sintomo-help" className="text-sm text-gray-600">
                      Questo campo è obbligatorio per procedere con la valutazione
                    </div>
                  </div>
                </fieldset>

                {/* Durata e intensità */}
                <fieldset className="space-y-6">
                  <legend className="text-lg font-semibold text-gray-900">
                    Caratteristiche del sintomo
                  </legend>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="durata" className="text-lg font-medium">
                        Durata del sintomo (opzionale)
                      </Label>
                      <Select 
                        value={formData.durata} 
                        onValueChange={(value) => {
                          setFormData(prev => ({...prev, durata: value}));
                          announce(`Durata selezionata: ${value}`, 'polite');
                        }}
                      >
                        <SelectTrigger 
                          className="h-12"
                          aria-label="Seleziona da quanto tempo hai questo sintomo"
                        >
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
                      <Label className="text-lg font-medium">
                        Intensità percepita (opzionale)
                      </Label>
                      <div className="px-4">
                        <Slider
                          value={formData.intensita}
                          onValueChange={handleIntensityChange}
                          max={10}
                          min={1}
                          step={1}
                          className="w-full"
                          aria-label={`Intensità del sintomo: ${formData.intensita[0]} su 10`}
                        />
                        <div className="flex justify-between text-sm text-gray-600 mt-2">
                          <span>Lieve (1)</span>
                          <span className="font-medium" aria-live="polite">
                            Attuale: {formData.intensita[0]}
                          </span>
                          <span>Grave (10)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </fieldset>

                {/* Sintomi associati */}
                <fieldset className="space-y-4">
                  <legend className="text-lg font-semibold text-gray-900">
                    Sintomi associati (opzionale)
                  </legend>
                  
                  <div 
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
                    role="group"
                    aria-labelledby="sintomi-associati-legend"
                  >
                    {sintomiComuni.map((sintomo) => (
                      <div key={sintomo} className="flex items-center space-x-2">
                        <Checkbox
                          id={`sintomo-${sintomo}`}
                          checked={formData.sintomiAssociati.includes(sintomo)}
                          onCheckedChange={(checked) => handleSintomiAssociatiChange(sintomo, checked)}
                          aria-describedby={`sintomo-${sintomo}-desc`}
                        />
                        <Label 
                          htmlFor={`sintomo-${sintomo}`} 
                          className="text-sm cursor-pointer"
                        >
                          {sintomo}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-gray-600">
                    Seleziona tutti i sintomi che stai sperimentando insieme al sintomo principale
                  </div>
                </fieldset>

                {/* Condizioni mediche note */}
                <fieldset className="space-y-4">
                  <legend className="text-lg font-semibold text-gray-900">
                    Condizioni mediche già note (opzionale)
                  </legend>
                  
                  <div 
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
                    role="group"
                    aria-labelledby="condizioni-note-legend"
                  >
                    {condizioniMediche.map((condizione) => (
                      <div key={condizione} className="flex items-center space-x-2">
                        <Checkbox
                          id={`condizione-${condizione}`}
                          checked={formData.condizioniNote.includes(condizione)}
                          onCheckedChange={(checked) => handleCondizioniChange(condizione, checked)}
                        />
                        <Label 
                          htmlFor={`condizione-${condizione}`} 
                          className="text-sm cursor-pointer"
                        >
                          {condizione}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-gray-600">
                    Seleziona le condizioni mediche di cui sei già a conoscenza
                  </div>
                </fieldset>

                {/* Familiarità */}
                <fieldset className="space-y-2">
                  <legend className="text-lg font-semibold text-gray-900">
                    Familiarità o predisposizione ereditaria (opzionale)
                  </legend>
                  
                  <Label htmlFor="familiarita" className="text-lg font-medium sr-only">
                    Descrivi eventuali condizioni familiari
                  </Label>
                  <Textarea
                    id="familiarita"
                    value={formData.familiarita}
                    onChange={(e) => setFormData(prev => ({...prev, familiarita: e.target.value}))}
                    placeholder="es. diabete in famiglia, malattie cardiache, allergie..."
                    className="min-h-[100px]"
                    aria-describedby="familiarita-help"
                  />
                  <div id="familiarita-help" className="text-sm text-gray-600">
                    Descrivi eventuali condizioni mediche presenti nella tua famiglia che potrebbero essere rilevanti
                  </div>
                </fieldset>

                {/* Submit button */}
                <div className="flex justify-center pt-8">
                  <AccessibleButton 
                    type="submit" 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-12 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    aria-label="Inizia la conversazione con MedAgent"
                  >
                    Inizia la conversazione
                    <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                  </AccessibleButton>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </AccessibleLayout>
  );
};

export default AccessibleValutazione;