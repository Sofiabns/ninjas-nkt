export const formatPhone = (value: string): string => {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}`;
};

export const validatePhone = (phone: string): boolean => {
  return /^\d{3}-\d{3}$/.test(phone);
};

export const formatPlate = (value: string): string => {
  return value.toUpperCase().slice(0, 20);
};

export const validatePlate = (plate: string): boolean => {
  return plate.trim().length > 0;
};

export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
