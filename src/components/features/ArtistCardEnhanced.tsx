import { Heart, MapPin, Calendar, Music2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ArtistCardProps {
  id: string;
  name: string;
  instrument: string;
  location: string;
  nextShow: string;
  followers: number;
  imageUrl: string;
  genres: string[];
  isFollowing?: boolean;
}

export function ArtistCardEnhanced({
  id,
  name,
  instrument,
  location,
  nextShow,
  followers,
  imageUrl,
  genres,
  isFollowing = false
}: ArtistCardProps) {
  const [following, setFollowing] = useState(isFollowing);

  const handleFollowToggle = () => {
    setFollowing(!following);
  };

  return (
    <Link href={`/teachers/${id}`}>
      <Card className="stats-card group cursor-pointer">
        <div className="relative">
          <div className="aspect-square relative overflow-hidden">
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Enhanced gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* Follow button */}
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "absolute top-3 right-3 w-10 h-10 rounded-full backdrop-blur-sm transition-all duration-300 z-10",
                following 
                  ? "bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300" 
                  : "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white"
              )}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleFollowToggle();
              }}
            >
              <Heart className={cn(
                "w-4 h-4 transition-all duration-300",
                following ? "fill-current scale-110" : ""
              )} />
            </Button>
            
            {/* Enhanced artist info overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h4 className="font-playfair text-white text-xl md:text-2xl font-bold mb-2 leading-tight drop-shadow-lg">
                {name}
              </h4>
              <div className="flex items-center gap-2 text-white">
                <Music2 className="w-4 h-4" />
                <span className="text-base font-semibold drop-shadow-sm">{instrument}</span>
              </div>
            </div>
          </div>
        </div>
      
      <CardContent className="p-6 space-y-6">
        {/* Genres */}
        <div className="flex flex-wrap gap-3">
          {genres.slice(0, 2).map((genre, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="text-xs border-primary/30 text-primary bg-primary/5 hover:bg-primary/10 transition-colors duration-300"
            >
              {genre}
            </Badge>
          ))}
          {genres.length > 2 && (
            <Badge 
              variant="outline" 
              className="text-xs border-muted-foreground/30 text-muted-foreground"
            >
              +{genres.length - 2}
            </Badge>
          )}
        </div>
        
        {/* Location and next show with improved contrast */}
        <div className="space-y-4 text-base">
          <div className="flex items-center gap-3 text-white">
            <MapPin className="w-4 h-4" />
            <span className="font-medium">{location}</span>
          </div>
          <div className="flex items-center gap-3 text-white">
            <Calendar className="w-4 h-4" />
            <span className="font-medium">Next: {nextShow}</span>
          </div>
        </div>
        
        {/* Footer with followers and follow button */}
        <div className="flex items-center justify-between pt-3 border-t border-border/30">
          <span className="text-sm text-white font-medium">
            {followers.toLocaleString()} followers
          </span>
          <Button 
            variant={following ? "secondary" : "default"}
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleFollowToggle();
            }}
            className={cn(
              "transition-all duration-300 font-medium",
              following 
                ? "bg-secondary hover:bg-secondary/80" 
                : "bg-primary hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
            )}
          >
            {following ? "Following" : "Follow"}
          </Button>
        </div>
      </CardContent>
    </Card>
    </Link>
  );
}