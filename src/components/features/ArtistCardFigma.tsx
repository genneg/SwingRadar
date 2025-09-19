import { Heart, MapPin, Calendar, Music2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Adapted from Figma design for Blues Dance Festival Finder
export interface ArtistCardFigmaProps {
  id: string;
  name: string;
  instrument: string;
  location: string;
  nextShow: string;
  followers: number;
  imageUrl: string;
  genres: string[];
  isFollowing?: boolean;
  onFollowToggle?: (id: string, isFollowing: boolean) => void;
  className?: string;
  type: 'teacher' | 'musician';
}

export function ArtistCardFigma({
  id,
  name,
  instrument,
  location,
  nextShow,
  followers,
  imageUrl,
  genres,
  isFollowing = false,
  onFollowToggle,
  className,
  type
}: ArtistCardFigmaProps) {
  const [following, setFollowing] = useState(isFollowing);

  const handleFollowToggle = () => {
    const newFollowingState = !following;
    setFollowing(newFollowingState);
    onFollowToggle?.(id, newFollowingState);
  };

  const displayRole = type === 'teacher' ? 'Instructor' : 'Musician';
  const linkPath = `/${type}s/${id}`; // /teachers/id or /musicians/id

  return (
    <Card className={cn(
      "overflow-hidden bg-card border-border/50 hover:border-gold-400/30 transition-all duration-300 group",
      className
    )}>
      <div className="relative">
        <Image
          src={imageUrl}
          alt={name}
          width={300}
          height={128}
          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "absolute top-2 right-2 p-1",
            following 
              ? "text-red-400 hover:text-red-300" 
              : "text-white/60 hover:text-white"
          )}
          onClick={handleFollowToggle}
        >
          <Heart className={cn("w-4 h-4", following && "fill-current")} />
        </Button>
        
        <div className="absolute bottom-2 left-2 right-2">
          <h4 className="font-playfair text-lg font-bold text-white">{name}</h4>
          <div className="flex items-center gap-1 text-white/80">
            <Music2 className="w-3 h-3" />
            <span className="text-sm">{displayRole} • {instrument}</span>
          </div>
        </div>
      </div>
      
      <div className="p-3">
        <div className="flex flex-wrap gap-1 mb-2">
          {genres.slice(0, 2).map((genre, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="text-xs border-gold-600/30 text-gold-600"
            >
              {genre}
            </Badge>
          ))}
          {genres.length > 2 && (
            <Badge 
              variant="outline" 
              className="text-xs border-gray-300/30 text-gray-500"
            >
              +{genres.length - 2}
            </Badge>
          )}
        </div>
        
        <div className="space-y-1 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Next: {nextShow}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-gray-500">
            {followers.toLocaleString()} followers
          </span>
          <div className="flex gap-2">
            <Button 
              variant={following ? "secondary" : "primary"}
              size="sm"
              onClick={handleFollowToggle}
              className="text-xs px-3"
            >
              {following ? "Following" : "Follow"}
            </Button>
            <Link href={linkPath}>
              <Button 
                variant="outline"
                size="sm"
                className="text-xs px-3"
              >
                View
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}