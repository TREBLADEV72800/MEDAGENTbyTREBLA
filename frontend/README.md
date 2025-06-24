# MedAgent Frontend - Versione Accessibile

Questo è il frontend di MedAgent, un'applicazione sanitaria digitale progettata con particolare attenzione all'accessibilità e all'usabilità per tutti gli utenti.

## Caratteristiche di Accessibilità

### 🎯 Conformità agli Standard
- **WCAG 2.1 AA**: Conformità alle linee guida per l'accessibilità dei contenuti web
- **Semantic HTML**: Utilizzo di elementi HTML semantici appropriati
- **ARIA Labels**: Etichette e descrizioni per screen reader
- **Keyboard Navigation**: Navigazione completa da tastiera

### 🔧 Componenti Accessibili

#### Skip Links
- Link "Salta al contenuto principale" per utenti di screen reader
- Visibile solo quando ha il focus

#### Focus Management
- Indicatori di focus visibili e ad alto contrasto
- Focus trap per modali e dialog
- Gestione logica dell'ordine di tabulazione

#### Screen Reader Support
- Live regions per annunci dinamici
- Etichette descrittive per tutti gli elementi interattivi
- Struttura heading gerarchica corretta

#### Keyboard Navigation
- Supporto completo per navigazione da tastiera
- Shortcuts standard (Tab, Enter, Escape, Arrow keys)
- Gestione del focus per componenti complessi

### 🎨 Design Inclusivo

#### Contrasto e Colori
- Rapporto di contrasto minimo 4.5:1 per testo normale
- Rapporto di contrasto minimo 3:1 per testo grande
- Supporto per modalità ad alto contrasto
- Non affidamento esclusivo sul colore per trasmettere informazioni

#### Tipografia
- Font leggibili e dimensioni appropriate
- Spaziatura adeguata tra righe e paragrafi
- Supporto per zoom fino al 200% senza perdita di funzionalità

#### Responsive Design
- Layout adattivo per tutti i dispositivi
- Touch targets di almeno 44x44px
- Supporto per orientamento portrait e landscape

### 🔊 Supporto Audio e Visivo

#### Preferenze Utente
- Rispetto per `prefers-reduced-motion`
- Supporto per `prefers-color-scheme`
- Supporto per `prefers-contrast`

#### Multimedia
- Testi alternativi per tutte le immagini
- Controlli accessibili per contenuti multimediali
- Trascrizioni quando necessario

## Struttura dei Componenti Accessibili

```
src/
├── components/
│   ├── ui/
│   │   ├── accessible-button.jsx      # Button con supporto ARIA
│   │   ├── accessible-input.jsx       # Input con validazione accessibile
│   │   ├── accessible-heading.jsx     # Heading con gerarchia corretta
│   │   ├── skip-link.jsx             # Link per saltare al contenuto
│   │   ├── focus-trap.jsx            # Gestione focus per modali
│   │   └── live-region.jsx           # Annunci per screen reader
│   └── layout/
│       └── AccessibleLayout.jsx      # Layout base accessibile
├── hooks/
│   ├── use-keyboard-navigation.js    # Hook per navigazione da tastiera
│   └── use-announce.js              # Hook per annunci screen reader
└── pages/
    ├── AccessibleHome.jsx           # Homepage accessibile
    └── AccessibleValutazione.jsx    # Form valutazione accessibile
```

## Utilizzo dei Componenti

### AccessibleButton
```jsx
import { AccessibleButton } from '../components/ui/accessible-button';

<AccessibleButton
  aria-label="Descrizione dettagliata dell'azione"
  aria-describedby="help-text-id"
  onClick={handleClick}
>
  Testo del button
</AccessibleButton>
```

### AccessibleInput
```jsx
import { AccessibleInput } from '../components/ui/accessible-input';

<AccessibleInput
  id="unique-id"
  aria-label="Etichetta descrittiva"
  aria-required="true"
  aria-invalid={hasError}
  error={errorMessage}
/>
```

### LiveRegion per Annunci
```jsx
import { useAnnounce } from '../hooks/use-announce';

const { announce } = useAnnounce();

// Per annunciare cambiamenti di stato
announce('Operazione completata con successo', 'polite');
announce('Errore: riprova', 'assertive');
```

## Testing dell'Accessibilità

### Strumenti Consigliati
- **axe-core**: Testing automatico dell'accessibilità
- **WAVE**: Valutazione web dell'accessibilità
- **Lighthouse**: Audit di accessibilità integrato in Chrome
- **Screen Reader**: Test con NVDA, JAWS, o VoiceOver

### Checklist di Test
- [ ] Navigazione completa da tastiera
- [ ] Funzionamento con screen reader
- [ ] Contrasto colori adeguato
- [ ] Zoom fino al 200% funzionale
- [ ] Responsive design su tutti i dispositivi
- [ ] Validazione HTML semantico
- [ ] Test con utenti reali

## Linee Guida per Sviluppatori

### Principi Base
1. **Semantic First**: Usa sempre l'elemento HTML più appropriato
2. **Progressive Enhancement**: Funzionalità base senza JavaScript
3. **Inclusive Design**: Progetta per la diversità di utenti
4. **Test Early**: Testa l'accessibilità durante lo sviluppo

### Best Practices
- Fornisci sempre testi alternativi significativi
- Usa heading in ordine gerarchico (h1, h2, h3...)
- Assicurati che tutti gli elementi interattivi siano raggiungibili da tastiera
- Fornisci feedback chiaro per azioni e errori
- Mantieni un linguaggio semplice e chiaro

### Errori Comuni da Evitare
- Non usare `div` o `span` per elementi interattivi
- Non affidarsi solo al colore per trasmettere informazioni
- Non rimuovere gli outline di focus senza fornire alternative
- Non usare placeholder come unica etichetta per i form
- Non creare trap di focus accidentali

## Risorse Aggiuntive

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [A11y Project](https://www.a11yproject.com/)
- [WebAIM](https://webaim.org/)

## Supporto e Feedback

Per segnalazioni di problemi di accessibilità o suggerimenti di miglioramento:
- Email: accessibility@medagent.com
- Issue GitHub: [Apri una issue](https://github.com/medagent/frontend/issues)

L'accessibilità è un processo continuo e apprezziamo tutti i feedback per migliorare l'esperienza di tutti gli utenti.