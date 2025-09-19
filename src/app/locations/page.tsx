import { Metadata } from 'next'
import BreadcrumbNavigation from '@/components/ui/BreadcrumbNavigation'
import { OrganizationSchema, WebsiteSchema, FAQSchema } from '@/components/seo/SchemaMarkup'

export const metadata: Metadata = {
  title: 'Blues Dance Location Guides - Best Scenes Worldwide | Blues Festival Finder',
  description: 'Discover the best blues dance scenes worldwide. Comprehensive guides to major blues communities, venues, teachers, and events in Europe, North America, and beyond.',
  keywords: 'blues dance locations, blues dance scenes, blues communities, blues venues, blues dance cities, blues dance worldwide',
  openGraph: {
    title: 'Blues Dance Location Guides - Best Scenes Worldwide',
    description: 'Complete guides to major blues dance scenes across Europe, North America, and worldwide',
    url: 'https://blues-festival-finder.vercel.app/locations',
    type: 'website'
  }
}

const locationData = [
  {
    city: 'Stockholm',
    country: 'Sweden',
    continent: 'Europe',
    description: 'The heart of the European blues dance scene, Stockholm boasts a vibrant community with regular social dances, workshops, and world-class teachers.',
    venues: [
      { name: 'Blues Garage', description: 'Iconic venue known for intimate atmosphere and live blues music' },
      { name: 'Herräng Dance Camp', description: 'World-famous summer dance camp with blues and swing events' }
    ],
    teachers: ['Vicci & Adamo', 'Jennie Löfgren', 'David Linde'],
    events: ['Stockholm Blues Festival', 'Blues Paradise'],
    bestTime: 'Year-round, peak summer season',
    communitySize: 'Large (300+ active dancers)',
    level: 'All levels welcome'
  },
  {
    city: 'Berlin',
    country: 'Germany',
    continent: 'Europe',
    description: 'Berlin\'s blues scene is rapidly growing with a diverse international community and innovative dance styles.',
    venues: [
      { name: 'Swing Factory', description: 'Popular venue for blues and swing dances' },
      { name: 'Monkeys Bar', description: 'Regular blues nights with live music' }
    ],
    teachers: ['Max Pitruzella', 'Sophie Adam', 'Thomas Blomberg'],
    events: ['Berlin Blues Exchange', 'Berlin Swing Festival'],
    bestTime: 'Year-round, especially spring and autumn',
    communitySize: 'Medium (150+ active dancers)',
    level: 'Intermediate to advanced'
  },
  {
    city: 'Boston',
    country: 'USA',
    continent: 'North America',
    description: 'One of the oldest blues dance communities in the US, Boston has a rich history and strong educational foundation.',
    venues: [
      { name: 'Bentley University Ballroom', description: 'Regular blues dance venue with excellent floor' },
      { name: 'MIT Ballroom Dance Club', description: 'Academic venue hosting blues dance events' }
    ],
    teachers: ['Heather Flock', 'Damon Stone', 'Sharon Davis'],
    events: ['Beantown Blues Festival', 'Blues Muse'],
    bestTime: 'September - May',
    communitySize: 'Large (250+ active dancers)',
    level: 'All levels, strong beginner program'
  },
  {
    city: 'San Francisco',
    country: 'USA',
    continent: 'North America',
    description: 'The birthplace of modern blues dance, SF maintains a cutting-edge scene with innovative movements and styles.',
    venues: [
      { name: '9:20 Special', description: 'Historic venue with regular blues dances' },
      { name: 'The Verdi Club', description: 'Elegant venue perfect for blues dancing' }
    ],
    teachers: ['Abby Key', 'Dan Repsch', 'Mike Legenthal'],
    events: ['San Francisco Blues Exchange', 'Blues Bootcamp'],
    bestTime: 'Year-round, mild climate',
    communitySize: 'Large (300+ active dancers)',
    level: 'All levels, advanced techniques emphasized'
  },
  {
    city: 'Barcelona',
    country: 'Spain',
    continent: 'Europe',
    description: 'Spain\'s premier blues dance destination with Mediterranean charm and passionate dancers.',
    venues: [
      { name: 'Swing Maniacs', description: 'Leading blues and swing venue' },
      { name: 'Bluescelona', description: 'Dedicated blues dance studio' }
    ],
    teachers: ['Guillermo Cerutti', 'Sandra Casas', 'Pau Deix'],
    events: ['Barcelona Blues Festival', 'Swing Maniacs Festival'],
    bestTime: 'September - June',
    communitySize: 'Medium (100+ active dancers)',
    level: 'All levels'
  },
  {
    city: 'London',
    country: 'UK',
    continent: 'Europe',
    description: 'A thriving international blues scene with regular events and workshops attracting dancers from across Europe.',
    venues: [
      { name: 'Swing Patrol', description: 'Multiple venues across London' },
      { name: 'The 100 Club', description: 'Historic music venue with blues nights' }
    ],
    teachers: ['Simon Selmon', 'Simon Tamin', 'Joanna Swan'],
    events: ['London Blues Weekend', 'Swingtime Ball'],
    bestTime: 'Year-round',
    communitySize: 'Large (200+ active dancers)',
    level: 'All levels'
  },
  {
    city: 'Portland',
    country: 'USA',
    continent: 'North America',
    description: 'Home to one of America\'s most innovative blues dance communities, known for experimental styles and strong musical connections.',
    venues: [
      { name: 'The Viscount Ballroom', description: 'Elegant venue with regular blues nights' },
      { name: 'Secret Ballroom', description: 'Intimate space for blues dancing' }
    ],
    teachers: ['Brenda Russell', 'Charlie Fuller', 'Heather Mitchell'],
    events: ['Portland Blues Exchange', 'Rose City Blues'],
    bestTime: 'Year-round, best September-May',
    communitySize: 'Large (180+ active dancers)',
    level: 'Intermediate to advanced'
  },
  {
    city: 'Milan',
    country: 'Italy',
    continent: 'Europe',
    description: 'Italy\'s blues dance capital with a passionate community and strong connections to the European blues festival circuit.',
    venues: [
      { name: 'Blues Kitchen', description: 'Dedicated blues dance studio' },
      { name: 'Swing Italian Style', description: 'Regular blues and swing events' }
    ],
    teachers: ['Marco Ferrigno', 'Silvia Grassi', 'Luca Fadda'],
    events: ['Milan Blues Festival', 'Blues Italian Style'],
    bestTime: 'October - June',
    communitySize: 'Medium (120+ active dancers)',
    level: 'All levels'
  },
  {
    city: 'Paris',
    country: 'France',
    continent: 'Europe',
    description: 'A sophisticated blues scene with French influences and regular international exchanges.',
    venues: [
      { name: 'Swing Jam', description: 'Popular blues and swing venue' },
      { name: 'Le Dancing', description: 'Historic ballroom with blues nights' }
    ],
    teachers: ['Julien & Manon', 'Sophie & Romain', 'Camille & Thomas'],
    events: ['Paris Blues Festival', 'Swing de Paris'],
    bestTime: 'Year-round, peak September-May',
    communitySize: 'Medium (150+ active dancers)',
    level: 'All levels welcome'
  },
  {
    city: 'Seoul',
    country: 'South Korea',
    continent: 'Asia',
    description: 'Asia\'s fastest-growing blues dance scene with dedicated dancers and unique cultural influences.',
    venues: [
      { name: 'Blues Seoul', description: 'Primary blues dance studio' },
      { name: 'Swing Korea', description: 'Blues and swing dance community' }
    ],
    teachers: ['Minji Kim', 'Joon Park', 'Soyoung Lee'],
    events: ['Seoul Blues Festival', 'Korea Blues Exchange'],
    bestTime: 'Year-round, indoor venues',
    communitySize: 'Medium (80+ active dancers)',
    level: 'Beginner to intermediate'
  },
  {
    city: 'Melbourne',
    country: 'Australia',
    continent: 'Oceania',
    description: 'Australia\'s blues dance hub with a vibrant community and strong connections to the Asian scene.',
    venues: [
      { name: 'Blues Melbourne', description: 'Regular blues dance events' },
      { name: 'The Swingtime', description: 'Historic venue with blues nights' }
    ],
    teachers: ['Chris & Jules', 'Sarah & Mike', 'Emma & Tom'],
    events: ['Melbourne Blues Festival', 'Blues Down Under'],
    bestTime: 'March - November',
    communitySize: 'Medium (100+ active dancers)',
    level: 'All levels'
  },
  {
    city: 'New Orleans',
    country: 'USA',
    continent: 'North America',
    description: 'The birthplace of blues music, offering authentic experiences and deep cultural connections to blues history.',
    venues: [
      { name: 'The Spotted Cat', description: 'Live blues music venue in French Quarter' },
      { name: 'd.b.a.', description: 'Local favorite for live blues and jazz' }
    ],
    teachers: ['Marcus Brown', 'Lisa Johnson', 'Andre Williams'],
    events: ['New Orleans Jazz & Heritage Festival', 'French Quarter Festival'],
    bestTime: 'Year-round, best spring and fall',
    communitySize: 'Small but dedicated (50+ active dancers)',
    level: 'All levels, strong musical focus'
  },
  {
    city: 'Tokyo',
    country: 'Japan',
    continent: 'Asia',
    description: 'A highly technical blues dance scene with precision dancing and strong community organization.',
    venues: [
      { name: 'Blues Tokyo', description: 'Primary blues dance studio' },
      { name: 'Swing Tokyo', description: 'Regular blues events in central Tokyo' }
    ],
    teachers: ['Yuki Tanaka', 'Kenji Yamamoto', 'Aiko Sato'],
    events: ['Tokyo Blues Festival', 'Japan Blues Exchange'],
    bestTime: 'Year-round',
    communitySize: 'Medium (90+ active dancers)',
    level: 'Intermediate to advanced'
  },
  {
    city: 'Buenos Aires',
    country: 'Argentina',
    continent: 'South America',
    description: 'South America\'s emerging blues scene with tango influences and passionate dancers.',
    venues: [
      { name: 'Blues Buenos Aires', description: 'Dedicated blues dance space' },
      { name: 'La Nacional', description: 'Historic ballroom with blues nights' }
    ],
    teachers: ['Carlos Mendoza', 'Isabella Rodriguez', 'Pedro Garcia'],
    events: ['Buenos Aires Blues Festival', 'Tango & Blues Week'],
    bestTime: 'March - November',
    communitySize: 'Small but growing (40+ active dancers)',
    level: 'Beginner to intermediate'
  }
]

