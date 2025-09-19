'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FormLabel } from '@/components/ui/Form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react'

interface EventPrice {
  id: number
  type: string
  amount: number
  currency: string
  deadline?: string
  description?: string
  available: boolean
}

interface PriceTypesSuggestions {
  common: string[]
  used: string[]
}

interface EventPriceManagerProps {
  eventId: string | number
  initialPrices?: EventPrice[]
  onPricesChange?: (prices: EventPrice[]) => void
  readOnly?: boolean
}

export function EventPriceManager({ 
  eventId, 
  initialPrices = [], 
  onPricesChange,
  readOnly = false 
}: EventPriceManagerProps) {
  const [prices, setPrices] = useState<EventPrice[]>(initialPrices)
  const [suggestions, setSuggestions] = useState<PriceTypesSuggestions>({ common: [], used: [] })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingPrice, setEditingPrice] = useState<number | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  
  // Form state for new price
  const [newPrice, setNewPrice] = useState({
    type: '',
    amount: 0,
    currency: 'EUR',
    deadline: '',
    description: '',
    available: true
  })

  // Load price suggestions on mount
  useEffect(() => {
    loadPriceSuggestions()
  }, [])

  // Load existing prices if eventId changes
  useEffect(() => {
    if (eventId && !initialPrices.length) {
      loadEventPrices()
    }
  }, [eventId])

  const loadPriceSuggestions = async () => {
    try {
      const response = await fetch('/api/price-types?includeUsed=true')
      const data = await response.json()
      if (data.success) {
        setSuggestions(data.data)
      }
    } catch (error) {
      console.error('Failed to load price suggestions:', error)
    }
  }

  const loadEventPrices = async () => {
    if (!eventId) return
    
    setIsLoading(true)
    try {
      const response = await fetch(`/api/events/${eventId}/prices`)
      const data = await response.json()
      if (data.success) {
        setPrices(data.data)
        onPricesChange?.(data.data)
      } else {
        setError('Failed to load prices')
      }
    } catch (error) {
      setError('Failed to load prices')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddPrice = async () => {
    if (!newPrice.type || !newPrice.amount) {
      setError('Price type and amount are required')
      return
    }

    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/events/${eventId}/prices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: newPrice.type,
          amount: newPrice.amount,
          currency: newPrice.currency,
          deadline: newPrice.deadline || undefined,
          description: newPrice.description || undefined,
          available: newPrice.available
        })
      })
      
      const data = await response.json()
      if (data.success) {
        const updatedPrices = [...prices, data.data]
        setPrices(updatedPrices)
        onPricesChange?.(updatedPrices)
        
        // Reset form
        setNewPrice({
          type: '',
          amount: 0,
          currency: 'EUR',
          deadline: '',
          description: '',
          available: true
        })
        setShowAddForm(false)
      } else {
        setError(data.error || 'Failed to add price')
      }
    } catch (error) {
      setError('Failed to add price')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeletePrice = async (priceId: number) => {
    if (!confirm('Are you sure you want to delete this price?')) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/events/${eventId}/prices/${priceId}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      if (data.success) {
        const updatedPrices = prices.filter(p => p.id !== priceId)
        setPrices(updatedPrices)
        onPricesChange?.(updatedPrices)
      } else {
        setError(data.error || 'Failed to delete price')
      }
    } catch (error) {
      setError('Failed to delete price')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestedType = (type: string) => {
    setNewPrice(prev => ({ ...prev, type }))
  }

  if (readOnly && prices.length === 0) {
    return null
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Event Pricing</span>
          {!readOnly && (
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Price
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <LoadingSpinner className="mr-2" />
            <span>Loading...</span>
          </div>
        )}

        {/* Add Price Form */}
        {!readOnly && showAddForm && (
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FormLabel htmlFor="priceType" required>Price Type</FormLabel>
                  <Input
                    id="priceType"
                    value={newPrice.type}
                    onChange={(e) => setNewPrice(prev => ({ ...prev, type: e.target.value }))}
                    placeholder="e.g., Beginner Full Pass"
                    className="mt-1"
                  />
                  
                  {/* Price Type Suggestions */}
                  {(suggestions.common.length > 0 || suggestions.used.length > 0) && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-600 mb-2">Quick suggestions:</p>
                      <div className="flex flex-wrap gap-1">
                        {suggestions.common.slice(0, 6).map(type => (
                          <Badge
                            key={type}
                            variant="neutral"
                            className="cursor-pointer hover:bg-primary hover:text-white text-xs"
                            onClick={() => handleSuggestedType(type)}
                          >
                            {type}
                          </Badge>
                        ))}
                        {suggestions.used.slice(0, 3).map(type => (
                          <Badge
                            key={type}
                            variant="secondary"
                            className="cursor-pointer hover:bg-primary hover:text-white text-xs"
                            onClick={() => handleSuggestedType(type)}
                          >
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <FormLabel htmlFor="priceAmount" required>Amount</FormLabel>
                  <div className="flex mt-1">
                    <select
                      value={newPrice.currency}
                      onChange={(e) => setNewPrice(prev => ({ ...prev, currency: e.target.value }))}
                      className="rounded-l-md border border-r-0 border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="EUR">€</option>
                      <option value="USD">$</option>
                      <option value="GBP">£</option>
                    </select>
                    <Input
                      id="priceAmount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={newPrice.amount}
                      onChange={(e) => setNewPrice(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                      placeholder="50.00"
                      className="rounded-l-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FormLabel htmlFor="priceDeadline">Registration Deadline</FormLabel>
                  <Input
                    id="priceDeadline"
                    type="datetime-local"
                    value={newPrice.deadline}
                    onChange={(e) => setNewPrice(prev => ({ ...prev, deadline: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <FormLabel htmlFor="priceDescription">Description</FormLabel>
                  <Input
                    id="priceDescription"
                    value={newPrice.description}
                    onChange={(e) => setNewPrice(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Optional details about this price"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newPrice.available}
                    onChange={(e) => setNewPrice(prev => ({ ...prev, available: e.target.checked }))}
                    className="mr-2"
                  />
                  Available for registration
                </label>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddPrice} disabled={isLoading}>
                  <Check className="w-4 h-4 mr-2" />
                  Add Price
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Existing Prices List */}
        <div className="space-y-3">
          {prices.map((price) => (
            <div
              key={price.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <Badge variant={price.available ? "default" : "secondary"}>
                    {price.type}
                  </Badge>
                  <span className="font-semibold text-lg">
                    {price.currency === 'EUR' ? '€' : price.currency === 'USD' ? '$' : '£'}
                    {price.amount}
                  </span>
                  {!price.available && (
                    <Badge variant="secondary">Unavailable</Badge>
                  )}
                </div>
                {price.description && (
                  <p className="text-sm text-gray-600 mt-1">{price.description}</p>
                )}
                {price.deadline && (
                  <p className="text-xs text-gray-500 mt-1">
                    Deadline: {new Date(price.deadline).toLocaleString()}
                  </p>
                )}
              </div>
              
              {!readOnly && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingPrice(price.id)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeletePrice(price.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {prices.length === 0 && !showAddForm && !isLoading && (
          <div className="text-center py-8 text-gray-500">
            <p>No prices configured for this event</p>
            {!readOnly && (
              <Button
                onClick={() => setShowAddForm(true)}
                variant="outline"
                className="mt-4"
              >
                Add First Price
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}