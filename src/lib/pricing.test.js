import { describe, it, expect } from 'vitest'
import { getPricingTier } from './pricing'

describe('getPricingTier', () => {
  it('returns 50 for 0 years', () => expect(getPricingTier(0)).toBe(50))
  it('returns 50 for 2 years', () => expect(getPricingTier(2)).toBe(50))
  it('returns 75 for 3 years', () => expect(getPricingTier(3)).toBe(75))
  it('returns 75 for 4 years', () => expect(getPricingTier(4)).toBe(75))
  it('returns 100 for 5 years', () => expect(getPricingTier(5)).toBe(100))
  it('returns 100 for 9 years', () => expect(getPricingTier(9)).toBe(100))
  it('returns 125 for 10 years', () => expect(getPricingTier(10)).toBe(125))
  it('returns 125 for 20 years', () => expect(getPricingTier(20)).toBe(125))
  it('returns null for null', () => expect(getPricingTier(null)).toBeNull())
})
