'use client';

/**
 * Research Plan Card
 * 
 * Displays comprehensive research plan for a token
 * Shows all research sections with status indicators
 * Uses VeChain-inspired design system with motion animations
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CheckCircle2, 
  Clock, 
  PlayCircle, 
  Target, 
  FileText, 
  TrendingUp,
  Users,
  Globe,
  Search,
  BarChart3,
  User,
  Coins,
  MessageSquare
} from 'lucide-react';
import { ResearchPlan, ToolResponse } from '@/lib/ai/tools/web3-research/types';

interface ResearchPlanCardProps {
  result: ToolResponse<{
    tokenName: string;
    tokenTicker: string;
    researchId: string;
    researchPlan: ResearchPlan;
    status: string;
    createdAt: string;
  }>;
}

export function ResearchPlanCard({ result }: ResearchPlanCardProps) {
  const { tokenName, tokenTicker, researchId, researchPlan, status, createdAt } = result.data!;

  // Safety check: If researchPlan is undefined or null, show error
  if (!researchPlan) {
    return (
      <Card className="vet-glass-card border-red-500/50">
        <CardHeader>
          <CardTitle className="text-red-500">Error: Research Plan Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The research plan data is missing. This might be due to a service error.
          </p>
          <pre className="mt-4 p-4 bg-secondary/50 rounded text-xs overflow-auto">
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </CardContent>
      </Card>
    );
  }

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

  const getSectionIcon = (sectionKey: string) => {
    const icons: Record<string, React.ReactNode> = {
      projectInfo: <FileText className="h-4 w-4" />,
      technicalFundamentals: <Target className="h-4 w-4" />,
      marketStatus: <TrendingUp className="h-4 w-4" />,
      listings: <Globe className="h-4 w-4" />,
      news: <Search className="h-4 w-4" />,
      community: <Users className="h-4 w-4" />,
      predictions: <BarChart3 className="h-4 w-4" />,
      teamInfo: <User className="h-4 w-4" />,
      relatedCoins: <Coins className="h-4 w-4" />,
      socialSentiment: <MessageSquare className="h-4 w-4" />,
    };
    return icons[sectionKey] || <FileText className="h-4 w-4" />;
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

  const sections = Object.entries(researchPlan);
  const completedCount = sections.filter(([_, section]) => section.status === 'completed').length;
  const inProgressCount = sections.filter(([_, section]) => section.status === 'in_progress').length;
  const plannedCount = sections.filter(([_, section]) => section.status === 'planned').length;

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
                <Target className="h-5 w-5 text-vet-accent" />
              </div>
              <div>
                <CardTitle className="text-lg text-vet-text-primary">
                  Research Plan: {tokenName} ({tokenTicker})
                </CardTitle>
                <p className="text-sm text-vet-text-secondary">
                  Research ID: {researchId}
                </p>
              </div>
            </div>
            <Badge className="bg-vet-accent/10 text-vet-accent border-vet-accent/20">
              {status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{completedCount}</div>
              <div className="text-xs text-vet-text-muted">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{inProgressCount}</div>
              <div className="text-xs text-vet-text-muted">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-vet-text-muted">{plannedCount}</div>
              <div className="text-xs text-vet-text-muted">Planned</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Research Sections */}
      <div className="grid gap-3">
        {sections.map(([sectionKey, section], index) => (
          <motion.div
            key={sectionKey}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="vet-glass-card border-vet-border hover:border-vet-accent/30 transition-colors">
              <CardContent className="max-h-[600px] overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-vet-accent/20 scrollbar-track-transparent hover:scrollbar-thumb-vet-accent/40">
                <div className="space-y-3">
                  {/* Section Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-1 rounded bg-vet-surface/50">
                        {getSectionIcon(sectionKey)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-vet-text-primary">
                          {getSectionTitle(sectionKey)}
                        </h3>
                        <p className="text-sm text-vet-text-secondary">
                          {section.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(section.status)}
                      <Badge className={getStatusColor(section.status)}>
                        {section.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>

                  {/* Sources */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-vet-text-muted">Sources:</div>
                    <div className="flex flex-wrap gap-1">
                      {section.sources.map((source, sourceIndex) => (
                        <Badge key={sourceIndex} variant="outline" className="text-xs">
                          {source}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <Card className="vet-glass-card border-vet-border">
        <CardContent className="max-h-[600px] overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-vet-accent/20 scrollbar-track-transparent hover:scrollbar-thumb-vet-accent/40">
          <div className="flex items-center justify-between text-sm">
            <span className="text-vet-text-secondary">
              Created: {new Date(createdAt).toLocaleString()}
            </span>
            <Badge variant="outline" className="text-vet-accent border-vet-accent/20">
              Web3 Research
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
