import { Calendar, MapPin, Music, Star, Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

// Adapted from Figma design to match our project structure
export interface FestivalCardFigmaProps {
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
  className?: string;
}

export function FestivalCardFigma({
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
  artists,
  className
}: FestivalCardFigmaProps) {
  return (
    <Card className={cn(
      "overflow-hidden bg-card border-border/50 hover:border-primary/30 transition-all duration-300 group",
      className
    )}>
      <div className="relative">
        <Image
          src={imageUrl}
          alt={title}
          width={400}
          height={192}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {featured && (
          <Badge className="absolute top-3 left-3 bg-gold-600 text-navy-900">
            <Star className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        )}
        
        <Badge className="absolute top-3 right-3 bg-white/10 backdrop-blur text-white">
          {genre}
        </Badge>
        
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-playfair text-xl font-bold text-white mb-1">{title}</h3>
          <div className="flex items-center text-white/80 gap-4">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span className="text-sm">{location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span className="text-sm">{date}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-gold-600 text-gold-600" />
              <span className="text-sm font-medium">{rating}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <Users className="w-4 h-4" />
              <span className="text-sm">{attendees.toLocaleString()}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">from</p>
            <p className="font-medium text-gold-600">{price}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <Music className="w-4 h-4 text-gold-600" />
          <div className="flex flex-wrap gap-1">
            {artists.slice(0, 2).map((artist, index) => (
              <span key={index} className="text-sm text-gray-600">
                {artist}{index < Math.min(artists.length - 1, 1) && ","}
              </span>
            ))}
            {artists.length > 2 && (
              <span className="text-sm text-gray-500">
                +{artists.length - 2} more
              </span>
            )}
          </div>
        </div>
        
        <Link href={`/events/${id}`}>
          <Button className="w-full bg-gold-600 hover:bg-gold-700 text-navy-900 font-semibold">
            View Details
          </Button>
        </Link>
      </div>
    </Card>
  );
}