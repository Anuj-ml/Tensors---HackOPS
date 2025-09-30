import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Mic, MicOff, Play, Square } from 'lucide-react';

interface VoiceRecorderProps {
  onRecordingComplete: (transcript: string) => void;
  isAnalyzing: boolean;
}

export function VoiceRecorder({ onRecordingComplete, isAnalyzing }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    setHasRecording(false);
    
    // Simulate recording timer
    const timer = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= 10) {
          setIsRecording(false);
          setHasRecording(true);
          clearInterval(timer);
          return 10;
        }
        return prev + 0.1;
      });
    }, 100);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setHasRecording(true);
  };

  const playRecording = () => {
    // Simulate playback and transcription
    setTimeout(() => {
      const mockTranscripts = [
        "I'm feeling so stressed about work today, everything is piling up and I can't catch a break",
        "Having an amazing day! Just got promoted and feeling on top of the world",
        "Feeling a bit lonely lately, missing my friends and family",
        "Angry about the traffic this morning, everything is going wrong",
        "Peaceful evening vibes, just want to relax and unwind",
        "Anxious about the presentation tomorrow, butterflies in my stomach"
      ];
      const randomTranscript = mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];
      onRecordingComplete(randomTranscript);
    }, 1000);
  };

  return (
    <Card className="w-full max-w-md hover-glow bg-gradient-to-br from-[var(--theme-surface)] to-[var(--theme-primary)]/10 border-[var(--theme-primary)]/20 backdrop-blur-sm theme-glow">
      <CardContent className="p-6 text-center space-y-4">
        <div className="space-y-2">
          <h3 className="text-white">Voice Mood Capture</h3>
          <p className="text-white/70">
            Record a 10-second voice vent to analyze your mood
          </p>
        </div>

        <div className="flex flex-col items-center space-y-4">
          {/* Recording Visualizer */}
          <div className="relative">
            <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all ${
              isRecording 
                ? 'border-red-400 bg-red-500/20 animate-pulse shadow-lg shadow-red-500/30' 
                : hasRecording
                ? 'border-green-400 bg-green-500/20 shadow-lg shadow-green-500/30'
                : 'border-[var(--theme-primary)]/40 bg-[var(--theme-primary)]/10 theme-glow'
            }`}>
              {isRecording ? (
                <MicOff className="w-8 h-8 text-red-500" />
              ) : hasRecording ? (
                <Play className="w-8 h-8 text-green-500" />
              ) : (
                <Mic className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
            
            {isRecording && (
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                <div className="bg-red-500 text-white px-2 py-1 rounded text-sm">
                  {recordingTime.toFixed(1)}s
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex space-x-2">
            {!isRecording && !hasRecording && (
              <Button 
                onClick={startRecording} 
                disabled={isAnalyzing}
                className="bg-red-500 hover:bg-red-600"
              >
                <Mic className="w-4 h-4 mr-2" />
                Start Recording
              </Button>
            )}
            
            {isRecording && (
              <Button 
                onClick={stopRecording}
                variant="outline"
              >
                <Square className="w-4 h-4 mr-2" />
                Stop ({(10 - recordingTime).toFixed(1)}s left)
              </Button>
            )}
            
            {hasRecording && !isAnalyzing && (
              <div className="space-x-2">
                <Button onClick={playRecording} className="bg-green-500 hover:bg-green-600">
                  <Play className="w-4 h-4 mr-2" />
                  Analyze Mood
                </Button>
                <Button 
                  onClick={() => {
                    setHasRecording(false);
                    setRecordingTime(0);
                  }}
                  variant="outline"
                >
                  Re-record
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}