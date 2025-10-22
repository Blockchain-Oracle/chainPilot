'use client';

/**
 * Research Loading Card
 *
 * Specialized loading component for long-running research operations
 * Shows animated progress indicators and research stages
 * Uses VeChain design system with smooth animations
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Globe,
  FileText,
  TrendingUp,
  Users,
  MessageSquare,
  CheckCircle2,
  Loader2
} from 'lucide-react';

interface ResearchLoadingCardProps {
  tokenName?: string;
  tokenTicker?: string;
}

const researchStages = [
  {
    id: 'initializing',
    label: 'Initializing Research',
    icon: Loader2,
    duration: 2000,
  },
  {
    id: 'searching',
    label: 'Searching Web Sources',
    icon: Search,
    duration: 5000,
  },
  {
    id: 'analyzing',
    label: 'Analyzing Project Info',
    icon: FileText,
    duration: 4000,
  },
  {
    id: 'market',
    label: 'Fetching Market Data',
    icon: TrendingUp,
    duration: 3000,
  },
  {
    id: 'community',
    label: 'Analyzing Community',
    icon: Users,
    duration: 3000,
  },
  {
    id: 'social',
    label: 'Checking Social Sentiment',
    icon: MessageSquare,
    duration: 3000,
  },
  {
    id: 'compiling',
    label: 'Compiling Results',
    icon: Globe,
    duration: 2000,
  },
];

export function ResearchLoadingCard({ tokenName, tokenTicker }: ResearchLoadingCardProps) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [completedStages, setCompletedStages] = useState<string[]>([]);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Auto-progress through stages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStageIndex((prev) => {
        if (prev < researchStages.length - 1) {
          setCompletedStages((completed) => [...completed, researchStages[prev].id]);
          return prev + 1;
        }
        return prev;
      });
    }, 3000); // Move to next stage every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Track elapsed time
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const currentStage = researchStages[currentStageIndex];
  const progress = ((currentStageIndex + 1) / researchStages.length) * 100;

  return (
    <Card className="vet-glass-card border-vet-accent/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Loader2 className="w-6 h-6 text-vet-accent animate-spin" />
              <div className="absolute inset-0 w-6 h-6 bg-vet-accent/20 blur-lg animate-pulse" />
            </div>
            <div>
              <CardTitle className="text-lg">
                {tokenName && tokenTicker
                  ? `Researching ${tokenName} (${tokenTicker})`
                  : 'Researching Token'
                }
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                This may take 20-60 seconds
              </p>
            </div>
          </div>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            {elapsedTime}s
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-vet-surface rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-vet-accent to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
          </div>
        </div>

        {/* Research Stages */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-vet-text-secondary">Research Stages</h4>
          <div className="space-y-2">
            {researchStages.map((stage, index) => {
              const isCompleted = completedStages.includes(stage.id);
              const isCurrent = index === currentStageIndex;
              const Icon = stage.icon;

              return (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    isCurrent
                      ? 'bg-vet-accent/10 border border-vet-accent/30'
                      : isCompleted
                      ? 'bg-green-500/10 border border-green-500/30'
                      : 'bg-vet-surface/50 border border-vet-border'
                  }`}
                >
                  <div className="relative">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : isCurrent ? (
                      <>
                        <Icon className="w-5 h-5 text-vet-accent animate-pulse" />
                        <div className="absolute inset-0 w-5 h-5 bg-vet-accent/20 blur-md animate-pulse" />
                      </>
                    ) : (
                      <Icon className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className={`text-sm font-medium ${
                      isCurrent
                        ? 'text-vet-accent'
                        : isCompleted
                        ? 'text-green-500'
                        : 'text-muted-foreground'
                    }`}>
                      {stage.label}
                    </div>
                  </div>

                  <AnimatePresence>
                    {isCurrent && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Badge className="bg-vet-accent/20 text-vet-accent border-vet-accent/30">
                          In Progress
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Loading Tip */}
        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="text-blue-400 mt-0.5">💡</div>
            <div className="flex-1 text-sm text-blue-300">
              <strong>Did you know?</strong> We're searching multiple sources including
              project websites, GitHub, CoinMarketCap, social media, and news outlets
              to give you comprehensive token insights.
            </div>
          </div>
        </div>

        {/* Animated Dots */}
        <div className="flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-vet-accent rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
