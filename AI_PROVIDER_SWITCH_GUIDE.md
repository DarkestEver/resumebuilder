# AI Provider Configuration Guide

## 🎯 Current Configuration

**Active Provider**: Google Gemini (gemini-1.5-flash)  
**Switch Method**: Environment Variable in `.env` file

## 📋 Quick Switch Instructions

To switch AI providers, simply update your `.env` file:

```bash
# In backend/.env file
AI_PRIMARY_PROVIDER=gemini    # Options: 'gemini', 'openai', 'anthropic'
```

**That's it!** Restart your backend server and the new provider will be active.

---

## 🔄 Available AI Providers

### 1. Google Gemini (✅ CURRENTLY ACTIVE)

**Provider Code**: `gemini`

**Setup**:
```bash
# In backend/.env
AI_PRIMARY_PROVIDER=gemini
GEMINI_API_KEY=your-api-key-here
GEMINI_MODEL=gemini-1.5-flash
```

**Get API Key**: https://makersuite.google.com/app/apikey

**Available Models**:
- `gemini-1.5-flash` ✅ (Recommended - Fast, cost-effective)
- `gemini-1.5-pro` (Best for complex tasks, longer context)
- `gemini-pro` (Standard model)

**Pricing**: 
- Very cost-effective
- Generous free tier (15 requests/minute, 1,500 requests/day)
- Paid tier: $0.35 per million input tokens

**Best For**:
- Cost-conscious applications
- High-volume requests
- Fast response times
- Multimodal capabilities (text, images)

---

### 2. OpenAI GPT (Inactive)

**Provider Code**: `openai`

**Setup**:
```bash
# In backend/.env
AI_PRIMARY_PROVIDER=openai
OPENAI_API_KEY=sk-proj-your-api-key
OPENAI_MODEL=gpt-4o-mini
```

**Get API Key**: https://platform.openai.com/api-keys

**Available Models**:
- `gpt-4o-mini` ✅ (Recommended - Affordable, fast, capable)
- `gpt-4o` (Most capable, expensive)
- `gpt-4-turbo` (Previous generation)
- `gpt-3.5-turbo` (Cheapest, fast)

**Pricing**:
- gpt-4o-mini: $0.15 per million input tokens
- gpt-4o: $5.00 per million input tokens
- gpt-3.5-turbo: $0.50 per million input tokens

**Best For**:
- Structured JSON outputs
- Complex reasoning tasks
- Established, reliable service
- Advanced features (function calling)

---

### 3. Anthropic Claude (Inactive)

**Provider Code**: `anthropic`

**Setup**:
```bash
# In backend/.env
AI_PRIMARY_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-your-api-key
ANTHROPIC_MODEL=claude-3-sonnet-20240229
```

**Get API Key**: https://console.anthropic.com/

**Available Models**:
- `claude-3-sonnet-20240229` ✅ (Recommended - Balanced)
- `claude-3-opus-20240229` (Most intelligent, expensive)
- `claude-3-haiku-20240307` (Fast, affordable)

**Pricing**:
- Claude 3 Sonnet: $3.00 per million input tokens
- Claude 3 Opus: $15.00 per million input tokens
- Claude 3 Haiku: $0.25 per million input tokens

**Best For**:
- Long context understanding
- Safety-focused applications
- Detailed analysis
- Conversational AI

---

## 🚀 How to Switch Providers

### Step 1: Update Environment File

Edit `backend/.env`:

```bash
# Change this line:
AI_PRIMARY_PROVIDER=gemini

# To one of:
AI_PRIMARY_PROVIDER=openai
AI_PRIMARY_PROVIDER=anthropic
AI_PRIMARY_PROVIDER=gemini
```

### Step 2: Ensure API Key is Set

Make sure the corresponding API key is configured:

```bash
# For Gemini
GEMINI_API_KEY=your-key-here

# For OpenAI
OPENAI_API_KEY=your-key-here

# For Anthropic
ANTHROPIC_API_KEY=your-key-here
```

### Step 3: Restart Backend Server

```bash
cd backend
npm run dev
# or
npm start
```

### Step 4: Verify

Check the server logs on startup. You should see which provider is active.

---

## 🔍 How It Works

### Architecture

