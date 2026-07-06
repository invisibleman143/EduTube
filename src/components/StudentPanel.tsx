import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Course, Lecture, UserProgress, Review, Question } from '../types';
import {
  BookOpen,
  PlayCircle,
  CheckCircle,
  Star,
  Search,
  Sparkles,
  Send,
  X,
  Clock,
  ArrowRight
} from 'lucide-react';

interface StudentPanelProps {
  courses: Course[];
  progress: UserProgress[];
  reviews: Review[];
  questions: Question[];
  onEnroll: (courseId: string) => void;
  onToggleLectureComplete: (courseId: string, lectureId: string) => void;
  onAddReview: (courseId: string, rating: number, comment: string) => void;
  onAddQuestion: (courseId: string, text: string) => void;
  onAddAnswer: (questionId: string, text: string) => void;
}

export const StudentPanel: React.FC<StudentPanelProps> = ({
  courses,
  progress,
  reviews,
  questions,
  onEnroll,
  onToggleLectureComplete,
  onAddReview,
  onAddQuestion,
  onAddAnswer,
}) => {
  const [activeTab, setActiveTab] = useState<'explore' | 'my-learning'>('explore');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory] = useState<string>('All');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedExplorerCourse, setSelectedExplorerCourse] = useState<Course | null>(null);
  const [activeLecture, setActiveLecture] = useState<Lecture | null>(null);
  const [lectureTab, setLectureTab] = useState<'info' | 'qa' | 'reviews'>('info');

  const [currentPage, setCurrentPage] = useState(1);
  const [myLearningCurrentPage, setMyLearningCurrentPage] = useState(1);

  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getColumns = () => {
    if (windowWidth >= 1200) return 4;
    if (windowWidth >= 900) return 3;
    if (windowWidth >= 600) return 2;
    return 1;
  };

  const coursesPerPage = getColumns() * 2;



  // Input States
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newAnswerText, setNewAnswerText] = useState<{ [qId: string]: string }>({});

  const approvedCourses = courses.filter((c) => c.status === 'approved');



  // Filtering
  const filteredCourses = approvedCourses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.teacherName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  const getCourseProgress = (courseId: string) => {
    const p = progress.find((item) => item.courseId === courseId);
    if (!p) return 0;
    const course = courses.find((c) => c.id === courseId);
    if (!course || course.lectures.length === 0) return 0;
    return Math.round((p.completedLectureIds.length / course.lectures.length) * 100);
  };

  const isEnrolled = (courseId: string) => {
    return progress.some((p) => p.courseId === courseId);
  };

  const isLectureCompleted = (courseId: string, lectureId: string) => {
    const p = progress.find((item) => item.courseId === courseId);
    return p ? p.completedLectureIds.includes(lectureId) : false;
  };

  const enrolledCourses = approvedCourses.filter((c) => isEnrolled(c.id));
  const myLearningTotalPages = Math.ceil(enrolledCourses.length / coursesPerPage);
  const indexOfLastEnrolled = myLearningCurrentPage * coursesPerPage;
  const indexOfFirstEnrolled = indexOfLastEnrolled - coursesPerPage;
  const currentEnrolledCourses = enrolledCourses.slice(indexOfFirstEnrolled, indexOfLastEnrolled);

  const handleOpenCourse = (course: Course) => {
    setSelectedCourse(course);
    if (course.lectures.length > 0) {
      setActiveLecture(course.lectures[0]);
    } else {
      setActiveLecture(null);
    }
    setLectureTab('info');
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !newReviewComment.trim()) return;
    onAddReview(selectedCourse.id, newReviewRating, newReviewComment);
    setNewReviewComment('');
    setNewReviewRating(5);
  };

  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !newQuestionText.trim()) return;
    onAddQuestion(selectedCourse.id, newQuestionText);
    setNewQuestionText('');
  };

  const handleSubmitAnswer = (questionId: string) => {
    const text = newAnswerText[questionId];
    if (!text || !text.trim()) return;
    onAddAnswer(questionId, text);
    setNewAnswerText({ ...newAnswerText, [questionId]: '' });
  };

  // Video URL parser to handle Youtube Embeds safely
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/embed/')) return url;
    // Fallback or regex conversion for normal youtube links
    const ytIdReg = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i;
    const match = url.match(ytIdReg);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  return (
    <div className="fade-in">
      {!selectedCourse ? (
        <>
          {/* Welcome Dashboard Banner */}
          <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(79, 70, 229, 0.15) 100%)', border: '1px solid rgba(124, 58, 237, 0.2)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-g-1)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <Sparkles size={16} />
                <span>WELCOME BACK, ALEX</span>
              </div>
              <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>Expand Your Coding Frontiers</h2>
              <p style={{ maxWidth: '600px', fontSize: '0.95rem' }}>
                Access professional developer lectures, track your completion status, and participate in active community Q&As.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div className="glass-panel" style={{ padding: '1rem 1.5rem', textAlign: 'center', background: 'rgba(25, 25, 45, 0.5)' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-g-1)' }}>{enrolledCourses.length}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginTop: '0.25rem' }}>Enrolled Courses</div>
              </div>
              <div className="glass-panel" style={{ padding: '1rem 1.5rem', textAlign: 'center', background: 'rgba(25, 25, 45, 0.5)' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-success)' }}>
                  {progress.filter(p => getCourseProgress(p.courseId) === 100).length}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginTop: '0.25rem' }}>Completed</div>
              </div>
            </div>
          </div>

          {/* Navigation Tab Bar & Search */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            {activeTab === 'explore' ? (
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flex: 1, maxWidth: '400px', minWidth: '250px' }}>
                <div style={{ position: 'relative', width: '100%' }}>
                  <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Search courses, teachers..."
                    className="form-input"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                      setMyLearningCurrentPage(1);
                    }}
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>
              </div>
            ) : (
              <div style={{ flex: 1 }} />
            )}

            <div className="tab-nav">
              <button
                className={`tab-btn ${activeTab === 'explore' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('explore');
                  setCurrentPage(1);
                  setMyLearningCurrentPage(1);
                }}
              >
                <BookOpen size={16} />
                Explore Courses
              </button>
              <button
                className={`tab-btn ${activeTab === 'my-learning' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('my-learning');
                  setCurrentPage(1);
                  setMyLearningCurrentPage(1);
                }}
              >
                <PlayCircle size={16} />
                My Learning Progress
              </button>
            </div>
          </div>

          {/* Category Filter Pills Removed */}

          {/* Course Listing */}
          <div>
            {activeTab === 'explore' ? (
              filteredCourses.length === 0 ? (
                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                  <BookOpen size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                  <h3>No Courses Found</h3>
                  <p>Try refining your search query or choosing another category.</p>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Showing {indexOfFirstCourse + 1}-{Math.min(indexOfLastCourse, filteredCourses.length)} of {filteredCourses.length} programs</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '2rem' }}>
                    {currentCourses.map((course) => {
                      const enrolled = isEnrolled(course.id);
                      return (
                        <div 
                          key={course.id} 
                          className="glass-panel" 
                          style={{ 
                            borderRadius: '12px', 
                            overflow: 'hidden', 
                            border: '1px solid rgba(139, 92, 246, 0.15)',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'transform 0.2s, box-shadow 0.2s'
                          }}
                        >
                          {/* Image header */}
                          <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden', position: 'relative' }}>
                            <img 
                              src={course.thumbnail} 
                              alt={course.title} 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                            <div style={{ 
                              position: 'absolute', 
                              top: '0.75rem', 
                              right: '0.75rem', 
                              backgroundColor: 'rgba(10, 10, 15, 0.85)', 
                              padding: '0.25rem 0.6rem', 
                              borderRadius: '6px', 
                              fontSize: '0.7rem', 
                              fontWeight: 600,
                              color: 'var(--accent-g-1)',
                              border: '1px solid rgba(139, 92, 246, 0.3)'
                            }}>
                              {course.category}
                            </div>
                          </div>

                          {/* Content body */}
                          <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, lineHeight: '1.4' }}>{course.title}</h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '2.4rem', lineHeight: '1.5' }}>
                              {course.description}
                            </p>
                            
                            {/* Instructor name */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              <span>By {course.teacherName}</span>
                            </div>

                            {/* Ratings & Enrolled count row */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: 'auto' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: 'var(--color-success)', fontWeight: 600 }}>
                                <Star size={14} fill="currentColor" />
                                {course.rating || 'New'}
                              </div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                {course.enrolledCount.toLocaleString()} enrolled
                              </div>
                            </div>

                            {/* Dual CTA buttons */}
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                              <button
                                type="button"
                                onClick={() => setSelectedExplorerCourse(course)}
                                className="btn btn-secondary"
                                style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem', borderRadius: '8px', border: '1px solid rgba(139, 92, 246, 0.3)' }}
                              >
                                Curriculum Explorer
                              </button>
                              {enrolled ? (
                                <button
                                  type="button"
                                  onClick={() => handleOpenCourse(course)}
                                  className="btn btn-primary"
                                  style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                                >
                                  <PlayCircle size={14} /> Resume
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => onEnroll(course.id)}
                                  className="btn btn-primary"
                                  style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem', borderRadius: '8px' }}
                                >
                                  Enroll Now
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '1rem',
                      marginTop: '3rem',
                      fontFamily: 'var(--font-heading)',
                      fontSize: '0.9rem',
                      userSelect: 'none'
                    }}>
                      <button
                        type="button"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: currentPage === 1 ? 'var(--text-muted)' : 'var(--accent-primary)',
                          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                          fontWeight: 600,
                          letterSpacing: '0.5px'
                        }}
                      >
                        PREVIOUS
                      </button>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => setCurrentPage(pageNum)}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              border: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              fontSize: '0.85rem',
                              fontWeight: 600,
                              backgroundColor: currentPage === pageNum ? 'var(--accent-primary)' : 'transparent',
                              color: currentPage === pageNum ? '#ffffff' : 'var(--text-secondary)',
                              transition: 'all 0.2s'
                            }}
                          >
                            {pageNum}
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: currentPage === totalPages ? 'var(--text-muted)' : 'var(--accent-primary)',
                          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                          fontWeight: 600,
                          letterSpacing: '0.5px'
                        }}
                      >
                        NEXT
                      </button>
                    </div>
                  )}
                </>
              )
            ) : (
              // Enrolled Courses Tab
              enrolledCourses.length === 0 ? (
                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                  <PlayCircle size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                  <h3>No Enrollments Yet</h3>
                  <p style={{ marginBottom: '1.5rem' }}>Browse the marketplace to enroll in lectures.</p>
                  <button onClick={() => {
                    setActiveTab('explore');
                    setCurrentPage(1);
                    setMyLearningCurrentPage(1);
                  }} className="btn btn-primary">
                    Browse Marketplace
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '2rem' }}>
                    {currentEnrolledCourses.map((course) => {
                      const completion = getCourseProgress(course.id);
                      return (
                        <div 
                          key={course.id} 
                          className="glass-panel" 
                          style={{ 
                            borderRadius: '12px', 
                            overflow: 'hidden', 
                            border: '1px solid rgba(139, 92, 246, 0.15)',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'transform 0.2s, box-shadow 0.2s'
                          }}
                        >
                          {/* Image header */}
                          <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden', position: 'relative' }}>
                            <img 
                              src={course.thumbnail} 
                              alt={course.title} 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                            <div style={{ 
                              position: 'absolute', 
                              top: '0.75rem', 
                              right: '0.75rem', 
                              backgroundColor: 'rgba(10, 10, 15, 0.85)', 
                              padding: '0.25rem 0.6rem', 
                              borderRadius: '6px', 
                              fontSize: '0.7rem', 
                              fontWeight: 600,
                              color: 'var(--accent-g-1)',
                              border: '1px solid rgba(139, 92, 246, 0.3)'
                            }}>
                              {course.category}
                            </div>
                          </div>

                          {/* Content body */}
                          <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, lineHeight: '1.4' }}>{course.title}</h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '2.4rem', lineHeight: '1.5' }}>
                              {course.description}
                            </p>
                            
                            {/* Instructor name */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              <span>By {course.teacherName}</span>
                            </div>

                            {/* Ratings & Enrolled count row */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: 'auto' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: 'var(--color-success)', fontWeight: 600 }}>
                                <Star size={14} fill="currentColor" />
                                {course.rating || 'New'}
                              </div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                {course.enrolledCount.toLocaleString()} enrolled
                              </div>
                            </div>

                            {/* Progress bar */}
                            <div style={{ marginTop: '0.5rem' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.35rem' }}>
                                <span>Course Completed</span>
                                <span>{completion}%</span>
                              </div>
                              <div style={{ height: '6px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${completion}%`, backgroundColor: completion === 100 ? 'var(--color-success)' : 'var(--accent-primary)', borderRadius: '3px' }}></div>
                              </div>
                            </div>

                            {/* Dual CTA buttons */}
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                              <button
                                type="button"
                                onClick={() => setSelectedExplorerCourse(course)}
                                className="btn btn-secondary"
                                style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem', borderRadius: '8px', border: '1px solid rgba(139, 92, 246, 0.3)' }}
                              >
                                Curriculum Explorer
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenCourse(course)}
                                className="btn btn-primary"
                                style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                              >
                                <PlayCircle size={14} /> Resume
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination Controls */}
                  {myLearningTotalPages > 1 && (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '1rem',
                      marginTop: '3rem',
                      fontFamily: 'var(--font-heading)',
                      fontSize: '0.9rem',
                      userSelect: 'none'
                    }}>
                      <button
                        type="button"
                        onClick={() => setMyLearningCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={myLearningCurrentPage === 1}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: myLearningCurrentPage === 1 ? 'var(--text-muted)' : 'var(--accent-primary)',
                          cursor: myLearningCurrentPage === 1 ? 'not-allowed' : 'pointer',
                          fontWeight: 600,
                          letterSpacing: '0.5px'
                        }}
                      >
                        PREVIOUS
                      </button>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {Array.from({ length: myLearningTotalPages }, (_, i) => i + 1).map(pageNum => (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => setMyLearningCurrentPage(pageNum)}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              border: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              fontSize: '0.85rem',
                              fontWeight: 600,
                              backgroundColor: myLearningCurrentPage === pageNum ? 'var(--accent-primary)' : 'transparent',
                              color: myLearningCurrentPage === pageNum ? '#ffffff' : 'var(--text-secondary)',
                              transition: 'all 0.2s'
                            }}
                          >
                            {pageNum}
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setMyLearningCurrentPage(prev => Math.min(prev + 1, myLearningTotalPages))}
                        disabled={myLearningCurrentPage === myLearningTotalPages}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: myLearningCurrentPage === myLearningTotalPages ? 'var(--text-muted)' : 'var(--accent-primary)',
                          cursor: myLearningCurrentPage === myLearningTotalPages ? 'not-allowed' : 'pointer',
                          fontWeight: 600,
                          letterSpacing: '0.5px'
                        }}
                      >
                        NEXT
                      </button>
                    </div>
                  )}
                </>
              )
            )}
          </div>
        </>
      ) : (
        // Course Learning Workspace (Lecture Room)
        <div className="fade-in">
          {/* Back Navigation Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <button
              onClick={() => setSelectedCourse(null)}
              className="btn btn-secondary"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
            >
              ← Back to Dashboard
            </button>
            <span style={{ color: 'var(--text-muted)' }}>/</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              {selectedCourse.title}
            </span>
          </div>

          <div className="workspace-layout">
            {/* Video Player */}
            <div className="workspace-video glass-panel" style={{ overflow: 'hidden', position: 'relative', borderRadius: '16px' }}>
                {activeLecture ? (
                  <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', backgroundColor: '#000' }}>
                    {activeLecture.videoUrl.includes('youtube.com') || activeLecture.videoUrl.includes('youtu.be') ? (
                      <iframe
                        src={getEmbedUrl(activeLecture.videoUrl)}
                        title={activeLecture.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                      ></iframe>
                    ) : (
                      <video
                        src={activeLecture.videoUrl}
                        controls
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    )}
                  </div>
                ) : (
                  <div style={{ padding: '5rem 2rem', textAlign: 'center', backgroundColor: '#000' }}>
                    <BookOpen size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                    <p>No lecture selected. Please choose a lecture from the curriculum sidebar.</p>
                  </div>
                )}
                {activeLecture && (
                  <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--accent-g-1)', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>
                        Lecture {activeLecture.order} of {selectedCourse.lectures.length}
                      </span>
                      <h2 style={{ fontSize: '1.4rem', marginTop: '0.2rem' }}>{activeLecture.title}</h2>
                    </div>
                    <button
                      onClick={() => onToggleLectureComplete(selectedCourse.id, activeLecture.id)}
                      className={`btn ${isLectureCompleted(selectedCourse.id, activeLecture.id) ? 'btn-success' : 'btn-primary'}`}
                    >
                      <CheckCircle size={16} />
                      {isLectureCompleted(selectedCourse.id, activeLecture.id) ? 'Completed' : 'Mark Complete'}
                    </button>
                  </div>
                )}
              </div>

              {/* Workspace Navigation Tabs (Info, Q&A, Reviews) */}
              <div className="workspace-tabs glass-panel" style={{ padding: '1.5rem' }}>
                <div className="tab-nav" style={{ width: 'fit-content', marginBottom: '1.5rem' }}>
                  <button className={`tab-btn ${lectureTab === 'info' ? 'active' : ''}`} onClick={() => setLectureTab('info')}>About Course</button>
                  <button className={`tab-btn ${lectureTab === 'qa' ? 'active' : ''}`} onClick={() => setLectureTab('qa')}>Q&A Forum ({questions.filter(q => q.courseId === selectedCourse.id).length})</button>
                  <button className={`tab-btn ${lectureTab === 'reviews' ? 'active' : ''}`} onClick={() => setLectureTab('reviews')}>Student Reviews ({reviews.filter(r => r.courseId === selectedCourse.id).length})</button>
                </div>

                {lectureTab === 'info' && (
                  <div className="fade-in">
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>About this Course</h3>
                    <p style={{ marginBottom: '1.5rem', fontSize: '0.95rem' }}>{selectedCourse.description}</p>
                    
                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                      <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Instructor</span>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedCourse.teacherName}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Category</span>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedCourse.category}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Rating</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                          <Star size={14} fill="#fbbf24" stroke="#fbbf24" />
                          <span>{selectedCourse.rating > 0 ? selectedCourse.rating.toFixed(1) : 'No Ratings'}</span>
                        </div>
                      </div>
                    </div>

                    {activeLecture && (
                      <div style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: '10px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                        <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem', color: 'var(--accent-g-1)' }}>Current Lecture Notes</h4>
                        <p style={{ fontSize: '0.9rem' }}>{activeLecture.description}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Q&A Forum */}
                {lectureTab === 'qa' && (
                  <div className="fade-in">
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Course Questions & Answers</h3>

                    {/* Ask a new Question Form */}
                    <form onSubmit={handleSubmitQuestion} style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
                      <input
                        type="text"
                        placeholder="Ask a public question about this course..."
                        className="form-input"
                        value={newQuestionText}
                        onChange={(e) => setNewQuestionText(e.target.value)}
                        required
                      />
                      <button type="submit" className="btn btn-primary" style={{ padding: '0 1.5rem' }}>
                        <Send size={16} />
                      </button>
                    </form>

                    {/* Question List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      {questions.filter((q) => q.courseId === selectedCourse.id).length === 0 ? (
                        <p style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>No questions asked yet. Be the first to ask!</p>
                      ) : (
                        questions
                          .filter((q) => q.courseId === selectedCourse.id)
                          .map((q) => (
                            <div key={q.id} className="glass-panel" style={{ padding: '1.25rem', backgroundColor: 'var(--bg-secondary)' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--accent-g-1)' }}>{q.userName}</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{q.date}</span>
                              </div>
                              <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>{q.text}</p>

                              {/* Answers */}
                              <div style={{ borderLeft: '2px solid var(--border-color)', paddingLeft: '1rem', marginLeft: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {q.answers.map((ans) => (
                                  <div key={ans.id} style={{ backgroundColor: 'rgba(25,25,35,0.4)', padding: '0.75rem', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                                      <span style={{ fontWeight: 600, color: 'var(--color-success)' }}>{ans.userName}</span>
                                      <span style={{ color: 'var(--text-muted)' }}>{ans.date}</span>
                                    </div>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{ans.text}</p>
                                  </div>
                                ))}

                                {/* Reply Input Box */}
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                  <input
                                    type="text"
                                    placeholder="Write a response..."
                                    className="form-input"
                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                                    value={newAnswerText[q.id] || ''}
                                    onChange={(e) => setNewAnswerText({ ...newAnswerText, [q.id]: e.target.value })}
                                  />
                                  <button
                                    onClick={() => handleSubmitAnswer(q.id)}
                                    className="btn btn-secondary"
                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                                  >
                                    Reply
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                )}

                {/* Reviews Section */}
                {lectureTab === 'reviews' && (
                  <div className="fade-in">
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Course Reviews</h3>

                    {/* Add Review Form */}
                    <form onSubmit={handleSubmitReview} className="glass-panel" style={{ padding: '1.25rem', marginBottom: '2rem', backgroundColor: 'var(--bg-secondary)' }}>
                      <h4 style={{ fontSize: '0.95rem', marginBottom: '1rem' }}>Write a Review</h4>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Your Rating:</span>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setNewReviewRating(star)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                              <Star
                                size={20}
                                fill={star <= newReviewRating ? '#fbbf24' : 'none'}
                                stroke="#fbbf24"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="form-group">
                        <textarea
                          placeholder="Tell us what you think of this course..."
                          className="form-textarea"
                          value={newReviewComment}
                          onChange={(e) => setNewReviewComment(e.target.value)}
                          required
                        ></textarea>
                      </div>
                      <button type="submit" className="btn btn-primary">
                        Submit Review
                      </button>
                    </form>

                    {/* Reviews List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {reviews.filter((r) => r.courseId === selectedCourse.id).length === 0 ? (
                        <p style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>No reviews yet. Be the first to rate this course!</p>
                      ) : (
                        reviews
                          .filter((r) => r.courseId === selectedCourse.id)
                          .map((r) => (
                            <div key={r.id} className="glass-panel" style={{ padding: '1.25rem' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <div>
                                  <span style={{ fontWeight: 600, fontSize: '0.9rem', marginRight: '0.75rem' }}>{r.userName}</span>
                                  <span style={{ display: 'inline-flex', gap: '2px', color: '#fbbf24' }}>
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <Star
                                        key={i}
                                        size={12}
                                        fill={i < r.rating ? '#fbbf24' : 'none'}
                                        stroke="#fbbf24"
                                      />
                                    ))}
                                  </span>
                                </div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.date}</span>
                              </div>
                              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{r.comment}</p>
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                )}
              </div>

            {/* Right Side: Sidebar - Curriculum Lectures */}
            <div className="workspace-sidebar glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem' }}>Course Curriculum</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {selectedCourse.lectures.length} {selectedCourse.lectures.length === 1 ? 'lecture' : 'lectures'}
                </span>
              </div>

              {/* Progress bar */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 500, marginBottom: '0.25rem' }}>
                  <span>Completed</span>
                  <span>{getCourseProgress(selectedCourse.id)}%</span>
                </div>
                <div style={{ height: '4px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${getCourseProgress(selectedCourse.id)}%`, backgroundColor: 'var(--color-success)', borderRadius: '2px' }}></div>
                </div>
              </div>

              {/* Lecture list item stack */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {selectedCourse.lectures.length === 0 ? (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0' }}>No lectures uploaded yet.</p>
                ) : (
                  selectedCourse.lectures
                    .sort((a, b) => a.order - b.order)
                    .map((lec) => {
                      const isActive = activeLecture?.id === lec.id;
                      const isDone = isLectureCompleted(selectedCourse.id, lec.id);
                      return (
                        <button
                          key={lec.id}
                          onClick={() => setActiveLecture(lec)}
                          className="glass-panel"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '0.75rem',
                            padding: '0.75rem 1rem',
                            borderRadius: '10px',
                            textAlign: 'left',
                            background: isActive ? 'rgba(124, 58, 237, 0.15)' : 'rgba(20,20,30,0.5)',
                            borderColor: isActive ? 'var(--accent-primary)' : 'var(--border-color)',
                            cursor: 'pointer',
                            width: '100%',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.15rem' }}>
                              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: isActive ? 'var(--accent-g-1)' : 'var(--text-muted)' }}>
                                LECTURE {lec.order}
                              </span>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>• {lec.duration}</span>
                            </div>
                            <h4 style={{
                              fontSize: '0.85rem',
                              fontWeight: 500,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)'
                            }}>
                              {lec.title}
                            </h4>
                          </div>

                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleLectureComplete(selectedCourse.id, lec.id);
                            }}
                            style={{
                              color: isDone ? 'var(--color-success)' : 'var(--text-muted)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <CheckCircle size={16} fill={isDone ? 'var(--color-success-bg)' : 'none'} />
                          </div>
                        </button>
                      );
                    })
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {selectedExplorerCourse && createPortal(
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(5, 5, 10, 0.85)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(8px)',
          padding: '1rem'
        }} className="fade-in">
          <div className="glass-panel" style={{
            padding: '2.5rem',
            width: '95%',
            maxWidth: '900px',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            boxShadow: 'var(--shadow-lg), var(--shadow-neon)',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            {/* Close button */}
            <button
              onClick={() => setSelectedExplorerCourse(null)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            {/* Modal Header */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ 
                  backgroundColor: 'rgba(124, 58, 237, 0.15)', 
                  padding: '0.2rem 0.5rem', 
                  borderRadius: '4px', 
                  fontSize: '0.75rem', 
                  fontWeight: 600,
                  color: 'var(--accent-g-1)'
                }}>
                  {selectedExplorerCourse.category}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--color-success)', fontWeight: 600 }}>
                  <Star size={12} fill="currentColor" /> {selectedExplorerCourse.rating}
                </span>
              </div>
              <h3 style={{ fontSize: '1.75rem', margin: 0 }}>{selectedExplorerCourse.title}</h3>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Created by {selectedExplorerCourse.teacherName}</span>
            </div>

            {/* Modal Layout Body */}
            <div className="grid-2-col" style={{ gap: '2rem', alignItems: 'start' }}>
              {/* Left Column: Description and Curriculum */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>About this Course</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>{selectedExplorerCourse.description}</p>
                </div>

                <div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <BookOpen size={18} style={{ color: 'var(--accent-g-1)' }} />
                    Curriculum Syllabus ({selectedExplorerCourse.lectures.length} Lectures)
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {selectedExplorerCourse.lectures.map((lecture, idx) => (
                      <div 
                        key={lecture.id}
                        className="glass-panel"
                        style={{ 
                          padding: '1rem', 
                          borderRadius: '8px', 
                          border: '1px solid rgba(255,255,255,0.05)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          backgroundColor: 'rgba(255,255,255,0.01)'
                        }}
                      >
                        <div style={{ 
                          width: '28px', 
                          height: '28px', 
                          borderRadius: '50%', 
                          backgroundColor: 'rgba(124, 58, 237, 0.1)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: 'var(--accent-g-1)',
                          flexShrink: 0
                        }}>
                          {idx + 1}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{lecture.title}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lecture.description}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                          <Clock size={12} />
                          {lecture.duration}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: CTA card & Quick Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '1rem' }}>
                {/* Course Quick Stats Card */}
                <div className="glass-panel" style={{ 
                  borderRadius: '12px', 
                  overflow: 'hidden', 
                  border: '1px solid rgba(139, 92, 246, 0.25)',
                  backgroundColor: 'rgba(10, 10, 15, 0.5)'
                }}>
                  <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
                    <img 
                      src={selectedExplorerCourse.thumbnail} 
                      alt={selectedExplorerCourse.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>

                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Enrolled Students</span>
                        <span style={{ fontWeight: 600 }}>{selectedExplorerCourse.enrolledCount.toLocaleString()}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Syllabus lectures</span>
                        <span style={{ fontWeight: 600 }}>{selectedExplorerCourse.lectures.length} lessons</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Access Validity</span>
                        <span style={{ fontWeight: 600, color: 'var(--color-success)' }}>Lifetime Access</span>
                      </div>
                    </div>

                    {/* Enroll/Resume CTA */}
                    {progress.some((p) => p.courseId === selectedExplorerCourse.id) ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedExplorerCourse(null);
                          handleOpenCourse(selectedExplorerCourse);
                        }}
                        className="btn btn-secondary"
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                      >
                        <PlayCircle size={16} /> Continue Learning
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          onEnroll(selectedExplorerCourse.id);
                          setSelectedExplorerCourse(null);
                        }}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: 'var(--shadow-neon)' }}
                      >
                        Enroll in Course <ArrowRight size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
