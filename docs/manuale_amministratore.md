# Manuale Amministratore FestivalScout

## Indice

1. Panoramica del sito e ruoli dell’amministratore  
2. Accesso all’area amministrativa  
3. Gestione dei contenuti  
 3.1 Validazione e pubblicazione eventi  
 3.2 Modifica e cancellazione eventi  
 3.3 Gestione venue, insegnanti e musicisti  
4. Gestione utenti e segnalazioni  
5. Gestione notifiche e comunicazioni  
6. Deploy e gestione su Vercel  
 6.1 Come pubblicare una nuova versione  
 6.2 Monitoraggio e rollback  
7. Amministrazione base del database  
 7.1 Accesso e backup  
 7.2 Operazioni semplici (modifica dati, esportazione)  
8. Risoluzione problemi comuni  
9. Risorse utili e supporto

---

## 1. Panoramica del sito e ruoli dell’amministratore

FestivalScout è una piattaforma web per scoprire, promuovere e gestire festival di blues dance. Gli utenti possono cercare eventi, salvare i preferiti, seguire insegnanti e musicisti, ricevere notifiche e interagire con la community.

**L’amministratore** ha il compito di:
- Validare e pubblicare nuovi eventi
- Gestire e moderare i contenuti (eventi, venue, insegnanti, musicisti)
- Gestire gli utenti e le segnalazioni
- Inviare notifiche e comunicazioni
- Occuparsi delle operazioni tecniche di base (deploy, backup, database)
- Risolvere problemi comuni o contattare il supporto tecnico

---

## 2. Accesso all’area amministrativa

