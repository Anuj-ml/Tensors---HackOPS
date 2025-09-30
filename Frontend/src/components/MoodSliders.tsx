import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Shuffle } from 'lucide-react';

interface MoodSlidersProps {
  onMoodSet: (mood: any) => void;
  onSurpriseRemix: () => void;
}

export function MoodSliders({ onMoodSet, onSurpriseRemix }: MoodSlidersProps) {
  const [moods, setMoods] = useState({
    energy: [50],
    positivity: [50],
    intensity: [50],
    calmness: [50],
  });

  const handleSliderChange = (moodType: string, value: number[]) => {
    setMoods(prev => ({
      ...prev,
      [moodType]: value
    }));
  };

  const generateMoodFromSliders = () => {
    const values = {
      energy: moods.energy[0],
      positivity: moods.positivity[0],
      intensity: moods.intensity[0],
      calmness: moods.calmness[0],
    };

    // Determine primary mood based on slider values
    let primaryMood = 'neutral';
    
    if (values.positivity > 70 && values.energy > 60) {
      primaryMood = 'happy';
    } else if (values.positivity < 30) {
      primaryMood = 'sad';
    } else if (values.intensity > 70 && values.energy > 60) {
      primaryMood = 'angry';
    } else if (values.calmness > 70) {
      primaryMood = 'calm';
    } else if (values.energy < 30 && values.intensity > 50) {
      primaryMood = 'stressed';
    } else if (values.energy > 80) {
      primaryMood = 'excited';
    }

    const moodData = {
      primary: primaryMood,
      secondary: values.calmness > 60 ? 'peaceful' : values.intensity > 60 ? 'intense' : 'balanced',
      confidence: 0.85,
      emotions: [
        { emotion: 'Energy', intensity: values.energy },
        { emotion: 'Positivity', intensity: values.positivity },
        { emotion: 'Intensity', intensity: values.intensity },
        { emotion: 'Calmness', intensity: values.calmness },
      ],
      transcript: `Manual mood set: Energy ${values.energy}%, Positivity ${values.positivity}%, Intensity ${values.intensity}%, Calmness ${values.calmness}%`
    };

    onMoodSet(moodData);
  };

  const resetSliders = () => {
    setMoods({
      energy: [50],
      positivity: [50],
      intensity: [50],
      calmness: [50],
    });
  };

  return (
    <Card className="w-full max-w-md hover-glow bg-gradient-to-br from-[var(--theme-surface)] to-[var(--theme-primary)]/10 border-[var(--theme-primary)]/20 backdrop-blur-sm theme-glow">
      <CardContent className="p-6 space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-white">Manual Mood Control</h3>
          <p className="text-white/70 text-sm">
            Fine-tune your vibe when voice detection glitches
          </p>
        </div>

        <div className="space-y-6">
          {Object.entries(moods).map(([moodType, value]) => (
            <div key={moodType} className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm capitalize">{moodType}</label>
                <span className="text-sm text-muted-foreground">{value[0]}%</span>
              </div>
              <Slider
                value={value}
                onValueChange={(newValue) => handleSliderChange(moodType, newValue)}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Button onClick={generateMoodFromSliders} className="w-full">
            Generate Playlist
          </Button>
          <div className="flex space-x-2">
            <Button onClick={resetSliders} variant="outline" className="flex-1">
              Reset
            </Button>
            <Button 
              onClick={onSurpriseRemix} 
              variant="outline"
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:from-purple-600 hover:to-pink-600"
            >
              <Shuffle className="w-4 h-4 mr-2" />
              Surprise Remix
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}