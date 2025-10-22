'use client';

/**
 * Content Card
 * 
 * Displays fetched web content with metadata
 * Shows content preview, source information, and formatting options
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
  Copy, 
  CheckCircle2,
  Globe,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { FetchContentResponse, ToolResponse } from '@/lib/ai/tools/web3-research/types';

interface ContentCardProps {
  result: ToolResponse<FetchContentResponse & {
    contentLength: number;
    format: 'text' | 'html' | 'markdown' | 'json';
  }>;
}

export function ContentCard({ result }: ContentCardProps) {
  const { title, content, metadata, url, timestamp, format, contentLength } = result.data!;
  const [copied, setCopied] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [showRaw, setShowRaw] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFormatColor = (format: string) => {
    switch (format.toLowerCase()) {
      case 'html': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'markdown': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'json': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'text': return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
      default: return 'bg-vet-text-muted/10 text-vet-text-muted border-vet-text-muted/20';
    }
  };

  const truncateContent = (content: string, maxLength: number = 500): string => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const renderContent = () => {
    if (showRaw) {
      return (
        <pre className="whitespace-pre-wrap text-sm text-vet-text-secondary font-mono bg-vet-surface/30 p-3 rounded-lg overflow-x-auto">
          {content}
        </pre>
      );
    }

    if (format === 'markdown') {
      // Simple markdown rendering (you could use a proper markdown parser here)
      return (
        <div className="prose prose-sm max-w-none text-vet-text-secondary">
          {content.split('\n').map((line, index) => {
            if (line.startsWith('# ')) {
              return <h1 key={index} className="text-lg font-bold text-vet-text-primary">{line.substring(2)}</h1>;
            }
            if (line.startsWith('## ')) {
              return <h2 key={index} className="text-base font-semibold text-vet-text-primary">{line.substring(3)}</h2>;
            }
            if (line.startsWith('### ')) {
              return <h3 key={index} className="text-sm font-medium text-vet-text-primary">{line.substring(4)}</h3>;
            }
            if (line.startsWith('- ')) {
              return <li key={index} className="text-sm text-vet-text-secondary">{line.substring(2)}</li>;
            }
            if (line.trim() === '') {
              return <br key={index} />;
            }
            return <p key={index} className="text-sm text-vet-text-secondary">{line}</p>;
          })}
        </div>
      );
    }

    if (format === 'html') {
      return (
        <div 
          className="text-sm text-vet-text-secondary prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }

    if (format === 'json') {
      try {
        const parsed = JSON.parse(content);
        return (
          <pre className="whitespace-pre-wrap text-sm text-vet-text-secondary font-mono bg-vet-surface/30 p-3 rounded-lg overflow-x-auto">
            {JSON.stringify(parsed, null, 2)}
          </pre>
        );
      } catch {
        return (
          <pre className="whitespace-pre-wrap text-sm text-vet-text-secondary font-mono bg-vet-surface/30 p-3 rounded-lg overflow-x-auto">
            {content}
          </pre>
        );
      }
    }

    // Default text rendering
    return (
      <div className="text-sm text-vet-text-secondary whitespace-pre-wrap">
        {expanded ? content : truncateContent(content)}
      </div>
    );
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
                <FileText className="h-5 w-5 text-vet-accent" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg text-vet-text-primary line-clamp-2">
                  {title}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-vet-text-muted">
                  <ExternalLink className="h-3 w-3" />
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate hover:text-vet-accent transition-colors"
                  >
                    {url}
                  </a>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getFormatColor(format)}>
                {format.toUpperCase()}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {formatFileSize(contentLength)}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm text-vet-text-muted">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(timestamp)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                <span>{url}</span>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              Web3 Research
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <Card className="vet-glass-card border-vet-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-vet-text-primary flex items-center gap-2">
              <Eye className="h-5 w-5 text-vet-accent" />
              Content
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExpanded(!expanded)}
                className="h-7 px-3 text-xs"
              >
                {expanded ? <Minimize2 className="h-3 w-3 mr-1" /> : <Maximize2 className="h-3 w-3 mr-1" />}
                {expanded ? 'Collapse' : 'Expand'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRaw(!showRaw)}
                className="h-7 px-3 text-xs"
              >
                {showRaw ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
                {showRaw ? 'Formatted' : 'Raw'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="h-7 px-3 text-xs"
              >
                {copied ? <CheckCircle2 className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {renderContent()}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card className="vet-glass-card border-vet-border">
        <CardContent className="max-h-[600px] overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-vet-accent/20 scrollbar-track-transparent hover:scrollbar-thumb-vet-accent/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(url, '_blank')}
                className="h-8 px-4"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Source
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const blob = new Blob([content], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${title || 'content'}.${format}`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="h-8 px-4"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
            <div className="text-sm text-vet-text-muted">
              {content.length} characters • {formatFileSize(contentLength)}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
