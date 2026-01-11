/**
 * GlowMate Skin Profile Type Definitions
 * Used to store user's skin characteristics and preferences
 */

export type SkinType = 'normal' | 'dry' | 'oily' | 'combination' | 'sensitive' | 'mature';

export type SkinConcern =
  | 'acne'
  | 'wrinkles'
  | 'fine_lines'
  | 'dark_spots'
  | 'hyperpigmentation'
  | 'redness'
  | 'rosacea'
  | 'dryness'
  | 'dehydration'
  | 'oily_t_zone'
  | 'large_pores'
  | 'uneven_texture'
  | 'dullness'
  | 'dark_circles'
  | 'sagging'
  | 'sun_damage'
  | 'scarring'
  | 'eczema'
  | 'psoriasis';

export type SkinGoal =
  | 'anti_aging'
  | 'hydration'
  | 'brightening'
  | 'clear_skin'
  | 'even_tone'
  | 'smooth_texture'
  | 'minimize_pores'
  | 'reduce_wrinkles'
  | 'fade_spots'
  | 'calm_redness'
  | 'oil_control'
  | 'sun_protection';

export type AllergenType =
  | 'fragrance'
  | 'alcohol'
  | 'nuts'
  | 'sulfates'
  | 'parabens'
  | 'silicones'
  | 'essential_oils'
  | 'retinol'
  | 'vitamin_c'
  | 'aha'
  | 'bha'
  | 'benzoyl_peroxide'
  | 'mineral_oil'
  | 'lanolin'
  | 'coconut_oil';

export type RoutinePreference = 'minimal' | 'moderate' | 'extensive';

export type BudgetLevel = 'low' | 'medium' | 'high' | 'luxury';

export type ClimateType = 'dry' | 'humid' | 'cold' | 'hot' | 'temperate';

/**
 * Main Skin Profile Interface
 * Stored as JSON in PostgreSQL User.skinProfile field
 */
export interface SkinProfile {
  // Basic skin characteristics
  skinType?: SkinType;
  
  // User's skin concerns (matches Ingredient.concerns)
  concerns?: SkinConcern[];
  
  // Known allergies/sensitivities (to filter Ingredient.isCommonAllergen)
  allergies?: AllergenType[];
  
  // What user wants to achieve
  goals?: SkinGoal[];
  
  // Routine preferences
  routinePreference?: RoutinePreference;
  
  // Budget constraints
  budget?: BudgetLevel;
  
  // Environmental factors
  climate?: ClimateType;
  
  // Additional medical conditions
  medicalConditions?: string[];
  
  // Preferred product types
  preferredFormulations?: ('cream' | 'gel' | 'serum' | 'oil' | 'foam' | 'balm')[];
  
  // Vegan/cruelty-free preferences
  veganOnly?: boolean;
  crueltyfreeOnly?: boolean;
  
  // Additional notes
  additionalNotes?: string;
  
  // Last updated timestamp
  lastUpdated?: Date;
}

/**
 * Validation helper for SkinProfile
 */
export function validateSkinProfile(profile: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!profile || typeof profile !== 'object') {
    return { valid: true, errors: [] }; // Empty profile is valid
  }

  // Validate skinType
  const validSkinTypes: SkinType[] = ['normal', 'dry', 'oily', 'combination', 'sensitive', 'mature'];
  if (profile.skinType && !validSkinTypes.includes(profile.skinType)) {
    errors.push(`Invalid skinType. Must be one of: ${validSkinTypes.join(', ')}`);
  }

  // Validate routinePreference
  const validRoutinePrefs: RoutinePreference[] = ['minimal', 'moderate', 'extensive'];
  if (profile.routinePreference && !validRoutinePrefs.includes(profile.routinePreference)) {
    errors.push(`Invalid routinePreference. Must be one of: ${validRoutinePrefs.join(', ')}`);
  }

  // Validate budget
  const validBudgets: BudgetLevel[] = ['low', 'medium', 'high', 'luxury'];
  if (profile.budget && !validBudgets.includes(profile.budget)) {
    errors.push(`Invalid budget. Must be one of: ${validBudgets.join(', ')}`);
  }

  // Validate climate
  const validClimates: ClimateType[] = ['dry', 'humid', 'cold', 'hot', 'temperate'];
  if (profile.climate && !validClimates.includes(profile.climate)) {
    errors.push(`Invalid climate. Must be one of: ${validClimates.join(', ')}`);
  }

  // Validate arrays
  if (profile.concerns && !Array.isArray(profile.concerns)) {
    errors.push('concerns must be an array');
  }

  if (profile.allergies && !Array.isArray(profile.allergies)) {
    errors.push('allergies must be an array');
  }

  if (profile.goals && !Array.isArray(profile.goals)) {
    errors.push('goals must be an array');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Create empty skin profile with defaults
 */
export function createEmptySkinProfile(): SkinProfile {
  return {
    concerns: [],
    allergies: [],
    goals: [],
    routinePreference: 'moderate',
    budget: 'medium',
    veganOnly: false,
    crueltyfreeOnly: false,
  };
}

/**
 * Example skin profiles for testing
 */
export const exampleProfiles = {
  acneProne: {
    skinType: 'oily',
    concerns: ['acne', 'large_pores', 'oily_t_zone'],
    allergies: ['fragrance', 'coconut_oil'],
    goals: ['clear_skin', 'minimize_pores', 'oil_control'],
    routinePreference: 'moderate',
    budget: 'medium'
  } as SkinProfile,

  antiAging: {
    skinType: 'mature',
    concerns: ['wrinkles', 'fine_lines', 'sagging', 'dark_spots'],
    allergies: [],
    goals: ['anti_aging', 'reduce_wrinkles', 'hydration'],
    routinePreference: 'extensive',
    budget: 'high',
    climate: 'dry'
  } as SkinProfile,

  sensitive: {
    skinType: 'sensitive',
    concerns: ['redness', 'rosacea', 'dryness'],
    allergies: ['fragrance', 'alcohol', 'essential_oils', 'aha', 'bha'],
    goals: ['calm_redness', 'hydration'],
    routinePreference: 'minimal',
    budget: 'medium'
  } as SkinProfile,

  minimal: {
    skinType: 'normal',
    concerns: [],
    allergies: [],
    goals: ['hydration'],
    routinePreference: 'minimal',
    budget: 'low'
  } as SkinProfile
};
