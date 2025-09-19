'use client'

import { useState } from 'react'
import { FAQSchema } from '@/components/seo/SchemaMarkup'
// FAQ data with comprehensive blues dance questions
const faqData = [
  {
    category: 'Getting Started',
    questions: [
      {
        id: 'what-is-blues-dance',
        question: 'What is blues dance?',
        answer: 'Blues dance is an intimate, grounded partner dance that evolved alongside blues music in African American communities. It emphasizes connection between partners, improvisation, and expressing the feeling of blues music through movement. Unlike other social dances, blues dance focuses on the subtle communication between partners and interpretation of the music\'s emotional depth.',
      },
      {
        id: 'beginner-requirements',
        question: 'Do I need experience to attend blues dance festivals?',
        answer: 'No prior experience is required! Most blues dance festivals welcome dancers of all levels, from complete beginners to advanced dancers. Many festivals offer beginner-friendly workshops, introduction classes, and have designated areas for new dancers to practice. The blues dance community is known for being inclusive and supportive of newcomers.',
      },
      {
        id: 'what-to-expect',
        question: 'What can I expect at my first blues dance festival?',
        answer: 'A typical blues dance festival includes workshops with renowned teachers, social dancing in the evenings, live music performances, and often competitions or performances. You\'ll experience a welcoming community, learn new moves and techniques, dance to amazing live blues music, and make connections with dancers from around the world.',
      },
      {
        id: 'dress-code',
        question: 'What should I wear to a blues dance festival?',
        answer: 'Comfortable clothing that allows for movement is key. For workshops, casual clothing and comfortable shoes (leather-soled dance shoes, sneakers, or comfortable flats work well). For evening social dancing, many dancers dress up more - think vintage-inspired outfits, cocktail attire, or whatever makes you feel confident on the dance floor.',
      },
    ],
  },
  {
    category: 'Finding Events',
    questions: [
      {
        id: 'how-to-find-festivals',
        question: 'How do I find blues dance festivals near me?',
        answer: 'Blues Festival Finder is the best resource for discovering blues dance festivals worldwide! Use our search filters to find events by location, date, teacher, or musician. You can also follow your favorite teachers and musicians to get notified when they\'re teaching at festivals. Additionally, local blues dance communities and Facebook groups often share regional events.',
      },
      {
        id: 'festival-timing',
        question: 'When do most blues dance festivals happen?',
        answer: 'Blues dance festivals occur year-round, but there are some seasonal patterns. Many major festivals happen during spring and fall months when weather is comfortable. Summer often features outdoor events and camps, while winter months may have more intimate indoor gatherings. Holiday weekends are particularly popular for longer festivals.',
      },
      {
        id: 'international-festivals',
        question: 'Are there blues dance festivals outside the United States?',
        answer: 'Absolutely! The blues dance community is global, with amazing festivals in Europe (especially Germany, France, UK, and Scandinavia), Australia, Asia, and South America. European festivals like Blues Muse (Germany), Keep on Groovin\' (France), and Smokey Feet (UK) are particularly renowned for their high-quality instruction and vibrant communities.',
      },
      {
        id: 'virtual-events',
        question: 'Are there virtual or online blues dance events?',
        answer: 'Yes! Especially since 2020, many events offer virtual workshops, online social dancing sessions, and hybrid formats. These can be great for learning from teachers you couldn\'t otherwise access, practicing at home, or staying connected with the community when you can\'t travel.',
      },
    ],
  },
  {
    category: 'Festival Experience',
    questions: [
      {
        id: 'workshop-levels',
        question: 'How do I choose the right workshop level?',
        answer: 'Most festivals offer workshops for Beginner, Intermediate, and Advanced levels. Beginners should look for "Introduction to Blues" or "Blues Basics" classes. If you\'ve been dancing blues for 6+ months, intermediate might be right. Advanced is typically for dancers with several years of experience and solid fundamentals. Don\'t be afraid to ask organizers for guidance!',
      },
      {
        id: 'partner-requirements',
        question: 'Do I need to bring a partner to blues dance festivals?',
        answer: 'No partner required! Blues dance festivals are designed for both coupled and solo attendees. In workshops, partners are typically rotated regularly so everyone gets to dance with different people. During social dancing, it\'s completely normal and expected to ask others to dance, regardless of whether you came with someone.',
      },
      {
        id: 'live-music',
        question: 'Will there be live music at the festival?',
        answer: 'Many blues dance festivals feature live musicians, which is one of the most magical aspects of these events! Dancing to live blues music creates an incredible energy and connection. Check the festival lineup to see which musicians will be performing. Even festivals without live music typically feature excellent DJs playing authentic blues tracks.',
      },
      {
        id: 'accommodation',
        question: 'Where should I stay during a blues dance festival?',
        answer: 'Options vary by festival. Some offer host housing (staying with local dancers), which is a great way to save money and make friends. Others have partnered hotels with group rates. Airbnb, hostels, or camping might also be available. Many festivals provide accommodation information on their websites, and organizers can often help with recommendations.',
      },
    ],
  },
  {
    category: 'Learning & Teaching',
    questions: [
      {
        id: 'finding-teachers',
        question: 'How do I find and follow my favorite blues dance teachers?',
        answer: 'On Blues Festival Finder, you can follow teachers to get notifications about their upcoming festival appearances. This is perfect for planning your festival attendance around instructors you want to learn from. You can also check teachers\' personal websites and social media for their teaching schedules and travel plans.',
      },
      {
        id: 'teacher-styles',
        question: 'Do different teachers have different blues dance styles?',
        answer: 'Yes! Blues dance is quite diverse, with influences from different regions, eras of blues music, and individual teacher backgrounds. Some teachers focus on traditional blues idiom, others on contemporary fusion styles. Some emphasize musicality, others connection or improvisation. Attending workshops with different teachers helps you develop a well-rounded dance vocabulary.',
      },
      {
        id: 'home-practice',
        question: 'How can I practice blues dance between festivals?',
        answer: 'Look for local blues dance scenes in your area - many cities have weekly or monthly blues dance events. If there\'s no local scene, try reaching out to swing dance communities, as there\'s often overlap. You can also practice solo work at home, work on musicality, and connect with the broader blues dance community online.',
      },
      {
        id: 'becoming-teacher',
        question: 'How do I become a blues dance teacher?',
        answer: 'Start by becoming a strong social dancer with several years of experience. Take workshops with many different teachers to develop your own style and teaching perspective. Begin by helping in your local scene, then start teaching beginner classes. Many teachers start by teaching locally before being invited to teach at festivals. Focus on developing both your dance skills and your ability to communicate effectively with students.',
      },
    ],
  },
  {
    category: 'Technical & Website',
    questions: [
      {
        id: 'website-features',
        question: 'What features does Blues Festival Finder offer?',
        answer: 'Blues Festival Finder provides comprehensive festival search and filtering, teacher and musician following systems, event calendars, detailed festival information, and notifications about upcoming events featuring your followed artists. Our platform is designed specifically for the blues dance community with features you won\'t find on general event platforms.',
      },
      {
        id: 'following-notifications',
        question: 'How do notifications work when I follow teachers or musicians?',
        answer: 'When you follow a teacher or musician, you\'ll receive notifications (via email or on-platform) when they\'re announced for upcoming festivals. This helps you plan your festival attendance around the instructors and performers you\'re most excited to learn from or see perform.',
      },
      {
        id: 'mobile-access',
        question: 'Can I use Blues Festival Finder on my mobile device?',
        answer: 'Yes! Our website is fully responsive and optimized for mobile devices. You can search for festivals, check your followed teachers\' schedules, and access all features from your smartphone or tablet. We\'re also working on a dedicated mobile app for even better mobile experience.',
      },
      {
        id: 'add-festival',
        question: 'How can I add my festival to Blues Festival Finder?',
        answer: 'Festival organizers can submit their events through our contact form or by reaching out directly. We welcome all blues dance festivals and workshops to join our platform. We verify all submissions to ensure accuracy and quality. There\'s no cost to list your festival - we\'re committed to supporting the entire blues dance community.',
      },
    ],
  },
]

