'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FormLabel } from '@/components/ui/Form'
import { PriceTypeInput } from '@/components/forms/PriceTypeInput'
import { EventPriceManager } from '@/components/features/EventPriceManager'

/**
 * Example component showing how to use the new dynamic price type system
 * This demonstrates both the simple PriceTypeInput and the full EventPriceManager
 */
export function EventPriceExample() {
  const [simpleForm, setSimpleForm] = useState({
    priceType: '',
    amount: 0,
    currency: 'EUR'
  })
  
  const [selectedEventId, setSelectedEventId] = useState<string>('1') // Example event ID

  const handleSimpleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Simple form submitted:', simpleForm)
    alert(`Price created: ${simpleForm.priceType} - ${simpleForm.currency === 'EUR' ? '€' : '$'}${simpleForm.amount}`)
  }

  return (
    <div className="space-y-8 p-6 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dynamic Price Types - Examples
        </h1>
        <p className="text-gray-600">
          Now you can add custom price types like "Beginner Full Pass" directly when creating prices!
        </p>
      </div>

      {/* Simple Form Example */}
      <Card>
        <CardHeader>
          <CardTitle>Simple Price Type Input Example</CardTitle>
          <p className="text-sm text-gray-600">
            Use this component in any form where you need to specify a price type.
            It provides suggestions but allows any custom value.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSimpleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <PriceTypeInput
                value={simpleForm.priceType}
                onChange={(value) => setSimpleForm(prev => ({ ...prev, priceType: value }))}
                required
                placeholder="Try typing 'Beginner' or 'Full Pass'"
              />
              
              <div>
                <FormLabel htmlFor="amount" required>Amount</FormLabel>
                <div className="flex">
                  <select
                    value={simpleForm.currency}
                    onChange={(e) => setSimpleForm(prev => ({ ...prev, currency: e.target.value }))}
                    className="rounded-l-md border border-r-0 border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="EUR">€</option>
                    <option value="USD">$</option>
                    <option value="GBP">£</option>
                  </select>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={simpleForm.amount}
                    onChange={(e) => setSimpleForm(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                    placeholder="50.00"
                    className="rounded-l-none"
                    required
                  />
                </div>
              </div>

              <div className="flex items-end">
                <Button type="submit" className="w-full">
                  Add Price
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Full Price Manager Example */}
      <Card>
        <CardHeader>
          <CardTitle>Full Event Price Manager Example</CardTitle>
          <p className="text-sm text-gray-600">
            This component handles all price management for an event, including adding, editing, and deleting prices.
            It integrates with the API endpoints we created.
          </p>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <FormLabel htmlFor="eventSelect">Select Event (for demo):</FormLabel>
            <select
              id="eventSelect"
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="1">NYC Blues Weekend 2024</option>
              <option value="2">Chicago Blues Festival</option>
              <option value="3">LA Blues Intensive</option>
            </select>
          </div>
          
          <EventPriceManager
            eventId={selectedEventId}
            onPricesChange={(prices) => {
              console.log('Prices updated:', prices)
            }}
          />
        </CardContent>
      </Card>

      {/* Usage Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use in Your Forms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-lg mb-2">For Simple Forms:</h4>
            <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-x-auto">
{`import { PriceTypeInput } from '@/components/forms/PriceTypeInput'

// In your form component:
const [priceType, setPriceType] = useState('')

<PriceTypeInput
  value={priceType}
  onChange={setPriceType}
  placeholder="e.g., Beginner Full Pass"
  required
/>`}
            </pre>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-2">For Full Event Management:</h4>
            <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-x-auto">
{`import { EventPriceManager } from '@/components/features/EventPriceManager'

// In your event edit/create page:
<EventPriceManager
  eventId={eventId}
  onPricesChange={(prices) => {
    // Handle price changes
    console.log('Updated prices:', prices)
  }}
/>`}
            </pre>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-2">API Endpoints Available:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li><code>GET /api/price-types</code> - Get common and used price types</li>
              <li><code>GET /api/events/[id]/prices</code> - Get all prices for an event</li>
              <li><code>POST /api/events/[id]/prices</code> - Add a new price to an event</li>
              <li><code>PUT /api/events/[id]/prices/[priceId]</code> - Update a specific price</li>
              <li><code>DELETE /api/events/[id]/prices/[priceId]</code> - Delete a specific price</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}