All AI functions in `backend/src/services/aiService.ts` use a single helper function:

```typescript
async function callAI(systemPrompt, userPrompt, options)
```

This function automatically routes requests to the active provider based on `AI_PRIMARY_PROVIDER`.

### Code Structure

```
backend/src/services/aiService.ts
│
├── callAI() - Main routing function
│   ├── if (provider === 'gemini') → Google Gemini API
│   ├── if (provider === 'openai') → OpenAI API
│   └── if (provider === 'anthropic') → Anthropic API
│
├── improveContent() - Uses callAI()
├── generateBulletPoints() - Uses callAI()
├── tailorForJob() - Uses callAI()
├── scoreATS() - Uses callAI()
├── generateCoverLetter() - Uses callAI()
└── extractKeywords() - Uses callAI()
```

**All AI functions automatically use the configured provider!**

---

## 📊 Provider Comparison

| Feature | Gemini (Active) | OpenAI | Anthropic |
|---------|----------------|--------|-----------|
| **Cost** | ⭐⭐⭐⭐⭐ Very Low | ⭐⭐⭐ Medium | ⭐⭐ High |
| **Speed** | ⭐⭐⭐⭐⭐ Very Fast | ⭐⭐⭐⭐ Fast | ⭐⭐⭐⭐ Fast |
| **Quality** | ⭐⭐⭐⭐ Excellent | ⭐⭐⭐⭐⭐ Best | ⭐⭐⭐⭐ Excellent |
| **Free Tier** | ⭐⭐⭐⭐⭐ Generous | ⭐⭐ Limited | ⭐⭐ Limited |
| **JSON Mode** | ⭐⭐⭐⭐ Good | ⭐⭐⭐⭐⭐ Best | ⭐⭐⭐ Good |
| **Context** | ⭐⭐⭐⭐⭐ 1M tokens | ⭐⭐⭐⭐ 128k tokens | ⭐⭐⭐⭐⭐ 200k tokens |

### Recommendation by Use Case

**For Development/Testing**: 
→ Gemini (free tier, fast, good quality)

**For Production (Cost-Conscious)**: 
→ Gemini or OpenAI gpt-4o-mini

**For Production (Best Quality)**: 
→ OpenAI gpt-4o or Anthropic Claude Opus

**For Long Documents**: 
→ Gemini (1M context) or Anthropic (200k context)

---

## 🧪 Testing Provider Switch

### Quick Test Script

```bash
# Test current provider
curl -X POST http://localhost:5000/api/ai/improve-content \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "Managed team of developers", "operation": "enhance"}'
```

