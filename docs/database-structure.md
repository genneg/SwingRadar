# SwingRadar - Struttura Database

## Panoramica

Questo documento descrive la struttura completa del database PostgreSQL utilizzato da SwingRadar per la gestione di eventi di danza swing, insegnanti, musicisti e utenti.

**Database:** PostgreSQL 17.4
**Host:** aws-0-eu-central-1.pooler.supabase.com (Supabase)
**Schema:** public
**ORM:** Prisma
**Totale Tabelle:** 16

---

## 📊 Tabelle Principali

### 1. **events** (Eventi)
Tabella centrale che contiene tutti gli eventi di danza swing.

| Colonna | Tipo | Nullable | Default | Descrizione |
|---------|------|----------|---------|-------------|
| id | integer | NO | autoincrement | Chiave primaria |
| name | varchar(255) | NO | - | Nome dell'evento |
| from_date | date | NO | - | Data di inizio |
| to_date | date | NO | - | Data di fine |
| country | varchar(100) | NO | - | Paese |
| city | varchar(100) | NO | - | Città |
| website | varchar(500) | YES | - | Sito web ufficiale |
| style | varchar(100) | YES | - | Stile di danza |
| description | text | YES | - | Descrizione evento |
| ai_quality_score | integer | YES | - | Punteggio qualità AI |
| ai_completeness_score | integer | YES | - | Punteggio completezza AI |
| extraction_method | varchar(50) | YES | - | Metodo estrazione dati |
| created_at | timestamptz | YES | CURRENT_TIMESTAMP | Data creazione |
| updated_at | timestamptz | YES | CURRENT_TIMESTAMP | Data aggiornamento |
| image_url | varchar(500) | YES | - | URL immagine evento |

**Indici:**
- `idx_events_country_city` (country, city)
- `idx_events_created_at` (created_at)
- `idx_events_dates` (from_date, to_date)
- `idx_events_name` (name)
- `idx_events_name_gin` (Full-text search su name)

**Relazioni:**
- One-to-many con `event_teachers`
- One-to-many con `event_musicians`
- One-to-many con `event_prices`
- One-to-many con `venues`
- One-to-many con `user_follow_events`

---

### 2. **teachers** (Insegnanti)
Anagrafica degli insegnanti di danza swing.

| Colonna | Tipo | Nullable | Default | Descrizione |
|---------|------|----------|---------|-------------|
| id | integer | NO | autoincrement | Chiave primaria |
| name | varchar(255) | NO | - | Nome insegnante |
| bio | text | YES | - | Biografia |
| website | varchar(500) | YES | - | Sito web personale |
| ai_bio_summary | text | YES | - | Riassunto bio generato da AI |
| ai_relevance_score | integer | YES | - | Punteggio rilevanza AI |
| image_url | text | YES | - | URL foto profilo |

**Relazioni:**
- One-to-many con `event_teachers`
- One-to-many con `user_follow_teachers`

---

### 3. **musicians** (Musicisti)
Anagrafica dei musicisti che si esibiscono agli eventi.

| Colonna | Tipo | Nullable | Default | Descrizione |
|---------|------|----------|---------|-------------|
| id | integer | NO | autoincrement | Chiave primaria |
| name | varchar(255) | NO | - | Nome musicista |
| slug | varchar(255) | NO | unique | Slug URL-friendly |
| bio | text | YES | - | Biografia |
| avatar | varchar(500) | YES | - | Avatar/foto profilo |
| verified | boolean | YES | false | Account verificato |
| instruments | text[] | YES | - | Strumenti suonati |
| yearsActive | integer | YES | - | Anni di attività |
| website | varchar(500) | YES | - | Sito web |
| email | varchar(255) | YES | - | Email contatto |
| followerCount | integer | YES | 0 | Numero follower |
| eventCount | integer | YES | 0 | Numero eventi |
| createdAt | timestamptz | YES | CURRENT_TIMESTAMP | Data creazione |
| updatedAt | timestamptz | YES | CURRENT_TIMESTAMP | Data aggiornamento |
| image_url | text | YES | - | URL immagine |

