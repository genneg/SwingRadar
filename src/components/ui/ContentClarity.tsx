'use client'

import { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface JargonTerm {
  term: string
  definition: string
  category?: string
  example?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
}

interface ContentClarityProps {
  jargonTooltips?: Record<string, JargonTerm>
  beginnerMode?: boolean
  showDifficulty?: boolean
  enableTextToSpeech?: boolean
  className?: string
  children: React.ReactNode
}

interface TooltipProps {
  term: string
  definition: string
  example?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

// Default jargon terms for blues dancing
const defaultJargonTerms: Record<string, JargonTerm> = {
  'blues dance': {
    term: 'blues dance',
    definition: 'A family of historical dances developed alongside blues music, characterized by an improvised lead-follow connection and grounded movement.',
    category: 'Dance Style',
    example: 'Slow drag and ballroomin\' are popular blues dance styles.',
    difficulty: 'beginner'
  },
  'social dance': {
    term: 'social dance',
    definition: 'Partner dancing done for social enjoyment and connection rather than performance or competition.',
    category: 'Dance Context',
    example: 'Blues festivals often feature social dancing events.',
    difficulty: 'beginner'
  },
  'workshop': {
    term: 'workshop',
    definition: 'A structured learning session where teachers instruct students on specific dance techniques or concepts.',
    category: 'Event Type',
    example: 'The festival offers beginner and advanced workshops.',
    difficulty: 'beginner'
  },
  'social': {
    term: 'social',
    definition: 'An informal dancing event where participants can dance freely with different partners.',
    category: 'Event Type',
    example: 'The evening social runs from 9 PM to 2 AM.',
    difficulty: 'beginner'
  },
  'ballroomin\'': {
    term: 'ballroomin\'',
    definition: 'A blues dance style danced to faster blues music, featuring smooth traveling steps.',
    category: 'Dance Style',
    example: 'Ballroomin\' is great for uptempo blues songs.',
    difficulty: 'intermediate'
  },
  'slow drag': {
    term: 'slow drag',
    definition: 'A close embrace blues dance style typically danced to slow blues music.',
    category: 'Dance Style',
    example: 'Slow drag emphasizes connection and subtle movement.',
    difficulty: 'beginner'
  },
  'jukin\'': {
    term: 'jukin\'',
    definition: 'An energetic blues dance style featuring solo movement and personal expression.',
    category: 'Dance Style',
    example: 'Jukin\' is often danced to more raw, traditional blues.',
    difficulty: 'intermediate'
  },
  'connection': {
    term: 'connection',
    definition: 'The physical and emotional communication between dance partners through touch and movement.',
    category: 'Dance Concept',
    example: 'Good connection makes the dance feel effortless.',
    difficulty: 'beginner'
  },
  'pulse': {
    term: 'pulse',
    definition: 'The rhythmic bouncing motion that connects dancers to the music\'s beat.',
    category: 'Dance Technique',
    example: 'A consistent pulse helps partners stay together.',
    difficulty: 'beginner'
  },
  'frame': {
    term: 'frame',
    definition: 'The structure created by dancers\' arms and bodies that facilitates lead-follow communication.',
    category: 'Dance Technique',
    example: 'A flexible frame allows for better communication.',
    difficulty: 'intermediate'
  }
}

export function ContentClarity({
  jargonTooltips = defaultJargonTerms,
  beginnerMode = false,
  showDifficulty = true,
  enableTextToSpeech = false,
  className,
  children
}: ContentClarityProps) {
  const [activeTooltips, setActiveTooltips] = useState<Set<string>>(new Set())

  const processContent = useCallback((content: React.ReactNode): React.ReactNode => {
    if (typeof content !== 'string') return content

    let processedContent = content

    // Replace jargon terms with tooltip versions
    Object.entries(jargonTooltips).forEach(([term, termData]) => {
      const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
      processedContent = processedContent.replace(regex, (match) => {
        const termKey = term.toLowerCase()
        return `<span class="jargon-term" data-term="${termKey}" style="border-bottom: 1px dashed #fbbf24; cursor: help;">${match}</span>`
      })
    })

    return processedContent
  }, [jargonTooltips])

  const handleTermClick = useCallback((termKey: string) => {
    setActiveTooltips(prev => {
      const newSet = new Set(prev)
      if (newSet.has(termKey)) {
        newSet.delete(termKey)
      } else {
        newSet.add(termKey)
      }
      return newSet
    })
  }, [])

  const handleTextToSpeech = useCallback((text: string) => {
    if ('speechSynthesis' in window && enableTextToSpeech) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      speechSynthesis.speak(utterance)
    }
  }, [enableTextToSpeech])

  return (
    <div className={cn('relative', className)}>
      {/* Process children content */}
      {typeof children === 'string' ? (
        <div
          dangerouslySetInnerHTML={{ __html: processContent(children) }}
          className="content-processed"
          onClick={(e) => {
            const target = e.target as HTMLElement
            if (target.classList.contains('jargon-term')) {
              const termKey = target.getAttribute('data-term')
              if (termKey) {
                handleTermClick(termKey)
                const termData = jargonTooltips[termKey]
                if (termData) {
                  handleTextToSpeech(termData.definition)
                }
              }
            }
          }}
        />
      ) : (
        children
      )}

      {/* Tooltips */}
      {Array.from(activeTooltips).map((termKey) => {
        const termData = jargonTooltips[termKey]
        if (!termData) return null

        return (
          <JargonTooltip
            key={termKey}
            term={termData.term}
            definition={termData.definition}
            example={termData.example}
            difficulty={termData.difficulty}
            showDifficulty={showDifficulty}
            onClose={() => handleTermClick(termKey)}
            onSpeak={() => handleTextToSpeech(termData.definition)}
          />
        )
      })}

      {/* Beginner mode indicator */}
      {beginnerMode && (
        <div className="fixed top-20 right-4 z-40 bg-gold-600 text-navy-900 px-4 py-2 rounded-lg shadow-lg jazz-font font-bold animate-pulse">
          Beginner Mode Active
        </div>
      )}
    </div>
  )
}

export function JargonTooltip({
  term,
  definition,
  example,
  difficulty,
  showDifficulty = true,
  position = 'bottom',
  onClose,
  onSpeak,
  className
}: TooltipProps & {
  showDifficulty?: boolean
  onClose?: () => void
  onSpeak?: () => void
}) {
  const getDifficultyColor = (diff?: string) => {
    switch (diff) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-300'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'advanced': return 'bg-red-100 text-red-800 border-red-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getDifficultyLabel = (diff?: string) => {
    switch (diff) {
      case 'beginner': return 'Beginner'
      case 'intermediate': return 'Intermediate'
      case 'advanced': return 'Advanced'
      default: return 'Unknown'
    }
  }

  return (
    <div
      className={cn(
        'fixed z-50 max-w-sm bg-white rounded-xl shadow-2xl border-2 border-gold-400 p-6',
        'animate-in fade-in-50 zoom-in-95',
        className
      )}
      style={{
        top: position === 'bottom' ? '100%' : 'auto',
        bottom: position === 'top' ? '100%' : 'auto',
        left: '50%',
        transform: 'translateX(-50%)',
        marginTop: position === 'bottom' ? '8px' : '0',
        marginBottom: position === 'top' ? '8px' : '0'
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="jazz-font text-xl text-navy-900 font-bold">{term}</h3>
        <button
          onClick={onClose}
          className="ml-2 p-1 hover:bg-gold-100 rounded-full transition-colors"
          aria-label="Close tooltip"
        >
          <span className="text-navy-600">×</span>
        </button>
      </div>

      {showDifficulty && difficulty && (
        <div className="mb-3">
          <span className={cn(
            'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border',
            getDifficultyColor(difficulty)
          )}>
            {getDifficultyLabel(difficulty)}
          </span>
        </div>
      )}

      <p className="text-navy-700 mb-3 leading-relaxed">{definition}</p>

      {example && (
        <div className="bg-gold-50 p-3 rounded-lg mb-3">
          <p className="text-sm text-navy-600 italic">
            <span className="font-semibold not-italic">Example:</span> {example}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gold-200">
        <button
          onClick={onSpeak}
          className="flex items-center space-x-2 text-gold-600 hover:text-gold-700 transition-colors"
          aria-label={`Listen to definition of ${term}`}
        >
          <span className="text-lg">🔊</span>
          <span className="text-sm jazz-font">Listen</span>
        </button>

        <span className="text-xs text-navy-400 jazz-font">
          Click term to close
        </span>
      </div>

      {/* Arrow pointing to the term */}
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-l-2 border-t-2 border-gold-400 rotate-45"></div>
    </div>
  )
}

// Component for simplified content display
export function SimplifiedContent({
  original,
  simplified,
  showToggle = true,
  defaultSimplified = false,
  className
}: {
  original: React.ReactNode
  simplified: React.ReactNode
  showToggle?: boolean
  defaultSimplified?: boolean
  className?: string
}) {
  const [isSimplified, setIsSimplified] = useState(defaultSimplified)

  return (
    <div className={cn('relative', className)}>
      <div className="prose prose-vintage max-w-none">
        {isSimplified ? simplified : original}
      </div>

      {showToggle && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setIsSimplified(!isSimplified)}
            className="vintage-button bg-gold-600 hover:bg-gold-500 text-navy-900 px-6 py-2 rounded-lg jazz-font font-bold flex items-center space-x-2"
          >
            <span>{isSimplified ? 'Show Original' : 'Simplify Text'}</span>
            <span>📖</span>
          </button>
        </div>
      )}
    </div>
  )
}

// Hook for managing content clarity settings
export function useContentClarity() {
  const [beginnerMode, setBeginnerMode] = useState(false)
  const [simplifiedText, setSimplifiedText] = useState(false)
  const [textToSpeech, setTextToSpeech] = useState(false)

  const toggleBeginnerMode = useCallback(() => {
    setBeginnerMode(prev => !prev)
  }, [])

  const toggleSimplifiedText = useCallback(() => {
    setSimplifiedText(prev => !prev)
  }, [])

  const toggleTextToSpeech = useCallback(() => {
    setTextToSpeech(prev => !prev)
  }, [])

  return {
    beginnerMode,
    simplifiedText,
    textToSpeech,
    toggleBeginnerMode,
    toggleSimplifiedText,
    toggleTextToSpeech
  }
}

// Component for beginner-friendly glossary
export function BeginnerGlossary({
  terms = Object.values(defaultJargonTerms),
  className
}: {
  terms?: JargonTerm[]
  className?: string
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = Array.from(new Set(terms.map(term => term.category).filter(Boolean)))

  const filteredTerms = terms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         term.definition.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className={cn('bg-gradient-to-br from-cream-50 to-bordeaux-50 rounded-xl p-6', className)}>
      <h2 className="jazz-font text-2xl text-navy-900 mb-6">Blues Dance Glossary</h2>

      <div className="mb-6 space-y-4">
        <div>
          <input
            type="text"
            placeholder="Search terms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gold-300 focus:outline-none focus:ring-2 focus:ring-gold-500"
            aria-label="Search glossary terms"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={cn(
              'px-3 py-1 rounded-full text-sm font-medium transition-colors',
              selectedCategory === 'all'
                ? 'bg-gold-600 text-navy-900'
                : 'bg-gold-200 text-navy-700 hover:bg-gold-300'
            )}
          >
            All Categories
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                selectedCategory === category
                  ? 'bg-gold-600 text-navy-900'
                  : 'bg-gold-200 text-navy-700 hover:bg-gold-300'
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filteredTerms.map((term, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border border-gold-200">
            <div className="flex items-start justify-between mb-2">
              <h3 className="jazz-font text-lg text-navy-900 font-bold">{term.term}</h3>
              {term.difficulty && (
                <span className={cn(
                  'px-2 py-1 rounded-full text-xs font-medium',
                  term.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                  term.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                )}>
                  {term.difficulty}
                </span>
              )}
            </div>
            <p className="text-navy-700 mb-2">{term.definition}</p>
            {term.example && (
              <p className="text-sm text-navy-600 italic">
                <span className="font-semibold not-italic">Example:</span> {term.example}
              </p>
            )}
          </div>
        ))}
      </div>

      {filteredTerms.length === 0 && (
        <div className="text-center py-8 text-navy-600">
          <p className="jazz-font text-lg">No terms found matching your search.</p>
        </div>
      )}
    </div>
  )
}