'use client';

/**
 * Research Status Card
 * 
 * Displays current research progress and status
 * Shows completion percentage and section-by-section progress
 * Uses VeChain-inspired design system with motion animations
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  Clock, 
  PlayCircle, 
  Target, 
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { ToolResponse } from '@/lib/ai/tools/web3-research/types';

interface ResearchStatusCardProps {
  result: ToolResponse<{
    tokenName: string;
    tokenTicker: string;
    status: string;
    progress: Record<string, string>;
    totalSections: number;
    completedSections: number;
    inProgressSections: number;
    plannedSections: number;
  }>;
}

export function ResearchStatusCard({ result }: ResearchStatusCardProps) {
  const { 
    tokenName, 
    tokenTicker, 
    status, 
    progress, 
    totalSections,
    completedSections,
    inProgressSections,
    plannedSections
  } = result.data!;

  const completionPercentage = totalSections > 0 ? (completedSections / totalSections) * 100 : 0;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'in_progress': return <PlayCircle className="h-4 w-4 text-blue-500" />;
      default: return <Clock className="h-4 w-4 text-vet-text-muted" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'in_progress': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-vet-text-muted/10 text-vet-text-muted border-vet-text-muted/20';
    }
  };

  const getSectionTitle = (sectionKey: string) => {
    const titles: Record<string, string> = {
      projectInfo: 'Project Information',
      technicalFundamentals: 'Technical Fundamentals',
      marketStatus: 'Market Status',
      listings: 'Exchange Listings',
      news: 'Recent News',
      community: 'Community Analysis',
      predictions: 'Price Predictions',
      teamInfo: 'Team Information',
      relatedCoins: 'Related Coins',
      socialSentiment: 'Social Sentiment',
    };
    return titles[sectionKey] || sectionKey;
  };

  const progressEntries = Object.entries(progress);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {/* Header */}
      <Card className="vet-glass-card border-vet-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-vet-surface/50">
                <BarChart3 className="h-5 w-5 text-vet-accent" />
              </div>
              <div>
                <CardTitle className="text-lg text-vet-text-primary">
                  Research Status: {tokenName} ({tokenTicker})
                </CardTitle>
                <p className="text-sm text-vet-text-secondary">
                  Overall Progress: {completionPercentage.toFixed(1)}% Complete
                </p>
              </div>
            </div>
            <Badge className={getStatusColor(status)}>
              {getStatusIcon(status)}
              <span className="ml-1 capitalize">{status}</span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-vet-text-secondary">Overall Progress</span>
              <span className="font-semibold text-vet-text-primary">
                {completedSections}/{totalSections} sections
              </span>
            </div>
            <Progress 
              value={completionPercentage} 
              className="h-2 bg-vet-surface/50"
            />
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{completedSections}</div>
              <div className="text-xs text-vet-text-muted">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{inProgressSections}</div>
              <div className="text-xs text-vet-text-muted">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-vet-text-muted">{plannedSections}</div>
              <div className="text-xs text-vet-text-muted">Planned</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section Progress */}
      <Card className="vet-glass-card border-vet-border">
        <CardHeader>
          <CardTitle className="text-lg text-vet-text-primary flex items-center gap-2">
            <Target className="h-5 w-5 text-vet-accent" />
            Section Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {progressEntries.map(([sectionKey, sectionStatus], index) => (
              <motion.div
                key={sectionKey}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-vet-surface/30"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(sectionStatus)}
                  <span className="text-sm font-medium text-vet-text-primary">
                    {getSectionTitle(sectionKey)}
                  </span>
                </div>
                <Badge className={getStatusColor(sectionStatus)}>
                  {sectionStatus.replace('_', ' ')}
                </Badge>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Progress Visualization */}
      <Card className="vet-glass-card border-vet-border">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-vet-text-secondary">Progress Breakdown</span>
              <TrendingUp className="h-4 w-4 text-vet-accent" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-green-500">Completed</span>
                <span className="text-vet-text-muted">{completedSections} sections</span>
              </div>
              <Progress 
                value={(completedSections / totalSections) * 100} 
                className="h-1 bg-green-500/20"
              />
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-blue-500">In Progress</span>
                <span className="text-vet-text-muted">{inProgressSections} sections</span>
              </div>
              <Progress 
                value={(inProgressSections / totalSections) * 100} 
                className="h-1 bg-blue-500/20"
              />
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-vet-text-muted">Planned</span>
                <span className="text-vet-text-muted">{plannedSections} sections</span>
              </div>
              <Progress 
                value={(plannedSections / totalSections) * 100} 
                className="h-1 bg-vet-text-muted/20"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
