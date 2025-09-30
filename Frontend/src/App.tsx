import { useState } from 'react';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Badge } from './components/ui/badge';
import { VoiceRecorder } from './components/VoiceRecorder';
import { TextMoodInput } from './components/TextMoodInput';
import { MoodAnalysis, MoodData } from './components/MoodAnalysis';
import { PlaylistGenerator, Playlist } from './components/PlaylistGenerator';
import { ShareModal } from './components/ShareModal';
import { ThreeScene } from './components/ThreeScene';
import { FeatureCard } from './components/FeatureCard';
import { ThemeProvider } from './components/ThemeProvider';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { SimpleMusicIcon } from './components/SimpleMusicIcon';
import { Music, Sparkles, Heart, Zap, Brain, Headphones, Share2, Mic, MessageSquare, Bot, Waves, Globe, Volume2, Radio } from 'lucide-react';

type AppState = 'input' | 'analyzing' | 'results';

function AppContent() {
  const [appState, setAppState] = useState<AppState>('input');
  const [moodData, setMoodData] = useState<MoodData | null>(null);
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [playlistToShare, setPlaylistToShare] = useState<Playlist | null>(null);

  const analyzeMood = (input: string) => {
    setAppState('analyzing');
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockMoods = [
        {
          primary: 'happy',
          secondary: 'energetic',
          confidence: 0.92,
          emotions: [
            { emotion: 'Joy', intensity: 85 },
            { emotion: 'Energy', intensity: 78 },
            { emotion: 'Confidence', intensity: 90 },
            { emotion: 'Excitement', intensity: 72 }
          ]
        },
        {
          primary: 'stressed',
          secondary: 'overwhelmed',
          confidence: 0.88,
          emotions: [
            { emotion: 'Anxiety', intensity: 82 },
            { emotion: 'Pressure', intensity: 90 },
            { emotion: 'Fatigue', intensity: 65 },
            { emotion: 'Worry', intensity: 75 }
          ]
        },
        {
          primary: 'sad',
          secondary: 'lonely',
          confidence: 0.88,
          emotions: [
            { emotion: 'Sadness', intensity: 80 },
            { emotion: 'Loneliness', intensity: 75 },
            { emotion: 'Melancholy', intensity: 70 },
            { emotion: 'Nostalgia', intensity: 60 }
          ]
        },
        {
          primary: 'angry',
          secondary: 'frustrated',
          confidence: 0.90,
          emotions: [
            { emotion: 'Anger', intensity: 85 },
            { emotion: 'Frustration', intensity: 90 },
            { emotion: 'Irritation', intensity: 78 },
            { emotion: 'Intensity', intensity: 88 }
          ]
        },
        {
          primary: 'calm',
          secondary: 'peaceful',
          confidence: 0.87,
          emotions: [
            { emotion: 'Serenity', intensity: 85 },
            { emotion: 'Peace', intensity: 90 },
            { emotion: 'Relaxation', intensity: 82 },
            { emotion: 'Mindfulness', intensity: 75 }
          ]
        }
      ];

      // Simple mood detection based on keywords
      let selectedMood = mockMoods[Math.floor(Math.random() * mockMoods.length)];
      
      if (input.toLowerCase().includes('stress') || input.toLowerCase().includes('overwhelm')) {
        selectedMood = mockMoods[1];
      } else if (input.toLowerCase().includes('happy') || input.toLowerCase().includes('amazing') || input.toLowerCase().includes('great')) {
        selectedMood = mockMoods[0];
      } else if (input.toLowerCase().includes('sad') || input.toLowerCase().includes('lonely') || input.toLowerCase().includes('down')) {
        selectedMood = mockMoods[2];
      } else if (input.toLowerCase().includes('angry') || input.toLowerCase().includes('mad') || input.toLowerCase().includes('frustrated')) {
        selectedMood = mockMoods[3];
      } else if (input.toLowerCase().includes('calm') || input.toLowerCase().includes('peaceful') || input.toLowerCase().includes('relax')) {
        selectedMood = mockMoods[4];
      }

      const mood: MoodData = {
        ...selectedMood,
        transcript: input
      };

      setMoodData(mood);
      setAppState('results');
    }, 2000);
  };

  const handleShare = (playlist: Playlist) => {
    setPlaylistToShare(playlist);
    setShareModalOpen(true);
  };

  const handleRegenerate = () => {
    if (moodData) {
      // Force re-render of playlist by updating mood data timestamp
      setMoodData({ ...moodData });
    }
  };

  const resetApp = () => {
    setAppState('input');
    setMoodData(null);
    setPlaylist(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white relative overflow-hidden" style={{
      background: `linear-gradient(to bottom right, var(--theme-background), var(--theme-surface), var(--theme-background))`
    }}>
      {/* Dynamic Background with Music Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-blue-500/5"></div>
        
        {/* Large Vinyl Record - Top Left */}
        <div className="absolute -top-20 -left-20 w-32 h-32 opacity-30">
          <SimpleMusicIcon variant="vinyl" isPlaying={appState === 'analyzing'} />
        </div>
        
        {/* Speaker Stack - Bottom Right */}
        <div className="absolute -bottom-10 -right-10 w-24 h-24 opacity-40">
          <SimpleMusicIcon variant="speaker" isPlaying={appState === 'analyzing'} />
        </div>
        
        {/* Floating Musical Notes - Center */}
        <div className="absolute top-1/3 left-1/4 w-16 h-16 opacity-25">
          <SimpleMusicIcon variant="notes" isPlaying={appState !== 'input'} />
        </div>
        
        {/* Equalizer Bars - Center Right */}
        <div className="absolute top-1/2 right-1/4 w-20 h-20 opacity-30">
          <SimpleMusicIcon variant="equalizer" isPlaying={appState === 'analyzing'} />
        </div>
      </div>

      {/* Navigation Header */}
      <nav className="relative z-50 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-[var(--theme-primary)]/20 p-2 rounded-xl theme-glow">
              <Music className="w-6 h-6 text-[var(--theme-primary)]" />
            </div>
            <span className="text-xl font-semibold">MoodTune AI</span>
          </div>
          <ThemeSwitcher />
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="relative py-16 lg:py-24">
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="floating-animation">
              <div className="flex items-center justify-center space-x-6 mb-8">
                <div className="bg-[var(--theme-primary)]/20 p-6 rounded-3xl backdrop-blur-sm border border-[var(--theme-primary)]/30 hover-glow theme-glow">
                  <div className="w-16 h-16 relative">
                    <SimpleMusicIcon variant="vinyl" isPlaying={true} />
                  </div>
                </div>
                <div>
                  <h1 className="text-6xl lg:text-8xl bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                    MoodTune AI
                  </h1>
                  <div className="flex items-center justify-center space-x-3 mt-2 pulse-slow">
                    <Sparkles className="w-6 h-6 text-[var(--theme-accent)]" />
                    <span className="text-2xl lg:text-3xl text-white/90">Voice-to-Vibe Emotional Music Companion</span>
                    <Sparkles className="w-6 h-6 text-[var(--theme-accent)]" />
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-lg lg:text-xl text-white/80 max-w-4xl mx-auto mb-12 leading-relaxed">
              Transform your emotional chaos into perfect sonic therapy. Our AI analyzes your voice or text 
              to curate personalized playlists that match your exact emotional fingerprint. Experience music like never before.
            </p>

            {/* Music Feature Showcase */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
              <div className="group">
                <div className="bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6 hover-container theme-glow h-48">
                  <div className="flex items-center justify-center h-20 mb-4">
                    <SimpleMusicIcon variant="speaker" isPlaying={true} className="w-16 h-16" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-white font-medium">Audio Visualization</h3>
                    <p className="text-white/60 text-sm">Real-time sound reactive graphics</p>
                  </div>
                </div>
              </div>

              <div className="group">
                <div className="bg-blue-400/10 backdrop-blur-sm border border-blue-400/20 rounded-2xl p-6 hover-container theme-glow h-48">
                  <div className="flex items-center justify-center h-20 mb-4">
                    <SimpleMusicIcon variant="equalizer" isPlaying={true} className="w-16 h-16" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-white font-medium">Dynamic Equalizer</h3>
                    <p className="text-white/60 text-sm">Live frequency analysis</p>
                  </div>
                </div>
              </div>

              <div className="group">
                <div className="bg-blue-600/10 backdrop-blur-sm border border-blue-600/20 rounded-2xl p-6 hover-container theme-glow h-48">
                  <div className="flex items-center justify-center h-20 mb-4">
                    <SimpleMusicIcon variant="notes" isPlaying={true} className="w-16 h-16" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-white font-medium">Musical Elements</h3>
                    <p className="text-white/60 text-sm">Interactive note animations</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
              <div className="bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6 hover-container music-pulse">
                <Brain className="w-10 h-10 text-blue-400 mx-auto mb-3" />
                <div className="text-white font-medium text-lg">AI Emotion Detection</div>
                <div className="text-white/70">Advanced sentiment analysis with 90%+ accuracy</div>
              </div>
              <div className="bg-blue-400/10 backdrop-blur-sm border border-blue-400/20 rounded-xl p-6 hover-container music-pulse" style={{ animationDelay: '0.2s' }}>
                <Headphones className="w-10 h-10 text-blue-300 mx-auto mb-3" />
                <div className="text-white font-medium text-lg">Instant Playlists</div>
                <div className="text-white/70">5 perfect tracks curated in seconds</div>
              </div>
              <div className="bg-blue-600/10 backdrop-blur-sm border border-blue-600/20 rounded-xl p-6 hover-container music-pulse" style={{ animationDelay: '0.4s' }}>
                <Share2 className="w-10 h-10 text-blue-500 mx-auto mb-3" />
                <div className="text-white font-medium text-lg">Social Sharing</div>
                <div className="text-white/70">One-tap mood and music sharing</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {appState === 'input' && (
          <div className="max-w-6xl mx-auto space-y-16">
            {/* How It Works with Enhanced 3D */}
            <div className="text-center space-y-12">
              <div className="space-y-6">
                <Badge variant="secondary" className="bg-[var(--theme-primary)]/20 text-white border-[var(--theme-primary)]/30 text-lg px-6 py-2">
                  How MoodTune AI Works
                </Badge>
                <h2 className="text-4xl lg:text-5xl text-white">
                  From Emotion to Perfect Playlist in 3 Steps
                </h2>
                <div className="w-12 h-12 mx-auto">
                  <SimpleMusicIcon variant="waveform" isPlaying={true} />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="relative">
                  <div className="absolute -top-4 -left-4 w-8 h-8 opacity-30">
                    <SimpleMusicIcon variant="notes" isPlaying={true} />
                  </div>
                  <FeatureCard
                    icon={<Mic className="w-6 h-6 text-[var(--theme-primary)]" />}
                    title="Capture Your Mood"
                    description="Voice or text input"
                    details={[
                      "10-second voice recordings with real-time analysis",
                      "Free-form text venting for emotional expression", 
                      "Supports multiple languages and accents",
                      "Instant mood capture and processing"
                    ]}
                    className="bg-[var(--theme-primary)]/5 border-[var(--theme-primary)]/20"
                  />
                </div>

                <div className="relative">
                  <div className="absolute -top-4 -right-4 w-8 h-8 opacity-30">
                    <SimpleMusicIcon variant="equalizer" isPlaying={true} />
                  </div>
                  <FeatureCard
                    icon={<Bot className="w-6 h-6 text-[var(--theme-accent)]" />}
                    title="AI Analysis Engine"
                    description="Advanced emotion processing"
                    details={[
                      "Machine learning emotion detection algorithms",
                      "Sentiment analysis with 90%+ accuracy",
                      "Multi-dimensional emotional mapping",
                      "Context-aware mood interpretation"
                    ]}
                    className="bg-[var(--theme-accent)]/5 border-[var(--theme-accent)]/20"
                  />
                </div>

                <div className="relative">
                  <div className="absolute -bottom-4 -left-4 w-8 h-8 opacity-30">
                    <SimpleMusicIcon variant="vinyl" isPlaying={true} />
                  </div>
                  <FeatureCard
                    icon={<Music className="w-6 h-6 text-[var(--theme-secondary)]" />}
                    title="Smart Playlist Curation"
                    description="Personalized music selection"
                    details={[
                      "5-song playlists optimized for your mood",
                      "AI-generated vibe notes explaining each choice",
                      "Genre-spanning recommendations",
                      "Tempo and energy matching your emotional state"
                    ]}
                    className="bg-[var(--theme-secondary)]/5 border-[var(--theme-secondary)]/20"
                  />
                </div>
              </div>
            </div>

            {/* Main Interface */}
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <Badge variant="secondary" className="bg-[var(--theme-primary)]/20 text-white border-[var(--theme-primary)]/30 mb-6 text-lg px-6 py-2">
                  Try MoodTune AI Now
                </Badge>
                <h2 className="text-3xl lg:text-4xl text-white mb-4">
                  Start Your Emotional Music Journey
                </h2>
                <p className="text-white/80 text-lg">
                  Choose your preferred method to capture and analyze your current mood
                </p>
                <div className="w-8 h-8 mx-auto mt-4">
                  <SimpleMusicIcon variant="waveform" isPlaying={true} />
                </div>
              </div>

              <Tabs defaultValue="voice" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-[var(--theme-surface)]/80 border-[var(--theme-primary)]/20 backdrop-blur-sm">
                  <TabsTrigger value="voice" className="data-[state=active]:bg-[var(--theme-primary)]/20 data-[state=active]:text-white">
                    <Mic className="w-4 h-4 mr-2" />
                    Voice
                  </TabsTrigger>
                  <TabsTrigger value="text" className="data-[state=active]:bg-[var(--theme-primary)]/20 data-[state=active]:text-white">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Text
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="voice" className="space-y-4 mt-8">
                  <VoiceRecorder 
                    onRecordingComplete={analyzeMood}
                    isAnalyzing={appState === 'analyzing'}
                  />
                </TabsContent>
                
                <TabsContent value="text" className="space-y-4 mt-8">
                  <TextMoodInput 
                    onTextSubmit={analyzeMood}
                    isAnalyzing={appState === 'analyzing'}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}

        {appState === 'analyzing' && (
          <div className="max-w-lg mx-auto">
            <Card className="hover-glow bg-gradient-to-br from-[var(--theme-surface)] to-[var(--theme-primary)]/10 border-[var(--theme-primary)]/20 backdrop-blur-sm theme-glow">
              <CardContent className="p-12 text-center space-y-8">
                <div className="relative">
                  <div className="w-32 h-32 mx-auto flex items-center justify-center">
                    <SimpleMusicIcon variant="equalizer" isPlaying={true} className="w-16 h-16" />
                  </div>
                  <div className="absolute -inset-8 bg-[var(--theme-primary)]/20 rounded-full animate-ping"></div>
                </div>
                
                <div>
                  <h3 className="text-white text-2xl mb-2">Analyzing Your Emotional Fingerprint</h3>
                  <p className="text-white/80 text-lg">
                    Our AI is processing your unique emotional signature
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-3 text-white/90">
                    <div className="w-3 h-3 bg-[var(--theme-primary)] rounded-full animate-pulse"></div>
                    <span>Detecting emotional patterns and intensity</span>
                  </div>
                  <div className="flex items-center justify-center space-x-3 text-white/90">
                    <div className="w-3 h-3 bg-[var(--theme-accent)] rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    <span>Curating personalized track selection</span>
                  </div>
                  <div className="flex items-center justify-center space-x-3 text-white/90">
                    <div className="w-3 h-3 bg-[var(--theme-secondary)] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <span>Generating AI-powered vibe explanations</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {appState === 'results' && moodData && (
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-6">
              <Badge variant="secondary" className="bg-green-500/20 text-green-200 border-green-500/30 text-lg px-6 py-2">
                ✨ Analysis Complete
              </Badge>
              <h2 className="text-4xl lg:text-5xl text-white">Your Personalized Music Experience</h2>
              <p className="text-white/80 max-w-2xl mx-auto text-lg">
                Based on your emotional analysis, we've curated the perfect playlist to match your current vibe
              </p>
              <div className="w-12 h-12 mx-auto">
                <SimpleMusicIcon variant="waveform" isPlaying={true} />
              </div>
            </div>

            <div className="grid gap-12 lg:grid-cols-2">
              <div className="space-y-8">
                <MoodAnalysis moodData={moodData} />
                <div className="text-center space-y-6">
                  <Button 
                    onClick={resetApp} 
                    variant="outline"
                    size="lg"
                    className="border-[var(--theme-primary)]/30 hover:bg-[var(--theme-primary)]/10 hover:border-[var(--theme-primary)]/50 text-white"
                  >
                    <Brain className="w-5 h-5 mr-2" />
                    Analyze New Mood
                  </Button>
                  <p className="text-white/60">
                    Try different input methods or share your results with friends
                  </p>
                </div>
              </div>

              <div>
                <PlaylistGenerator 
                  moodData={moodData}
                  onShare={handleShare}
                  onRegenerate={handleRegenerate}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <ShareModal
        playlist={playlistToShare}
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />

      {/* Enhanced Footer */}
      <footer className="relative mt-32 py-16 border-t border-[var(--theme-primary)]/20">
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--theme-background)] to-transparent"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center space-y-8">
            <div className="flex items-center justify-center space-x-4">
              <div className="bg-[var(--theme-primary)]/20 p-3 rounded-xl theme-glow">
                <Music className="w-8 h-8 text-[var(--theme-primary)]" />
              </div>
              <span className="text-2xl text-white font-semibold">MoodTune AI</span>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-6">
              <p className="text-white/80 text-lg">
                Transforming emotional moments into perfect soundtracks through advanced AI emotion detection 
                and personalized music curation with immersive 3D visualizations.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <div className="text-white font-medium flex items-center gap-2">
                    <Volume2 className="w-4 h-4" />
                    3D Audio Visualization
                  </div>
                  <div className="text-white/60 text-sm">Real-time interactive music graphics</div>
                </div>
                <div className="space-y-2">
                  <div className="text-white font-medium flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    AI-Powered Analysis
                  </div>
                  <div className="text-white/60 text-sm">Advanced emotion detection algorithms</div>
                </div>
                <div className="space-y-2">
                  <div className="text-white font-medium flex items-center gap-2">
                    <Headphones className="w-4 h-4" />
                    Instant Playlists
                  </div>
                  <div className="text-white/60 text-sm">Curated in seconds with AI explanations</div>
                </div>
                <div className="space-y-2">
                  <div className="text-white font-medium flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Social Sharing
                  </div>
                  <div className="text-white/60 text-sm">Connect through music and emotion</div>
                </div>
              </div>
            </div>
            
            <div className="text-white/60">
              © 2024 MoodTune AI - Your Personal Emotional Music Companion with 3D Interactive Experience
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
