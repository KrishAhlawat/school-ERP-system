import { UserRole, AttendanceStatus, FeeStatus, ExamType } from '../types';

// Date utilities
export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('hi-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatDateTime = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleString('hi-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getCurrentAcademicYear = (): string => {
  const currentYear = new Date().getFullYear();
  const month = new Date().getMonth();
  
  // Academic year starts from April
  if (month >= 3) {
    return `${currentYear}-${currentYear + 1}`;
  } else {
    return `${currentYear - 1}-${currentYear}`;
  }
};

// Validation utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

export const isValidPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Role utilities
export const getRoleDisplayName = (role: UserRole): string => {
  const roleNames = {
    [UserRole.ADMIN]: 'प्रशासक',
    [UserRole.TEACHER]: 'शिक्षक',
    [UserRole.STUDENT]: 'छात्र',
    [UserRole.PARENT]: 'अभिभावक'
  };
  return roleNames[role] || role;
};

export const canAccessAdminPanel = (role: UserRole): boolean => {
  return role === UserRole.ADMIN;
};

export const canManageStudents = (role: UserRole): boolean => {
  return [UserRole.ADMIN, UserRole.TEACHER].includes(role);
};

export const canViewResults = (role: UserRole): boolean => {
  return [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT, UserRole.PARENT].includes(role);
};

// Status utilities
export const getAttendanceStatusColor = (status: AttendanceStatus): string => {
  const colors = {
    [AttendanceStatus.PRESENT]: 'text-green-600',
    [AttendanceStatus.ABSENT]: 'text-red-600',
    [AttendanceStatus.LATE]: 'text-yellow-600',
    [AttendanceStatus.EXCUSED]: 'text-blue-600'
  };
  return colors[status] || 'text-gray-600';
};

export const getAttendanceStatusText = (status: AttendanceStatus): string => {
  const texts = {
    [AttendanceStatus.PRESENT]: 'उपस्थित',
    [AttendanceStatus.ABSENT]: 'अनुपस्थित',
    [AttendanceStatus.LATE]: 'देर से आया',
    [AttendanceStatus.EXCUSED]: 'छुट्टी'
  };
  return texts[status] || status;
};

export const getFeeStatusColor = (status: FeeStatus): string => {
  const colors = {
    [FeeStatus.PAID]: 'text-green-600',
    [FeeStatus.PENDING]: 'text-yellow-600',
    [FeeStatus.OVERDUE]: 'text-red-600',
    [FeeStatus.WAIVED]: 'text-blue-600'
  };
  return colors[status] || 'text-gray-600';
};

export const getExamTypeText = (type: ExamType): string => {
  const texts = {
    [ExamType.MONTHLY]: 'मासिक',
    [ExamType.QUARTERLY]: 'त्रैमासिक',
    [ExamType.HALF_YEARLY]: 'अर्धवार्षिक',
    [ExamType.ANNUAL]: 'वार्षिक',
    [ExamType.PRACTICAL]: 'प्रायोगिक',
    [ExamType.ASSIGNMENT]: 'असाइनमेंट'
  };
  return texts[type] || type;
};

// String utilities
export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const generateRandomString = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Number utilities
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('hi-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('hi-IN').format(num);
};

export const calculatePercentage = (obtained: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((obtained / total) * 100);
};

export const getGradeFromPercentage = (percentage: number): string => {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C';
  if (percentage >= 40) return 'D';
  return 'F';
};

// Array utilities
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const group = String(item[key]);
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

export const sortBy = <T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

// File utilities
export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// URL utilities
export const getSchoolDomain = (schoolName: string): string => {
  return `${slugify(schoolName)}.yourapp.com`;
};

export const extractSchoolFromDomain = (domain: string): string => {
  const parts = domain.split('.');
  return parts[0];
};

// Error handling utilities
export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'कुछ गलत हुआ है। कृपया बाद में कोशिश करें।';
};

// Local storage utilities
export const setLocalStorage = (key: string, value: any): void => {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  }
};

export const getLocalStorage = <T>(key: string, defaultValue?: T): T | null => {
  if (typeof window !== 'undefined') {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.error('Error getting localStorage:', error);
      return defaultValue || null;
    }
  }
  return defaultValue || null;
};

export const removeLocalStorage = (key: string): void => {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing localStorage:', error);
    }
  }
};
