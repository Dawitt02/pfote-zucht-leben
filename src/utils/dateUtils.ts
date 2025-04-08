
import { differenceInYears, differenceInMonths } from "date-fns";

export const calculateAge = (birthdateInput: string | Date | undefined): string => {
  if (!birthdateInput) return "";
  
  // Convert to Date if it's a string
  const birthdate = typeof birthdateInput === 'string' ? new Date(birthdateInput) : birthdateInput;
  
  if (isNaN(birthdate.getTime())) return "";
  
  const today = new Date();
  const years = differenceInYears(today, birthdate);
  
  if (years === 0) {
    const months = differenceInMonths(today, birthdate);
    return `${months} ${months === 1 ? 'Monat' : 'Monate'}`;
  } else {
    const monthsAfterYear = differenceInMonths(today, birthdate) % 12;
    return monthsAfterYear > 0 
      ? `${years} ${years === 1 ? 'Jahr' : 'Jahre'} und ${monthsAfterYear} ${monthsAfterYear === 1 ? 'Monat' : 'Monate'}`
      : `${years} ${years === 1 ? 'Jahr' : 'Jahre'}`;
  }
};
