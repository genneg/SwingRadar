import { useState } from 'react'

import { 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
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
} from '@/components/ui'

/**
 * Elegant Design System Showcase
 * 
 * Showcases the new elegant design system inspired by the blues_dance_app_ui.html reference
 * Features:
 * - Dark navy background with gold accents
 * - Playfair Display font for headings
 * - Sophisticated gradients and shadows
 * - Elegant hover effects and animations
 */
export function ElegantShowcase() {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', name: 'Overview', icon: 'home' },
    { id: 'colors', name: 'Colors', icon: 'settings' },
    { id: 'typography', name: 'Typography', icon: 'user' },
    { id: 'buttons', name: 'Buttons', icon: 'music' },
    { id: 'cards', name: 'Cards', icon: 'calendar' },
    { id: 'forms', name: 'Forms', icon: 'search' },
    { id: 'components', name: 'Components', icon: 'heart' }
  ] as const

  return (
    <div className="min-h-screen bg-elegant-pattern">
      <Section spacing="xl" className="relative">
        <Container size="xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-6xl font-display font-bold text-gradient-gold mb-4">
              Elegant Design System
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Ispirato al design elegante e sofisticato del blues, con colori ricchi e tipografia raffinata
            </p>
          </div>

          {/* Navigation */}
          <Card variant="elegant" className="mb-8">
            <CardContent className="p-4">
              <Flex gap="md" justify="center" wrap="wrap">
                {sections.map((section) => (
                  <Button
                    key={section.id}
                    variant={activeSection === section.id ? 'gold' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveSection(section.id)}
                    icon={<Icon name={section.icon as any} />}
                  >
                    {section.name}
                  </Button>
                ))}
              </Flex>
            </CardContent>
          </Card>

          {/* Overview Section */}
          {activeSection === 'overview' && (
            <Grid cols={2} gap="lg">
              <Card variant="featured" hover>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="music" className="text-gold-600" />
                    Palette dei Colori
                  </CardTitle>
                  <CardDescription>
                    Colori ispirati al mondo del blues e jazz
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Stack space="md">
                    <div className="grid grid-cols-5 gap-2">
                      <div className="h-12 bg-navy-900 rounded border border-gold-600/20"></div>
                      <div className="h-12 bg-navy-800 rounded border border-gold-600/20"></div>
                      <div className="h-12 bg-primary-900 rounded border border-gold-600/20"></div>
                      <div className="h-12 bg-gold-600 rounded border border-gold-600/20"></div>
                      <div className="h-12 bg-gold-700 rounded border border-gold-600/20"></div>
                    </div>
                    <p className="text-sm text-gray-400">
                      Sfumature di blu navy profondo con accenti oro eleganti
                    </p>
                  </Stack>
                </CardContent>
              </Card>

              <Card variant="featured" hover>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="user" className="text-gold-600" />
                    Tipografia
                  </CardTitle>
                  <CardDescription>
                    Playfair Display per eleganza e Inter per leggibilità
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Stack space="md">
                    <div className="font-display text-2xl text-gold-600">
                      Playfair Display
                    </div>
                    <div className="font-sans text-lg text-gray-300">
                      Inter Regular
                    </div>
                    <p className="text-sm text-gray-400">
                      Combinazione di serif elegante e sans-serif moderna
                    </p>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Colors Section */}
          {activeSection === 'colors' && (
            <Stack space="lg">
              <Card variant="elegant">
                <CardHeader>
                  <CardTitle>Palette Colori Principale</CardTitle>
                  <CardDescription>
                    Colori principali del design system elegante
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Grid cols={3} gap="lg">
                    <div>
                      <h4 className="text-gold-600 font-semibold mb-4">Navy (Sfondi)</h4>
                      <div className="space-y-2">
                        {[
                          { name: 'Navy 950', color: 'bg-navy-950', hex: '#131220' },
                          { name: 'Navy 900', color: 'bg-navy-900', hex: '#1a1a2e' },
                          { name: 'Navy 800', color: 'bg-navy-800', hex: '#3a4052' },
                          { name: 'Navy 700', color: 'bg-navy-700', hex: '#444c61' },
                        ].map((color) => (
                          <div key={color.name} className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded ${color.color} border border-gold-600/20`}></div>
                            <div>
                              <div className="text-sm font-medium">{color.name}</div>
                              <div className="text-xs text-gray-400 font-mono">{color.hex}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-gold-600 font-semibold mb-4">Gold (Accenti)</h4>
                      <div className="space-y-2">
                        {[
                          { name: 'Gold 600', color: 'bg-gold-600', hex: '#d4af37' },
                          { name: 'Gold 700', color: 'bg-gold-700', hex: '#b8941f' },
                          { name: 'Gold 500', color: 'bg-gold-500', hex: '#f2b71e' },
                          { name: 'Gold 400', color: 'bg-gold-400', hex: '#f5c842' },
                        ].map((color) => (
                          <div key={color.name} className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded ${color.color} border border-gold-600/20`}></div>
                            <div>
                              <div className="text-sm font-medium">{color.name}</div>
                              <div className="text-xs text-gray-400 font-mono">{color.hex}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-gold-600 font-semibold mb-4">Primary (Blues)</h4>
                      <div className="space-y-2">
                        {[
                          { name: 'Primary 950', color: 'bg-primary-950', hex: '#0f3460' },
                          { name: 'Primary 900', color: 'bg-primary-900', hex: '#16213e' },
                          { name: 'Primary 800', color: 'bg-primary-800', hex: '#1f2c65' },
                          { name: 'Primary 700', color: 'bg-primary-700', hex: '#2d3f7f' },
                        ].map((color) => (
                          <div key={color.name} className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded ${color.color} border border-gold-600/20`}></div>
                            <div>
                              <div className="text-sm font-medium">{color.name}</div>
                              <div className="text-xs text-gray-400 font-mono">{color.hex}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Grid>
                </CardContent>
              </Card>
            </Stack>
          )}

          {/* Typography Section */}
          {activeSection === 'typography' && (
            <Stack space="lg">
              <Card variant="elegant">
                <CardHeader>
                  <CardTitle>Sistema Tipografico</CardTitle>
                  <CardDescription>
                    Gerarchia tipografica elegante e leggibile
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Stack space="lg">
                    <div>
                      <h1 className="mb-2">Heading 1 - Titolo principale</h1>
                      <h2 className="mb-2">Heading 2 - Titolo secondario</h2>
                      <h3 className="mb-2">Heading 3 - Titolo terziario</h3>
                      <h4 className="mb-2">Heading 4 - Sottotitolo</h4>
                    </div>
                    
                    <div>
                      <p className="text-lg mb-3">
                        <strong>Paragrafo grande:</strong> Perfetto per introduzioni e contenuti importanti che devono risaltare. Il testo elegante e la spaziatura generosa creano un'esperienza di lettura piacevole.
                      </p>
                      <p className="mb-3">
                        <strong>Paragrafo standard:</strong> Il testo principale dell'applicazione, ottimizzato per la leggibilità su tutti i dispositivi. Utilizza Inter con peso normale e interlinea rilassata.
                      </p>
                      <p className="text-sm text-gray-400">
                        <strong>Testo piccolo:</strong> Ideale per metadati, didascalie e informazioni secondarie che supportano il contenuto principale.
                      </p>
                    </div>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          )}

          {/* Buttons Section */}
          {activeSection === 'buttons' && (
            <Stack space="lg">
              <Card variant="elegant">
                <CardHeader>
                  <CardTitle>Varianti dei Bottoni</CardTitle>
                  <CardDescription>
                    Bottoni eleganti con effetti hover sofisticati
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Stack space="lg">
                    <div>
                      <h4 className="text-gold-600 font-semibold mb-4">Bottoni Principali</h4>
                      <Flex gap="md" wrap="wrap">
                        <Button variant="primary">Primary</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="gold">Gold</Button>
                        <Button variant="elegant">Elegant</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="ghost">Ghost</Button>
                      </Flex>
                    </div>

                    <div>
                      <h4 className="text-gold-600 font-semibold mb-4">Dimensioni</h4>
                      <Flex gap="md" align="center" wrap="wrap">
                        <Button variant="primary" size="xs">XS</Button>
                        <Button variant="primary" size="sm">Small</Button>
                        <Button variant="primary" size="md">Medium</Button>
                        <Button variant="primary" size="lg">Large</Button>
                        <Button variant="primary" size="xl">XL</Button>
                      </Flex>
                    </div>

                    <div>
                      <h4 className="text-gold-600 font-semibold mb-4">Con Icone</h4>
                      <Flex gap="md" wrap="wrap">
                        <Button variant="primary" icon={<Icon name="heart" />}>
                          Like
                        </Button>
                        <Button variant="secondary" icon={<Icon name="search" />} iconPosition="right">
                          Cerca
                        </Button>
                        <Button variant="gold" loading>
                          Caricamento...
                        </Button>
                      </Flex>
                    </div>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          )}

          {/* Cards Section */}
          {activeSection === 'cards' && (
            <Stack space="lg">
              <Grid cols={2} gap="lg">
                <Card variant="default">
                  <CardHeader>
                    <CardTitle>Card Standard</CardTitle>
                    <CardDescription>
                      Una card con il design predefinito
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">
                      Questa è una card standard con gradiente navy e bordi dorati sottili.
                    </p>
                  </CardContent>
                </Card>

                <Card variant="elegant" hover>
                  <CardHeader>
                    <CardTitle>Card Elegante</CardTitle>
                    <CardDescription>
                      Con hover effect e backdrop blur
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">
                      Questa card ha un effetto hover elegante e backdrop blur per un look sofisticato.
                    </p>
                  </CardContent>
                </Card>

                <Card variant="featured">
                  <CardHeader>
                    <CardTitle>Card Featured</CardTitle>
                    <CardDescription>
                      Per contenuti importanti
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">
                      Perfetta per mettere in evidenza festival e contenuti speciali.
                    </p>
                  </CardContent>
                </Card>

                <Card variant="transparent">
                  <CardHeader>
                    <CardTitle>Card Trasparente</CardTitle>
                    <CardDescription>
                      Solo bordi, sfondo trasparente
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">
                      Ideale per overlay e contenuti che devono integrarsi con lo sfondo.
                    </p>
                  </CardContent>
                </Card>
              </Grid>
            </Stack>
          )}

          {/* Forms Section */}
          {activeSection === 'forms' && (
            <Stack space="lg">
              <Card variant="elegant">
                <CardHeader>
                  <CardTitle>Componenti Form</CardTitle>
                  <CardDescription>
                    Form eleganti con stile sofisticato
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Grid cols={2} gap="lg">
                    <Stack space="md">
                      <Input 
                        label="Nome Festival"
                        placeholder="Inserisci il nome del festival..."
                        hint="Nome completo del festival"
                      />
                      
                      <Input 
                        label="Email"
                        type="email"
                        placeholder="your@email.com"
                        error="Inserisci un indirizzo email valido"
                      />
                      
                      <Textarea 
                        label="Descrizione"
                        placeholder="Descrivi il festival..."
                        hint="Massimo 500 caratteri"
                      />

                      <Select label="Tipo Festival" placeholder="Seleziona il tipo">
                        <option value="weekend">Weekend</option>
                        <option value="workshop">Workshop</option>
                        <option value="festival">Festival</option>
                        <option value="competition">Competition</option>
                      </Select>
                    </Stack>

                    <Stack space="md">
                      <div>
                        <label className="form-label">Stile di Ballo</label>
                        <Stack space="sm">
                          <Checkbox label="Blues" defaultChecked />
                          <Checkbox label="Jazz" />
                          <Checkbox label="Fusion" />
                          <Checkbox label="Lindy Hop" />
                        </Stack>
                      </div>

                      <RadioGroup legend="Livello">
                        <Radio name="level" label="Principiante" value="beginner" />
                        <Radio name="level" label="Intermedio" value="intermediate" defaultChecked />
                        <Radio name="level" label="Avanzato" value="advanced" />
                      </RadioGroup>
                    </Stack>
                  </Grid>
                </CardContent>
              </Card>
            </Stack>
          )}

          {/* Components Section */}
          {activeSection === 'components' && (
            <Stack space="lg">
              <Card variant="elegant">
                <CardHeader>
                  <CardTitle>Altri Componenti</CardTitle>
                  <CardDescription>
                    Badge, Avatar e altri elementi UI
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Stack space="lg">
                    <div>
                      <h4 className="text-gold-600 font-semibold mb-4">Badges</h4>
                      <Flex gap="md" wrap="wrap">
                        <Badge variant="primary">Primary</Badge>
                        <Badge variant="gold">Gold</Badge>
                        <Badge variant="elegant">Elegant</Badge>
                        <Badge variant="success" dot>Success</Badge>
                        <Badge variant="warning">Warning</Badge>
                        <Badge variant="error">Error</Badge>
                      </Flex>
                    </div>

                    <div>
                      <h4 className="text-gold-600 font-semibold mb-4">Avatars</h4>
                      <Flex gap="md" align="center">
                        <Avatar size="xs" fallback="XS" />
                        <Avatar size="sm" fallback="SM" />
                        <Avatar size="md" fallback="MD" />
                        <Avatar size="lg" fallback="LG" />
                        <Avatar size="xl" fallback="XL" />
                      </Flex>
                    </div>

                    <div>
                      <h4 className="text-gold-600 font-semibold mb-4">Icone</h4>
                      <Grid cols={8} gap="md">
                        {[
                          'home', 'search', 'calendar', 'user', 'heart', 'music',
                          'location', 'settings', 'bell', 'star', 'filter', 'menu'
                        ].map((iconName) => (
                          <div key={iconName} className="text-center p-3 rounded-lg bg-gold-600/10 border border-gold-600/20 hover:bg-gold-600/20 transition-colors">
                            <Icon name={iconName as any} size="lg" className="text-gold-600 mx-auto mb-1" />
                            <div className="text-xs text-gray-400">{iconName}</div>
                          </div>
                        ))}
                      </Grid>
                    </div>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          )}

          {/* Footer */}
          <div className="text-center mt-12 p-6 rounded-lg bg-gold-600/10 border border-gold-600/20">
            <p className="text-gold-600 font-semibold">
              🎷 Design System Ispirato al Blues Dance Festival Finder
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Eleganza, sofisticazione e funzionalità unite in un design system moderno
            </p>
          </div>
        </Container>
      </Section>
    </div>
  )
}