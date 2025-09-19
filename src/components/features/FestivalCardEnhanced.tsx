import { Calendar, MapPin, Music, Star, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface FestivalCardProps {
  id: string;
  title: string;
  location: string;
  date: string;
  price: string;
  genre: string;
  featured: boolean;
  attendees: number;
  rating: number;
  imageUrl: string;
  artists: string[];
}

export function FestivalCardEnhanced({
  id,
  title,
  location,
  date,
  price,
  genre,
  featured,
  attendees,
  rating,
  imageUrl,
  artists
}: FestivalCardProps) {
  return (
    <Card className="stats-card group cursor-pointer">
      <div className="relative">
        <div className="aspect-[16/10] relative overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Enhanced gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            {featured && (
              <Badge className="bg-primary text-primary-foreground border-0 shadow-lg">
                <Star className="w-3 h-3 mr-1 fill-current" />
                Featured
              </Badge>
            )}
            <Badge className="bg-secondary/90 text-secondary-foreground border border-border/30 backdrop-blur-sm">
              {genre}
            </Badge>
          </div>
          
          {/* Enhanced title and info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="font-playfair text-white text-2xl md:text-3xl font-bold mb-3 leading-tight drop-shadow-lg">
              {title}
            </h3>
            <div className="flex items-center text-white gap-4 text-base font-medium">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="drop-shadow-sm">{location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="drop-shadow-sm">{date}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <CardContent className="p-6 space-y-6">
        {/* Rating and Attendees */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-primary text-primary" />
              <span className="text-base font-semibold text-white">{rating}</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <Users className="w-5 h-5" />
              <span className="text-base font-medium">{attendees.toLocaleString()}</span>
            </div>
          </div>
          <div className="text-right bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2">
            <p className="text-sm text-white/90 font-medium">from</p>
            <p className="font-bold text-primary text-2xl leading-none">{price}</p>
          </div>
        </div>
        
        {/* Artists with improved contrast */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Music className="w-5 h-5 text-primary" />
            <div className="flex flex-wrap gap-2">
              {artists.slice(0, 2).map((artist, index) => (
                <span key={index} className="text-base text-white font-medium">
                  {artist}{index < Math.min(artists.length - 1, 1) && ","}
                </span>
              ))}
              {artists.length > 2 && (
                <span className="text-base text-primary font-semibold">
                  +{artists.length - 2} more
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Action Button */}
        <Link href={`/events/${id}`}>
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}