**Indici:**
- `musicians_slug_key` (slug) - UNIQUE

**Relazioni:**
- One-to-many con `event_musicians`
- One-to-many con `user_follow_musicians`

---

### 4. **users** (Utenti)
Sistema di autenticazione e gestione utenti.

| Colonna | Tipo | Nullable | Default | Descrizione |
|---------|------|----------|---------|-------------|
| id | integer | NO | autoincrement | Chiave primaria |
| email | varchar(255) | NO | unique | Email utente |
| name | varchar(255) | YES | - | Nome utente |
| avatar | varchar(500) | YES | - | Avatar utente |
| verified | boolean | NO | false | Account verificato |
| created_at | timestamptz | NO | CURRENT_TIMESTAMP | Data registrazione |
| updated_at | timestamptz | NO | CURRENT_TIMESTAMP | Ultimo aggiornamento |

**Indici:**
- `idx_users_email` (email)
- `users_email_key` (email) - UNIQUE

**Relazioni:**
- One-to-one con `user_preferences`
- One-to-many con `accounts`
- One-to-many con `saved_searches`
- One-to-many con `user_follow_*`
- One-to-many con `user_notifications`

---

## 🔗 Tabelle di Collegamento

### 5. **event_teachers**
Collegamento many-to-many tra eventi e insegnanti.

| Colonna | Tipo | Nullable | Default | Descrizione |
|---------|------|----------|---------|-------------|
| event_id | integer | NO | - | FK verso events |
| teacher_id | integer | NO | - | FK verso teachers |
| role | varchar(100) | YES | - | Ruolo nell'evento |

**Chiave Primaria:** (event_id, teacher_id)

---

### 6. **event_musicians**
Collegamento tra eventi e musicisti con dettagli performance.

| Colonna | Tipo | Nullable | Default | Descrizione |
|---------|------|----------|---------|-------------|
| id | integer | NO | autoincrement | Chiave primaria |
| event_id | integer | YES | - | FK verso events |
| musician_id | integer | YES | - | FK verso musicians |
| role | varchar(100) | YES | - | Ruolo (es. "band leader") |
| set_times | text[] | YES | - | Orari delle performance |
| created_at | timestamptz | YES | CURRENT_TIMESTAMP | Data creazione |

---

### 7. **event_prices**
Prezzi e tipologie di biglietti per gli eventi.

| Colonna | Tipo | Nullable | Default | Descrizione |
|---------|------|----------|---------|-------------|
| id | integer | NO | autoincrement | Chiave primaria |
| event_id | integer | YES | - | FK verso events |
| type | varchar(100) | NO | - | Tipo prezzo (es. "Early Bird") |
| amount | numeric(10,2) | NO | - | Importo |
| currency | varchar(10) | YES | 'EUR' | Valuta |
| deadline | date | YES | - | Scadenza prezzo |
| description | text | YES | - | Descrizione dettagliata |
| available | boolean | YES | true | Disponibilità |
| created_at | timestamptz | YES | CURRENT_TIMESTAMP | Data creazione |
| updated_at | timestamptz | YES | CURRENT_TIMESTAMP | Data aggiornamento |

---

### 8. **venues** (Luoghi)
Luoghi dove si svolgono gli eventi.

| Colonna | Tipo | Nullable | Default | Descrizione |
|---------|------|----------|---------|-------------|
| id | integer | NO | autoincrement | Chiave primaria |
| event_id | integer | YES | - | FK verso events |
| name | varchar(255) | YES | - | Nome venue |
| address | text | YES | - | Indirizzo completo |
| type | varchar(50) | YES | - | Tipo venue |

---

## 👤 Sistema Utenti e Following

### 9. **accounts**
Sistema di autenticazione (OAuth, credenziali).

