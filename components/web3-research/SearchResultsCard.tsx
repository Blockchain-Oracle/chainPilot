'use client';

/**
 * Search Results Card
 * 
 * Displays web search results from DuckDuckGo
 * Shows search query, result count, and individual results with links
 * Uses VeChain-inspired design system with motion animations
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Search, Calendar, Globe, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchResult, SearchType, ToolResponse } from '@/lib/ai/tools/web3-research/types';

interface SearchResultsCardProps {
  result: ToolResponse<{
    query: string;
    searchType: SearchType;
    results: SearchResult[];
    totalResults: number;
  }>;
}

export function SearchResultsCard({ result }: SearchResultsCardProps) {
  const { query, searchType, results, totalResults } = result.data!;
  const [copied, setCopied] = React.useState<string | null>(null);

  const handleCopy = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return '';
    }
  };

  const getSearchTypeIcon = (type: string) => {
    switch (type) {
      case 'news': return <FileText className="h-4 w-4" />;
      case 'images': return <Globe className="h-4 w-4" />;
      case 'videos': return <Globe className="h-4 w-4" />;
      default: return <Search className="h-4 w-4" />;
    }
  };

  const getSearchTypeColor = (type: string) => {
    switch (type) {
      case 'news': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'images': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'videos': return 'bg-pink-500/10 text-pink-500 border-pink-500/20';
      default: return 'bg-vet-accent/10 text-vet-accent border-vet-accent/20';
    }
  };

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
                <Search className="h-5 w-5 text-vet-accent" />
              </div>
              <div>
                <CardTitle className="text-lg text-vet-text-primary">
                  Search Results
                </CardTitle>
                <p className="text-sm text-vet-text-secondary">
                  Found {totalResults} results for "{query}"
                </p>
              </div>
            </div>
            <Badge className={getSearchTypeColor(searchType)}>
              {getSearchTypeIcon(searchType)}
              <span className="ml-1 capitalize">{searchType}</span>
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Results */}
      <div className="space-y-3">
        {results.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="vet-glass-card border-vet-border hover:border-vet-accent/30 transition-colors">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Title and URL */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-vet-text-primary line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <ExternalLink className="h-3 w-3 text-vet-text-muted" />
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-vet-accent hover:text-vet-accent/80 truncate flex-1"
                      >
                        {item.url}
                      </a>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(item.url)}
                        className="h-6 w-6 p-0"
                      >
                        {copied === item.url ? (
                          <div className="h-3 w-3 text-green-500" />
                        ) : (
                          <div className="h-3 w-3 text-vet-text-muted" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Snippet */}
                  {item.snippet && (
                    <p className="text-sm text-vet-text-secondary line-clamp-3">
                      {item.snippet}
                    </p>
                  )}

                  {/* Metadata */}
                  <div className="flex items-center justify-between text-xs text-vet-text-muted">
                    <div className="flex items-center gap-4">
                      {item.publishedDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(item.publishedDate)}</span>
                        </div>
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Result #{index + 1}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      <Card className="vet-glass-card border-vet-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-vet-text-secondary">
              Showing {results.length} of {totalResults} results
            </span>
            <Badge variant="outline" className="text-vet-accent border-vet-accent/20">
              DuckDuckGo Search
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
