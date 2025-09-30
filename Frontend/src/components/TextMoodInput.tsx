import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Textarea } from './ui/textarea';
import { MessageSquare } from 'lucide-react';

interface TextMoodInputProps {
  onTextSubmit: (text: string) => void;
  isAnalyzing: boolean;
}

export function TextMoodInput({ onTextSubmit, isAnalyzing }: TextMoodInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim()) {
      onTextSubmit(text.trim());
      setText('');
    }
  };

  const quickMoods = [
    "I'm feeling stressed and overwhelmed",
    "Having an amazing day!",
    "Feeling a bit lonely",
    "Angry about everything",
    "Need some chill vibes",
    "Anxious and worried"
  ];

  return (
    <Card className="w-full max-w-md hover-glow bg-gradient-to-br from-[var(--theme-surface)] to-[var(--theme-primary)]/10 border-[var(--theme-primary)]/20 backdrop-blur-sm theme-glow">
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-white">Text Mood Vent</h3>
          <p className="text-white/70">
            Type out how you're feeling right now
          </p>
        </div>

        <div className="space-y-4">
          <Textarea
            placeholder="Pour your heart out here... what's on your mind?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[100px] resize-none"
            disabled={isAnalyzing}
          />

          <Button 
            onClick={handleSubmit}
            disabled={!text.trim() || isAnalyzing}
            className="w-full"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Analyze My Mood
          </Button>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Quick mood starters:</p>
            <div className="grid grid-cols-1 gap-2">
              {quickMoods.map((mood, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setText(mood)}
                  disabled={isAnalyzing}
                  className="text-left justify-start text-xs"
                >
                  "{mood}"
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}