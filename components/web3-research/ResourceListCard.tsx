'use client';

/**
 * Resource List Card
 * 
 * Displays saved research resources and content
 * Shows resource metadata, content preview, and management options
 * Uses VeChain-inspired design system with motion animations
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  ExternalLink, 
  Calendar, 
  Download, 
  Eye, 
  Globe,
  Image,
  Video,
  File,
  Database,
  Copy,
  CheckCircle2
} from 'lucide-react';
import { ToolResponse } from '@/lib/ai/tools/web3-research/types';

interface Resource {
  id: string;
  url: string;
  title?: string;
  source?: string;
  contentLength: number;
  fetchedAt: string;
  format?: string;
  content?: string;
}

interface ResourceListCardProps {
  result: ToolResponse<{
    researchId: string;
    resources: Resource[];
    totalResources: number;
    totalContentSize: number;
  }>;
}

export function ResourceListCard({ result }: ResourceListCardProps) {
  const { researchId, resources, totalResources, totalContentSize } = result.data!;
  const [copied, setCopied] = React.useState<string | null>(null);
  const [expanded, setExpanded] = React.useState<string | null>(null);

  const handleCopy = async (text: string, resourceId: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(resourceId);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFormatIcon = (format?: string) => {
    switch (format?.toLowerCase()) {
      case 'html': return <Globe className="h-4 w-4" />;
      case 'markdown': return <FileText className="h-4 w-4" />;
      case 'json': return <Database className="h-4 w-4" />;
      case 'text': return <FileText className="h-4 w-4" />;
      case 'image': return <Image className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      default: return <File className="h-4 w-4" />;
    }
  };

  const getFormatColor = (format?: string) => {
    switch (format?.toLowerCase()) {
      case 'html': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'markdown': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'json': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'text': return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
      case 'image': return 'bg-pink-500/10 text-pink-500 border-pink-500/20';
      case 'video': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-vet-text-muted/10 text-vet-text-muted border-vet-text-muted/20';
    }
  };

  const truncateContent = (content: string, maxLength: number = 200): string => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
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
                <Database className="h-5 w-5 text-vet-accent" />
              </div>
              <div>
                <CardTitle className="text-lg text-vet-text-primary">
                  Research Resources
                </CardTitle>
                <p className="text-sm text-vet-text-secondary">
                  {totalResources} resources • {formatFileSize(totalContentSize)} total
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-vet-accent border-vet-accent/20">
              Research ID: {researchId}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Resources */}
      <div className="space-y-3">
        {resources.map((resource, index) => (
          <motion.div
            key={resource.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="vet-glass-card border-vet-border hover:border-vet-accent/30 transition-colors">
              <CardContent className="max-h-[600px] overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-vet-accent/20 scrollbar-track-transparent hover:scrollbar-thumb-vet-accent/40">
                <div className="space-y-3">
                  {/* Resource Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-1 rounded bg-vet-surface/50">
                        {getFormatIcon(resource.format)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-vet-text-primary line-clamp-1">
                          {resource.title || 'Untitled Resource'}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-vet-text-muted">
                          <ExternalLink className="h-3 w-3" />
                          <span className="truncate">{resource.url}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {resource.format && (
                        <Badge className={getFormatColor(resource.format)}>
                          {getFormatIcon(resource.format)}
                          <span className="ml-1">{resource.format}</span>
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {formatFileSize(resource.contentLength)}
                      </Badge>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center justify-between text-xs text-vet-text-muted">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(resource.fetchedAt)}</span>
                      </div>
                      {resource.source && (
                        <div className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          <span>{resource.source}</span>
                        </div>
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Resource #{index + 1}
                    </Badge>
                  </div>

                  {/* Content Preview */}
                  {resource.content && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-vet-text-muted">Content Preview:</span>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpanded(expanded === resource.id ? null : resource.id)}
                            className="h-6 px-2 text-xs"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            {expanded === resource.id ? 'Collapse' : 'Expand'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopy(resource.content || '', resource.id)}
                            className="h-6 px-2 text-xs"
                          >
                            {copied === resource.id ? (
                              <CheckCircle2 className="h-3 w-3 text-green-500" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-vet-surface/30 text-sm text-vet-text-secondary">
                        {expanded === resource.id 
                          ? resource.content 
                          : truncateContent(resource.content)
                        }
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-vet-border/50">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(resource.url, '_blank')}
                        className="h-7 px-3 text-xs"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Visit Source
                      </Button>
                      {resource.content && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const blob = new Blob([resource.content || ''], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `${resource.title || 'resource'}.txt`;
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                          className="h-7 px-3 text-xs"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      ID: {resource.id}
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
        <CardContent className="max-h-[600px] overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-vet-accent/20 scrollbar-track-transparent hover:scrollbar-thumb-vet-accent/40">
          <div className="flex items-center justify-between text-sm">
            <span className="text-vet-text-secondary">
              Showing {resources.length} of {totalResources} resources
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
