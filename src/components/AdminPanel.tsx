import React, { useState } from 'react';
import type { Course, PlatformStats } from '../types';
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  Users,
  Video,
  Award,
  DollarSign
} from 'lucide-react';

interface AdminPanelProps {
  courses: Course[];
  stats: PlatformStats;
  onApproveCourse: (courseId: string) => void;
  onRejectCourse: (courseId: string, feedback: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  courses,
  stats,
  onApproveCourse,
  onRejectCourse,
}) => {
  const [rejectingCourseId, setRejectingCourseId] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'moderation' | 'users'>('moderation');

  const pendingCourses = courses.filter((c) => c.status === 'pending');

  const handleOpenRejectModal = (courseId: string) => {
    setRejectingCourseId(courseId);
    setFeedbackText('');
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingCourseId || !feedbackText.trim()) return;
    onRejectCourse(rejectingCourseId, feedbackText);
    setRejectingCourseId(null);
    setFeedbackText('');
  };

  // Mock users database
  const mockUsers = [
    { name: 'Dr. Angela Yu', email: 'angela@edutube.com', role: 'Teacher', count: 3, status: 'Active' },
    { name: 'Sarah Jenkins', email: 'sarah.j@edutube.com', role: 'Teacher', count: 1, status: 'Active' },
    { name: 'David Miller', email: 'd.miller@edutube.com', role: 'Teacher', count: 1, status: 'Active' },
    { name: 'Alex Johnson', email: 'alex.j@gmail.com', role: 'Student', count: 2, status: 'Active' },
    { name: 'Emma Watson', email: 'emma@watson.co', role: 'Student', count: 1, status: 'Active' },
    { name: 'Ryan Reynolds', email: 'ryan@deadpool.com', role: 'Student', count: 0, status: 'Inactive' },
  ];

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.85rem' }}>Administrator Portal</h2>
        <p>Review uploaded courses, monitor active users, and manage platform safety metrics.</p>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-grid">
        <div className="glass-panel stats-card">
          <div className="stats-info">
            <span>TOTAL STUDENTS</span>
            <h3>{stats.totalStudents}</h3>
          </div>
          <div className="stats-icon"><Users size={20} /></div>
        </div>
        <div className="glass-panel stats-card">
          <div className="stats-info">
            <span>TOTAL TEACHERS</span>
            <h3>{stats.totalTeachers}</h3>
          </div>
          <div className="stats-icon" style={{ color: 'var(--accent-g-1)' }}><Award size={20} /></div>
        </div>
        <div className="glass-panel stats-card">
          <div className="stats-info">
            <span>TOTAL COURSES</span>
            <h3>{courses.length}</h3>
          </div>
          <div className="stats-icon" style={{ color: 'var(--accent-g-2)' }}><Video size={20} /></div>
        </div>
        <div className="glass-panel stats-card">
          <div className="stats-info">
            <span>PLATFORM REVENUE</span>
            <h3>${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
          </div>
          <div className="stats-icon" style={{ color: 'var(--color-success)', backgroundColor: 'var(--color-success-bg)' }}><DollarSign size={20} /></div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="tab-nav" style={{ width: 'fit-content', marginBottom: '2rem' }}>
        <button
          className={`tab-btn ${activeSubTab === 'moderation' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('moderation')}
        >
          <ShieldAlert size={16} />
          Course Review Queue ({pendingCourses.length})
        </button>
        <button
          className={`tab-btn ${activeSubTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('users')}
        >
          <Users size={16} />
          Account Management
        </button>
      </div>

      {/* Moderation Queue Sub-view */}
      {activeSubTab === 'moderation' && (
        <div className="fade-in">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Pending Course Approvals</h3>

          {pendingCourses.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3.5rem', textAlign: 'center' }}>
              <CheckCircle size={48} style={{ color: 'var(--color-success)', marginBottom: '1rem' }} />
              <h3>Queue Cleared!</h3>
              <p>All submitted teacher courses have been moderated.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {pendingCourses.map((course) => (
                <div key={course.id} className="glass-panel" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        style={{ width: '120px', height: '75px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                      <div>
                        <span className="badge badge-pending" style={{ fontSize: '0.65rem', marginBottom: '0.25rem' }}>PENDING REVIEW</span>
                        <h4 style={{ fontSize: '1.15rem' }}>{course.title}</h4>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Instructor: <strong>{course.teacherName}</strong></span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <button onClick={() => onApproveCourse(course.id)} className="btn btn-success">
                        <CheckCircle size={15} /> Approve
                      </button>
                      <button onClick={() => handleOpenRejectModal(course.id)} className="btn btn-danger">
                        <XCircle size={15} /> Reject
                      </button>
                    </div>
                  </div>

                  <div>
                    <h5 style={{ fontSize: '0.9rem', color: 'var(--accent-g-1)', marginBottom: '0.25rem' }}>Course Summary</h5>
                    <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>{course.description}</p>

                    <h5 style={{ fontSize: '0.9rem', color: 'var(--accent-g-1)', marginBottom: '0.5rem' }}>Syllabus Structure ({course.lectures.length} Lectures)</h5>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
                      {course.lectures.map((lec) => (
                        <div key={lec.id} className="glass-panel" style={{ padding: '0.75rem', backgroundColor: 'rgba(25, 25, 45, 0.4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {lec.order}. {lec.title}
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Duration: {lec.duration}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* User Accounts list sub-view */}
      {activeSubTab === 'users' && (
        <div className="fade-in">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Registered Platform Profiles</h3>
          <div className="glass-panel" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '1rem' }}>Name</th>
                  <th style={{ padding: '1rem' }}>Email Address</th>
                  <th style={{ padding: '1rem' }}>Account Role</th>
                  <th style={{ padding: '1rem' }}>Uploaded/Enrolled Courses</th>
                  <th style={{ padding: '1rem' }}>Account Status</th>
                </tr>
              </thead>
              <tbody>
                {mockUsers.map((user, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(36, 36, 58, 0.5)' }}>
                    <td style={{ padding: '1rem', fontWeight: 600 }}>{user.name}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{user.email}</td>
                    <td style={{ padding: '1rem' }}>
                      <span className={`badge ${user.role === 'Teacher' ? 'badge-primary' : 'badge-success'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 600 }}>{user.count}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.8rem',
                        color: user.status === 'Active' ? 'var(--color-success)' : 'var(--text-muted)'
                      }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: user.status === 'Active' ? 'var(--color-success)' : 'var(--text-muted)' }}></span>
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reject Modal Backdrop & Form */}
      {rejectingCourseId && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.75)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }}>
          <div className="glass-panel" style={{ padding: '2rem', width: '90%', maxWidth: '500px', backgroundColor: 'var(--bg-secondary)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-danger)' }}>
              <ShieldAlert size={20} />
              Reject Course Submission
            </h3>
            
            <form onSubmit={handleConfirmReject}>
              <div className="form-group">
                <label className="form-label">Provide Revision Feedback for the Teacher</label>
                <textarea
                  className="form-textarea"
                  placeholder="Explain why this course is rejected and how the teacher can fix it..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  required
                ></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setRejectingCourseId(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-danger">
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
