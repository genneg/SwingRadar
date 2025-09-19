'use client'

import { Search, Filter, MapPin, Calendar, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { useState } from "react";

// Note: We'll need to implement Select component or use a simpler approach
export interface SearchFilterFigmaProps {
  onSearch: (query: string) => void;
  onFilter: (filters: FilterOptions) => void;
  className?: string;
}

interface FilterOptions {
  location: string;
  dateRange: string;
  priceRange: string;
  genre: string;
}

export function SearchFilterFigma({ onSearch, onFilter, className }: SearchFilterFigmaProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    location: "",
    dateRange: "",
    priceRange: "",
    genre: ""
  });

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = { location: "", dateRange: "", priceRange: "", genre: "" };
    setFilters(emptyFilters);
    onFilter(emptyFilters);
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search festivals, artists, locations..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 bg-white/10 backdrop-blur border-white/20 focus:border-gold-400 text-white placeholder:text-gray-300"
        />
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white hover:text-gold-400"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="w-4 h-4" />
          {activeFilterCount > 0 && (
            <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 text-xs bg-gold-600 text-navy-900">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-white font-medium">Filters</h4>
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gold-400 hover:text-gold-300">
                Clear All
              </Button>
            )}
          </div>

          {/* Quick Filter Tags */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filters.dateRange === "this-weekend" ? "primary" : "outline"}
              size="sm"
              onClick={() => handleFilterChange("dateRange", filters.dateRange === "this-weekend" ? "" : "this-weekend")}
              className="text-xs"
            >
              This Weekend
            </Button>
            <Button
              variant={filters.dateRange === "next-month" ? "primary" : "outline"}
              size="sm"
              onClick={() => handleFilterChange("dateRange", filters.dateRange === "next-month" ? "" : "next-month")}
              className="text-xs"
            >
              Next Month
            </Button>
            <Button
              variant={filters.location === "europe" ? "primary" : "outline"}
              size="sm"
              onClick={() => handleFilterChange("location", filters.location === "europe" ? "" : "europe")}
              className="text-xs"
            >
              Europe
            </Button>
            <Button
              variant={filters.location === "north-america" ? "primary" : "outline"}
              size="sm"
              onClick={() => handleFilterChange("location", filters.location === "north-america" ? "" : "north-america")}
              className="text-xs"
            >
              North America
            </Button>
            <Button
              variant={filters.genre === "beginner-friendly" ? "primary" : "outline"}
              size="sm"
              onClick={() => handleFilterChange("genre", filters.genre === "beginner-friendly" ? "" : "beginner-friendly")}
              className="text-xs"
            >
              Beginner Friendly
            </Button>
          </div>

          {/* Advanced Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Location Filter */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-white">
                <MapPin className="w-4 h-4 text-gold-400" />
                Location
              </label>
              <select
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:border-gold-400 focus:outline-none"
              >
                <option value="">Any location</option>
                <option value="chicago">Chicago, IL</option>
                <option value="new-orleans">New Orleans, LA</option>
                <option value="memphis">Memphis, TN</option>
                <option value="austin">Austin, TX</option>
                <option value="new-york">New York, NY</option>
                <option value="europe">Europe</option>
                <option value="north-america">North America</option>
              </select>
            </div>

            {/* Date Range Filter */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-white">
                <Calendar className="w-4 h-4 text-gold-400" />
                Date Range
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => handleFilterChange("dateRange", e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:border-gold-400 focus:outline-none"
              >
                <option value="">Any time</option>
                <option value="this-week">This Week</option>
                <option value="this-weekend">This Weekend</option>
                <option value="this-month">This Month</option>
                <option value="next-month">Next Month</option>
                <option value="this-year">This Year</option>
              </select>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-white">
                <DollarSign className="w-4 h-4 text-gold-400" />
                Price Range
              </label>
              <select
                value={filters.priceRange}
                onChange={(e) => handleFilterChange("priceRange", e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:border-gold-400 focus:outline-none"
              >
                <option value="">Any price</option>
                <option value="free">Free</option>
                <option value="under-50">Under $50</option>
                <option value="50-100">$50 - $100</option>
                <option value="100-200">$100 - $200</option>
                <option value="over-200">Over $200</option>
              </select>
            </div>

            {/* Genre Filter */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-white">
                <Search className="w-4 h-4 text-gold-400" />
                Genre
              </label>
              <select
                value={filters.genre}
                onChange={(e) => handleFilterChange("genre", e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:border-gold-400 focus:outline-none"
              >
                <option value="">All genres</option>
                <option value="traditional-blues">Traditional Blues</option>
                <option value="chicago-blues">Chicago Blues</option>
                <option value="delta-blues">Delta Blues</option>
                <option value="jazz">Jazz</option>
                <option value="swing">Swing</option>
                <option value="bebop">Bebop</option>
                <option value="beginner-friendly">Beginner Friendly</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}