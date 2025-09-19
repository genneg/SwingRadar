# Google Search Console Setup Guide

## Overview
Google Search Console è uno strumento gratuito che aiuta a monitorare, mantenere e risolvere i problemi della presenza del sito nei risultati di ricerca Google.

## Setup Steps

### 1. Verifica del Dominio

**Opzioni di verifica disponibili:**

#### A. Verifica tramite DNS Record (Raccomandato)
1. Accedi a [Google Search Console](https://search.google.com/search-console/)
2. Clicca su "Aggiungi proprietà"
3. Seleziona "Dominio" e inserisci: `blues-festival-finder.vercel.app`
4. Google fornirà un TXT record DNS
5. Aggiungi il record DNS tramite Vercel:
   - Vai su Vercel Dashboard
   - Seleziona il progetto
   - Vai su "Settings" > "Domains"
   - Clicca su "Edit" accanto al dominio
   - Aggiungi il TXT record fornito da Google

#### B. Verifica tramite Meta Tag HTML (Alternative)
1. Seleziona "Prefisso URL" invece di "Dominio"
2. Inserisci: `https://blues-festival-finder.vercel.app`
3. Scegli "Tag HTML" come metodo di verifica
4. Copia il tag meta fornito
5. Aggiungi al file `_document.tsx`:

```tsx
<meta name="google-site-verification" content="CODICE_FORNITO_DA_GOOGLE" />
```

6. Deploy del sito e verifica

### 2. Configurazione Iniziale

Dopo la verifica, configura:

#### A. Sitemap Submission
1. Vai su "Sitemaps" nella barra laterale
2. Aggiungi sitemap URL: `sitemap.xml`
3. Clicca "Invia"
4. Controlla che lo stato sia "Success"

#### B. Configurazione Proprietà
1. **Paese di Destinazione**: Lascia "Non specificato" (sito globale)
2. **Proprietà Preferita**: Imposta come preferita se è l'unico dominio

### 3. Monitoraggio Impostazioni

#### A. Copertura dell'Indice
- Monitora pagine indicizzate vs errori
- Target: 95%+ pagine valide

#### B. Prestazioni di Ricerca
- Monitora query, impressioni, clic, CTR
- Target keywords: "blues festivals 2025", "blues dance events"

#### C. Usabilità Mobile
- Assicurati che tutte le pagine siano mobile-friendly
- Target: 100% pagine senza problemi

#### D. Core Web Vitals
- Monitora LCP, FID, CLS
- Target: tutte le metriche in "Good"

### 4. Configurazione Avanzata

#### A. Associazione con Google Analytics
1. Vai su "Impostazioni" > "Associazioni"
2. Collega con Google Analytics 4 property
3. Abilita condivisione dati per report avanzati

#### B. Configurazione Crawling
1. **robots.txt**: Verifica che sia accessibile
2. **Crawl Budget**: Monitora per siti con 1000+ pagine
3. **Velocità di Crawling**: Lascia automatico inizialmente

#### C. Configurazione Internazionale
1. **hreflang**: Non necessario inizialmente (sito in inglese)
2. **Targeting Geografico**: Globale
3. **URL Parameters**: Configura per filtri search page

### 5. Alert e Notifiche

#### A. Email Notifications
1. Vai su "Impostazioni" > "Utenti e autorizzazioni"
2. Aggiungi email per notifiche critiche
3. Abilita notifiche per:
   - Problemi critici di indicizzazione
   - Problemi di sicurezza
   - Penalizzazioni manuali

#### B. Dashboard Monitoring
Controlla settimanalmente:
- Errori di copertura
- Problemi di usabilità mobile
- Core Web Vitals performance
- Query performance trends

### 6. Integration con Development Workflow

#### A. Environment Variables
Aggiungi a `.env.local`:
```
GOOGLE_SITE_VERIFICATION=codice_verifica_google
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

#### B. Sitemap Automatico
Il sitemap è già configurato in:
- `public/sitemap.xml` (attuale)
- Future: dynamic sitemap generation

#### C. Testing Setup
1. **Staging verification**: Configura anche per staging.vercel.app
2. **URL Inspection**: Testa nuove pagine prima del launch
3. **Rich Results Testing**: Testa schema markup

### 7. SEO Optimization Tasks

#### A. Immediate Actions (Settimana 1)
- [ ] Verifica dominio principale
- [ ] Invia sitemap
- [ ] Configura email notifications
- [ ] Controlla problemi esistenti

#### B. Weekly Monitoring
- [ ] Controlla copertura dell'indice
- [ ] Analizza performance delle query
- [ ] Monitora errori crawling
- [ ] Verifica mobile usability

#### C. Monthly Review
- [ ] Analizza trend del traffico organico
- [ ] Ottimizza pagine con basso CTR
- [ ] Aggiorna meta descriptions per query top
- [ ] Pianifica contenuti basati su search queries

### 8. Common Issues & Solutions

#### A. Indicizzazione Lenta
**Problema**: Nuove pagine non indicizzate
**Soluzione**:
- Verifica internal linking
- Richiedi indicizzazione manuale via URL Inspection
- Controlla robots.txt

#### B. Calo delle Impressioni
**Problema**: Diminuzione visibilità search
**Soluzione**:
- Analizza competitor rankings
- Aggiorna contenuti obsoleti
- Migliora meta tags e titles

#### C. Problemi Mobile Usability
**Problema**: Errori mobile-friendliness
**Soluzione**:
- Testa con Mobile-Friendly Test
- Ottimizza font sizes e touch targets
- Migliora velocità di caricamento mobile

### 9. Success Metrics

#### A. Baseline Targets (Mese 1-2)
- **Pagine Indicizzate**: 15-20 pagine
- **Average Position**: <50 per target keywords
- **Impressions**: 100-500/mese
- **CTR**: >2%

#### B. Growth Targets (Mese 3-6)
- **Pagine Indicizzate**: 50+ pagine
- **Average Position**: <25 per target keywords
- **Impressions**: 1000-5000/mese
- **CTR**: >3%
- **Clicks**: 30-150/mese

#### C. Mature Targets (Mese 6+)
- **Pagine Indicizzate**: 100+ pagine
- **Average Position**: <10 per target keywords principali
- **Impressions**: 5000-15000/mese
- **CTR**: >5%
- **Clicks**: 250-750/mese

### 10. Documentation & Reporting

#### A. Weekly Reports
Crea report automatici con:
- Top performing pages
- New indexing issues
- Performance changes
- Technical errors

#### B. Monthly SEO Report
Include:
- Organic traffic growth
- Keyword ranking improvements
- Technical SEO health
- Content performance
- Competitor analysis

Questo setup garantisce un monitoraggio completo delle performance SEO e aiuta a identificare rapidamente problemi e opportunità di crescita.