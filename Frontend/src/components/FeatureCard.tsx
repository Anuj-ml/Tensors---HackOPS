import { ReactNode } from 'react';
import { Card, CardContent } from './ui/card';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  details: string[];
  className?: string;
}

export function FeatureCard({ icon, title, description, details, className = '' }: FeatureCardProps) {
  return (
    <Card className={`group transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 border-blue-500/20 bg-gradient-to-br from-gray-900 to-blue-900/20 backdrop-blur-sm ${className}`}>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors duration-300">
            {icon}
          </div>
          <div>
            <h3 className="text-blue-100 group-hover:text-white transition-colors duration-300">{title}</h3>
            <p className="text-blue-300/80 text-sm">{description}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          {details.map((detail, index) => (
            <div key={index} className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
              <p className="text-sm text-blue-200/90">{detail}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}