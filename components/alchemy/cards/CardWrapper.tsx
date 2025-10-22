'use client';

import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

/**
 * Wrapper component that handles undefined/null results for all tool cards
 */
export function withCardErrorHandling<P extends { result: any }>(
  Component: React.ComponentType<P>,
  toolName: string
) {
  return function WrappedCard(props: P) {
    const { result } = props;

    console.log(`[${toolName}Card] CardWrapper received props:`, {
      hasResult: !!result,
      resultType: typeof result,
      resultKeys: result ? Object.keys(result) : [],
      success: result?.success,
      hasData: !!result?.data,
      dataKeys: result?.data ? Object.keys(result.data) : [],
      fullResult: result
    });

    // Handle completely missing result
    if (!result) {
      console.warn(`[${toolName}Card] ❌ Result is undefined/null`);
      return (
        <Card className="border-muted bg-card/50 backdrop-blur">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg text-muted-foreground">
                Loading {toolName}...
              </CardTitle>
            </div>
            <CardDescription>Waiting for data...</CardDescription>
          </CardHeader>
        </Card>
      );
    }

    // Handle error results
    if (result.success === false || result.error) {
      console.warn(`[${toolName}Card] ❌ Error result:`, result.error);
      return (
        <Card className="border-destructive/20 bg-card/50 backdrop-blur">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <CardTitle className="text-lg text-destructive">
                {toolName} Failed
              </CardTitle>
            </div>
            <CardDescription>{result.error || 'An error occurred'}</CardDescription>
          </CardHeader>
        </Card>
      );
    }

    // Handle missing data
    if (!result.data) {
      console.warn(`[${toolName}Card] ⚠️  No data in result:`, result);
      return (
        <Card className="border-muted bg-card/50 backdrop-blur">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg text-muted-foreground">
                No {toolName} Data
              </CardTitle>
            </div>
            <CardDescription>No data available</CardDescription>
          </CardHeader>
        </Card>
      );
    }

    // All checks passed, render the actual component
    console.log(`[${toolName}Card] ✅ All checks passed, rendering component`);
    return <Component {...props} />;
  };
}
