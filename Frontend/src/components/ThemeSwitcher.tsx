import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { useTheme } from './ThemeProvider';
import { Palette, Sparkles, Zap, Waves } from 'lucide-react';

export function ThemeSwitcher() {
  const { theme, setTheme, themeConfig } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    {
      id: 'dark-glow' as const,
      name: 'Dark Glow',
      description: 'Immersive dark with glowing accents',
      icon: <Sparkles className="w-4 h-4" />,
      preview: 'from-slate-950 to-blue-950',
      accent: 'border-blue-500/40 bg-blue-500/10'
    },
    {
      id: 'vibrant-energy' as const,
      name: 'Vibrant Energy',
      description: 'High-energy complementary colors',
      icon: <Zap className="w-4 h-4" />,
      preview: 'from-orange-900 to-red-900',
      accent: 'border-orange-500/40 bg-orange-500/10'
    },
    {
      id: 'blue-purple-calm' as const,
      name: 'Blue Purple Calm',
      description: 'Sophisticated monochromatic palette',
      icon: <Waves className="w-4 h-4" />,
      preview: 'from-purple-900 to-indigo-900',
      accent: 'border-purple-500/40 bg-purple-500/10'
    }
  ];

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2 bg-white/5 border-white/20 hover:bg-white/10 text-white"
      >
        <Palette className="w-4 h-4" />
        <span className="hidden sm:inline">{themeConfig.name}</span>
        Themes
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 z-50">
          <Card className="w-80 bg-black/80 backdrop-blur-lg border-white/20">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium">Choose Your Vibe</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white/60 hover:text-white hover:bg-white/10"
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-3">
                {themes.map((themeOption) => (
                  <div
                    key={themeOption.id}
                    className={`relative group cursor-pointer transition-all duration-300 ${
                      theme === themeOption.id ? 'scale-105' : 'hover:scale-102'
                    }`}
                    onClick={() => {
                      setTheme(themeOption.id);
                      setIsOpen(false);
                    }}
                  >
                    <div className={`
                      p-4 rounded-lg border-2 transition-all duration-300
                      ${theme === themeOption.id 
                        ? `${themeOption.accent} shadow-lg` 
                        : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                      }
                    `}>
                      <div className="flex items-start gap-3">
                        <div className={`
                          p-2 rounded-lg transition-colors duration-300
                          ${theme === themeOption.id ? themeOption.accent : 'bg-white/10'}
                        `}>
                          {themeOption.icon}
                        </div>
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium">{themeOption.name}</span>
                            {theme === themeOption.id && (
                              <Badge variant="secondary" className="text-xs bg-white/20 text-white">
                                Active
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-white/70 text-sm">{themeOption.description}</p>
                          
                          {/* Theme Preview */}
                          <div className={`
                            h-8 rounded-md bg-gradient-to-r ${themeOption.preview} 
                            border border-white/20 shadow-inner
                          `}>
                            <div className="h-full flex items-center justify-center">
                              <div className="flex gap-1">
                                <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                                <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                                <div className="w-2 h-2 bg-white/20 rounded-full"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Selection indicator */}
                    {theme === themeOption.id && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-white/20">
                <p className="text-white/60 text-xs text-center">
                  Themes adapt the entire interface to match your music mood
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}