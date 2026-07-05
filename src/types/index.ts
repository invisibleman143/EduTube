export interface Lecture {
  id: string;
  title: string;
  videoUrl: string;
  duration: string;
  description: string;
  order: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  teacherId: string;
  teacherName: string;
  rating: number;
  enrolledCount: number;
  status: 'approved' | 'pending' | 'rejected';
  feedback?: string;
  lectures: Lecture[];
}

export interface UserProgress {
  courseId: string;
  completedLectureIds: string[];
}

export interface Review {
  id: string;
  courseId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Question {
  id: string;
  courseId: string;
  userName: string;
  text: string;
  date: string;
  answers: Answer[];
}

export interface Answer {
  id: string;
  userName: string;
  text: string;
  date: string;
}

export interface PlatformStats {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
}
