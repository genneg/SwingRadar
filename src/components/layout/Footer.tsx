import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-white relative overflow-hidden">
      {/* Art Deco Background Pattern */}
      <div className="absolute inset-0 vintage-pattern opacity-30"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-600 to-transparent"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Enhanced Brand Section */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="vinyl-record w-12 h-12 animate-vinyl-spin">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-gold-600 font-bold text-lg">♪</span>
                </div>
              </div>
              <div>
                <div className="font-jazz text-2xl font-bold text-gradient-gold leading-tight">
                  SwingRadar
                </div>
                <div className="font-vintage text-sm text-cream-200 tracking-widest -mt-1">
                  DETECT SWING CULTURE
                </div>
              </div>
            </div>
            
            <p className="text-cream-100 max-w-md leading-relaxed mb-6">
              Your precision radar for detecting swing culture worldwide.
              Connect with legendary artists across Blues, Swing, Balboa, Shag, and Boogie Woogie.
              Navigate the golden age of dance with vintage style and modern technology.
            </p>
            
            
            {/* Enhanced Social Links */}
            <div className="flex space-x-4">
              <a href="#" className="group p-3 bg-gold-600/20 rounded-full border border-gold-600/30 hover:border-gold-600 hover:bg-gold-600/30 transition-all duration-300">
                <svg className="w-5 h-5 text-gold-600 group-hover:animate-vintage-bounce" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="group p-3 bg-copper-600/20 rounded-full border border-copper-600/30 hover:border-copper-600 hover:bg-copper-600/30 transition-all duration-300">
                <svg className="w-5 h-5 text-copper-600 group-hover:animate-vintage-bounce" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" className="group p-3 bg-bordeaux-600/20 rounded-full border border-bordeaux-600/30 hover:border-bordeaux-600 hover:bg-bordeaux-600/30 transition-all duration-300">
                <svg className="w-5 h-5 text-bordeaux-400 group-hover:animate-vintage-bounce" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.219-.359-1.219c0-1.141.660-1.992 1.483-1.992.699 0 1.037.525 1.037 1.155 0 .703-.449 1.753-.680 2.729-.194.819.410 1.487 1.219 1.487 1.463 0 2.588-1.543 2.588-3.771 0-1.972-1.417-3.353-3.445-3.353-2.346 0-3.723 1.760-3.723 3.582 0 .709.273 1.467.614 1.880.067.082.077.154.057.238-.061.256-.196.808-.223.922-.035.146-.115.177-.266.107-1.001-.465-1.624-1.926-1.624-3.101 0-2.523 1.834-4.84 5.287-4.84 2.774 0 4.932 1.98 4.932 4.620 0 2.757-1.739 4.976-4.151 4.976-.811 0-1.573-.421-1.834-.924l-.498 1.902c-.181.695-.669 1.566-.995 2.097A12.013 12.013 0 0 0 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                </svg>
              </a>
              <a href="#" className="group p-3 bg-cream-600/20 rounded-full border border-cream-600/30 hover:border-cream-600 hover:bg-cream-600/30 transition-all duration-300">
                <svg className="w-5 h-5 text-cream-300 group-hover:animate-vintage-bounce" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Discover Section */}
          <div>
            <h3 className="font-jazz text-xl font-bold text-gold-600 mb-6 relative">
              Discover
              <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-gold-600 to-transparent"></div>
            </h3>
            <ul className="space-y-4">
              <li>
                <Link href="/events" className="group flex items-center space-x-2 text-cream-200 hover:text-gold-600 transition-all duration-300">
                  <span className="w-1.5 h-1.5 bg-current rounded-full opacity-60 group-hover:opacity-100"></span>
                  <span className="font-vintage text-sm tracking-wide">Browse Events</span>
                </Link>
              </li>
              <li>
                <Link href="/teachers" className="group flex items-center space-x-2 text-cream-200 hover:text-copper-600 transition-all duration-300">
                  <span className="w-1.5 h-1.5 bg-current rounded-full opacity-60 group-hover:opacity-100"></span>
                  <span className="font-vintage text-sm tracking-wide">Master Teachers</span>
                </Link>
              </li>
              <li>
                <Link href="/musicians" className="group flex items-center space-x-2 text-cream-200 hover:text-bordeaux-400 transition-all duration-300">
                  <span className="w-1.5 h-1.5 bg-current rounded-full opacity-60 group-hover:opacity-100"></span>
                  <span className="font-vintage text-sm tracking-wide">Musicians</span>
                </Link>
              </li>
              <li>
                <Link href="/locations" className="group flex items-center space-x-2 text-cream-200 hover:text-gold-600 transition-all duration-300">
                  <span className="w-1.5 h-1.5 bg-current rounded-full opacity-60 group-hover:opacity-100"></span>
                  <span className="font-vintage text-sm tracking-wide">Dance Locations</span>
                </Link>
              </li>
              <li>
                <Link href="/search" className="group flex items-center space-x-2 text-cream-200 hover:text-gold-600 transition-all duration-300">
                  <span className="w-1.5 h-1.5 bg-current rounded-full opacity-60 group-hover:opacity-100"></span>
                  <span className="font-vintage text-sm tracking-wide">Advanced Search</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Community Section */}
          <div>
            <h3 className="font-jazz text-xl font-bold text-copper-600 mb-6 relative">
              Community
              <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-copper-600 to-transparent"></div>
            </h3>
            <ul className="space-y-4">
              <li>
                <Link href="/dashboard" className="group flex items-center space-x-2 text-cream-200 hover:text-copper-600 transition-all duration-300">
                  <span className="w-1.5 h-1.5 bg-current rounded-full opacity-60 group-hover:opacity-100"></span>
                  <span className="font-vintage text-sm tracking-wide">Your Studio</span>
                </Link>
              </li>
              <li>
                <Link href="/profile" className="group flex items-center space-x-2 text-cream-200 hover:text-gold-600 transition-all duration-300">
                  <span className="w-1.5 h-1.5 bg-current rounded-full opacity-60 group-hover:opacity-100"></span>
                  <span className="font-vintage text-sm tracking-wide">Profile</span>
                </Link>
              </li>
              <li>
                <Link href="/following" className="group flex items-center space-x-2 text-cream-200 hover:text-bordeaux-400 transition-all duration-300">
                  <span className="w-1.5 h-1.5 bg-current rounded-full opacity-60 group-hover:opacity-100"></span>
                  <span className="font-vintage text-sm tracking-wide">Following</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="group flex items-center space-x-2 text-cream-200 hover:text-cream-100 transition-all duration-300">
                  <span className="w-1.5 h-1.5 bg-current rounded-full opacity-60 group-hover:opacity-100"></span>
                  <span className="font-vintage text-sm tracking-wide">About Us</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Enhanced Footer Bottom */}
        <div className="border-t border-gold-600/30 mt-12 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            
            {/* Copyright and Legal */}
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
              <p className="text-cream-200 text-sm font-vintage tracking-wide">
                © 2024 SwingRadar
              </p>
              <div className="flex items-center space-x-4 text-xs">
                <Link href="/privacy" className="text-cream-300 hover:text-gold-600 transition-colors duration-300 uppercase tracking-wide">
                  Privacy
                </Link>
                <span className="text-cream-400">•</span>
                <Link href="/terms" className="text-cream-300 hover:text-gold-600 transition-colors duration-300 uppercase tracking-wide">
                  Terms
                </Link>
                <span className="text-cream-400">•</span>
                <Link href="/contact" className="text-cream-300 hover:text-gold-600 transition-colors duration-300 uppercase tracking-wide">
                  Contact
                </Link>
              </div>
            </div>
            
            {/* Vintage Badge */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gold-600/10 border border-gold-600/30 rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-gold-600 rounded-full animate-pulse"></div>
                <span className="text-gold-600 text-xs font-vintage tracking-wide uppercase">
                  Live Community
                </span>
              </div>
              
              <div className="text-center">
                <p className="text-cream-200 text-sm font-vintage tracking-wide">
                  Made with <span className="text-bordeaux-400 animate-pulse">♪</span> for dancers
                </p>
                <p className="text-cream-300 text-xs mt-1 tracking-wider">
                  EST. 2024 • WORLDWIDE
                </p>
              </div>
            </div>
          </div>
          
          {/* Jazz Quote */}
          <div className="mt-8 text-center">
            <blockquote className="font-jazz text-lg text-gold-600 italic mb-2">
              "Blues is a natural fact, something that comes in and out of our souls."
            </blockquote>
            <cite className="text-cream-300 text-sm font-vintage tracking-wide">
              — INSPIRED BY THE MASTERS
            </cite>
          </div>
        </div>
      </div>
    </footer>
  )
}