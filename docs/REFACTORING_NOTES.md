# ADK Architecture Refactoring Notes

## Overview
This document describes the architectural refactoring performed to properly align with ADK (Agent Development Kit) patterns and best practices.

## Key Changes

### 1. Fixed runner.runAsync() Signature ✅

**Problem**: We were passing an incorrect object structure to `runner.runAsync()`.

**Before (WRONG)**:
```typescript
for await (const event of runner.runAsync({
  userId: session.userId,
  sessionId: session.id,
  newMessage: {
    parts: [{ text: userMessage }]
  }
})) {
  // ...
}
```

**After (CORRECT)**:
```typescript
for await (const event of runner.runAsync(userMessage, session)) {
  // query is just a string
  // session is the session object
}
```

**Reference**: ADK documentation shows `runAsync(query: string, session: Session)` signature.

---

### 2. Fixed Event Streaming Pattern ✅

**Problem**: We weren't properly handling ADK's `event.partial` and `event.content.parts` structure.

**Before**:
```typescript
if (event.partial) {
  assistantContent += event.partial; // event.partial is a boolean!
}
```

**After**:
```typescript
// Handle streaming text deltas
if (event.partial && event.content?.parts?.[0]?.text) {
  const textChunk = event.content.parts[0].text;
  assistantContent += textChunk;
  controller.enqueue(/* ... */);
}

// Handle complete text content (non-streaming)
if (!event.partial && event.content?.parts) {
  for (const part of event.content.parts) {
    if (part.text) {
      // Only add if not already streamed
      if (!assistantContent.includes(part.text)) {
        assistantContent += part.text;
        controller.enqueue(/* ... */);
      }
    }
  }
}
```

**Key Insight**:
- `event.partial` is a **boolean** indicating if the event is a streaming chunk
- Actual text is in `event.content.parts[0].text`
- Need to handle both streaming (partial=true) and complete (partial=false) responses

---

### 3. Added OpenAI Model Support ✅

**Problem**: Only supported Gemini models. User specifically requested OpenAI support saying "lets use open ai cause gemnin is dumb".

**Changes**:
```typescript
// Determine which model to use based on user preference or default
// Support both OpenAI and Gemini models
const modelName = selectedChatModel || process.env.DEFAULT_MODEL || "gpt-4o";

const agentBuilder = AgentBuilder.create("alchemy_assistant")
  .withModel(modelName) // Now supports both openai and gemini
```

**Environment Variables Added**:
```env
OPENAI_API_KEY=your_openai_api_key
DEFAULT_MODEL=gpt-4o
```

**Supported Models**:
- OpenAI: `gpt-4o`, `gpt-4o-mini`, `gpt-3.5-turbo`
- Gemini: `gemini-2.0-flash-exp`, `gemini-2.5-flash`, `gemini-pro`

---

### 4. Tools Are Already Correct ✅

**Important Discovery**: After reviewing ADK documentation, we found that `createTool` IS the correct pattern!

```typescript
import { createTool } from '@iqai/adk';

export const balanceTool = createTool({
  name: 'get_balance',
  description: 'Get native token balance (ETH, MATIC, etc.)',
  schema: z.object({
    address: z.string(),
    chainId: z.number().optional().default(1),
  }),
  fn: async ({ address, chainId = 1 }, context) => {
    // Implementation
  }
});
```

**No changes needed to tool definitions** - they were already following ADK best practices.

---

## Architecture Validation

### Current Architecture (CORRECT)

```
┌─────────────────────────────────────────────────────────────┐
│                     Client (Browser)                         │
│                                                              │
│  useADKChat Hook                                             │
│    ↓                                                         │
│  SSE Stream Consumer                                         │
│    ↓                                                         │
│  Message State Management                                    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ HTTP POST /api/chat
                       │
┌──────────────────────┴──────────────────────────────────────┐
│                 Server (Next.js API Route)                   │
│                                                              │
│  1. Authenticate Wallet                                      │
│  2. Get/Create User                                          │
│  3. Load Chat History                                        │
│  4. Create AgentBuilder with:                                │
│     - Model (OpenAI or Gemini)                               │
│     - Tools (19 Alchemy tools)                               │
│     - Instructions                                           │
│  5. Build Agent + Session                                    │
│  6. Call runner.runAsync(message, session)                   │
│  7. Stream events via SSE:                                   │
│     - text-delta (streaming text)                            │
│     - tool-call (function invocation)                        │
│     - tool-result (function response)                        │
│     - finish (completion)                                    │
│  8. Save complete message to DB                              │
└─────────────────────┬────────────────────────────────────────┘
                      │
                      │
┌─────────────────────┴────────────────────────────────────────┐
│                   ADK Framework                               │
│                                                              │
│  AgentBuilder.create("alchemy_assistant")                    │
│    .withModel(modelName)                                     │
│    .withTools(...alchemyTools)                               │
│    .withInstruction(systemPrompt)                            │
│    .build()                                                  │
│      ↓                                                       │
│  runner.runAsync(query, session)                             │
│    - Handles LLM streaming automatically                     │
│    - Manages tool invocation                                 │
│    - Yields events with proper structure                     │
└──────────────────────────────────────────────────────────────┘
```

