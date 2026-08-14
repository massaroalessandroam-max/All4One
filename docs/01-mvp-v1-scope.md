# All4One — Scope congelato MVP v1

**Stato:** validato il 14 agosto 2026  
**Obiettivo:** realizzare una web app responsive (PWA) che permetta a cliente, personal trainer e nutrizionista di collaborare sullo stesso percorso, con ruoli, consenso e dati separati per competenza.

## Principio guida

L'app raccoglie, organizza e condivide dati dichiarati dal cliente. Non prescrive diete, non formula diagnosi, non sostituisce il giudizio del professionista. Le funzioni AI restano assistive, spiegabili e sempre modificabili/confermabili dall'utente o dal professionista.

## Decisioni confermate

- Nome prodotto: **All4One**.
- Mercato iniziale: Italia; interfaccia e contenuti in italiano.
- Relazione MVP: ogni cliente ha un solo PT e un solo nutrizionista collegati.
- Contatti professionisti: il cliente registra nome, email e numero WhatsApp del PT e del nutrizionista.
- Canali esterni: l'app apre email o WhatsApp con testo precompilato; non invia messaggi in automatico.
- Canale di rilascio: web app responsive. L'installazione come PWA e gli store vengono rinviati a una fase successiva.

## Utenti e ruoli

| Ruolo | Cosa fa nell'MVP |
| --- | --- |
| Cliente | Registra pasti e allenamenti, consulta progressi, invia report e messaggi. |
| Personal trainer | Crea e assegna schede allenamento, consulta allenamenti/progressi e riceve i report autorizzati. |
| Nutrizionista | Crea e assegna schede/piani nutrizionali, consulta diario alimentare e riceve i report autorizzati. |
| Admin | Solo amministrazione iniziale di utenti e relazioni professionista-cliente. |

## Incluso nell'MVP v1

### Cliente

- Accesso sicuro e profilo.
- Diario pasti: inserimento manuale; inserimento vocale con trascrizione e schermata di conferma/modifica prima del salvataggio.
- Alimenti: ricerca da catalogo, stagionalità e indicatore informativo di grado di trasformazione/qualità; nessun giudizio medico.
- Diario allenamento: esercizi, serie, ripetizioni, carico, RPE/nota.
- Record personali per esercizio (carico, ripetizioni, volume), con regole visibili.
- Riepilogo post-allenamento: volume, esercizi e gruppi muscolari coinvolti.
- Andamento: peso e misure inserite dal cliente, frequenza allenamenti, aderenza a pasti/allenamenti.
- Report giornaliero alimentazione al nutrizionista e report allenamento al PT.
- Report periodici incrociati: il PT riceve indicatori nutrizionali aggregati e il nutrizionista indicatori di allenamento aggregati, esclusivamente con consenso attivo del cliente.
- Messaggi 1:1 cliente–PT, cliente–nutrizionista e invio a entrambi.
- Pulsanti per aprire WhatsApp o email del PT/nutrizionista con report o messaggio precompilato, dopo conferma del cliente.

### Professionisti

- Elenco clienti collegati e scheda cliente con dati autorizzati.
- Schede allenamento: modello, esercizi, serie/ripetizioni/carichi, periodo di validità e assegnazione a un cliente.
- Schede/piani nutrizionali: sezioni, pasti/indicazioni testuali, periodo di validità e assegnazione a un cliente.
- Numero di allenamenti per periodo e confronto con il periodo precedente.
- Ricezione report, messaggi e note professionali.

### Piattaforma

- Gestione del consenso: il cliente può autorizzare/revocare ogni condivisione incrociata.
- Traccia di accesso e condivisione dati essenziale (audit log).
- Esportazione dei dati del cliente e cancellazione account su richiesta.
- Interfaccia italiana, mobile-first e responsive.

## Fuori dall'MVP v1

- Diagnosi, triage clinico, prescrizioni automatiche o piani generati autonomamente dall'AI.
- Integrazioni con smartwatch, Apple Health, Google Fit o dispositivi medici.
- Pagamenti, abbonamenti, marketplace di professionisti e agenda/appuntamenti.
- Videochiamate, community/social feed, gamification e notifiche push avanzate.
- Riconoscimento automatico completo del cibo da foto; l'audio resta una proposta da confermare.
- Calcolo professionale di macro/micro nutrienti o diete: richiede successiva validazione con nutrizionista e database alimentare idoneo.

## Regole di visibilità iniziali

| Dato | Cliente | PT | Nutrizionista |
| --- | --- | --- | --- |
| Dettaglio allenamenti | pieno | pieno per i propri clienti | solo riepilogo aggregato, se autorizzato |
| Dettaglio pasti | pieno | solo riepilogo aggregato, se autorizzato | pieno per i propri clienti |
| Scheda allenamento | lettura | crea/modifica | nessun accesso diretto |
| Piano nutrizionale | lettura | nessun accesso diretto | crea/modifica |
| Messaggi | propri | propria conversazione | propria conversazione |

## Criteri di accettazione del rilascio pilota

1. Ogni ruolo vede solo i dati autorizzati.
2. Un cliente completa un pasto e un allenamento da mobile senza assistenza.
3. PT e nutrizionista assegnano una scheda e leggono i rispettivi report.
4. Ogni trascrizione audio viene confermata prima del salvataggio.
5. Revocando un consenso, il professionista perde subito l'accesso ai dati incrociati.
6. Le azioni rilevanti di condivisione sono registrate.

## Backlog ordinato

1. Fondazioni: progetto, autenticazione, ruoli, modello dati, consenso e audit.
2. Flusso cliente: pasti, allenamenti, progressi, report.
3. Area PT e nutrizionista: clienti, schede, confronto periodi, report e messaggi.
4. AI assistiva: trascrizione vocale con conferma, spiegazioni e controllo professionista.
5. Qualità: test, sicurezza, privacy, accessibilità, pilot con utenti reali.

## Regola di lavoro

Ogni micro-task contiene: obiettivo, schermata/API coinvolta, criterio di accettazione e test. Le richieste fuori scope vengono annotate in una lista `v2` e non interrompono il rilascio dell'MVP.
