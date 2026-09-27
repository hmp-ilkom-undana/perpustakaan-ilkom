/**
 * Password validation criteria and strength evaluation utility.
 */

export interface PasswordCriterion {
  id: "minLength" | "hasUppercase" | "hasLowercase" | "hasNumber";
  label: string;
  met: boolean;
}

export type PasswordStrengthLevel = "empty" | "weak" | "medium" | "strong";

export interface PasswordValidationResult {
  criteria: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
  };
  criteriaList: PasswordCriterion[];
  score: number;
  strength: PasswordStrengthLevel;
  strengthLabel: string;
  progressPercent: number;
  isValid: boolean;
}

/**
 * Mengevaluasi password terhadap 4 kriteria utama:
 * 1. Minimal 8 karakter
 * 2. Mengandung huruf besar (A-Z)
 * 3. Mengandung huruf kecil (a-z)
 * 4. Mengandung angka (0-9)
 */
export function evaluatePassword(password: string): PasswordValidationResult {
  const minLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const criteriaList: PasswordCriterion[] = [
    {
      id: "minLength",
      label: "Minimal 8 karakter",
      met: minLength,
    },
    {
      id: "hasUppercase",
      label: "Huruf besar (A-Z)",
      met: hasUppercase,
    },
    {
      id: "hasLowercase",
      label: "Huruf kecil (a-z)",
      met: hasLowercase,
    },
    {
      id: "hasNumber",
      label: "Karakter angka (0-9)",
      met: hasNumber,
    },
  ];

  const score = [minLength, hasUppercase, hasLowercase, hasNumber].filter(Boolean).length;
  const isValid = score === 4;

  if (!password || password.length === 0) {
    return {
      criteria: { minLength, hasUppercase, hasLowercase, hasNumber },
      criteriaList,
      score: 0,
      strength: "empty",
      strengthLabel: "Belum diisi",
      progressPercent: 0,
      isValid: false,
    };
  }

  let strength: PasswordStrengthLevel = "weak";
  let strengthLabel = "Lemah";

  if (score === 4) {
    strength = "strong";
    strengthLabel = "Kuat";
  } else if (score >= 2 && minLength) {
    strength = "medium";
    strengthLabel = "Sedang";
  } else if (score >= 3) {
    strength = "medium";
    strengthLabel = "Sedang";
  } else {
    strength = "weak";
    strengthLabel = "Lemah";
  }

  const progressPercent = Math.round((score / 4) * 100);

  return {
    criteria: {
      minLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
    },
    criteriaList,
    score,
    strength,
    strengthLabel,
    progressPercent,
    isValid,
  };
}
