# Task 01 — Fondazioni tecniche

**Stato:** in corso — struttura web e schema predisposti; collegamento Supabase da completare  
**Dipendenze:** scope MVP v1 validato

## Obiettivo

Creare il progetto web di All4One con una base stabile per autenticazione, ruoli e dati, senza ancora implementare le funzioni di diario o messaggistica.

## Scelta tecnica

- **Frontend e backend applicativo:** Next.js + TypeScript.
- **Database e autenticazione:** PostgreSQL tramite Supabase.
- **Interfaccia:** responsive, ottimizzata prima per smartphone e utilizzabile da browser desktop.
- **Invio esterno:** link `mailto:` e link WhatsApp precompilati; nessuna integrazione API in questa fase.

Questa scelta mantiene il primo rilascio semplice: un solo progetto web, nessuna app nativa e nessun server separato da gestire inizialmente.

## Micro-task

| ID | Attività | Criterio di accettazione |
| --- | --- | --- |
| 01.1 | Inizializzare progetto Next.js/TypeScript | Completato: il progetto compila e mostra una pagina All4One. |
| 01.2 | Definire configurazione ambiente | Completato: chiavi e URL restano in variabili locali non versionate; esiste `.env.example`. |
| 01.3 | Creare schema dati iniziale | Predisposto: migrazione SQL con utenti, profili, ruoli, relazione cliente–PT–nutrizionista, contatti e consensi. |
| 01.4 | Abilitare autenticazione | Implementato: un cliente può registrarsi, accedere e uscire dopo l'applicazione della migrazione `202608150001_auth_profiles.sql`. |
| 01.5 | Applicare autorizzazioni | Implementato: le aree applicative controllano il ruolo; il database impedisce l'auto-promozione del ruolo. |
| 01.6 | Creare pagine protette vuote | Implementato: ogni ruolo raggiunge soltanto la propria dashboard dopo l'accesso. |
| 01.7 | Verificare sicurezza minima | Le chiavi segrete non arrivano nel browser; controlli automatici base superati. |

## Modello dati minimo

```text
auth.users
  └─ profiles (id, nome, email, ruolo)
       ├─ client_care_teams (cliente_id, pt_id, nutrizionista_id, stato)
       ├─ professional_contacts (profilo_id, telefono_whatsapp, email)
       └─ sharing_consents (cliente_id, tipo_dato, destinatario_ruolo, attivo, aggiornato_il)
```

`client_care_teams` impone un solo PT e un solo nutrizionista attivi per cliente nell'MVP.

## Test di chiusura

1. Creare un account per ciascuno dei tre ruoli.
2. Collegare un cliente al suo PT e nutrizionista.
3. Verificare che il PT non possa aprire l'area nutrizionista e viceversa.
4. Verificare che un consenso revocato impedisca la lettura del dato previsto.
5. Verificare che email e WhatsApp aprano soltanto un messaggio precompilato dopo azione esplicita dell'utente.

## Non incluso

- Invio automatico di WhatsApp/email.
- Diario pasti, diario allenamenti, schede e chat interna: iniziano dal Task 02.
- PWA, pubblicazione sugli store e pagamenti.

## Task 02.1 — Diario allenamenti

**Stato:** implementato, in attesa della migrazione `202608150002_workouts.sql` su Supabase.

- Il cliente crea una sessione e registra esercizio, gruppo muscolare, serie, ripetizioni, carico e RPE.
- L'app calcola volume e serie per gruppo muscolare della sessione.
- L'app mostra record personali per esercizio: carico, ripetizioni e volume massimo della serie.