The response will include `"model": "gemini-1.5-flash"` (or the active provider's model).

### Test All Functions

1. **Content Improvement**: POST `/api/ai/improve-content`
2. **Bullet Points**: POST `/api/ai/generate-bullets`
3. **Resume Tailoring**: POST `/api/ai/tailor-job`
4. **ATS Scoring**: POST `/api/ai/score-ats`
5. **Cover Letter**: POST `/api/ai/generate-cover-letter`
6. **PDF Scoring**: POST `/api/ai/score-resume-pdf`

All will automatically use the configured provider!

---

## ⚠️ Important Notes

### API Key Security

**Never commit API keys to Git!**

```bash
# Always use .env file
backend/.env       # ← Add your keys here
backend/.env.example  # ← Template with fake keys (safe to commit)
```

### Provider-Specific Differences

**JSON Mode**:
- ✅ Gemini: Native JSON support via `responseMimeType`
- ✅ OpenAI: Native JSON mode via `response_format`
- ⚠️ Anthropic: Requires manual JSON extraction

**Token Limits**:
- Gemini: Up to 1,000,000 tokens context
- OpenAI: Up to 128,000 tokens context
- Anthropic: Up to 200,000 tokens context

**Response Time**:
- Gemini: 1-3 seconds (flash model)
- OpenAI: 2-5 seconds (gpt-4o-mini)
- Anthropic: 2-4 seconds (sonnet)

---

## 🐛 Troubleshooting

### Error: "API key not configured"

**Solution**: Add the API key to your `.env` file:
```bash
GEMINI_API_KEY=your-key-here
```

### Error: "Unsupported AI provider"

**Solution**: Check `AI_PRIMARY_PROVIDER` value in `.env`:
```bash
# Must be exactly one of:
AI_PRIMARY_PROVIDER=gemini
AI_PRIMARY_PROVIDER=openai
AI_PRIMARY_PROVIDER=anthropic
```

### Provider not switching

**Solution**: Restart the backend server:
```bash
cd backend
# Kill running process (Ctrl+C)
npm run dev
```

### Rate limit errors

**Solution**: 
- Gemini: Wait 1 minute (15 requests/min limit)
- OpenAI: Upgrade to paid tier or wait
- Anthropic: Check your tier limits

---

## 📝 Code Comments

All AI-related code now includes comprehensive comments:

### In `backend/.env.example`:
```bash
# =============================================================================
# AI PROVIDERS CONFIGURATION
# =============================================================================
# Choose your primary AI provider by setting AI_PRIMARY_PROVIDER
# Available options: 'gemini', 'openai', 'anthropic'
```

### In `backend/src/services/aiService.ts`:
```typescript
/**
 * =============================================================================
 * AI SERVICE - MULTI-PROVIDER SUPPORT
 * =============================================================================
 * This service supports multiple AI providers: Google Gemini, OpenAI, Anthropic
 * 
 * CURRENT ACTIVE PROVIDER: Google Gemini (gemini-1.5-flash)
 * 
 * To switch providers:
 * 1. Set AI_PRIMARY_PROVIDER in your .env file
 * 2. Restart the server
 */
```

### In `backend/src/routes/ai.routes.ts`:
```typescript
/**
 * Comprehensive ATS scoring function
 * Uses active AI provider configured in .env (currently: Gemini)
 * 
 * To switch providers, change AI_PRIMARY_PROVIDER in .env
 */
```

---

## 🎓 Example: Switching to OpenAI

### Current (Gemini):
```bash
# backend/.env
AI_PRIMARY_PROVIDER=gemini
GEMINI_API_KEY=AIzaSy...
GEMINI_MODEL=gemini-1.5-flash
```

### Switch to OpenAI:
```bash
# backend/.env
AI_PRIMARY_PROVIDER=openai
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4o-mini
```

### Restart:
```bash
cd backend
npm run dev
```

### Verify:
```bash
# Check logs - should show OpenAI model
# Test any AI endpoint - response includes "model": "gpt-4o-mini"
```

---

## 📈 Cost Optimization Tips

### Use Gemini for:
- High-volume requests
- Development/testing
- Cost-sensitive applications
- Resume parsing (free tier covers most usage)

### Use OpenAI for:
- Structured outputs (best JSON mode)
- Complex reasoning
- When you need OpenAI-specific features

### Use Anthropic for:
- Long document analysis
- Safety-critical applications
- When you need Claude's specific capabilities

### Hybrid Approach:
```bash
# Development
AI_PRIMARY_PROVIDER=gemini

# Production (different environments)
AI_PRIMARY_PROVIDER=openai  # for critical features
AI_PRIMARY_PROVIDER=gemini  # for bulk operations
```

---

## 🔐 Environment Variables Reference

### Required for Gemini (Active):
```bash
AI_PRIMARY_PROVIDER=gemini
GEMINI_API_KEY=your-key-here
GEMINI_MODEL=gemini-1.5-flash
```

### Required for OpenAI:
```bash
AI_PRIMARY_PROVIDER=openai
OPENAI_API_KEY=your-key-here
OPENAI_MODEL=gpt-4o-mini
```

### Required for Anthropic:
```bash
AI_PRIMARY_PROVIDER=anthropic
ANTHROPIC_API_KEY=your-key-here
ANTHROPIC_MODEL=claude-3-sonnet-20240229
```

---

## ✅ Checklist

- [x] All AI functions updated to use `callAI()` helper
- [x] Support for Gemini, OpenAI, Anthropic
- [x] Comprehensive comments in all files
- [x] `.env.example` updated with instructions
- [x] Default provider changed to Gemini
- [x] PDF scoring updated to support all providers
- [x] Documentation created

---

**Last Updated**: December 8, 2024  
**Active Provider**: Google Gemini (gemini-1.5-flash)  
**Switch Method**: Change `AI_PRIMARY_PROVIDER` in `.env` file
