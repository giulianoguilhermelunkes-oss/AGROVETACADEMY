export type CourseId = 'agronomia' | 'zootecnia' | 'veterinaria';

export interface Topic {
  id: string;
  name: string;
}

export interface Discipline {
  id: string;
  name: string;
  level: 'Básico' | 'Intermediário' | 'Avançado';
  topics: Topic[];
}

export interface Area {
  id: string;
  name: string;
  disciplines: Discipline[];
}

export interface Course {
  id: CourseId;
  name: string;
  description: string;
  color: string;
  areas: Area[];
}

// Educational Content Structure (Raw Markdown Document)
export interface EducationalContent {
  markdown: string;
}

// --- Auth Types ---

export type UserRole = 'student' | 'professor';
export type ProfessorSpecialization = CourseId;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  studentCode?: string; // Only for students
  specialization?: ProfessorSpecialization; // Only for professors
  avatarColor: string; // Tail wind class for color
  completedTopics: string[]; // List of IDs of completed topics
  isMuted?: boolean; // For chat moderation
}

// --- Chat Types ---

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  receiverId?: string; // If null/undefined, it is a public message
  content: string;
  timestamp: number;
}