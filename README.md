# All4One

Web app in sviluppo per collegare clienti, personal trainer e nutrizionisti in un unico percorso autorizzato.

## Stato

Il prototipo statico iniziale resta nei file `index.html`, `style.css` e `app.js`. La nuova applicazione è in `app/` e costituisce l'MVP funzionante in costruzione.

## Avvio locale

1. Copiare `.env.example` in `.env.local`.
2. Inserire le chiavi pubbliche del progetto Supabase quando disponibili.
3. Eseguire `npm install` e poi `npm run dev`.
4. Aprire `http://localhost:3000`.

Finché Supabase non è configurato è disponibile un ambiente demo con le tre aree ruolo.

## Contenuto previsto

- diario pasti con inserimento vocale simulato e conferma del cliente;
- stagionalita e qualita degli alimenti;
- log degli allenamenti, record personali e report per gruppi muscolari;
- report automatici per PT e nutrizionista;
- schede nutrizionali e schede di allenamento;
- confronto del numero di allenamenti tra periodi;
- messaggi diretti verso PT, nutrizionista o entrambi.

## Nota per il prodotto reale

Prima di gestire utenti reali saranno necessari autenticazione, database UE, consensi e permessi granulari, audit log, informativa privacy e una revisione GDPR/AI Act.