export default function LocationsPage() {
  return (
    <>

      <OrganizationSchema />
      <WebsiteSchema />
      {/* Breadcrumb navigation is handled by the global layout */}

      <div className="min-h-screen bg-gradient-to-b from-navy-900 via-navy-800 to-bordeaux-900">
        {/* Hero Section */}
        <section className="relative py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gold-600 mb-6 jazz-font">
              Blues Dance Locations
            </h1>
            <p className="text-xl md:text-2xl text-cream-100 max-w-3xl mx-auto leading-relaxed">
              Explore 15+ major blues dance scenes across 6 continents
            </p>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-navy-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gold-600/20">
              <h2 className="text-3xl font-bold text-gold-500 mb-4 jazz-font">
                Your Guide to the Best Blues Dance Communities
              </h2>
              <p className="text-cream-100 text-lg leading-relaxed mb-6">
                Whether you&apos;re a traveling blues dancer looking for your next destination or a newcomer
                wanting to connect with local communities, our location guides provide comprehensive
                information about the world&apos;s most active blues dance scenes.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl mb-2">🌍</div>
                  <h3 className="text-gold-500 font-semibold mb-2">Worldwide Coverage</h3>
                  <p className="text-cream-200 text-sm">From Europe to North America and beyond</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🎵</div>
                  <h3 className="text-gold-500 font-semibold mb-2">Scene Details</h3>
                  <p className="text-cream-200 text-sm">Venues, teachers, events, and community info</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">📅</div>
                  <h3 className="text-gold-500 font-semibold mb-2">Planning Help</h3>
                  <p className="text-cream-200 text-sm">Best times to visit and level recommendations</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Locations Grid */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {locationData.map((location, index) => (
                <div
                  key={index}
                  className="bg-navy-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gold-600/20 hover:border-gold-600/40 transition-all duration-300 hover:shadow-2xl hover:shadow-gold-600/10"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gold-500 jazz-font mb-1">
                        {location.city}
                      </h3>
                      <p className="text-cream-300 flex items-center gap-2">
                        <span>📍</span>
                        {location.country}, {location.continent}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gold-400 font-semibold">
                        {location.communitySize}
                      </div>
                      <div className="text-xs text-cream-400">
                        {location.level}
                      </div>
                    </div>
                  </div>

                  <p className="text-cream-100 text-sm leading-relaxed mb-4">
                    {location.description}
                  </p>

                  <div className="space-y-4">
                    {/* Venues */}
                    <div>
                      <h4 className="text-gold-400 font-semibold text-sm mb-2 flex items-center gap-2">
                        <span>🎭</span> Key Venues
                      </h4>
                      <div className="space-y-2">
                        {location.venues.map((venue, venueIndex) => (
                          <div key={venueIndex} className="bg-navy-700/50 rounded-lg p-3">
                            <div className="font-medium text-cream-100 text-sm">
                              {venue.name}
                            </div>
                            <div className="text-cream-300 text-xs mt-1">
                              {venue.description}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Teachers */}
                    <div>
                      <h4 className="text-gold-400 font-semibold text-sm mb-2 flex items-center gap-2">
                        <span>👨‍🏫</span> Notable Teachers
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {location.teachers.map((teacher, teacherIndex) => (
                          <span
                            key={teacherIndex}
                            className="bg-bordeaux-700/50 text-cream-100 text-xs px-3 py-1 rounded-full"
                          >
                            {teacher}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Events */}
                    <div>
                      <h4 className="text-gold-400 font-semibold text-sm mb-2 flex items-center gap-2">
                        <span>🎉</span> Major Events
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {location.events.map((event, eventIndex) => (
                          <span
                            key={eventIndex}
                            className="bg-gold-700/30 text-cream-100 text-xs px-3 py-1 rounded-full"
                          >
                            {event}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Best Time */}
                    <div className="pt-2 border-t border-gold-600/20">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gold-400">📅 Best Time:</span>
                        <span className="text-cream-100">{location.bestTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gold-500 mb-8 text-center jazz-font">
              Common Questions About Blues Dance Locations
            </h2>

            <div className="space-y-4">
              <div className="bg-navy-800/50 rounded-xl p-6 border border-gold-600/20">
                <h3 className="text-xl font-semibold text-gold-400 mb-3">
                  What makes a good blues dance scene?
                </h3>
                <p className="text-cream-100">
                  A thriving blues dance scene typically has regular social dances (at least weekly),
                  qualified instructors offering classes, a welcoming community, and live music venues
                  that support blues dancing. Community size and consistency of events are key indicators.
                </p>
              </div>

              <div className="bg-navy-800/50 rounded-xl p-6 border border-gold-600/20">
                <h3 className="text-xl font-semibold text-gold-400 mb-3">
                  How can I connect with local blues communities?
                </h3>
                <p className="text-cream-100">
                  Most scenes have Facebook groups, Meetup pages, or websites where they post events.
                  Check local dance studios, search for "blues dance [city]" on social media,
                  or contact the teachers listed in our guides for current information.
                </p>
              </div>

              <div className="bg-navy-800/50 rounded-xl p-6 border border-gold-600/20">
                <h3 className="text-xl font-semibold text-gold-400 mb-3">
                  Do I need a partner to attend blues dances?
                </h3>
                <p className="text-cream-100">
                  No! Blues dance communities are very welcoming to solo dancers. Most events practice
                  partner rotation during classes, and social dances typically encourage everyone
                  to dance with different partners throughout the evening.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-bordeaux-700/50 to-gold-700/50 backdrop-blur-sm rounded-2xl p-8 border border-gold-600/30">
              <h2 className="text-3xl font-bold text-gold-500 mb-4 jazz-font">
                Planning Your Blues Dance Journey?
              </h2>
              <p className="text-xl text-cream-100 mb-6">
                Explore our comprehensive database of blues festivals and events worldwide
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/search"
                  className="bg-gold-600 hover:bg-gold-700 text-navy-900 font-semibold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  Browse Events
                </a>
                <a
                  href="/teachers"
                  className="border-2 border-gold-600 text-gold-600 hover:bg-gold-600/10 font-semibold px-8 py-3 rounded-xl transition-all duration-300"
                >
                  Find Teachers
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}