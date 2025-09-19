// Validation utilities

export interface ValidationError {
  field: string
  message: string
  code: string
}

export interface ValidationResult<T> {
  success: boolean
  data?: T
  errors: ValidationError[]
}

// Common validation patterns
export const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  phone: /^\+?[\d\s\-\(\)]+$/,
  date: /^\d{4}-\d{2}-\d{2}$/,
  time: /^\d{2}:\d{2}$/
}

// Generic validator function
export function validate<T>(
  data: any,
  schema: ValidationSchema<T>
): ValidationResult<T> {
  const errors: ValidationError[] = []
  const result: any = {}

  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field]
    const fieldErrors = validateField(field, value, rules as FieldRules)
    
    if (fieldErrors.length > 0) {
      errors.push(...fieldErrors)
    } else if (value !== undefined) {
      result[field] = value
    }
  }

  return {
    success: errors.length === 0,
    data: errors.length === 0 ? result : undefined,
    errors
  }
}

type ValidationSchema<T> = {
  [K in keyof T]: FieldRules
}

interface FieldRules {
  required?: boolean
  type?: 'string' | 'number' | 'boolean' | 'date' | 'email' | 'url'
  min?: number
  max?: number
  pattern?: RegExp
  custom?: (value: any) => string | null
}

function validateField(field: string, value: any, rules: FieldRules): ValidationError[] {
  const errors: ValidationError[] = []

  // Required validation
  if (rules.required && (value === undefined || value === null || value === '')) {
    errors.push({
      field,
      message: `${field} is required`,
      code: 'required'
    })
    return errors
  }

  // Skip other validations if value is empty and not required
  if (value === undefined || value === null || value === '') {
    return errors
  }

  // Type validation
  if (rules.type) {
    const typeError = validateType(field, value, rules.type)
    if (typeError) {
errors.push(typeError)
}
  }

  // Length/range validation
  if (rules.min !== undefined) {
    const minError = validateMin(field, value, rules.min)
    if (minError) {
errors.push(minError)
}
  }

  if (rules.max !== undefined) {
    const maxError = validateMax(field, value, rules.max)
    if (maxError) {
errors.push(maxError)
}
  }

  // Pattern validation
  if (rules.pattern) {
    const patternError = validatePattern(field, value, rules.pattern)
    if (patternError) {
errors.push(patternError)
}
  }

  // Custom validation
  if (rules.custom) {
    const customError = rules.custom(value)
    if (customError) {
      errors.push({
        field,
        message: customError,
        code: 'custom'
      })
    }
  }

  return errors
}

function validateType(field: string, value: any, type: string): ValidationError | null {
  switch (type) {
    case 'string':
      if (typeof value !== 'string') {
        return { field, message: `${field} must be a string`, code: 'type' }
      }
      break
    case 'number':
      if (typeof value !== 'number' || isNaN(value)) {
        return { field, message: `${field} must be a number`, code: 'type' }
      }
      break
    case 'boolean':
      if (typeof value !== 'boolean') {
        return { field, message: `${field} must be a boolean`, code: 'type' }
      }
      break
    case 'email':
      if (!patterns.email.test(value)) {
        return { field, message: `${field} must be a valid email`, code: 'type' }
      }
      break
    case 'url':
      if (!patterns.url.test(value)) {
        return { field, message: `${field} must be a valid URL`, code: 'type' }
      }
      break
    case 'date':
      if (!patterns.date.test(value)) {
        return { field, message: `${field} must be a valid date (YYYY-MM-DD)`, code: 'type' }
      }
      break
  }
  return null
}

function validateMin(field: string, value: any, min: number): ValidationError | null {
  const length = typeof value === 'string' ? value.length : value
  if (length < min) {
    return {
      field,
      message: `${field} must be at least ${min} ${typeof value === 'string' ? 'characters' : ''}`,
      code: 'min'
    }
  }
  return null
}

function validateMax(field: string, value: any, max: number): ValidationError | null {
  const length = typeof value === 'string' ? value.length : value
  if (length > max) {
    return {
      field,
      message: `${field} must be at most ${max} ${typeof value === 'string' ? 'characters' : ''}`,
      code: 'max'
    }
  }
  return null
}

function validatePattern(field: string, value: any, pattern: RegExp): ValidationError | null {
  if (!pattern.test(value)) {
    return {
      field,
      message: `${field} format is invalid`,
      code: 'pattern'
    }
  }
  return null
}

// Pre-built validation schemas
export const schemas = {
  user: {
    name: { required: true, type: 'string' as const, min: 2, max: 50 },
    email: { required: true, type: 'email' as const },
    password: { required: true, type: 'string' as const, min: 8 }
  },
  event: {
    name: { required: true, type: 'string' as const, min: 3, max: 100 },
    description: { required: true, type: 'string' as const, min: 10 },
    startDate: { required: true, type: 'date' as const },
    endDate: { required: true, type: 'date' as const },
    website: { type: 'url' as const }
  }
}