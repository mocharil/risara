/**
 * Helper function to determine if dummy data should be used
 *
 * By default, uses dummy data unless explicitly set to 'false'
 * This ensures demo works on Vercel even without environment variables set
 */
export function useDummyData(): boolean {
  // Check both server and client environment variables
  const serverEnv = process.env.USE_DUMMY_DATA;
  const clientEnv = process.env.NEXT_PUBLIC_USE_DUMMY_DATA;

  // Default to true (use dummy data) unless explicitly set to 'false'
  // This makes it work on Vercel deployment without needing to set env vars
  if (serverEnv === 'false' || clientEnv === 'false') {
    return false;
  }

  // If explicitly set to 'true' or undefined/null, use dummy data
  return true;
}
