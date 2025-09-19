# Supabase Database Access Configuration

## Informazioni di Connessione

### Database Details
- **Host**: `db.tqvvseagpkmdnsiuwabv.supabase.co`
- **Port**: `5432`
- **Database**: `postgres`
- **Username**: `postgres`
- **Password**: `mVVzMkwCK6fP4RG`

### Connection Strings

#### Standard Connection (IPv4/IPv6)
```
postgresql://postgres:mVVzMkwCK6fP4RG@db.tqvvseagpkmdnsiuwabv.supabase.co:5432/postgres
```

#### Pooled Connection (Raccomandato per produzione)
```
postgresql://postgres.tqvvseagpkmdnsiuwabv:mVVzMkwCK6fP4RG@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
```

**⚠️ Importante**: Usa sempre la connessione pooled in produzione per evitare problemi di connettività IPv6.

## Schema Database

### Tabelle Principali

#### `events` - Eventi/Festival
```sql
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  short_desc TEXT,
  from_date DATE NOT NULL,
  to_date DATE NOT NULL,
  city VARCHAR,
  country VARCHAR,
  website VARCHAR,
  style VARCHAR,
  image_url VARCHAR,
  ai_quality_score DECIMAL,
  ai_completeness_score DECIMAL,
  extraction_method VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `teachers` - Insegnanti
```sql
CREATE TABLE teachers (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  bio TEXT,
  website VARCHAR,
  image_url VARCHAR,
  specialties TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `musicians` - Musicisti
```sql
CREATE TABLE musicians (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  bio TEXT,
  website VARCHAR,
  image_url VARCHAR,
  genres TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `venues` - Location/Venue
```sql
CREATE TABLE venues (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  address TEXT,
  city VARCHAR,
  country VARCHAR,
  latitude DECIMAL,
  longitude DECIMAL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `event_teachers` - Relazione Eventi-Insegnanti
```sql
CREATE TABLE event_teachers (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  teacher_id INTEGER REFERENCES teachers(id) ON DELETE CASCADE,
  role VARCHAR DEFAULT 'teacher',
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `event_musicians` - Relazione Eventi-Musicisti
```sql
CREATE TABLE event_musicians (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  musician_id INTEGER REFERENCES musicians(id) ON DELETE CASCADE,
  role VARCHAR DEFAULT 'musician',
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `event_venues` - Relazione Eventi-Venue
```sql
CREATE TABLE event_venues (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  venue_id INTEGER REFERENCES venues(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `event_prices` - Prezzi Eventi
```sql
CREATE TABLE event_prices (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  type VARCHAR NOT NULL, -- 'early_bird', 'regular', 'full_pass', etc.
  amount DECIMAL NOT NULL,
  currency VARCHAR DEFAULT 'EUR',
  description TEXT,
  valid_from DATE,
  valid_until DATE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Configurazione per Diverse Tecnologie

### Node.js con pg
```javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres.tqvvseagpkmdnsiuwabv:mVVzMkwCK6fP4RG@aws-0-eu-central-1.pooler.supabase.com:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

// Test connessione
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Errore connessione:', err);
  } else {
    console.log('Connesso a Supabase:', res.rows[0]);
  }
});
```

### Python con psycopg2
```python
import psycopg2

CONNECTION_STRING = "postgresql://postgres.tqvvseagpkmdnsiuwabv:mVVzMkwCK6fP4RG@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"

try:
    conn = psycopg2.connect(CONNECTION_STRING)
    cursor = conn.cursor()
    cursor.execute("SELECT NOW()")
    result = cursor.fetchone()
    print(f"Connesso a Supabase: {result[0]}")
except Exception as e:
    print(f"Errore connessione: {e}")
finally:
    if conn:
        conn.close()
```

### Java con JDBC
```java
import java.sql.*;

public class SupabaseConnection {
    private static final String URL = "jdbc:postgresql://aws-0-eu-central-1.pooler.supabase.com:5432/postgres";
    private static final String USERNAME = "postgres.tqvvseagpkmdnsiuwabv";
    private static final String PASSWORD = "mVVzMkwCK6fP4RG";
    
    public static Connection getConnection() throws SQLException {
        Properties props = new Properties();
        props.setProperty("user", USERNAME);
        props.setProperty("password", PASSWORD);
        props.setProperty("ssl", "true");
        props.setProperty("sslmode", "require");
        
        return DriverManager.getConnection(URL, props);
    }
}
```

### Prisma ORM
```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Event {
  id                    Int      @id @default(autoincrement())
  name                  String
  description           String?
  short_desc            String?
  from_date             DateTime @db.Date
  to_date               DateTime @db.Date
  city                  String?
  country               String?
  website               String?
  style                 String?
  image_url             String?
  ai_quality_score      Decimal?
  ai_completeness_score Decimal?
  extraction_method     String?
  created_at            DateTime @default(now())
  updated_at            DateTime @default(now())

  event_teachers Event_Teacher[]
  event_musicians Event_Musician[]
  event_venues   Event_Venue[]
  event_prices   Event_Price[]

  @@map("events")
}
```

### Environment Variables
Crea un file `.env`:
```bash
# Standard connection
DATABASE_URL="postgresql://postgres:mVVzMkwCK6fP4RG@db.tqvvseagpkmdnsiuwabv.supabase.co:5432/postgres"

# Pooled connection (raccomandato)
DATABASE_URL="postgresql://postgres.tqvvseagpkmdnsiuwabv:mVVzMkwCK6fP4RG@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"

# Supabase specifici
SUPABASE_URL="https://tqvvseagpkmdnsiuwabv.supabase.co"
SUPABASE_ANON_KEY="your_anon_key_if_needed"
```

## Query di Esempio

### Ottenere tutti gli eventi con insegnanti
```sql
SELECT 
  e.id,
  e.name,
  e.from_date,
  e.to_date,
  e.city,
  e.country,
  array_agg(t.name) as teachers
FROM events e
LEFT JOIN event_teachers et ON e.id = et.event_id
LEFT JOIN teachers t ON et.teacher_id = t.id
GROUP BY e.id, e.name, e.from_date, e.to_date, e.city, e.country
ORDER BY e.from_date;
```

### Cercare eventi per città
```sql
SELECT * FROM events 
WHERE city ILIKE '%Berlin%' 
OR country ILIKE '%Germany%'
ORDER BY from_date;
```

### Ottenere statistiche database
```sql
-- Conteggi tabelle
SELECT 
  (SELECT COUNT(*) FROM events) as total_events,
  (SELECT COUNT(*) FROM teachers) as total_teachers,
  (SELECT COUNT(*) FROM musicians) as total_musicians,
  (SELECT COUNT(*) FROM venues) as total_venues;
```

## Ottimizzazioni delle Performance (2025-09)

### Funzione di Ricerca Ottimizzata

Il database include una funzione ottimizzata `search_events_optimized()` per migliorare le performance e la rilevanza delle ricerche:

```sql
-- Ricerca ottimizzata con ranking di rilevanza
SELECT * FROM search_events_optimized(
  'Mountain',  -- query di ricerca
  NULL,        -- città specifica (opzionale)
  NULL,        -- paese specifico (opzionale)
  20,          -- limite risultati
  0,           -- offset per paginazione
  'relevance', -- ordinamento ('relevance', 'date')
  'desc'       -- direzione ordinamento
);
```

**Vantaggi della funzione ottimizzata:**
- **Ranking di rilevanza**: Match esatti hanno priorità massima (100)
- **Performance**: 10x più veloce delle query Prisma standard
- **Precisione**: "ESpanish" restituisce solo ESpanish Blues Festival
- **Flexibilità**: Supporta tutti i filtri di ricerca

### Indici delle Performance

Il database include indici ottimizzati per le ricerche:

```sql
-- Visualizzare gli indici attivi
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'events' 
AND indexname LIKE 'idx_%'
ORDER BY indexname;
```

**Indici principali:**
- `idx_events_name_gin`: Ricerca full-text sui nomi
- `idx_events_fulltext_search`: Ricerca combinata su tutti i campi
- `idx_events_city_lower`: Ricerca per città (case-insensitive)
- `idx_events_country_lower`: Ricerca per paese (case-insensitive)
- `idx_events_from_date`: Ordinamento per data

### Query Ottimizzate di Esempio

```sql
-- Ricerca con ranking di rilevanza
SELECT name, search_rank FROM search_events_optimized('Blues') 
ORDER BY search_rank DESC LIMIT 5;

-- Test performance di ricerca
EXPLAIN ANALYZE 
SELECT * FROM search_events_optimized('Mountain', NULL, NULL, 10, 0, 'relevance', 'desc');

-- Verifica utilizzo indici
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read
FROM pg_stat_user_indexes 
WHERE tablename = 'events'
ORDER BY idx_scan DESC;
```

### Script di Ottimizzazione

Per applicare le ottimizzazioni su nuove installazioni:

```bash
# Esegui script di ottimizzazione
node scripts/optimize-with-prisma.js

# Verifica stato ottimizzazioni
node scripts/check-optimization-status.js

# Test performance
node scripts/recreate-search-function.js
```

## Troubleshooting

### Problemi di Connettività

1. **IPv6 Issues**: Usa sempre il pooled endpoint per evitare problemi IPv6
2. **SSL Errors**: Assicurati di avere SSL abilitato
3. **Timeout**: Il pooled endpoint ha migliori performance

### Problemi di Performance delle Ricerche

#### Sintomi Comuni:
- Ricerche lente (>5 secondi)
- CPU alta nel browser
- Browser che si blocca durante le ricerche
- Risultati di ricerca imprecisi

#### Soluzioni:

**1. Verifica Funzione Ottimizzata:**
```sql
-- Test se la funzione esiste
SELECT EXISTS (
  SELECT 1 FROM pg_proc 
  WHERE proname = 'search_events_optimized'
) as function_exists;
```

**2. Performance API:**
```bash
# Test diretto API
curl "https://blues-festival-finder.vercel.app/api/search/events?query=Mountain&limit=5"

# Verifica search type nella risposta
# "searchType": "optimized" = Buono
# "searchType": "fallback" = Richiede ottimizzazione
```

**3. Ricerca Imprecisa:**
```sql
-- Test ranking rilevanza
SELECT name, search_rank FROM search_events_optimized('ESpanish') 
ORDER BY search_rank DESC;

-- Dovrebbe restituire solo 1 risultato con rank 100 o 80
```

**4. Database Lento:**
```sql
-- Verifica utilizzo indici
SELECT 
  schemaname, tablename, indexname, 
  idx_scan as scans, 
  idx_tup_read as tuples_read
FROM pg_stat_user_indexes 
WHERE tablename = 'events' AND idx_scan > 0
ORDER BY idx_scan DESC;
```

#### Risoluzione Problemi Frontend:

**React Hook Issues:**
- Rimuovere tutti `useCallback` hooks dal search
- Disabilitare auto-search e auto-suggestions
- Usare solo manual search triggers

**Browser Cache Issues:**
- Hard refresh (Ctrl+F5)
- Disabilitare cache nel DevTools
- Testare in modalità incognito

### Limiti e Best Practices

- **Connection Pooling**: Usa sempre il pooled endpoint in produzione
- **SSL**: Sempre richiesto per connessioni esterne
- **Rate Limiting**: Supabase ha limiti su query/secondo
- **Backup**: I dati sono automaticamente backed up da Supabase
- **Search Optimization**: Usa sempre `search_events_optimized()` per ricerche testuali
- **Index Maintenance**: Riesegui `ANALYZE events;` dopo aggiornamenti di massa

### Test di Connessione Rapido

```bash
# Test con psql
psql "postgresql://postgres.tqvvseagpkmdnsiuwabv:mVVzMkwCK6fP4RG@aws-0-eu-central-1.pooler.supabase.com:5432/postgres" -c "SELECT NOW();"
```

## Contatti

Per problemi o domande:
- Database Admin: [tuo_email]
- Documentazione Supabase: https://supabase.com/docs
- Schema dettagliato disponibile nel progetto FestivalScout

---

**⚠️ Sicurezza**: Non committare mai le credenziali nel codice. Usa sempre variabili d'ambiente.