| Colonna | Tipo | Nullable | Default | Descrizione |
|---------|------|----------|---------|-------------|
| id | integer | NO | autoincrement | Chiave primaria |
| user_id | integer | NO | - | FK verso users |
| type | varchar(50) | NO | - | Tipo account (oauth/credentials) |
| provider | varchar(50) | NO | - | Provider (google, facebook, etc.) |
| providerAccountId | varchar(255) | NO | - | ID account provider |
| password | varchar(255) | YES | - | Password (se credentials) |
| created_at | timestamptz | NO | CURRENT_TIMESTAMP | Data creazione |
| updated_at | timestamptz | NO | CURRENT_TIMESTAMP | Data aggiornamento |

**Indici:**
- `accounts_provider_providerAccountId_key` (provider, providerAccountId) - UNIQUE

---

### 10. **user_preferences**
Preferenze utente personalizzate.

| Colonna | Tipo | Nullable | Default | Descrizione |
|---------|------|----------|---------|-------------|
| id | integer | NO | autoincrement | Chiave primaria |
| user_id | integer | NO | unique | FK verso users |
| email_notifications | boolean | NO | true | Notifiche email |
| push_notifications | boolean | NO | true | Notifiche push |
| new_event_notifications | boolean | NO | true | Notifiche nuovi eventi |
| deadlineReminders | boolean | NO | true | Promemoria scadenze |
| weeklyDigest | boolean | NO | true | Digest settimanale |
| followingUpdates | boolean | NO | true | Aggiornamenti following |
| theme | varchar(10) | NO | 'light' | Tema interfaccia |
| language | varchar(2) | NO | 'en' | Lingua |
| defaultCountry | varchar(2) | YES | - | Paese predefinito |
| defaultCity | varchar(100) | YES | - | Città predefinita |
| searchRadius | integer | YES | 50 | Raggio ricerca (km) |
| timezone | varchar(50) | YES | 'UTC' | Fuso orario |
| created_at | timestamptz | NO | CURRENT_TIMESTAMP | Data creazione |
| updated_at | timestamptz | NO | CURRENT_TIMESTAMP | Data aggiornamento |

---

### 11. **user_follow_teachers**
Following insegnanti da parte degli utenti.

| Colonna | Tipo | Nullable | Default | Descrizione |
|---------|------|----------|---------|-------------|
| user_id | integer | NO | - | FK verso users |
| teacher_id | integer | NO | - | FK verso teachers |
| created_at | timestamptz | NO | CURRENT_TIMESTAMP | Data follow |

**Chiave Primaria:** (user_id, teacher_id)

---

### 12. **user_follow_musicians**
Following musicisti da parte degli utenti.

| Colonna | Tipo | Nullable | Default | Descrizione |
|---------|------|----------|---------|-------------|
| user_id | integer | NO | - | FK verso users |
| musician_id | integer | NO | - | FK verso musicians |
| created_at | timestamptz | NO | CURRENT_TIMESTAMP | Data follow |

**Chiave Primaria:** (user_id, musician_id)

---

### 13. **user_follow_events**
Following eventi da parte degli utenti.

| Colonna | Tipo | Nullable | Default | Descrizione |
|---------|------|----------|---------|-------------|
| user_id | integer | NO | - | FK verso users |
| event_id | integer | NO | - | FK verso events |
| created_at | timestamptz | NO | CURRENT_TIMESTAMP | Data follow |

**Chiave Primaria:** (user_id, event_id)

---

### 14. **saved_searches**
Ricerche salvate dagli utenti.

| Colonna | Tipo | Nullable | Default | Descrizione |
|---------|------|----------|---------|-------------|
| id | integer | NO | autoincrement | Chiave primaria |
| user_id | integer | NO | - | FK verso users |
| name | varchar(255) | NO | - | Nome ricerca |
| query | jsonb | NO | - | Parametri ricerca (JSON) |
| created_at | timestamptz | NO | CURRENT_TIMESTAMP | Data salvataggio |

---

### 15. **user_notifications**
Sistema di notifiche utente.

