'use client'

import { FestivalCardFigma, ArtistCardFigma, SearchFilterFigma } from '@/components/figma'

// Demo data
const mockFestival = {
  id: "festival-1",
  title: "Chicago Blues Festival 2025",
  location: "Chicago, IL",
  date: "June 15-17, 2025",
  price: "$120",
  genre: "Traditional Blues",
  featured: true,
  attendees: 1250,
  rating: 4.8,
  imageUrl: "/images/festival-placeholder.jpg",
  artists: ["Muddy Waters Jr.", "Buddy Guy", "Koko Taylor"]
}

const mockArtist = {
  id: "artist-1",
  name: "Sarah Johnson",
  instrument: "Guitar & Vocals",
  location: "New Orleans, LA",
  nextShow: "July 20, 2025",
  followers: 2840,
  imageUrl: "/images/artist-placeholder.jpg",
  genres: ["Delta Blues", "Acoustic"],
  isFollowing: false,
  type: "musician" as const
}

const mockTeacher = {
  id: "teacher-1",
  name: "Marcus Blues",
  instrument: "Slow Blues & Technique",
  location: "Austin, TX",
  nextShow: "Blues Workshop Series",
  followers: 1520,
  imageUrl: "/images/teacher-placeholder.jpg",
  genres: ["Blues Dance", "Technique"],
  isFollowing: true,
  type: "teacher" as const
}

export default function DemoFigmaPage() {
  const handleSearch = (query: string) => {
    console.log('Search:', query)
  }

  const handleFilter = (filters: any) => {
    console.log('Filters:', filters)
  }

  const handleFollow = (id: string, isFollowing: boolean) => {
    console.log('Follow toggle:', id, isFollowing)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-primary-900 to-primary-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-4">
            Figma Components Demo
          </h1>
          <p className="text-center text-gray-300 mb-8">
            Components adapted from Figma design for Blues Dance Festival Finder
          </p>
        </div>

        {/* Search Filter Demo */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Search & Filter Component</h2>
          <SearchFilterFigma 
            onSearch={handleSearch}
            onFilter={handleFilter}
          />
        </section>

        {/* Festival Card Demo */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Festival Card Component</h2>
          <div className="max-w-md">
            <FestivalCardFigma {...mockFestival} />
          </div>
        </section>

        {/* Artist Cards Demo */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Artist & Teacher Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            <div>
              <h3 className="text-lg font-medium mb-2 text-gold-400">Musician Card</h3>
              <ArtistCardFigma 
                {...mockArtist}
                onFollowToggle={handleFollow}
              />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2 text-gold-400">Teacher Card</h3>
              <ArtistCardFigma 
                {...mockTeacher}
                onFollowToggle={handleFollow}
              />
            </div>
          </div>
        </section>

        {/* Grid Demo */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Grid Layout Demo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FestivalCardFigma 
              {...mockFestival}
              id="festival-2"
              title="Memphis Blues Heritage"
              location="Memphis, TN"
              featured={false}
              rating={4.6}
              attendees={890}
            />
            <FestivalCardFigma 
              {...mockFestival}
              id="festival-3"
              title="Delta Blues Experience"
              location="Clarksdale, MS"
              genre="Delta Blues"
              featured={true}
              rating={4.9}
              attendees={1500}
            />
            <FestivalCardFigma 
              {...mockFestival}
              id="festival-4"
              title="Austin Blues Underground"
              location="Austin, TX"
              genre="Modern Blues"
              featured={false}
              rating={4.4}
              attendees={650}
            />
          </div>
        </section>

        {/* Integration Notes */}
        <section className="mb-12 bg-white/10 backdrop-blur rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Integration Notes</h2>
          <div className="prose prose-invert max-w-none">
            <ul className="space-y-2 text-gray-300">
              <li><strong>✅ Adapted:</strong> Components use our existing UI library (Button, Card, Badge, Input)</li>
              <li><strong>✅ Styled:</strong> Colors adapted to blues theme (gold accents, navy backgrounds)</li>
              <li><strong>✅ Responsive:</strong> Mobile-first design with Tailwind breakpoints</li>
              <li><strong>✅ Accessible:</strong> Proper semantic HTML and ARIA attributes</li>
              <li><strong>✅ Interactive:</strong> Follow buttons, search filters, hover effects</li>
              <li><strong>⚡ Performance:</strong> Next.js Image optimization, component lazy loading</li>
              <li><strong>🎨 Design:</strong> Consistent with Figma mockups but adapted to our theme</li>
            </ul>
          </div>
        </section>

        {/* Usage Examples */}
        <section className="bg-gray-900/50 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Usage Examples</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gold-400 mb-2">Import Components:</h3>
              <pre className="bg-black/50 p-4 rounded text-sm overflow-x-auto">
                <code>{`import { FestivalCardFigma, ArtistCardFigma, SearchFilterFigma } from '@/components/figma'`}</code>
              </pre>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gold-400 mb-2">Use in Pages:</h3>
              <pre className="bg-black/50 p-4 rounded text-sm overflow-x-auto">
                <code>{`<FestivalCardFigma 
  id="festival-1"
  title="Chicago Blues Festival"
  location="Chicago, IL"
  // ... other props
/>`}</code>
              </pre>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}