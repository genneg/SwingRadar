import { useState } from 'react'

import { 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Badge,
  Avatar,
  Icon,
  Container,
  Section,
  Grid,
  Stack,
  Flex,
  Input,
  Textarea,
  Select,
  Checkbox,
  Radio,
  RadioGroup,
  Skeleton
} from '@/components/ui'

/**
 * Design System Showcase Component
 * 
 * This component demonstrates all design system elements including:
 * - Color palette
 * - Typography system
 * - Component variants
 * - Layout components
 * - Icons
 * 
 * Used for development reference and design consistency
 */
export function DesignSystemShowcase() {
  const [activeTab, setActiveTab] = useState('colors')

  const colorPalettes = [
    {
      name: 'Primary',
      colors: [
        { name: '50', class: 'bg-primary-50', hex: '#eff6ff' },
        { name: '100', class: 'bg-primary-100', hex: '#dbeafe' },
        { name: '200', class: 'bg-primary-200', hex: '#bfdbfe' },
        { name: '300', class: 'bg-primary-300', hex: '#93c5fd' },
        { name: '400', class: 'bg-primary-400', hex: '#60a5fa' },
        { name: '500', class: 'bg-primary-500', hex: '#3b82f6' },
        { name: '600', class: 'bg-primary-600', hex: '#2563eb' },
        { name: '700', class: 'bg-primary-700', hex: '#1d4ed8' },
        { name: '800', class: 'bg-primary-800', hex: '#1e40af' },
        { name: '900', class: 'bg-primary-900', hex: '#1e3a8a' },
        { name: '950', class: 'bg-primary-950', hex: '#172554' },
      ]
    },
    {
      name: 'Blues',
      colors: [
        { name: '50', class: 'bg-blues-50', hex: '#f0f4f8' },
        { name: '100', class: 'bg-blues-100', hex: '#d9e2ec' },
        { name: '200', class: 'bg-blues-200', hex: '#bcccdc' },
        { name: '300', class: 'bg-blues-300', hex: '#9fb3c8' },
        { name: '400', class: 'bg-blues-400', hex: '#829ab1' },
        { name: '500', class: 'bg-blues-500', hex: '#627d98' },
        { name: '600', class: 'bg-blues-600', hex: '#486581' },
        { name: '700', class: 'bg-blues-700', hex: '#334e68' },
        { name: '800', class: 'bg-blues-800', hex: '#243b53' },
        { name: '900', class: 'bg-blues-900', hex: '#102a43' },
        { name: '950', class: 'bg-blues-950', hex: '#0a1929' },
      ]
    },
    {
      name: 'Jazz',
      colors: [
        { name: '50', class: 'bg-jazz-50', hex: '#fefce8' },
        { name: '100', class: 'bg-jazz-100', hex: '#fef9c3' },
        { name: '200', class: 'bg-jazz-200', hex: '#fef08a' },
        { name: '300', class: 'bg-jazz-300', hex: '#fde047' },
        { name: '400', class: 'bg-jazz-400', hex: '#facc15' },
        { name: '500', class: 'bg-jazz-500', hex: '#eab308' },
        { name: '600', class: 'bg-jazz-600', hex: '#ca8a04' },
        { name: '700', class: 'bg-jazz-700', hex: '#a16207' },
        { name: '800', class: 'bg-jazz-800', hex: '#854d0e' },
        { name: '900', class: 'bg-jazz-900', hex: '#713f12' },
        { name: '950', class: 'bg-jazz-950', hex: '#422006' },
      ]
    }
  ]

  const tabs = [
    { id: 'colors', name: 'Colors', icon: 'settings' },
    { id: 'typography', name: 'Typography', icon: 'user' },
    { id: 'buttons', name: 'Buttons', icon: 'music' },
    { id: 'forms', name: 'Forms', icon: 'calendar' },
    { id: 'layout', name: 'Layout', icon: 'map' },
    { id: 'icons', name: 'Icons', icon: 'heart' }
  ] as const

  return (
    <Container size="xl" className="py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gradient-primary mb-4">
          Blues Dance Festival Design System
        </h1>
        <p className="text-lg text-neutral-600">
          A comprehensive design system for the Blues Dance Festival Finder application
        </p>
      </div>

      {/* Navigation Tabs */}
      <Card className="mb-8">
        <CardContent className="p-0">
          <Flex className="border-b border-neutral-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors
                  ${activeTab === tab.id 
                    ? 'border-primary-500 text-primary-600' 
                    : 'border-transparent text-neutral-500 hover:text-neutral-700'
                  }
                `}
              >
                <Icon name={tab.icon as any} size="sm" />
                {tab.name}
              </button>
            ))}
          </Flex>
        </CardContent>
      </Card>

      {/* Colors Tab */}
      {activeTab === 'colors' && (
        <Stack space="lg">
          <Card>
            <CardHeader>
              <CardTitle>Color Palettes</CardTitle>
            </CardHeader>
            <CardContent>
              <Stack space="xl">
                {colorPalettes.map((palette) => (
                  <div key={palette.name}>
                    <h3 className="text-lg font-semibold mb-4">{palette.name}</h3>
                    <Grid cols={11} gap="sm">
                      {palette.colors.map((color) => (
                        <div key={color.name} className="text-center">
                          <div 
                            className={`w-full h-16 rounded-lg ${color.class} border border-neutral-200 mb-2`}
                          />
                          <div className="text-xs font-medium text-neutral-900">{color.name}</div>
                          <div className="text-xs text-neutral-500 font-mono">{color.hex}</div>
                        </div>
                      ))}
                    </Grid>
                  </div>
                ))}

                <div>
                  <h3 className="text-lg font-semibold mb-4">Status Colors</h3>
                  <Grid cols={4} gap="md">
                    {[
                      { name: 'Success', class: 'bg-success-500', text: 'text-white' },
                      { name: 'Warning', class: 'bg-warning-500', text: 'text-white' },
                      { name: 'Error', class: 'bg-error-500', text: 'text-white' },
                      { name: 'Neutral', class: 'bg-neutral-500', text: 'text-white' }
                    ].map((color) => (
                      <div key={color.name} className="text-center">
                        <div className={`w-full h-16 rounded-lg ${color.class} flex items-center justify-center ${color.text} mb-2`}>
                          {color.name}
                        </div>
                      </div>
                    ))}
                  </Grid>
                </div>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      )}

      {/* Typography Tab */}
      {activeTab === 'typography' && (
        <Stack space="lg">
          <Card>
            <CardHeader>
              <CardTitle>Typography Scale</CardTitle>
            </CardHeader>
            <CardContent>
              <Stack space="lg">
                <div>
                  <h1>Heading 1 - The largest heading</h1>
                  <h2>Heading 2 - Secondary heading</h2>
                  <h3>Heading 3 - Tertiary heading</h3>
                  <h4>Heading 4 - Quaternary heading</h4>
                  <h5>Heading 5 - Quinary heading</h5>
                  <h6>Heading 6 - Smallest heading</h6>
                </div>
                
                <div>
                  <p className="text-xl">
                    Large paragraph text - Perfect for introductions and important content that needs to stand out.
                  </p>
                  <p>
                    Regular paragraph text - The standard text size for most content. This provides excellent readability 
                    while maintaining a comfortable reading experience across all devices.
                  </p>
                  <p className="text-sm text-neutral-600">
                    Small text - Used for captions, metadata, and secondary information that supports the main content.
                  </p>
                </div>

                <div>
                  <h4 className="mb-4">Font Weights</h4>
                  <div className="space-y-2">
                    <div className="font-light">Light weight text</div>
                    <div className="font-normal">Normal weight text</div>
                    <div className="font-medium">Medium weight text</div>
                    <div className="font-semibold">Semibold weight text</div>
                    <div className="font-bold">Bold weight text</div>
                  </div>
                </div>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      )}

      {/* Buttons Tab */}
      {activeTab === 'buttons' && (
        <Stack space="lg">
          <Card>
            <CardHeader>
              <CardTitle>Button Variants</CardTitle>
            </CardHeader>
            <CardContent>
              <Stack space="lg">
                <div>
                  <h4 className="mb-4">Primary Buttons</h4>
                  <Flex gap="md" wrap="wrap">
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="jazz">Jazz</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                  </Flex>
                </div>

                <div>
                  <h4 className="mb-4">Status Buttons</h4>
                  <Flex gap="md" wrap="wrap">
                    <Button variant="success">Success</Button>
                    <Button variant="warning">Warning</Button>
                    <Button variant="error">Error</Button>
                  </Flex>
                </div>

                <div>
                  <h4 className="mb-4">Button Sizes</h4>
                  <Flex gap="md" align="center" wrap="wrap">
                    <Button size="xs">Extra Small</Button>
                    <Button size="sm">Small</Button>
                    <Button size="md">Medium</Button>
                    <Button size="lg">Large</Button>
                    <Button size="xl">Extra Large</Button>
                  </Flex>
                </div>

                <div>
                  <h4 className="mb-4">Buttons with Icons</h4>
                  <Flex gap="md" wrap="wrap">
                    <Button icon={<Icon name="heart" />}>
                      With Icon
                    </Button>
                    <Button icon={<Icon name="search" />} iconPosition="right">
                      Icon Right
                    </Button>
                    <Button loading>Loading</Button>
                  </Flex>
                </div>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      )}

      {/* Forms Tab */}
      {activeTab === 'forms' && (
        <Stack space="lg">
          <Card>
            <CardHeader>
              <CardTitle>Form Components</CardTitle>
            </CardHeader>
            <CardContent>
              <Grid cols={2} gap="lg">
                <Stack space="md">
                  <Input 
                    label="Text Input"
                    placeholder="Enter text here..."
                    hint="This is a helpful hint"
                  />
                  
                  <Input 
                    label="Email Input"
                    type="email"
                    placeholder="your@email.com"
                    error="Please enter a valid email address"
                  />
                  
                  <Textarea 
                    label="Textarea"
                    placeholder="Enter longer text here..."
                    hint="Maximum 500 characters"
                  />

                  <Select label="Select Option" placeholder="Choose an option">
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
                  </Select>
                </Stack>

                <Stack space="md">
                  <div>
                    <label className="form-label">Checkboxes</label>
                    <Stack space="sm">
                      <Checkbox label="Option 1" />
                      <Checkbox label="Option 2" defaultChecked />
                      <Checkbox label="Option 3 (disabled)" disabled />
                    </Stack>
                  </div>

                  <RadioGroup legend="Radio Options">
                    <Radio name="radio-group" label="Radio 1" value="1" />
                    <Radio name="radio-group" label="Radio 2" value="2" defaultChecked />
                    <Radio name="radio-group" label="Radio 3" value="3" />
                  </RadioGroup>
                </Stack>
              </Grid>
            </CardContent>
          </Card>
        </Stack>
      )}

      {/* Layout Tab */}
      {activeTab === 'layout' && (
        <Stack space="lg">
          <Card>
            <CardHeader>
              <CardTitle>Layout Components</CardTitle>
            </CardHeader>
            <CardContent>
              <Stack space="lg">
                <div>
                  <h4 className="mb-4">Badges</h4>
                  <Flex gap="md" wrap="wrap">
                    <Badge variant="primary">Primary</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="success" dot>Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="error">Error</Badge>
                    <Badge variant="jazz">Jazz</Badge>
                  </Flex>
                </div>

                <div>
                  <h4 className="mb-4">Avatars</h4>
                  <Flex gap="md" align="center">
                    <Avatar size="xs" fallback="XS" />
                    <Avatar size="sm" fallback="SM" />
                    <Avatar size="md" fallback="MD" />
                    <Avatar size="lg" fallback="LG" />
                    <Avatar size="xl" fallback="XL" />
                    <Avatar size="2xl" fallback="2XL" />
                  </Flex>
                </div>

                <div>
                  <h4 className="mb-4">Loading States</h4>
                  <Stack space="md">
                    <div>
                      <p className="text-sm text-neutral-600 mb-2">Skeleton Text</p>
                      <Stack space="sm">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-5/6" />
                      </Stack>
                    </div>
                    
                    <div>
                      <p className="text-sm text-neutral-600 mb-2">Skeleton Card</p>
                      <div className="max-w-sm">
                        <Stack space="md">
                          <Skeleton className="h-48 w-full rounded-lg" />
                          <Stack space="sm">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                          </Stack>
                        </Stack>
                      </div>
                    </div>
                  </Stack>
                </div>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      )}

      {/* Icons Tab */}
      {activeTab === 'icons' && (
        <Stack space="lg">
          <Card>
            <CardHeader>
              <CardTitle>Icon Library</CardTitle>
            </CardHeader>
            <CardContent>
              <Grid cols={8} gap="md">
                {[
                  'home', 'search', 'calendar', 'user', 'heart', 'heartFilled',
                  'bookmark', 'bookmarkFilled', 'share', 'follow', 'music', 'dance',
                  'location', 'map', 'chevronDown', 'chevronUp', 'chevronLeft', 'chevronRight',
                  'close', 'filter', 'check', 'exclamation', 'info', 'menu',
                  'dots', 'external', 'settings', 'bell', 'bellFilled'
                ].map((iconName) => (
                  <div key={iconName} className="text-center p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50">
                    <Icon name={iconName as any} size="lg" className="mx-auto mb-2 text-neutral-600" />
                    <div className="text-xs font-mono text-neutral-500">{iconName}</div>
                  </div>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Stack>
      )}
    </Container>
  )
}