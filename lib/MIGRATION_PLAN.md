# Supabase Environment Variables Migration Plan

## Current Implementation in page.tsx

```typescript
// Lines 31-33
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## Proposed Changes to page.tsx

### 1. Update Import
Replace:
```typescript
import { createClient } from '@supabase/supabase-js'
```

With:
```typescript
import { tryGetSupabaseClient, type Database } from '@/lib/supabase'
```

### 2. Replace Initialization
Replace the current initialization (lines 31-33) with:
```typescript
// Initialize Supabase with proper error handling
const { client: supabase, error: supabaseError } = tryGetSupabaseClient()
```

### 3. Update useEffect for Fetching Tools
Replace the fetchTools function (around line 856) with error-aware version:

```typescript
useEffect(() => {
  let isMounted = true
  setLoadingTools(true)
  setFetchError(false)

  const fetchTools = async () => {
    try {
      // Check if Supabase is properly initialized
      if (!supabase) {
        console.error('Supabase initialization failed:', supabaseError)
        setTools(fallbackTools)
        setFetchError(true)
        setLoadingTools(false)
        return
      }

      const { data, error } = await supabase
        .from('tools')
        .select('*')
      
      if (!isMounted) return
      
      if (error || !data) {
        setTools(fallbackTools)
        setFetchError(true)
      } else {
        setTools(data as Tool[])
      }
      setLoadingTools(false)
    } catch (err) {
      if (!isMounted) return
      console.warn('Error fetching tools:', err)
      setTools(fallbackTools)
      setFetchError(true)
      setLoadingTools(false)
    }
  }

  fetchTools()

  return () => { isMounted = false }
}, [supabase, supabaseError])
```

### 4. Enhanced Error Display
Update the error display (around line 1168) to show more specific error:

```typescript
{loadingTools ? (
  <div className="flex justify-center py-24">
    <Loader2 className="w-8 h-8 animate-spin text-slate-500" />
    <span className="ml-3 text-slate-500 text-lg">Loading tools...</span>
  </div>
) : fetchError ? (
  <div className="text-center py-12 bg-amber-50 border border-amber-200 rounded-lg">
    <div className="text-2xl mb-2 opacity-60">⚠️</div>
    <p className="text-amber-800 font-medium mb-1">
      {supabaseError ? 'Configuration Error' : 'Unable to load tools from database'}
    </p>
    <p className="text-amber-600 text-sm">
      {supabaseError ? 'Check console for details' : 'Using offline data - some tools may be outdated'}
    </p>
    {process.env.NODE_ENV === 'development' && supabaseError && (
      <details className="mt-4 text-left max-w-md mx-auto">
        <summary className="cursor-pointer text-amber-700 text-sm font-medium">
          Show Details
        </summary>
        <pre className="mt-2 text-xs bg-amber-100 p-3 rounded overflow-auto">
          {supabaseError.message}
        </pre>
      </details>
    )}
  </div>
) : null}
```

## Files Affected

1. **page.tsx** - Main update for Supabase initialization
2. **No other files need updates** - The modular approach ensures isolated changes

## Rollback Plan

If issues occur:
1. Simply revert the import change
2. Restore the original 3 lines of Supabase initialization
3. No other files are affected

## Testing Scenarios

### Scenario 1: Missing Environment Variables
- Remove `.env.local` temporarily
- App should show clear error message
- Should fall back to offline tools gracefully

### Scenario 2: Invalid Environment Variables  
- Set invalid values in `.env.local`
- App should handle gracefully
- Error should be logged in console

### Scenario 3: Valid Configuration
- With proper `.env.local` values
- App should work exactly as before
- No visible changes to user

## Benefits

1. **No runtime crashes** - Graceful fallback to offline data
2. **Clear error messages** - Developers know exactly what's wrong
3. **Development-friendly** - Detailed errors in dev mode
4. **Type safety** - Full TypeScript support maintained
5. **Minimal changes** - Only affects initialization code
6. **Easy rollback** - Simple 3-line revert if needed
