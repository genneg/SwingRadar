'use client'

interface EnhancedTeacherSchemaProps {
  teacher: {
    id: string
    name: string
    description?: string
    imageUrl?: string
    url?: string
    location?: {
      city: string
      country: string
    }
    specialties?: string[]
    experience?: number
    achievements?: string[]
    socialMedia?: {
      facebook?: string
      instagram?: string
      youtube?: string
      website?: string
    }
    teachingStyle?: string
    languages?: string[]
    certification?: string[]
    eventsTaught?: number
    studentCount?: number
  }
}

export function EnhancedTeacherSchema({ teacher }: EnhancedTeacherSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": teacher.name,
    "description": teacher.description || `Professional blues dance teacher based in ${teacher.location?.city || 'worldwide'}`,
    "image": teacher.imageUrl,
    "url": teacher.url,
    "jobTitle": "Blues Dance Teacher",
    "worksFor": {
      "@type": "Organization",
      "name": "Blues Dance Community",
      "description": "Professional dance instruction and performance"
    },
    "address": teacher.location ? {
      "@type": "PostalAddress",
      "addressLocality": teacher.location.city,
      "addressCountry": teacher.location.country
    } : undefined,
    "sameAs": [
      teacher.socialMedia?.website,
      teacher.socialMedia?.facebook,
      teacher.socialMedia?.instagram,
      teacher.socialMedia?.youtube
    ].filter(Boolean),
    "knowsAbout": teacher.specialties || [
      "blues dance",
      "partner dancing",
      "dance instruction",
      "dance technique",
      "musicality",
      "dance history"
    ],
    "hasOccupation": {
      "@type": "Occupation",
      "name": "Dance Instructor",
      "description": "Teaching blues dance techniques, musicality, and partner connection",
      "occupationalCategory": "27-2043.00",
      "experienceRequirements": teacher.experience ? `${teacher.experience}+ years of experience` : undefined
    },
    "award": teacher.achievements,
    "knowsLanguage": teacher.languages || ["English"],
    "alumniOf": teacher.certification?.map(cert => ({
      "@type": "EducationalOrganization",
      "name": cert
    })),
    "performerIn": teacher.eventsTaught ? {
      "@type": "EventSeries",
      "name": "Blues Dance Workshops and Festivals",
      "numberOfEvents": teacher.eventsTaught
    } : undefined
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  )
}

interface TeacherListSchemaProps {
  teachers: EnhancedTeacherSchemaProps['teacher'][]
  location?: string
}

export function TeacherListSchema({ teachers, location }: TeacherListSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": location ? `Blues Dance Teachers in ${location}` : "Blues Dance Teachers Worldwide",
    "description": "Professional blues dance instructors specializing in various blues dance styles",
    "numberOfItems": teachers.length,
    "itemListElement": teachers.map((teacher, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Person",
        "name": teacher.name,
        "description": teacher.description,
        "url": teacher.url,
        "jobTitle": "Blues Dance Teacher",
        "image": teacher.imageUrl,
        "address": teacher.location ? {
          "@type": "PostalAddress",
          "addressLocality": teacher.location.city,
          "addressCountry": teacher.location.country
        } : undefined,
        "knowsAbout": teacher.specialties || ["blues dance"]
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

interface DanceOrganizationSchemaProps {
  organization: {
    name: string
    description?: string
    url?: string
    logo?: string
    location?: {
      city: string
      country: string
      address?: string
    }
    members?: number
    founded?: string
    focus?: string[]
    events?: number
    teachers?: string[]
  }
}

export function DanceOrganizationSchema({ organization }: DanceOrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": organization.name,
    "description": organization.description,
    "url": organization.url,
    "logo": organization.logo,
    "address": organization.location ? {
      "@type": "PostalAddress",
      "streetAddress": organization.location.address,
      "addressLocality": organization.location.city,
      "addressCountry": organization.location.country
    } : undefined,
    "foundingDate": organization.founded,
    "numberOfEmployees": organization.members,
    "knowsAbout": organization.focus || ["blues dance", "dance education", "dance events"],
    "subOrganization": organization.teachers?.map(teacher => ({
      "@type": "Person",
      "name": teacher
    })),
    "event": organization.events ? {
      "@type": "EventSeries",
      "name": `${organization.name} Events`,
      "numberOfEvents": organization.events
    } : undefined,
    "sameAs": organization.url
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  )
}