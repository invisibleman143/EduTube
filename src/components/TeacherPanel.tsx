import React, { useState } from 'react';
import type { Course, Lecture } from '../types';
import {
  PlusCircle,
  Users,
  Star,
  DollarSign,
  Video,
  Trash2,
  AlertTriangle,
  FileEdit
} from 'lucide-react';

interface TeacherPanelProps {
  courses: Course[];
  teacherId: string;
  onAddCourse: (course: Omit<Course, 'id' | 'teacherId' | 'teacherName' | 'rating' | 'enrolledCount'>) => void;
  onUpdateCourse: (courseId: string, updatedFields: Partial<Course>) => void;
  onDeleteCourse: (courseId: string) => void;
}

export const TeacherPanel: React.FC<TeacherPanelProps> = ({
  courses,
  teacherId,
  onAddCourse,
  onUpdateCourse,
  onDeleteCourse,
}) => {
  const [view, setView] = useState<'dashboard' | 'create' | 'edit'>('dashboard');
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Forms states
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseCategory, setCourseCategory] = useState('Development');
  const [courseThumbnail, setCourseThumbnail] = useState('');

  // Lectures Form State
  const [lectures, setLectures] = useState<Omit<Lecture, 'id'>[]>([]);
  const [newLecTitle, setNewLecTitle] = useState('');
  const [newLecVideoUrl, setNewLecVideoUrl] = useState('');
  const [newLecDuration, setNewLecDuration] = useState('');
  const [newLecDesc, setNewLecDesc] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');
  const [selectedFileName, setSelectedFileName] = useState('');

  const teacherCourses = courses.filter((c) => c.teacherId === teacherId);

  // Statistics calculations
  const totalStudents = teacherCourses.reduce((acc, c) => acc + c.enrolledCount, 0);
  const liveCourses = teacherCourses.filter((c) => c.status === 'approved').length;
  const pendingCourses = teacherCourses.filter((c) => c.status === 'pending').length;
  const avgRating = teacherCourses.length > 0
    ? teacherCourses.reduce((acc, c) => acc + c.rating, 0) / teacherCourses.length
    : 0;
  const mockRevenue = totalStudents * 49.99; // Mock price of $49.99 per course

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const blobUrl = URL.createObjectURL(file);
      setNewLecVideoUrl(blobUrl);
      setSelectedFileName(file.name);
      
      const tempVideo = document.createElement('video');
      tempVideo.src = blobUrl;
      tempVideo.onloadedmetadata = () => {
        const minutes = Math.floor(tempVideo.duration / 60);
        const seconds = Math.floor(tempVideo.duration % 60);
        const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        setNewLecDuration(formattedDuration);
      };
    }
  };

  const handleAddLecture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLecTitle || !newLecVideoUrl || !newLecDuration) return;

    setLectures([
      ...lectures,
      {
        title: newLecTitle,
        videoUrl: newLecVideoUrl,
        duration: newLecDuration,
        description: newLecDesc,
        order: lectures.length + 1
      }
    ]);

    // reset fields
    setNewLecTitle('');
    setNewLecVideoUrl('');
    setNewLecDuration('');
    setNewLecDesc('');
    setSelectedFileName('');
    setUploadMethod('url');
  };

  const handleRemoveLecture = (index: number) => {
    const updated = lectures.filter((_, i) => i !== index).map((lec, i) => ({
      ...lec,
      order: i + 1
    }));
    setLectures(updated);
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle || !courseDescription || !courseThumbnail) return;

    // Compile lectures with mock IDs
    const finalLectures: Lecture[] = lectures.map((lec, idx) => ({
      ...lec,
      id: `lec-${Date.now()}-${idx}`
    }));

    onAddCourse({
      title: courseTitle,
      description: courseDescription,
      category: courseCategory,
      thumbnail: courseThumbnail,
      status: 'pending',
      lectures: finalLectures
    });

    // Reset all form states
    setCourseTitle('');
    setCourseDescription('');
    setCourseThumbnail('');
    setLectures([]);
    setView('dashboard');
  };

  const handleStartEdit = (course: Course) => {
    setEditingCourse(course);
    setCourseTitle(course.title);
    setCourseDescription(course.description);
    setCourseCategory(course.category);
    setCourseThumbnail(course.thumbnail);
    setLectures(course.lectures);
    setView('edit');
  };

  const handleUpdateCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse || !courseTitle || !courseDescription || !courseThumbnail) return;

    const finalLectures: Lecture[] = lectures.map((lec, idx) => ({
      ...lec,
      id: (lec as Partial<Lecture>).id || `lec-${Date.now()}-${idx}`
    }));

    onUpdateCourse(editingCourse.id, {
      title: courseTitle,
      description: courseDescription,
      category: courseCategory,
      thumbnail: courseThumbnail,
      lectures: finalLectures,
      status: 'pending' // Re-submit for review on modification
    });

    setEditingCourse(null);
    setView('dashboard');
  };

  return (
    <div className="fade-in">
      {view === 'dashboard' && (
        <>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.85rem' }}>Teacher Management Studio</h2>
              <p>Upload curriculum lectures, monitor students engagement, and build analytics.</p>
            </div>
            <button
              onClick={() => {
                setView('create');
                setCourseTitle('');
                setCourseDescription('');
                setCourseThumbnail('');
                setLectures([]);
              }}
              className="btn btn-primary"
            >
              <PlusCircle size={18} />
              Create New Course
            </button>
          </div>

          {/* Stats Row */}
          <div className="dashboard-grid">
            <div className="glass-panel stats-card">
              <div className="stats-info">
                <span>TOTAL STUDENTS</span>
                <h3>{totalStudents}</h3>
              </div>
              <div className="stats-icon"><Users size={20} /></div>
            </div>
            <div className="glass-panel stats-card">
              <div className="stats-info">
                <span>AVERAGE RATING</span>
                <h3>{avgRating > 0 ? avgRating.toFixed(1) : 'N/A'}</h3>
              </div>
              <div className="stats-icon" style={{ color: '#fbbf24', backgroundColor: 'rgba(251, 191, 36, 0.1)' }}>
                <Star size={20} fill="#fbbf24" stroke="#fbbf24" />
              </div>
            </div>
            <div className="glass-panel stats-card">
              <div className="stats-info">
                <span>TOTAL COURSES</span>
                <h3>{teacherCourses.length}</h3>
              </div>
              <div className="stats-icon" style={{ color: 'var(--accent-g-1)' }}><Video size={20} /></div>
            </div>
            <div className="glass-panel stats-card">
              <div className="stats-info">
                <span>EST. EARNINGS</span>
                <h3>${mockRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
              </div>
              <div className="stats-icon" style={{ color: 'var(--color-success)', backgroundColor: 'var(--color-success-bg)' }}><DollarSign size={20} /></div>
            </div>
          </div>

          {/* Live vs Pending status indicator block */}
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <div className="glass-panel" style={{ padding: '1.25rem', flex: 1, minWidth: '220px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--color-success)' }}></div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Live on Storefront</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{liveCourses} approved</div>
              </div>
            </div>
            <div className="glass-panel" style={{ padding: '1.25rem', flex: 1, minWidth: '220px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--color-warning)' }}></div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Pending Verification</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{pendingCourses} items</div>
              </div>
            </div>
          </div>

          {/* List of Courses */}
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Uploaded Course Material</h3>
          {teacherCourses.length === 0 ? (
            <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
              <Video size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
              <h3>No Courses Uploaded</h3>
              <p style={{ marginBottom: '1.5rem' }}>Start sharing your knowledge by creating your first video course.</p>
              <button onClick={() => setView('create')} className="btn btn-primary">
                Create Course Now
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {teacherCourses.map((course) => (
                <div key={course.id} className="glass-panel course-list-card" style={{ display: 'flex', overflow: 'hidden', flexWrap: 'wrap', gap: '1.5rem', padding: '1rem' }}>
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    style={{ width: '180px', height: '110px', objectFit: 'cover', borderRadius: '10px' }}
                  />
                  <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>{course.category}</span>
                      
                      {course.status === 'approved' && <span className="badge badge-success">Approved (Live)</span>}
                      {course.status === 'pending' && <span className="badge badge-pending">Pending Review</span>}
                      {course.status === 'rejected' && <span className="badge badge-danger">Rejected</span>}
                    </div>

                    <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{course.title}</h4>
                    <p style={{ fontSize: '0.85rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{course.description}</p>
                    
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <span>Lectures: <strong>{course.lectures.length}</strong></span>
                      <span>Enrolled: <strong>{course.enrolledCount} students</strong></span>
                    </div>

                    {course.status === 'rejected' && course.feedback && (
                      <div style={{ marginTop: '0.75rem', padding: '0.75rem', borderRadius: '8px', backgroundColor: 'var(--color-danger-bg)', border: '1px solid rgba(239, 68, 68, 0.2)', fontSize: '0.85rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-danger)', fontWeight: 600, marginBottom: '0.15rem' }}>
                          <AlertTriangle size={14} />
                          <span>Admin Feedback:</span>
                        </div>
                        <p style={{ color: 'var(--text-primary)' }}>{course.feedback}</p>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.5rem' }}>
                    <button onClick={() => handleStartEdit(course)} className="btn btn-secondary" style={{ width: '120px' }}>
                      <FileEdit size={14} /> Edit
                    </button>
                    <button onClick={() => onDeleteCourse(course.id)} className="btn btn-danger" style={{ width: '120px' }}>
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Create / Edit Form Views */}
      {(view === 'create' || view === 'edit') && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>{view === 'create' ? 'Create New Video Course' : 'Edit Course Details'}</h2>

          <form onSubmit={view === 'create' ? handleCreateCourse : handleUpdateCourseSubmit}>
            <div className="grid-2-col" style={{ marginBottom: '1.5rem' }}>
              <div>
                <div className="form-group">
                  <label className="form-label">Course Title</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Master React and Tailwind CSS"
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Course Description</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Provide a comprehensive syllabus overview..."
                    value={courseDescription}
                    onChange={(e) => setCourseDescription(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="grid-2-col" style={{ gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={courseCategory}
                      onChange={(e) => setCourseCategory(e.target.value)}
                    >
                      <option value="Development">Development</option>
                      <option value="Design">Design</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Business">Business</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Thumbnail URL</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="https://images.unsplash.com/... or a local file link"
                      value={courseThumbnail}
                      onChange={(e) => setCourseThumbnail(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Course Lectures Builder */}
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem', color: 'var(--accent-g-1)' }}>
                  Add Lectures to Curriculum
                </h3>

                {/* Add Lecture Mini-Form */}
                <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1rem', backgroundColor: 'rgba(20,20,30,0.5)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <input
                        type="text"
                        placeholder="Lecture Title"
                        className="form-input"
                        value={newLecTitle}
                        onChange={(e) => setNewLecTitle(e.target.value)}
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <input
                        type="text"
                        placeholder="Duration (e.g. 15:40)"
                        className="form-input"
                        value={newLecDuration}
                        onChange={(e) => setNewLecDuration(e.target.value)}
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>
                  
                  {/* Upload Method Switcher */}
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <button
                      type="button"
                      className={`btn ${uploadMethod === 'url' ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ flex: 1, padding: '0.35rem', fontSize: '0.75rem', minHeight: 'auto', background: uploadMethod === 'url' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)' }}
                      onClick={() => {
                        setUploadMethod('url');
                        setNewLecVideoUrl('');
                        setSelectedFileName('');
                      }}
                    >
                      YouTube / Link URL
                    </button>
                    <button
                      type="button"
                      className={`btn ${uploadMethod === 'file' ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ flex: 1, padding: '0.35rem', fontSize: '0.75rem', minHeight: 'auto', background: uploadMethod === 'file' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)' }}
                      onClick={() => {
                        setUploadMethod('file');
                        setNewLecVideoUrl('');
                        setSelectedFileName('');
                      }}
                    >
                      Direct Video Upload
                    </button>
                  </div>

                  {uploadMethod === 'url' ? (
                    <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                      <input
                        type="text"
                        placeholder="YouTube Embed URL (e.g. https://www.youtube.com/embed/...)"
                        className="form-input"
                        value={newLecVideoUrl}
                        onChange={(e) => setNewLecVideoUrl(e.target.value)}
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                      />
                    </div>
                  ) : (
                    <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                      <label 
                        className="btn btn-secondary" 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          gap: '0.5rem', 
                          cursor: 'pointer',
                          padding: '0.5rem 0.75rem', 
                          fontSize: '0.85rem',
                          borderStyle: 'dashed',
                          borderWidth: '2px',
                          borderColor: 'var(--accent-primary)',
                          background: 'rgba(124, 58, 237, 0.05)',
                          width: '100%'
                        }}
                      >
                        Choose Video File
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleFileChange}
                          style={{ display: 'none' }}
                        />
                      </label>
                      {selectedFileName && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--accent-g-1)', marginTop: '0.35rem', textAlign: 'center', wordBreak: 'break-all' }}>
                          Selected: {selectedFileName}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                    <input
                      type="text"
                      placeholder="Short lecture notes / description"
                      className="form-input"
                      value={newLecDesc}
                      onChange={(e) => setNewLecDesc(e.target.value)}
                      style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                    />
                  </div>
                  <button type="button" onClick={handleAddLecture} className="btn btn-secondary" style={{ width: '100%', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                    <PlusCircle size={14} /> Add Lecture to Stack
                  </button>
                </div>

                {/* Lectures Stack Preview */}
                <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Curriculum Lectures Preview ({lectures.length})</h4>
                <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {lectures.length === 0 ? (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>No lectures added. Add at least one lecture.</p>
                  ) : (
                    lectures.map((lec, idx) => (
                      <div key={idx} className="glass-panel" style={{ padding: '0.5rem 0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(25,25,35,0.4)', borderRadius: '8px' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>LECTURE {idx + 1} ({lec.duration})</div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lec.title}</div>
                        </div>
                        <button type="button" onClick={() => handleRemoveLecture(idx)} style={{ color: 'var(--color-danger)', border: 'none', background: 'none', cursor: 'pointer' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
              <button
                type="button"
                onClick={() => setView('dashboard')}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={lectures.length === 0}
                className="btn btn-primary"
                style={{ opacity: lectures.length === 0 ? 0.6 : 1 }}
              >
                {view === 'create' ? 'Submit Course for Review' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
