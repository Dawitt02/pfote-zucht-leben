
import { differenceInYears, differenceInMonths } from "date-fns";

export const calculateAge = (birthdateStr: string | undefined): string => {
  if (!birthdateStr) return "";
  
  const birthdate = new Date(birthdateStr);
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
