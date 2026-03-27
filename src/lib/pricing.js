/**
 * Returns the session price (in USD) for a given years of experience.
 * Matches the Postgres trigger logic in the DB.
 * Used client-side to show the inline rate preview on the mentor profile form.
 */
export function getPricingTier(years) {
  if (years === null || years === undefined) return null
  if (years <= 2) return 50
  if (years <= 4) return 75
  if (years <= 9) return 100
  return 125
}
