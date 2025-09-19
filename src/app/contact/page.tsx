'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Here you would typically send the form data to your API
      // For now, we'll simulate a submission
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsSubmitted(true)
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="app-container">
        <div className="max-w-md mx-auto bg-background min-h-screen relative flex items-center justify-center">
          <div className="card p-8 text-center">
            <div className="w-16 h-16 bg-green-900/20 border border-green-600/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-playfair text-xl text-gold-600 mb-2">Message Sent!</h2>
            <p className="text-white/80 mb-6">
              Thank you for reaching out. We'll get back to you within 24 hours.
            </p>
            <button 
              onClick={() => setIsSubmitted(false)}
              className="btn-secondary"
            >
              Send Another Message
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <div className="max-w-md mx-auto bg-background min-h-screen relative">
        <div className="content-wrapper">
          {/* Header */}
          <div className="hero-section rounded-2xl p-8 mb-6">
            <div className="hero-overlay"></div>
            <div className="relative z-10 text-center">
              <h1 className="font-playfair text-3xl mb-3 text-white leading-tight">
                Get in Touch
              </h1>
              <p className="text-white/90 mb-6 leading-relaxed max-w-sm mx-auto">
                Have questions, suggestions, or want to report an issue? We'd love to hear from you!
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="card p-6 mb-6">
            <h2 className="font-playfair text-xl text-gold-600 mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="form-label">
                    Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                    className="form-input"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="form-label">
                    Email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="type" className="form-label">
                  Message Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="general">General Inquiry</option>
                  <option value="bug">Bug Report</option>
                  <option value="feature">Feature Request</option>
                  <option value="data">Data Correction</option>
                  <option value="partnership">Partnership</option>
                  <option value="support">Technical Support</option>
                </select>
              </div>

              <div>
                <label htmlFor="subject" className="form-label">
                  Subject *
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Brief description of your message"
                  className="form-input"
                />
              </div>

              <div>
                <label htmlFor="message" className="form-label">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Please provide as much detail as possible..."
                  className="form-textarea"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full"
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner mr-3"></div>
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>

          {/* Quick Contact */}
          <div className="card p-6 mb-6">
            <h2 className="font-playfair text-xl text-gold-600 mb-4">Quick Contact</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-gold-600 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="font-medium text-gold-600">Email</p>
                  <p className="text-white/80">hello@bluesfestivalfinder.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <svg className="w-5 h-5 text-gold-600 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-medium text-gold-600">Response Time</p>
                  <p className="text-white/80">Within 24 hours</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="card p-6 mb-6">
            <h2 className="font-playfair text-xl text-gold-600 mb-4">Common Questions</h2>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gold-600 mb-1">How do I add my festival?</h4>
                <p className="text-sm text-white/80">
                  We automatically collect festival data, but you can contact us to ensure your event is included.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gold-600 mb-1">Found incorrect information?</h4>
                <p className="text-sm text-white/80">
                  Please use the "Data Correction" message type to report any inaccuracies.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gold-600 mb-1">How do notifications work?</h4>
                <p className="text-sm text-white/80">
                  Follow teachers and musicians to get notified when they announce new events.
                </p>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="card p-6">
            <h2 className="font-playfair text-xl text-gold-600 mb-4">Follow Us</h2>
            <div className="flex space-x-4 mb-3">
              <a href="#" className="text-white/60 hover:text-gold-600 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-white/60 hover:text-gold-600 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 20.312c-3.347 0-6.062-2.715-6.062-6.062s2.715-6.062 6.062-6.062s6.062 2.715 6.062 6.062s-2.715 6.062-6.062 6.062z"/>
                </svg>
              </a>
              <a href="#" className="text-white/60 hover:text-gold-600 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
            </div>
            <p className="text-sm text-white/80">
              Stay updated with the latest blues festival news and announcements.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}