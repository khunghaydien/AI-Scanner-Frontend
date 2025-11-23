/**
 * Format date to dd/mm/yyyy hh:mm
 * @param date - Date string, Date object, or timestamp (number or string big int from getTime())
 * @returns Formatted date string (dd/mm/yyyy hh:mm)
 */
export function formatDateTime(date: string | Date | number): string {
  let dateObj: Date;
  
  if (typeof date === 'number') {
    // Nếu là number, coi như timestamp
    dateObj = new Date(date);
  } else if (typeof date === 'string') {
    // Nếu là string, kiểm tra xem có phải là số không (big int dạng string)
    const numValue = Number(date);
    if (!isNaN(numValue) && !isNaN(parseFloat(date))) {
      // Nếu là string dạng số, coi như timestamp
      dateObj = new Date(numValue);
    } else {
      // Nếu không phải số, parse như date string bình thường
      dateObj = new Date(date);
    }
  } else {
    // Nếu là Date object
    dateObj = date;
  }
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }

  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

