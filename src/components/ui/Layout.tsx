import { forwardRef } from 'react'

import { cn } from '@/lib/utils'

// Container Component
interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  padding?: boolean
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = 'lg', padding = true, children, ...props }, ref) => {
    const sizes = {
      sm: 'max-w-2xl',
      md: 'max-w-4xl',
      lg: 'max-w-6xl',
      xl: 'max-w-7xl',
      full: 'max-w-none'
    }

    return (
      <div
        ref={ref}
        className={cn(
          'mx-auto',
          sizes[size],
          padding && 'px-4 sm:px-6 lg:px-8',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Container.displayName = 'Container'

// Section Component
interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  background?: 'transparent' | 'white' | 'neutral' | 'primary' | 'blues'
}

const Section = forwardRef<HTMLElement, SectionProps>(
  ({ className, spacing = 'md', background = 'transparent', children, ...props }, ref) => {
    const spacings = {
      none: '',
      sm: 'py-8',
      md: 'py-12 sm:py-16',
      lg: 'py-16 sm:py-20',
      xl: 'py-20 sm:py-24'
    }

    const backgrounds = {
      transparent: '',
      white: 'bg-white',
      neutral: 'bg-neutral-50',
      primary: 'bg-primary-50',
      blues: 'bg-blues-50'
    }

    return (
      <section
        ref={ref}
        className={cn(
          spacings[spacing],
          backgrounds[background],
          className
        )}
        {...props}
      >
        {children}
      </section>
    )
  }
)
Section.displayName = 'Section'

// Grid Component
interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'auto-fit' | 'auto-fill'
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  responsive?: boolean
}

const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols = 'auto-fit', gap = 'md', responsive = true, children, ...props }, ref) => {
    const getGridCols = () => {
      if (cols === 'auto-fit') return 'grid-auto-fit'
      if (cols === 'auto-fill') return 'grid-auto-fill'
      
      const baseGrid = `grid-cols-${cols}`
      if (!responsive) return baseGrid
      
      // Responsive grid classes
      switch (cols) {
        case 1: return 'grid-cols-1'
        case 2: return 'grid-cols-1 sm:grid-cols-2'
        case 3: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        case 4: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        case 5: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
        case 6: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
        case 7: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7'
        case 8: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8'
        case 9: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-9'
        case 10: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-10'
        case 11: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-11'
        case 12: return 'grid-cols-12'
        default: return baseGrid
      }
    }

    const gaps = {
      none: 'gap-0',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8'
    }

    return (
      <div
        ref={ref}
        className={cn(
          'grid',
          getGridCols(),
          gaps[gap],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Grid.displayName = 'Grid'

// Flex Component
interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse'
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

const Flex = forwardRef<HTMLDivElement, FlexProps>(
  ({ 
    className, 
    direction = 'row', 
    align = 'start', 
    justify = 'start', 
    wrap = 'nowrap',
    gap = 'none',
    children, 
    ...props 
  }, ref) => {
    const directions = {
      row: 'flex-row',
      col: 'flex-col',
      'row-reverse': 'flex-row-reverse',
      'col-reverse': 'flex-col-reverse'
    }

    const alignments = {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
      baseline: 'items-baseline'
    }

    const justifications = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly'
    }

    const wraps = {
      nowrap: 'flex-nowrap',
      wrap: 'flex-wrap',
      'wrap-reverse': 'flex-wrap-reverse'
    }

    const gaps = {
      none: '',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8'
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex',
          directions[direction],
          alignments[align],
          justifications[justify],
          wraps[wrap],
          gaps[gap],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Flex.displayName = 'Flex'

// Stack Component (Vertical Flex with gap)
interface StackProps extends Omit<FlexProps, 'direction'> {
  space?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

const Stack = forwardRef<HTMLDivElement, StackProps>(
  ({ className, space = 'md', gap, children, ...props }, ref) => {
    const spaces = {
      none: 'space-y-0',
      xs: 'space-y-1',
      sm: 'space-y-2',
      md: 'space-y-4',
      lg: 'space-y-6',
      xl: 'space-y-8',
      '2xl': 'space-y-12'
    }

    return (
      <Flex
        ref={ref}
        direction="col"
        className={cn(
          !gap && spaces[space],
          className
        )}
        gap={gap}
        {...props}
      >
        {children}
      </Flex>
    )
  }
)
Stack.displayName = 'Stack'

// Divider Component
interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  orientation?: 'horizontal' | 'vertical'
  variant?: 'solid' | 'dashed' | 'dotted'
  spacing?: 'none' | 'sm' | 'md' | 'lg'
}

const Divider = forwardRef<HTMLHRElement, DividerProps>(
  ({ className, orientation = 'horizontal', variant = 'solid', spacing = 'md', ...props }, ref) => {
    const orientations = {
      horizontal: 'w-full h-px',
      vertical: 'h-full w-px'
    }

    const variants = {
      solid: 'border-solid',
      dashed: 'border-dashed',
      dotted: 'border-dotted'
    }

    const spacings = {
      none: '',
      sm: orientation === 'horizontal' ? 'my-2' : 'mx-2',
      md: orientation === 'horizontal' ? 'my-4' : 'mx-4',
      lg: orientation === 'horizontal' ? 'my-6' : 'mx-6'
    }

    return (
      <hr
        ref={ref}
        className={cn(
          'border-neutral-200',
          orientations[orientation],
          variants[variant],
          spacings[spacing],
          className
        )}
        {...props}
      />
    )
  }
)
Divider.displayName = 'Divider'

// Spacer Component
interface SpacerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
}

const Spacer = forwardRef<HTMLDivElement, SpacerProps>(
  ({ className, size = 'md', ...props }, ref) => {
    const sizes = {
      xs: 'h-2',
      sm: 'h-4',
      md: 'h-8',
      lg: 'h-12',
      xl: 'h-16',
      '2xl': 'h-24',
      '3xl': 'h-32'
    }

    return (
      <div
        ref={ref}
        className={cn(sizes[size], className)}
        {...props}
      />
    )
  }
)
Spacer.displayName = 'Spacer'

// Center Component
interface CenterProps extends React.HTMLAttributes<HTMLDivElement> {
  axis?: 'both' | 'x' | 'y'
}

const Center = forwardRef<HTMLDivElement, CenterProps>(
  ({ className, axis = 'both', children, ...props }, ref) => {
    const alignments = {
      both: 'flex items-center justify-center',
      x: 'flex justify-center',
      y: 'flex items-center'
    }

    return (
      <div
        ref={ref}
        className={cn(alignments[axis], className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Center.displayName = 'Center'

export {
  Container,
  Section,
  Grid,
  Flex,
  Stack,
  Divider,
  Spacer,
  Center
}

export type {
  ContainerProps,
  SectionProps,
  GridProps,
  FlexProps,
  StackProps,
  DividerProps,
  SpacerProps,
  CenterProps
}