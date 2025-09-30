import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Play, Pause, Share2, RefreshCw, Volume2 } from 'lucide-react';
import { MoodData } from './MoodAnalysis';

export interface Track {
  id: string;
  title: string;
  artist: string;
  genre: string;
  vibeNote: string;
  previewUrl?: string;
  duration: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  tracks: Track[];
  mood: string;
  createdAt: Date;
}

interface PlaylistGeneratorProps {
  moodData: MoodData;
  onShare: (playlist: Playlist) => void;
  onRegenerate: () => void;
}

export function PlaylistGenerator({ moodData, onShare, onRegenerate }: PlaylistGeneratorProps) {
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Mock playlist data based on mood
  const generatePlaylist = (): Playlist => {
    const playlistData = {
      happy: {
        name: "Sunshine Vibes ☀️",
        description: "Uplifting tracks to match your bright mood",
        tracks: [
          { title: "Good as Hell", artist: "Lizzo", genre: "Pop", vibeNote: "This anthem matches your confident energy - you're unstoppable!" },
          { title: "Happy", artist: "Pharrell Williams", genre: "Pop", vibeNote: "Classic feel-good vibes for your joyful state" },
          { title: "Can't Stop the Feeling!", artist: "Justin Timberlake", genre: "Pop", vibeNote: "Pure happiness in musical form" },
          { title: "Walking on Sunshine", artist: "Katrina and the Waves", genre: "Rock", vibeNote: "Your mood is literally sunshine!" },
          { title: "I Got a Feeling", artist: "Black Eyed Peas", genre: "Hip-Hop", vibeNote: "Tonight's gonna be a good night vibes" }
        ]
      },
      sad: {
        name: "Healing Rain 🌧️",
        description: "Gentle melodies for emotional processing",
        tracks: [
          { title: "Someone Like You", artist: "Adele", genre: "Pop", vibeNote: "Let it out - this track understands your heartache" },
          { title: "Mad World", artist: "Gary Jules", genre: "Alternative", vibeNote: "Sometimes the world feels heavy, this gets it" },
          { title: "Black", artist: "Pearl Jam", genre: "Grunge", vibeNote: "Raw emotion for when words aren't enough" },
          { title: "Hurt", artist: "Johnny Cash", genre: "Country", vibeNote: "Pain transformed into beautiful art" },
          { title: "Skinny Love", artist: "Bon Iver", genre: "Indie", vibeNote: "Delicate healing for tender feelings" }
        ]
      },
      angry: {
        name: "Rage Release 🔥",
        description: "Channel that fire into pure sonic power",
        tracks: [
          { title: "Break Stuff", artist: "Limp Bizkit", genre: "Nu-Metal", vibeNote: "This beat's got your back on that breakup rage" },
          { title: "Killing in the Name", artist: "Rage Against the Machine", genre: "Rock", vibeNote: "Revolutionary anger meets musical genius" },
          { title: "Bodies", artist: "Drowning Pool", genre: "Metal", vibeNote: "Let the floor hit back!" },
          { title: "Psycho", artist: "Post Malone ft. Ty Dolla $ign", genre: "Hip-Hop", vibeNote: "Modern rage anthem for your mood" },
          { title: "Since U Been Gone", artist: "Kelly Clarkson", genre: "Pop-Rock", vibeNote: "Empowering anger that builds you up" }
        ]
      },
      stressed: {
        name: "Pressure Relief 💨",
        description: "Music to help you breathe through the chaos",
        tracks: [
          { title: "Breathe", artist: "Pink Floyd", genre: "Progressive Rock", vibeNote: "Deep breaths, this stress is temporary" },
          { title: "Weightless", artist: "Marconi Union", genre: "Ambient", vibeNote: "Scientifically proven to reduce anxiety" },
          { title: "Mad at You", artist: "Noah Kahan", genre: "Indie Folk", vibeNote: "When everything feels overwhelming" },
          { title: "Stress Relief", artist: "Lofi Girl", genre: "Lo-fi", vibeNote: "Gentle beats to calm your racing mind" },
          { title: "Take It Easy", artist: "Eagles", genre: "Rock", vibeNote: "Sometimes you just need to slow down" }
        ]
      },
      calm: {
        name: "Zen Garden 🧘",
        description: "Peaceful soundscapes for your serene mood",
        tracks: [
          { title: "River", artist: "Joni Mitchell", genre: "Folk", vibeNote: "Flowing like water, matching your peaceful state" },
          { title: "Aqueous Transmission", artist: "Incubus", genre: "Alternative", vibeNote: "13 minutes of pure tranquility" },
          { title: "The Sound of Silence", artist: "Simon & Garfunkel", genre: "Folk", vibeNote: "Perfect for your contemplative mood" },
          { title: "Clair de Lune", artist: "Claude Debussy", genre: "Classical", vibeNote: "Moonlight sonata for your soul" },
          { title: "Peaceful, Easy Feeling", artist: "Eagles", genre: "Rock", vibeNote: "Embracing the calm within the storm" }
        ]
      }
    };

    const moodKey = moodData.primary.toLowerCase() as keyof typeof playlistData;
    const selectedData = playlistData[moodKey] || playlistData.calm;

    return {
      id: Math.random().toString(36).substring(7),
      name: selectedData.name,
      description: selectedData.description,
      tracks: selectedData.tracks.map((track, index) => ({
        id: `track-${index}`,
        title: track.title,
        artist: track.artist,
        genre: track.genre,
        vibeNote: track.vibeNote,
        duration: `${Math.floor(Math.random() * 3) + 2}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
      })),
      mood: moodData.primary,
      createdAt: new Date()
    };
  };

  const [playlist] = useState<Playlist>(generatePlaylist());

  const togglePlay = (trackId: string) => {
    if (currentTrack === trackId && isPlaying) {
      setIsPlaying(false);
    } else {
      setCurrentTrack(trackId);
      setIsPlaying(true);
      // Simulate stopping after a few seconds
      setTimeout(() => setIsPlaying(false), 3000);
    }
  };

  return (
    <Card className="w-full hover-glow bg-gradient-to-br from-[var(--theme-surface)] to-[var(--theme-primary)]/10 border-[var(--theme-primary)]/20 backdrop-blur-sm theme-glow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <span>{playlist.name}</span>
              <Badge variant="outline">{playlist.mood}</Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {playlist.description}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={onRegenerate}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => onShare(playlist)}
              size="sm"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {playlist.tracks.map((track, index) => (
          <div key={track.id} className="border border-[var(--theme-primary)]/20 rounded-lg p-4 space-y-2 hover-container bg-gradient-to-r from-[var(--theme-primary)]/5 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={() => togglePlay(track.id)}
                    size="sm"
                    variant="outline"
                    className="w-8 h-8 p-0"
                  >
                    {currentTrack === track.id && isPlaying ? (
                      <Pause className="w-3 h-3" />
                    ) : (
                      <Play className="w-3 h-3" />
                    )}
                  </Button>
                  <div>
                    <p className="text-sm">{track.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {track.artist} • {track.genre} • {track.duration}
                    </p>
                  </div>
                </div>
              </div>
              {currentTrack === track.id && isPlaying && (
                <div className="flex items-center space-x-1 text-green-500">
                  <Volume2 className="w-4 h-4" />
                  <div className="flex space-x-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-1 bg-green-500 animate-pulse"
                        style={{
                          height: `${Math.random() * 16 + 8}px`,
                          animationDelay: `${i * 0.1}s`
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="bg-muted/50 p-2 rounded text-xs italic">
              <span className="text-muted-foreground">AI Vibe Note:</span> {track.vibeNote}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}