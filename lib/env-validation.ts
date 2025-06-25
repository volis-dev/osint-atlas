/**
 * Environment Variable Validation Utilities
 * Provides runtime validation for required environment variables
 */

export interface EnvValidationResult {
  isValid: boolean
  missingVars: string[]
  errors: string[]
}

export interface RequiredEnvVar {
  name: string
  description: string
  example?: string
}

// Define all required environment variables
export const REQUIRED_ENV_VARS: RequiredEnvVar[] = [
  {
    name: 'NEXT_PUBLIC_SUPABASE_URL',
    description: 'Supabase project URL',
    example: 'https://your-project.supabase.co'
  },
  {
    name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    description: 'Supabase anonymous/public key',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  }
]

/**
 * Validates that all required environment variables are present
 * @returns Validation result with missing variables and formatted errors
 */
export function validateEnvironmentVariables(): EnvValidationResult {
  const missingVars: string[] = []
  const errors: string[] = []

  for (const envVar of REQUIRED_ENV_VARS) {
    const value = process.env[envVar.name]
    
    if (!value || value.trim() === '') {
      missingVars.push(envVar.name)
      errors.push(`Missing required environment variable: ${envVar.name}`)
    }
  }

  return {
    isValid: missingVars.length === 0,
    missingVars,
    errors
  }
}

/**
 * Formats validation errors into a user-friendly message
 * @param result - The validation result
 * @returns Formatted error message
 */
export function formatEnvValidationError(result: EnvValidationResult): string {
  if (result.isValid) {
    return ''
  }

  let message = 'Environment Configuration Error\n\n'
  message += 'The following required environment variables are missing:\n\n'

  for (const varName of result.missingVars) {
    const envVar = REQUIRED_ENV_VARS.find(v => v.name === varName)
    if (envVar) {
      message += `• ${envVar.name}\n`
      message += `  Description: ${envVar.description}\n`
      if (envVar.example) {
        message += `  Example: ${envVar.example}\n`
      }
      message += '\n'
    }
  }

  message += 'Please add these variables to your .env.local file:\n\n'
  message += '```\n'
  for (const varName of result.missingVars) {
    const envVar = REQUIRED_ENV_VARS.find(v => v.name === varName)
    message += `${varName}=${envVar?.example || 'your-value-here'}\n`
  }
  message += '```\n\n'
  message += 'For more information, see: https://docs.supabase.com/guides/getting-started'

  return message
}

/**
 * Checks if we're in a development environment
 * @returns true if in development mode
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development'
}

/**
 * Safe getter for environment variables with fallback
 * @param varName - Environment variable name
 * @param fallback - Fallback value if not found
 * @returns The environment variable value or fallback
 */
export function getEnvVar(varName: string, fallback: string = ''): string {
  return process.env[varName] || fallback
}

/**
 * Validates a single environment variable
 * @param varName - Environment variable name
 * @returns true if the variable exists and has a value
 */
export function isEnvVarSet(varName: string): boolean {
  const value = process.env[varName]
  return value !== undefined && value.trim() !== ''
}