---

## Event Flow

### Correct ADK Event Structure

```typescript
interface ADKEvent {
  partial?: boolean;              // True for streaming chunks
  turnComplete?: boolean;         // True when agent's turn is finished
  content?: {
    parts: Array<{
      text?: string;              // Actual text content
      // ... other part types
    }>;
  };
  getFunctionCalls?: () => FunctionCall[];
  getFunctionResponses?: () => FunctionResponse[];
  isFinalResponse?: () => boolean;
}
```

### Event Processing Flow

1. **Text Streaming** (`event.partial === true`)
   ```typescript
   if (event.partial && event.content?.parts?.[0]?.text) {
     const chunk = event.content.parts[0].text;
     // Stream to client
   }
   ```

2. **Tool Calls** (`event.getFunctionCalls()`)
   ```typescript
   const calls = event.getFunctionCalls();
   if (calls && calls.length > 0) {
     for (const call of calls) {
       // Send tool-call event to client
     }
   }
   ```

3. **Tool Results** (`event.getFunctionResponses()`)
   ```typescript
   const responses = event.getFunctionResponses();
   if (responses && responses.length > 0) {
     for (const response of responses) {
       // Send tool-result event to client
     }
   }
   ```

4. **Complete Response** (`event.partial === false`)
   ```typescript
   if (!event.partial && event.content?.parts) {
     // Final text content (if not already streamed)
   }
   ```

---

## What We Didn't Change (And Why)

### Session Management

**Current**: Using ADK's default in-memory sessions per-request.

**Why Not Changed**:
- Default behavior works correctly
- Sessions are automatically managed by `AgentBuilder.build()`
- Conversation history is persisted in PostgreSQL (not Redis)
- Redis would be optional optimization for ADK session caching

**Future Enhancement**: Could add `withSessionService(new RedisSessionService())` for session caching.

---

### Agent Configuration

**Current**: Creating agent per-request with `AgentBuilder.create()`.

**Why Not Changed**:
- This is the correct ADK pattern for API routes
- AgentBuilder handles session creation automatically
- Allows dynamic model selection per-request
- Tools are loaded fresh each time (ensures up-to-date data)

**Alternative Pattern** (Not Used):
```typescript
// Could create a singleton agent, but loses flexibility
const globalAgent = await AgentBuilder.create("alchemy")
  .withModel("gpt-4o")
  .build();
```

---

## Testing Checklist

When testing the refactored implementation:

- [ ] Text streaming displays correctly in UI
- [ ] Tool calls show loading state
- [ ] Tool results render as custom cards
- [ ] Message persistence works (refresh page)
- [ ] Chat history appears in sidebar
- [ ] Both OpenAI and Gemini models work
- [ ] Error handling displays properly
- [ ] Multiple concurrent chats work
- [ ] Wallet authentication required
- [ ] Transaction preparation tools work

---

## Performance Considerations

### Current Implementation

1. **Agent Creation**: New agent created per request
   - ✅ Allows dynamic model selection
   - ✅ Fresh tool instances
   - ⚠️  Slight overhead (~50-100ms)

2. **Session Management**: In-memory per-request
   - ✅ Simple and works correctly
   - ✅ Conversation history in PostgreSQL
   - ⚠️  Could use Redis for session caching

3. **Streaming**: SSE with manual event encoding
   - ✅ Real-time updates
   - ✅ Handles tool calls correctly
   - ✅ ADK manages actual streaming

### Potential Optimizations (Future)

1. **Agent Pooling**: Reuse agent instances
   ```typescript
   const agentPool = new AgentPool({
     models: ['gpt-4o', 'gemini-2.5-flash'],
     maxSize: 10
   });
   ```

2. **Redis Sessions**: Cache conversation history
   ```typescript
   .withSessionService(new RedisSessionService({
     connectionString: process.env.REDIS_URL
   }))
   ```

3. **Tool Result Caching**: Cache blockchain data
   ```typescript
   // Cache NFT metadata, token prices, etc.
   const cache = new RedisCache(redis);
   ```

---

## Key Learnings

1. **`createTool` is correct** - ADK documentation confirms this is the recommended pattern
2. **`runner.runAsync()` signature** - Takes `(query: string, session: Session)`, not an object
3. **`event.partial` is boolean** - Text is in `event.content.parts[0].text`
4. **AgentBuilder handles sessions** - No need to manually create sessions
5. **Multi-model support is built-in** - Just pass model name as string

---

## Files Modified

- `/app/api/chat/route.ts` - Fixed runAsync signature and event handling
- `/.env.example` - Added OpenAI API key and DEFAULT_MODEL
- `/docs/REFACTORING_NOTES.md` - This file

---

## References

- ADK Documentation: `/Users/apple/dev/hackathon/ADK/ADK-Docs/adk-ts/`
  - `docs/framework/agents/agent-builder.mdx`
  - `docs/framework/events/streaming.mdx`
  - `docs/framework/tools/create-tool.mdx`
- Previous Implementation: VeChain Terminal
- Current Implementation: ChainPilot (Alchemy Terminal)

---

## Date

**Refactoring Completed**: 2025-10-22

**Status**: ✅ Ready for testing
