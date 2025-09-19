import { forwardRef } from 'react'

import { cn } from '@/lib/utils'

// Form Group Component
interface FormGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const FormGroup = forwardRef<HTMLDivElement, FormGroupProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('space-y-1', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
FormGroup.displayName = 'FormGroup'

// Form Label Component
interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

const FormLabel = forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, required, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn('form-label', className)}
        {...props}
      >
        {children}
        {required && <span className="text-error-500 ml-1">*</span>}
      </label>
    )
  }
)
FormLabel.displayName = 'FormLabel'

// Form Error Component
interface FormErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode
}

const FormError = forwardRef<HTMLParagraphElement, FormErrorProps>(
  ({ className, children, ...props }, ref) => {
    if (!children) return null
    
    return (
      <p
        ref={ref}
        className={cn('form-error', className)}
        {...props}
      >
        {children}
      </p>
    )
  }
)
FormError.displayName = 'FormError'

// Form Hint Component
interface FormHintProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode
}

const FormHint = forwardRef<HTMLParagraphElement, FormHintProps>(
  ({ className, children, ...props }, ref) => {
    if (!children) return null
    
    return (
      <p
        ref={ref}
        className={cn('form-hint', className)}
        {...props}
      >
        {children}
      </p>
    )
  }
)
FormHint.displayName = 'FormHint'

// Textarea Component
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, resize = 'vertical', ...props }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`
    
    const resizeClasses = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize'
    }
    
    return (
      <FormGroup>
        {label && (
          <FormLabel htmlFor={textareaId}>
            {label}
          </FormLabel>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'form-textarea',
            resizeClasses[resize],
            error && 'border-error-500 focus:ring-error-500',
            className
          )}
          {...props}
        />
        <FormHint>{hint}</FormHint>
        <FormError>{error}</FormError>
      </FormGroup>
    )
  }
)
Textarea.displayName = 'Textarea'

// Select Component
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  placeholder?: string
  children: React.ReactNode
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, hint, id, placeholder, children, ...props }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`
    
    return (
      <FormGroup>
        {label && (
          <FormLabel htmlFor={selectId}>
            {label}
          </FormLabel>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'form-select',
            error && 'border-error-500 focus:ring-error-500',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {children}
        </select>
        <FormHint>{hint}</FormHint>
        <FormError>{error}</FormError>
      </FormGroup>
    )
  }
)
Select.displayName = 'Select'

// Checkbox Component
interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`
    
    return (
      <FormGroup>
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              ref={ref}
              type="checkbox"
              id={checkboxId}
              className={cn(
                'form-checkbox',
                error && 'border-error-500 focus:ring-error-500',
                className
              )}
              {...props}
            />
          </div>
          {label && (
            <div className="ml-3 text-sm">
              <FormLabel htmlFor={checkboxId} className="mb-0">
                {label}
              </FormLabel>
            </div>
          )}
        </div>
        <FormHint>{hint}</FormHint>
        <FormError>{error}</FormError>
      </FormGroup>
    )
  }
)
Checkbox.displayName = 'Checkbox'

// Radio Component
interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`
    
    return (
      <FormGroup>
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              ref={ref}
              type="radio"
              id={radioId}
              className={cn(
                'form-radio',
                error && 'border-error-500 focus:ring-error-500',
                className
              )}
              {...props}
            />
          </div>
          {label && (
            <div className="ml-3 text-sm">
              <FormLabel htmlFor={radioId} className="mb-0">
                {label}
              </FormLabel>
            </div>
          )}
        </div>
        <FormHint>{hint}</FormHint>
        <FormError>{error}</FormError>
      </FormGroup>
    )
  }
)
Radio.displayName = 'Radio'

// RadioGroup Component
interface RadioGroupProps extends React.HTMLAttributes<HTMLFieldSetElement> {
  legend?: string
  error?: string
  hint?: string
  children: React.ReactNode
}

const RadioGroup = forwardRef<HTMLFieldSetElement, RadioGroupProps>(
  ({ className, legend, error, hint, children, ...props }, ref) => {
    return (
      <fieldset
        ref={ref}
        className={cn('space-y-3', className)}
        {...props}
      >
        {legend && (
          <legend className="text-sm font-medium text-neutral-700 mb-3">
            {legend}
          </legend>
        )}
        <div className="space-y-3">
          {children}
        </div>
        <FormHint>{hint}</FormHint>
        <FormError>{error}</FormError>
      </fieldset>
    )
  }
)
RadioGroup.displayName = 'RadioGroup'

export {
  FormGroup,
  FormLabel,
  FormError,
  FormHint,
  Textarea,
  Select,
  Checkbox,
  Radio,
  RadioGroup
}

export type {
  FormGroupProps,
  FormLabelProps,
  FormErrorProps,
  FormHintProps,
  TextareaProps,
  SelectProps,
  CheckboxProps,
  RadioProps,
  RadioGroupProps
}