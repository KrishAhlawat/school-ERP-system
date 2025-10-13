// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  schoolId: string;
  createdAt: Date;
  updatedAt: Date;
  profileImage?: string;
  isActive: boolean;
}

export enum UserRole {
  ADMIN = "ADMIN",
  TEACHER = "TEACHER",
  STUDENT = "STUDENT",
  PARENT = "PARENT",
}

// School Types
export interface School {
  id: string;
  name: string;
  logoUrl?: string;
  theme: SchoolTheme;
  domain: string;
  address: string;
  phone: string;
  email: string;
  principalName: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface SchoolTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  logoUrl?: string;
}

// Student Types
export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  class: string;
  section: string;
  parentId: string;
  schoolId: string;
  dateOfBirth: Date;
  gender: Gender;
  address: string;
  phone?: string;
  email?: string;
  admissionDate: Date;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

// Teacher Types
export interface Teacher {
  id: string;
  name: string;
  employeeId: string;
  subjects: string[];
  schoolId: string;
  qualification: string;
  experience: number;
  phone: string;
  email: string;
  address: string;
  joiningDate: Date;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

// Attendance Types
export interface Attendance {
  id: string;
  studentId: string;
  date: Date;
  status: AttendanceStatus;
  remarks?: string;
  markedBy: string;
  schoolId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum AttendanceStatus {
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
  LATE = "LATE",
  EXCUSED = "EXCUSED",
}

// Exam Types
export interface Exam {
  id: string;
  name: string;
  type: ExamType;
  subject: string;
  class: string;
  section: string;
  date: Date;
  duration: number; // in minutes
  totalMarks: number;
  passingMarks: number;
  schoolId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export enum ExamType {
  MONTHLY = "MONTHLY",
  QUARTERLY = "QUARTERLY",
  HALF_YEARLY = "HALF_YEARLY",
  ANNUAL = "ANNUAL",
  PRACTICAL = "PRACTICAL",
  ASSIGNMENT = "ASSIGNMENT",
}

// Result Types
export interface Result {
  id: string;
  examId: string;
  studentId: string;
  subject: string;
  marksObtained: number;
  totalMarks: number;
  grade: string;
  remarks?: string;
  schoolId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Fee Types
export interface Fee {
  id: string;
  studentId: string;
  type: FeeType;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: FeeStatus;
  description?: string;
  schoolId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum FeeType {
  TUITION = "TUITION",
  TRANSPORT = "TRANSPORT",
  LIBRARY = "LIBRARY",
  LABORATORY = "LABORATORY",
  SPORTS = "SPORTS",
  EXAMINATION = "EXAMINATION",
  MISCELLANEOUS = "MISCELLANEOUS",
}

export enum FeeStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  OVERDUE = "OVERDUE",
  WAIVED = "WAIVED",
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
  schoolDomain?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  schoolId?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// Dashboard Types
export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  attendancePercentage: number;
  upcomingExams: number;
  pendingFees: number;
  recentActivities: Activity[];
}

export interface Activity {
  id: string;
  type: ActivityType;
  message: string;
  timestamp: Date;
  userId: string;
  userName: string;
}

export enum ActivityType {
  STUDENT_ADDED = "STUDENT_ADDED",
  STUDENT_UPDATED = "STUDENT_UPDATED",
  ATTENDANCE_MARKED = "ATTENDANCE_MARKED",
  EXAM_CREATED = "EXAM_CREATED",
  FEE_PAID = "FEE_PAID",
  RESULT_PUBLISHED = "RESULT_PUBLISHED",
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: Date;
  data?: Record<string, any>;
}

export enum NotificationType {
  INFO = "INFO",
  WARNING = "WARNING",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}

// Common Types
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface FilterParams {
  schoolId?: string;
  class?: string;
  section?: string;
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
}
