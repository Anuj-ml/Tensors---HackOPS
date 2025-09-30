import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Copy, Twitter, Facebook, Instagram, Link, Check } from 'lucide-react';
import { Playlist } from './PlaylistGenerator';

interface ShareModalProps {
  playlist: Playlist | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareModal({ playlist, isOpen, onClose }: ShareModalProps) {
  const [customCaption, setCustomCaption] = useState('');
  const [copied, setCopied] = useState(false);

  if (!playlist) return null;

  const generateShareUrl = () => {
    return `https://moodtune.ai/playlist/${playlist.id}`;
  };

  const generateShareText = () => {
    const caption = customCaption || `Just discovered the perfect ${playlist.mood} playlist "${playlist.name}" with MoodTune AI! 🎵✨`;
    return `${caption}\n\n${generateShareUrl()}`;
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generateShareText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToSocial = (platform: string) => {
    const text = encodeURIComponent(generateShareText());
    const url = encodeURIComponent(generateShareUrl());
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${text}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`,
      instagram: `https://www.instagram.com/`, // Instagram doesn't support direct sharing
    };
    
    window.open(urls[platform as keyof typeof urls], '_blank', 'width=600,height=400');
  };

  const defaultCaptions = [
    `Just discovered the perfect ${playlist.mood} playlist "${playlist.name}" with MoodTune AI! 🎵✨`,
    `MoodTune AI nailed my vibe today - check out this ${playlist.mood} playlist! 🎧`,
    `When AI understands your mood better than your friends 😅 New playlist drop! 🎵`,
    `From voice to vibe in seconds - this ${playlist.mood} playlist is *chef's kiss* 👌`,
    `AI-curated music hits different! Loving this ${playlist.mood} energy 🔥`
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>Share Your Playlist</span>
            <Badge variant="outline">{playlist.mood}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Playlist Preview */}
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <h4 className="font-medium">{playlist.name}</h4>
            <p className="text-sm text-muted-foreground">{playlist.description}</p>
            <div className="flex flex-wrap gap-1">
              {playlist.tracks.slice(0, 3).map((track, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {track.title}
                </Badge>
              ))}
              {playlist.tracks.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{playlist.tracks.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          {/* Custom Caption */}
          <div className="space-y-2">
            <label className="text-sm">Custom caption:</label>
            <Textarea
              placeholder="Add your own message..."
              value={customCaption}
              onChange={(e) => setCustomCaption(e.target.value)}
              className="min-h-[60px] resize-none"
            />
          </div>

          {/* Quick Caption Options */}
          <div className="space-y-2">
            <label className="text-sm">Or use a quick caption:</label>
            <div className="space-y-1">
              {defaultCaptions.map((caption, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => setCustomCaption(caption)}
                  className="w-full text-left justify-start h-auto p-2 text-xs"
                >
                  "{caption}"
                </Button>
              ))}
            </div>
          </div>

          {/* Share URL */}
          <div className="space-y-2">
            <label className="text-sm">Share link:</label>
            <div className="flex space-x-2">
              <Input
                value={generateShareUrl()}
                readOnly
                className="text-sm"
              />
              <Button
                onClick={copyToClipboard}
                variant="outline"
                size="sm"
                className="shrink-0"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="space-y-2">
            <label className="text-sm">Share to:</label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={() => shareToSocial('twitter')}
                variant="outline"
                size="sm"
                className="bg-blue-500 text-white border-blue-500 hover:bg-blue-600"
              >
                <Twitter className="w-4 h-4 mr-2" />
                Twitter
              </Button>
              <Button
                onClick={() => shareToSocial('facebook')}
                variant="outline"
                size="sm"
                className="bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
              >
                <Facebook className="w-4 h-4 mr-2" />
                Facebook
              </Button>
              <Button
                onClick={copyToClipboard}
                variant="outline"
                size="sm"
              >
                <Link className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}