// Flatten all questions for schema markup
const allQuestions = faqData.flatMap(category =>
  category.questions.map(q => ({
    question: q.question,
    answer: q.answer
  }))
)

// Metadata will be handled by layout since this is a client component

interface FAQItemProps {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  return (
    <div className="border border-gold-600/20 rounded-lg vintage-card">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-navy-800/30 transition-all duration-300 rounded-lg"
        aria-expanded={isOpen}
      >
        <h3 className="text-lg font-semibold text-gold-600 jazz-font">
          {question}
        </h3>
        {isOpen ? (
          <svg className="w-5 h-5 text-gold-600 flex-shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-gold-600 flex-shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="px-6 pb-4 border-t border-gold-600/20 mt-2 pt-4">
          <p className="text-cream-50 leading-relaxed whitespace-pre-line">
            {answer}
          </p>
        </div>
      )}
    </div>
  )
}

interface FAQCategoryProps {
  category: string
  questions: Array<{
    id: string
    question: string
    answer: string
  }>
  openItems: Set<string>
  onToggle: (id: string) => void
}

function FAQCategory({ category, questions, openItems, onToggle }: FAQCategoryProps) {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-gold-600 jazz-font mb-6 flex items-center">
        <span className="w-12 h-px bg-gold-600 mr-4"></span>
        {category}
        <span className="w-12 h-px bg-gold-600 ml-4"></span>
      </h2>

      <div className="space-y-4">
        {questions.map((faq) => (
          <FAQItem
            key={faq.id}
            question={faq.question}
            answer={faq.answer}
            isOpen={openItems.has(faq.id)}
            onToggle={() => onToggle(faq.id)}
          />
        ))}
      </div>
    </div>
  )
}

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState('')

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id)
    } else {
      newOpenItems.add(id)
    }
    setOpenItems(newOpenItems)
  }

  const filteredFaqData = searchTerm
    ? faqData.map(category => ({
        ...category,
        questions: category.questions.filter(
          q =>
            q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.answer.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(category => category.questions.length > 0)
    : faqData

  return (
    <>
      <FAQSchema faqs={allQuestions} />

      <div className="min-h-screen bg-gradient-to-br from-navy-900 via-primary-900 to-primary-950">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gold-600 jazz-font mb-6">
              Blues Dance FAQ
            </h1>
            <p className="text-xl text-cream-50 max-w-3xl mx-auto leading-relaxed">
              Everything you need to know about blues dance festivals, getting started,
              and making the most of the blues dance community.
            </p>
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <input
                type="text"
                placeholder="Search FAQ questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 bg-navy-800/50 border border-gold-600/30 rounded-lg text-cream-50 placeholder-cream-50/60 focus:outline-none focus:border-gold-600 transition-all duration-300"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="max-w-4xl mx-auto mb-12">
            <h2 className="text-xl font-semibold text-gold-600 jazz-font mb-4 text-center">
              Quick Navigation
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {faqData.map((category) => (
                <button
                  key={category.category}
                  onClick={() => {
                    const element = document.getElementById(category.category.toLowerCase().replace(/\s+/g, '-'))
                    element?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="px-4 py-2 bg-navy-800/50 border border-gold-600/30 rounded-lg text-cream-50 hover:bg-gold-600/20 transition-all duration-300"
                >
                  {category.category}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Content */}
          <div className="max-w-4xl mx-auto">
            {filteredFaqData.length > 0 ? (
              filteredFaqData.map((category) => (
                <div
                  key={category.category}
                  id={category.category.toLowerCase().replace(/\s+/g, '-')}
                >
                  <FAQCategory
                    category={category.category}
                    questions={category.questions}
                    openItems={openItems}
                    onToggle={toggleItem}
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-cream-50/60 text-lg">
                  No FAQ items found matching "{searchTerm}". Try a different search term.
                </p>
              </div>
            )}
          </div>

          {/* Call to Action */}
          <div className="max-w-4xl mx-auto mt-16 text-center">
            <div className="bg-gradient-to-r from-gold-600/10 to-bordeaux-900/10 rounded-lg p-8 border border-gold-600/20">
              <h2 className="text-2xl font-bold text-gold-600 jazz-font mb-4">
                Still Have Questions?
              </h2>
              <p className="text-cream-50 mb-6">
                Can't find what you're looking for? Our blues dance community is here to help!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="px-6 py-3 bg-gold-600 text-navy-900 font-semibold rounded-lg hover:bg-gold-700 transition-all duration-300"
                >
                  Contact Us
                </a>
                <a
                  href="/search"
                  className="px-6 py-3 border border-gold-600 text-gold-600 font-semibold rounded-lg hover:bg-gold-600/10 transition-all duration-300"
                >
                  Find Festivals
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}