| Colonna | Tipo | Nullable | Default | Descrizione |
|---------|------|----------|---------|-------------|
| id | integer | NO | autoincrement | Chiave primaria |
| user_id | integer | NO | - | FK verso users |
| type | varchar(50) | NO | - | Tipo notifica |
| title | varchar(255) | NO | - | Titolo notifica |
| message | text | NO | - | Messaggio completo |
| read | boolean | NO | false | Letta/non letta |
| created_at | timestamptz | NO | CURRENT_TIMESTAMP | Data creazione |

**Indici:**
- `idx_notifications_user_read` (user_id, read)

---

### 16. **social_media**
Collegamenti social media per entità (insegnanti, musicisti, eventi).

| Colonna | Tipo | Nullable | Default | Descrizione |
|---------|------|----------|---------|-------------|
| id | integer | NO | autoincrement | Chiave primaria |
| entity_type | varchar(20) | NO | - | Tipo entità (teacher/musician/event) |
| entity_id | integer | NO | - | ID entità |
| platform | varchar(50) | NO | - | Piattaforma (instagram, facebook, etc.) |
| url | varchar(500) | NO | - | URL profilo |
| username | varchar(100) | YES | - | Username |
| is_verified | boolean | YES | false | Account verificato |
| follower_count | integer | YES | 0 | Numero follower |
| created_at | timestamptz | YES | CURRENT_TIMESTAMP | Data creazione |
| updated_at | timestamptz | YES | CURRENT_TIMESTAMP | Data aggiornamento |

**Indici:**
- `idx_social_media_entity` (entity_type, entity_id)
- `idx_social_media_platform` (platform)
- `social_media_entity_type_entity_id_platform_key` (entity_type, entity_id, platform) - UNIQUE

---

## 🔑 Relazioni e Vincoli

### Vincoli di Integrità Referenziale

1. **CASCADE DELETE:** Eliminazione a cascata per mantenere consistenza
   - `accounts.user_id` → `users.id`
   - `event_teachers.event_id` → `events.id`
   - `event_teachers.teacher_id` → `teachers.id`
   - `event_musicians.event_id` → `events.id`
   - `event_musicians.musician_id` → `musicians.id`
   - `event_prices.event_id` → `events.id`
   - `venues.event_id` → `events.id`
   - Tutte le tabelle `user_follow_*` e `user_notifications`

2. **UNIQUE CONSTRAINTS:**
   - `users.email`
   - `musicians.slug`
   - `accounts(provider, providerAccountId)`
   - `user_preferences.user_id`
   - `social_media(entity_type, entity_id, platform)`

---

## 📈 Statistiche Database

**Dati Attuali (Produzione):**
- **Eventi:** 8 record
- **Insegnanti:** 30 record
- **Musicisti:** 15 record
- **Venue:** 11 record
- **Prezzi:** ~24 record (3 per evento medio)
- **Collegamenti Insegnanti-Eventi:** ~36 record

---

## 🚀 Ottimizzazioni Performance

### Indici Strategici
1. **Full-text search** su nomi eventi (`idx_events_name_gin`)
2. **Ricerche geografiche** (country, city)
3. **Filtri temporali** (from_date, to_date)
4. **Notifiche utente** ottimizzate per query read/unread

### Suggerimenti per il Futuro
1. **Partitioning** sulla tabella events per date
2. **Indici compositi** per query frequenti
3. **Materialized views** per statistiche aggregate
4. **Connection pooling** già implementato (Supabase)

---

## 🔧 Comandi Utili

### Connessione Database
```bash
# Via Prisma
npx prisma studio

# Via psql
PGPASSWORD=mVVzMkwCK6fP4RG psql -h aws-0-eu-central-1.pooler.supabase.com -U postgres.tqvvseagpkmdnsiuwabv -d postgres -p 5432
```

### Backup e Migrazione
```bash
# Generare client Prisma
npx prisma generate

# Applicare migrazioni
npx prisma db push

# Reset database (solo sviluppo)
npx prisma db reset
```

---

**Ultima Aggiornamento:** 15 Settembre 2025
**Versione Database:** PostgreSQL 17.4
**ORM:** Prisma 5.x