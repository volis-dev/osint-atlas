import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { validateEnvironmentVariables, formatEnvValidationError } from './env-validation'

// Type for our Supabase database (you can expand this based on your schema)
export type Database = {
  public: {
    Tables: {
      tools: {
        Row: {
          id: number
          name: string
          description: string
          category: string
          status: "online" | "offline" | "warning"
          url: string
          pricing: "Free" | "Freemium" | "Paid"
          registration: boolean
          created_at?: string
          updated_at?: string
        }
        Insert: Omit<Database['public']['Tables']['tools']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['tools']['Insert']>
      }
    }
  }
}

class SupabaseClientManager {
  private static instance: SupabaseClientManager
  private client: SupabaseClient<Database> | null = null
  private initializationError: Error | null = null
  private isInitialized = false

  private constructor() {}

  static getInstance(): SupabaseClientManager {
    if (!SupabaseClientManager.instance) {
      SupabaseClientManager.instance = new SupabaseClientManager()
    }
    return SupabaseClientManager.instance
  }

  /**
   * Initializes the Supabase client with validation
   * @throws Error if environment variables are missing
   */
  private initializeClient(): void {
    if (this.isInitialized) return

    try {
      // Validate environment variables
      const validation = validateEnvironmentVariables()
      
      if (!validation.isValid) {
        const errorMessage = formatEnvValidationError(validation)
        this.initializationError = new Error(errorMessage)
        
        // In development, log detailed error
        if (process.env.NODE_ENV === 'development') {
          console.error('\n🚨 Supabase Configuration Error:\n')
          console.error(errorMessage)
          console.error('\nPlease ensure your .env.local file contains the required variables.\n')
        }
        
        throw this.initializationError
      }

      // Environment variables are valid, create client
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

      this.client = createClient<Database>(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      })

      this.isInitialized = true
      this.initializationError = null

      // Log success in development
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Supabase client initialized successfully')
      }
    } catch (error) {
      this.isInitialized = false
      if (error instanceof Error) {
        this.initializationError = error
      } else {
        this.initializationError = new Error('Unknown error during Supabase initialization')
      }
      throw this.initializationError
    }
  }

  /**
   * Gets the Supabase client instance
   * @returns The Supabase client or throws an error if initialization failed
   */
  getClient(): SupabaseClient<Database> {
    if (!this.isInitialized && !this.initializationError) {
      this.initializeClient()
    }

    if (this.initializationError) {
      throw this.initializationError
    }

    if (!this.client) {
      throw new Error('Supabase client is not initialized')
    }

    return this.client
  }

  /**
   * Checks if the Supabase client is properly initialized
   * @returns true if client is ready, false otherwise
   */
  isClientReady(): boolean {
    return this.isInitialized && this.client !== null && this.initializationError === null
  }

  /**
   * Gets the initialization error if any
   * @returns The error or null if no error
   */
  getInitializationError(): Error | null {
    return this.initializationError
  }

  /**
   * Attempts to reinitialize the client (useful for retry scenarios)
   */
  retryInitialization(): void {
    this.isInitialized = false
    this.initializationError = null
    this.client = null
    this.initializeClient()
  }
}

// Export singleton instance manager
const supabaseManager = SupabaseClientManager.getInstance()

/**
 * Safe Supabase client getter with error handling
 * @returns Supabase client instance
 * @throws Error if environment variables are missing
 */
export function getSupabaseClient(): SupabaseClient<Database> {
  return supabaseManager.getClient()
}

/**
 * Checks if Supabase is properly configured and ready
 * @returns true if ready, false otherwise
 */
export function isSupabaseReady(): boolean {
  return supabaseManager.isClientReady()
}

/**
 * Gets any initialization error
 * @returns Error or null
 */
export function getSupabaseError(): Error | null {
  return supabaseManager.getInitializationError()
}

/**
 * Safe Supabase client initialization with fallback
 * Use this when you want to handle errors gracefully
 * @returns Object with client (or null) and error (or null)
 */
export function tryGetSupabaseClient(): {
  client: SupabaseClient<Database> | null
  error: Error | null
} {
  try {
    const client = supabaseManager.getClient()
    return { client, error: null }
  } catch (error) {
    return {
      client: null,
      error: error instanceof Error ? error : new Error('Unknown error'),
    }
  }
}

/**
 * Retry Supabase initialization
 * Useful for recovery scenarios
 */
export function retrySupabaseInit(): void {
  supabaseManager.retryInitialization()
}
