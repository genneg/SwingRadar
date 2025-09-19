import { cn } from '@/lib/utils'

describe('lib/utils', () => {
  describe('cn', () => {
    it('should combine class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2')
    })

    it('should handle conditional classes', () => {
      expect(cn('class1', true && 'class2', false && 'class3')).toBe('class1 class2')
    })

    it('should handle empty values', () => {
      expect(cn('class1', '', null, undefined, 'class2')).toBe('class1 class2')
    })

    it('should handle arrays', () => {
      expect(cn(['class1', 'class2'], 'class3')).toBe('class1 class2 class3')
    })

    it('should handle objects', () => {
      expect(cn({ class1: true, class2: false, class3: true })).toBe('class1 class3')
    })

    it('should return empty string for no arguments', () => {
      expect(cn()).toBe('')
    })
  })
})