### Passaggi per accedere:
1. Apri il browser e vai all’indirizzo riservato (es. https://festival-scout.vercel.app/admin)
2. Inserisci la tua email e password amministratore.
3. Se richiesto, inserisci il codice di verifica per l’autenticazione a due fattori (2FA).
4. Se hai dimenticato la password, usa la funzione “Password dimenticata?” e segui le istruzioni.
5. Se non riesci ad accedere, contatta il team tecnico per verificare che il tuo account sia abilitato.

**Nota:** Non condividere mai le credenziali e cambia la password periodicamente.

---

## 3. Gestione dei contenuti

### 3.1 Validazione e pubblicazione eventi

**Per validare e pubblicare un evento:**
1. Accedi all’area amministrativa.
2. Vai alla sezione “Eventi in attesa di validazione” (di solito nel menu laterale o in dashboard).
3. Clicca sull’evento che vuoi esaminare.
4. Controlla tutti i dettagli: nome, date, descrizione, venue, insegnanti, musicisti, immagine.
5. Se necessario, clicca su “Modifica” per correggere o completare i dati mancanti.
6. Dopo aver verificato che tutto sia corretto, clicca su “Pubblica evento”.
7. Se l’evento non è idoneo, clicca su “Rifiuta” o “Elimina” e, se possibile, inserisci una motivazione.

**Consigli pratici:**
- Verifica che le date siano corrette e che non ci siano sovrapposizioni con altri eventi.
- Controlla che la venue sia esistente e correttamente associata.
- Assicurati che la descrizione sia chiara e priva di errori.

### 3.2 Modifica e cancellazione eventi

**Per modificare un evento già pubblicato:**
1. Vai alla sezione “Eventi pubblicati”.
2. Usa la barra di ricerca o i filtri (data, città, stato) per trovare l’evento.
3. Clicca sull’evento desiderato.
4. Premi su “Modifica”.
5. Aggiorna le informazioni necessarie (es. date, descrizione, immagine, venue, insegnanti, musicisti).
6. Salva le modifiche cliccando su “Salva” o “Aggiorna evento”.

**Per cancellare un evento:**
1. Segui i passaggi 1-3 sopra.
2. Clicca su “Elimina evento”.
3. Conferma l’operazione nella finestra di dialogo che appare.

**Nota:** L’evento eliminato non sarà più visibile agli utenti. Usa questa funzione solo se strettamente necessario.

### 3.3 Gestione venue, insegnanti e musicisti

**Per aggiungere una venue (luogo):**
1. Vai alla sezione “Venue” o “Luoghi”.
2. Clicca su “Aggiungi venue”.
3. Compila i campi richiesti: nome, indirizzo, città, paese, capienza, servizi disponibili.
4. Salva la venue.

**Per modificare una venue:**
1. Cerca la venue nella lista.
2. Clicca su “Modifica”.
3. Aggiorna i dati e salva.

**Per eliminare una venue:**
1. Cerca la venue.
2. Clicca su “Elimina” e conferma.

**Per aggiungere/modificare/eliminare insegnanti o musicisti:**
- Segui la stessa procedura delle venue, usando le sezioni “Insegnanti” o “Musicisti”.
- Ricorda di associare insegnanti e musicisti agli eventi pertinenti.

---

## 4. Gestione utenti e segnalazioni

**Per gestire gli utenti:**
1. Vai alla sezione “Utenti”.
2. Usa la barra di ricerca per trovare l’utente per nome o email.
3. Clicca sull’utente per vedere i dettagli.
4. Per bloccare/sbloccare l’account, clicca sull’apposito pulsante.
5. Per vedere la cronologia attività, consulta la scheda “Attività” o simile.

**Per gestire segnalazioni:**
1. Vai alla sezione “Segnalazioni” o controlla le notifiche in dashboard.
2. Clicca sulla segnalazione per vedere i dettagli.
3. Valuta il contenuto segnalato (evento, recensione, utente).
4. Decidi se rimuovere il contenuto, bloccare l’utente o ignorare la segnalazione.
5. Se necessario, comunica la decisione all’utente tramite email o notifica.

---

## 5. Gestione notifiche e comunicazioni

**Per inviare una notifica agli utenti:**
1. Vai alla sezione “Notifiche” o “Comunicazioni”.
2. Clicca su “Nuova notifica”.
3. Scegli il tipo di notifica (push, email, banner in-app).
4. Scrivi il messaggio e inserisci un titolo chiaro.
5. Seleziona i destinatari (tutti, utenti di un evento, ecc.).
6. Clicca su “Invia”.
7. Controlla lo storico delle notifiche per verificare l’invio e i tassi di apertura.

**Consigli:**
- Usa messaggi brevi e chiari.
- Non inviare troppe notifiche per non infastidire gli utenti.

---

## 6. Deploy e gestione su Vercel

### 6.1 Come pubblicare una nuova versione

1. Accedi alla dashboard Vercel su https://vercel.com/ con le credenziali fornite dal team tecnico.
2. Verifica che il progetto “FestivalScout” sia presente.
3. Ogni volta che viene aggiornata la repository su GitHub (ramo principale), Vercel esegue automaticamente il deploy.
4. Per forzare un nuovo deploy:
   - Clicca sul progetto.
   - Premi su “Deployments”.
   - Clicca su “Redeploy” sull’ultima build o su “Deploy” per una nuova.
5. Attendi che il deploy sia completato (stato “Ready”).

### 6.2 Monitoraggio e rollback

1. Nella dashboard Vercel, vai su “Deployments”.
2. Controlla lo stato delle ultime build (verde = successo, rosso = errore).
3. Per tornare a una versione precedente:
   - Trova la build desiderata.
   - Clicca su “Redeploy”.
4. Se ci sono errori, consulta i log cliccando sulla build.
5. In caso di problemi gravi, contatta il supporto tecnico.

---

## 7. Amministrazione base del database

### 7.1 Accesso e backup

**Per accedere al database:**
1. Apri l’interfaccia web fornita (es. Supabase o pgAdmin).
2. Inserisci le credenziali fornite dal team tecnico.
3. Naviga tra le tabelle tramite il menu laterale.

**Per fare un backup:**
1. Nell’interfaccia, cerca la funzione “Export” o “Backup”.
2. Scegli le tabelle da esportare (o tutto il database).
3. Seleziona il formato desiderato (CSV, SQL, ecc.).
4. Clicca su “Esporta” e salva il file in un luogo sicuro.

### 7.2 Operazioni semplici (modifica dati, esportazione)

**Per modificare un dato:**
1. Seleziona la tabella (es. utenti, eventi).
2. Trova il record da modificare (puoi usare la ricerca).
3. Clicca su “Modifica” accanto al record.
4. Cambia i dati necessari e salva.

**Per esportare dati:**
1. Seleziona la tabella.
2. Clicca su “Export” o “Scarica”.
3. Scegli il formato (CSV, Excel) e salva il file.

---

## 8. Risoluzione problemi comuni

- **Il sito non si aggiorna dopo una modifica:**
  1. Vai su Vercel e controlla lo stato del deploy.
  2. Aggiorna la pagina del sito.
  3. Svuota la cache del browser (Ctrl+Shift+R).
  4. Se il problema persiste, contatta il team tecnico.
- **Non riesci ad accedere all’area admin:**
  1. Controlla le credenziali.
  2. Verifica la connessione internet.
  3. Chiedi al team tecnico se il tuo account è abilitato.
- **Un evento non appare tra i pubblicati:**
  1. Verifica che sia stato validato e pubblicato.
  2. Controlla eventuali filtri attivi nella ricerca.
- **Problemi con il database:**
  1. Verifica la connessione.
  2. Riavvia l’interfaccia di amministrazione.
  3. Contatta il supporto se il problema persiste.
- **Ricevi segnalazioni di bug dagli utenti:**
  1. Prendi nota del problema.
  2. Prova a riprodurlo.
  3. Segnala al team tecnico con tutti i dettagli.

---

## 9. Risorse utili e supporto

- **Dashboard Vercel:** https://vercel.com/
- **Interfaccia database (Supabase/pgAdmin):** link fornito dal team tecnico
- **Manuale utente FestivalScout:** (link o PDF da fornire)
- **Supporto tecnico:** email/telefono/Slack del team di sviluppo
- **FAQ e guide rapide:** (aggiungi link se disponibili) 