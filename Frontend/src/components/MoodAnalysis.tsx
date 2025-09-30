import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

export interface MoodData {
  primary: string;
  secondary: string;
  confidence: number;
  emotions: { emotion: string; intensity: number }[];
  transcript?: string;
}

interface MoodAnalysisProps {
  moodData: MoodData;
}

export function MoodAnalysis({ moodData }: MoodAnalysisProps) {
  const getMoodColor = (mood: string) => {
    const colors = {
      happy: 'bg-yellow-500',
      sad: 'bg-blue-500',
      angry: 'bg-red-500',
      calm: 'bg-green-500',
      anxious: 'bg-purple-500',
      excited: 'bg-orange-500',
      stressed: 'bg-gray-500',
      peaceful: 'bg-teal-500',
      lonely: 'bg-indigo-500',
      energetic: 'bg-pink-500'
    };
    return colors[mood.toLowerCase() as keyof typeof colors] || 'bg-gray-500';
  };

  const getMoodEmoji = (mood: string) => {
    const emojis = {
      happy: '😊',
      sad: '😢',
      angry: '😠',
      calm: '😌',
      anxious: '😰',
      excited: '🤩',
      stressed: '😤',
      peaceful: '🧘',
      lonely: '😔',
      energetic: '⚡'
    };
    return emojis[mood.toLowerCase() as keyof typeof emojis] || '🎵';
  };

  return (
    <Card className="w-full hover-glow bg-gradient-to-br from-[var(--theme-surface)] to-[var(--theme-primary)]/10 border-[var(--theme-primary)]/20 backdrop-blur-sm theme-glow">
      <CardContent className="p-6 space-y-4">
        <div className="text-center space-y-2">
          <h3 className="text-white">Mood Analysis</h3>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-3xl">{getMoodEmoji(moodData.primary)}</span>
            <div>
              <Badge className={`${getMoodColor(moodData.primary)} text-white`}>
                {moodData.primary}
              </Badge>
              {moodData.secondary && (
                <Badge variant="outline" className="ml-2">
                  {moodData.secondary}
                </Badge>
              )}
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              Confidence: {Math.round(moodData.confidence * 100)}%
            </p>
            <Progress value={moodData.confidence * 100} className="h-2" />
          </div>
        </div>

        {moodData.transcript && (
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">What you said:</p>
            <p className="text-sm italic">"{moodData.transcript}"</p>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-sm">Emotional breakdown:</p>
          <div className="space-y-2">
            {moodData.emotions.map((emotion, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm">{emotion.emotion}</span>
                <div className="flex items-center space-x-2">
                  <Progress value={emotion.intensity} className="w-20 h-2" />
                  <span className="text-xs text-muted-foreground w-8">
                    {emotion.intensity}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}