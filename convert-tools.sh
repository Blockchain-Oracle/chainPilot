#!/bin/bash

# Script to convert FunctionTool to createTool in all tool files

echo "Converting all FunctionTool definitions to createTool..."

# Find all tool files (excluding index.ts)
find lib/adk/tools -name "*.ts" -type f | grep -v index.ts | while read -r file; do
    echo "Processing: $file"

    # Replace FunctionTool import with createTool
    sed -i '' 's/import { FunctionTool }/import { createTool }/g' "$file"

    # Note: The actual conversion requires manual inspection
    # This script just updates the imports
done

echo "Done! Import statements updated."
echo "Now you need to manually convert each tool function to the createTool pattern."
echo "See /Users/apple/dev/hackathon/ADK/adk-coinbase-terminal/lib/adk/tools/tokens/get-token-balance.ts for the correct pattern."
