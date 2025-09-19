'use client'

interface EnhancedEventSchemaProps {
  event: {
    id: string
    name: string
    description?: string
    startDate: string
    endDate?: string
    location: {
      name?: string
      city: string
      country: string
      address?: string
      latitude?: number
      longitude?: number
    }
    imageUrl?: string
    url?: string
    organizer?: {
      name: string
      url?: string
      email?: string
    }
    offers?: Array<{
      price: number
      currency: string
      availability: string
      validFrom?: string
      url?: string
    }>
    performers?: Array<{
      name: string
      type: string
      url?: string
      image?: string
    }>
    attendees?: {
      min?: number
      max?: number
    }
    eventStatus?: 'EventScheduled' | 'EventCancelled' | 'EventPostponed'
    keywords?: string[]
    inLanguage?: string
    isAccessibleForFree?: boolean
  }
}

export function EnhancedEventSchema({ event }: EnhancedEventSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Festival",
    "name": event.name,
    "description": event.description,
    "startDate": event.startDate,
    "endDate": event.endDate || event.startDate,
    "location": {
      "@type": "Place",
      "name": event.location.name || `${event.location.city}, ${event.location.country}`,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": event.location.city,
        "addressCountry": event.location.country,
        "streetAddress": event.location.address
      },
      "geo": event.location.latitude && event.location.longitude ? {
        "@type": "GeoCoordinates",
        "latitude": event.location.latitude,
        "longitude": event.location.longitude
      } : undefined
    },
    "image": event.imageUrl,
    "url": event.url,
    "organizer": event.organizer ? {
      "@type": "Organization",
      "name": event.organizer.name,
      "url": event.organizer.url,
      "email": event.organizer.email
    } : undefined,
    "offers": event.offers?.map(offer => ({
      "@type": "Offer",
      "price": offer.price,
      "priceCurrency": offer.currency,
      "availability": `https://schema.org/${offer.availability}`,
      "validFrom": offer.validFrom,
      "url": offer.url
    })),
    "performer": event.performers?.map(performer => ({
      "@type": performer.type === "MusicGroup" ? "MusicGroup" : "Person",
      "name": performer.name,
      "url": performer.url,
      "image": performer.image
    })),
    "attendeeMode": "https://schema.org/OfflineEventAttendanceMode",
    "eventStatus": `https://schema.org/${event.eventStatus || 'EventScheduled'}`,
    "keywords": event.keywords || ["blues dance", "festival", "dance event"],
    "inLanguage": event.inLanguage || "en",
    "isAccessibleForFree": event.isAccessibleForFree || false,
    "typicalAgeRange": "18+",
    "maximumAttendeeCapacity": event.attendees?.max,
    "remainingAttendeeCapacity": event.attendees?.max && event.attendees?.min ?
      event.attendees.max - event.attendees.min : undefined
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  )
}

interface DanceEventSchemaProps {
  events: EnhancedEventSchemaProps['event'][]
}

export function DanceEventSchema({ events }: DanceEventSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Blues Dance Festivals and Events",
    "description": "A curated list of blues dance festivals and events worldwide",
    "itemListElement": events.map((event, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Festival",
        "name": event.name,
        "description": event.description,
        "url": event.url,
        "startDate": event.startDate,
        "location": {
          "@type": "Place",
          "name": event.location.name,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": event.location.city,
            "addressCountry": event.location.country
          }
        }
      }
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  )
}