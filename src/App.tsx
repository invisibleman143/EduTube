import { useState, useEffect } from 'react';
import type { Course, UserProgress, Review, Question, PlatformStats } from './types';
import { INITIAL_COURSES, INITIAL_REVIEWS, INITIAL_QUESTIONS } from './data/mockData';
import { RoleSwitcher } from './components/RoleSwitcher';
import { StudentPanel } from './components/StudentPanel';
import { TeacherPanel } from './components/TeacherPanel';
import { AdminPanel } from './components/AdminPanel';
import { LandingPage } from './components/LandingPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [currentRole, setCurrentRole] = useState<'student' | 'teacher' | 'admin'>('student');

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('edutube_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('edutube_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleLogin = (role: 'student' | 'teacher' | 'admin', email: string) => {
    setCurrentRole(role);
    setUserEmail(email);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail('');
  };

  // Load from local storage or fall back to mock data
  const [courses, setCourses] = useState<Course[]>(() => {
    const local = localStorage.getItem('edutube_courses');
    if (local) {
      const parsed = JSON.parse(local);
      if (parsed.length < INITIAL_COURSES.length) {
        const parsedIds = new Set(parsed.map((c: Course) => c.id));
        const missing = INITIAL_COURSES.filter(c => !parsedIds.has(c.id));
        return [...parsed, ...missing];
      }
      return parsed;
    }
    return INITIAL_COURSES;
  });

  const [progress, setProgress] = useState<UserProgress[]>(() => {
    const local = localStorage.getItem('edutube_progress');
    return local ? JSON.parse(local) : [
      { courseId: 'course-1', completedLectureIds: ['c1-l1', 'c1-l2'] }
    ];
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const local = localStorage.getItem('edutube_reviews');
    return local ? JSON.parse(local) : INITIAL_REVIEWS;
  });

  const [questions, setQuestions] = useState<Question[]>(() => {
    const local = localStorage.getItem('edutube_questions');
    return local ? JSON.parse(local) : INITIAL_QUESTIONS;
  });

  // Sync to local storage when state changes
  useEffect(() => {
    localStorage.setItem('edutube_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('edutube_progress', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem('edutube_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('edutube_questions', JSON.stringify(questions));
  }, [questions]);

  // Fetch courses from the backend database on initial mount
  useEffect(() => {
    const loadCoursesFromBackend = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/courses/all');
        if (response.ok) {
          const fetchedCourses = await response.json();
          setCourses(fetchedCourses);
        }
      } catch (error) {
        console.error('Failed to fetch courses from backend API:', error);
      }
    };
    loadCoursesFromBackend();
  }, []);

  // Recalculate platform statistics dynamically
  const getPlatformStats = (): PlatformStats => {
    const totalStudents = 612; // Base number
    const totalTeachers = 3;
    const totalCourses = courses.length;
    
    // Sum total enrollments (base mock + dynamic progress entries)
    const mockEnrollments = courses.reduce((acc, c) => acc + c.enrolledCount, 0);
    const totalEnrollments = mockEnrollments + progress.length - 1; // Adjust offset

    // Est revenue ($49.99 per enrollment)
    const totalRevenue = totalEnrollments * 49.99;

    return {
      totalStudents,
      totalTeachers,
      totalCourses,
      totalEnrollments,
      totalRevenue
    };
  };

  // Student Actions
  const handleEnroll = (courseId: string) => {
    if (progress.some((p) => p.courseId === courseId)) return;
    
    // Add progress tracking entry
    setProgress([...progress, { courseId, completedLectureIds: [] }]);

    // Update course enrollment count
    setCourses(prev =>
      prev.map((c) =>
        c.id === courseId ? { ...c, enrolledCount: c.enrolledCount + 1 } : c
      )
    );
  };

  const handleToggleLectureComplete = (courseId: string, lectureId: string) => {
    setProgress(prev =>
      prev.map((item) => {
        if (item.courseId !== courseId) return item;
        const exists = item.completedLectureIds.includes(lectureId);
        const updatedIds = exists
          ? item.completedLectureIds.filter((id) => id !== lectureId)
          : [...item.completedLectureIds, lectureId];
        return { ...item, completedLectureIds: updatedIds };
      })
    );
  };

  const handleAddReview = (courseId: string, rating: number, comment: string) => {
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      courseId,
      userName: 'Alex Johnson (Student)',
      rating,
      comment,
      date: new Date().toISOString().split('T')[0]
    };

    const updatedReviews = [...reviews, newReview];
    setReviews(updatedReviews);

    // Recompute course average rating
    const courseReviews = updatedReviews.filter((r) => r.courseId === courseId);
    const avgRating = courseReviews.reduce((sum, r) => sum + r.rating, 0) / courseReviews.length;

    setCourses(prev =>
      prev.map((c) =>
        c.id === courseId ? { ...c, rating: avgRating } : c
      )
    );
  };

  const handleAddQuestion = (courseId: string, text: string) => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      courseId,
      userName: 'Alex Johnson (Student)',
      text,
      date: new Date().toISOString().split('T')[0],
      answers: []
    };

    setQuestions([...questions, newQuestion]);

    // Simulated reply from the instructor after a short delay
    setTimeout(() => {
      const course = courses.find((c) => c.id === courseId);
      const instructorName = course ? course.teacherName : 'Instructor';
      
      setQuestions(prevQuestions =>
        prevQuestions.map((q) => {
          if (q.id !== newQuestion.id) return q;
          return {
            ...q,
            answers: [
              ...q.answers,
              {
                id: `ans-sim-${Date.now()}`,
                userName: instructorName,
                text: `Thank you for asking! I've reviewed your inquiry. Feel free to re-watch the lecture section or consult the curriculum documentation. I'm always here to help.`,
                date: new Date().toISOString().split('T')[0]
              }
            ]
          };
        })
      );
    }, 2000);
  };

  const handleAddAnswer = (questionId: string, text: string) => {
    const replierName = currentRole === 'teacher' ? 'Dr. Angela Yu (Instructor)' : 'Alex Johnson (Student)';
    const newAnswer = {
      id: `ans-${Date.now()}`,
      userName: replierName,
      text,
      date: new Date().toISOString().split('T')[0]
    };

    setQuestions(prev =>
      prev.map((q) =>
        q.id === questionId ? { ...q, answers: [...q.answers, newAnswer] } : q
      )
    );
  };

  // Teacher Actions
  const handleAddCourse = (courseDetails: Omit<Course, 'id' | 'teacherId' | 'teacherName' | 'rating' | 'enrolledCount'>) => {
    const newCourse: Course = {
      ...courseDetails,
      id: `course-${Date.now()}`,
      teacherId: 'teacher-1',
      teacherName: 'Dr. Angela Yu (Demo)',
      rating: 0,
      enrolledCount: 0
    };
    setCourses([...courses, newCourse]);
  };

  const handleUpdateCourse = (courseId: string, updatedFields: Partial<Course>) => {
    setCourses(prev =>
      prev.map((c) =>
        c.id === courseId ? { ...c, ...updatedFields } : c
      )
    );
  };

  const handleDeleteCourse = (courseId: string) => {
    setCourses(prev => prev.filter((c) => c.id !== courseId));
  };

  // Admin Actions
  const handleApproveCourse = (courseId: string) => {
    setCourses(prev =>
      prev.map((c) =>
        c.id === courseId ? { ...c, status: 'approved', feedback: undefined } : c
      )
    );
  };

  const handleRejectCourse = (courseId: string, feedback: string) => {
    setCourses(prev =>
      prev.map((c) =>
        c.id === courseId ? { ...c, status: 'rejected', feedback } : c
      )
    );
  };

  return (
    <div className="app-container">
      {!isLoggedIn ? (
        <main className="main-content">
          <LandingPage onLogin={handleLogin} courses={courses} theme={theme} toggleTheme={toggleTheme} />
        </main>
      ) : (
        <>
          {/* Role Selector Header */}
          <RoleSwitcher currentRole={currentRole} onChangeRole={setCurrentRole} onLogout={handleLogout} userEmail={userEmail} theme={theme} toggleTheme={toggleTheme} />

          {/* Primary Role Views */}
          <main className="main-content">
            {currentRole === 'student' && (
              <StudentPanel
                courses={courses}
                progress={progress}
                reviews={reviews}
                questions={questions}
                onEnroll={handleEnroll}
                onToggleLectureComplete={handleToggleLectureComplete}
                onAddReview={handleAddReview}
                onAddQuestion={handleAddQuestion}
                onAddAnswer={handleAddAnswer}
              />
            )}

            {currentRole === 'teacher' && (
              <TeacherPanel
                courses={courses}
                teacherId="teacher-1"
                onAddCourse={handleAddCourse}
                onUpdateCourse={handleUpdateCourse}
                onDeleteCourse={handleDeleteCourse}
              />
            )}

            {currentRole === 'admin' && (
              <AdminPanel
                courses={courses}
                stats={getPlatformStats()}
                onApproveCourse={handleApproveCourse}
                onRejectCourse={handleRejectCourse}
              />
            )}
          </main>
        </>
      )}

      {/* Footer Branding */}
      <footer style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--border-color)',
        padding: '1.5rem 0',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.8rem',
        background: 'rgba(10, 10, 15, 0.9)'
      }}>
        <div>&copy; {new Date().getFullYear()} EduTube Studio Learning Platform. All rights reserved.</div>
        <div style={{ marginTop: '0.25rem', fontSize: '0.75rem' }}>Powered by Vite, React and Modern CSS Tokens.</div>
      </footer>
    </div>
  );
}

export default App;
