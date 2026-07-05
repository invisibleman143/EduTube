import React from 'react';
import { ShieldCheck, GraduationCap, Video, Users, LogOut, Sun, Moon } from 'lucide-react';

interface RoleSwitcherProps {
  currentRole: 'student' | 'teacher' | 'admin';
  onChangeRole?: (role: 'student' | 'teacher' | 'admin') => void;
  onLogout?: () => void;
  userEmail?: string;
  theme?: 'dark' | 'light';
  toggleTheme?: () => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({
  currentRole,
  onLogout,
  userEmail,
  theme,
  toggleTheme,
}) => {
  const roles = [
    {
      id: 'student' as const,
      label: 'Student Panel',
      icon: GraduationCap,
      description: 'Watch courses & track progress',
      color: 'from-blue-500 to-indigo-500',
    },
    {
      id: 'teacher' as const,
      label: 'Teacher Studio',
      icon: Video,
      description: 'Upload lectures & design curriculum',
      color: 'from-purple-500 to-violet-500',
    },
    {
      id: 'admin' as const,
      label: 'Admin Panel',
      icon: ShieldCheck,
      description: 'Moderate content & view analytics',
      color: 'from-emerald-500 to-teal-500',
    },
  ];

  const getPersonaName = () => {
    switch (currentRole) {
      case 'student':
        return 'Alex Johnson (Student)';
      case 'teacher':
        return 'Dr. Angela Yu (Teacher)';
      case 'admin':
        return 'Admin Portal (SuperUser)';
    }
  };

  return (
    <header className="app-header glass-panel">
      <div className="header-inner">
        {/* Logo Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
            padding: '0.6rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-neon)'
          }}>
            <Video size={22} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', margin: 0, padding: 0, fontFamily: 'var(--font-heading)', fontWeight: 800, background: 'linear-gradient(90deg, #f3f4f6 0%, #9ca3af 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              EduTube
            </h1>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Multi-Role Learning Hub
            </span>
          </div>
        </div>

        {/* Active Workspace Label */}
        {(() => {
          const activeRoleInfo = roles.find((r) => r.id === currentRole);
          if (!activeRoleInfo) return null;
          const Icon = activeRoleInfo.icon;
          return (
            <div
              className="glass-panel"
              style={{
                padding: '0.6rem 1.25rem',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                fontWeight: 600,
                fontSize: '0.85rem',
                border: '1px solid var(--border-color)',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                color: 'var(--text-primary)'
              }}
            >
              <Icon size={16} style={{ color: 'var(--accent-g-1)' }} />
              <span>{activeRoleInfo.label}</span>
            </div>
          );
        })()}

        {/* Active Persona Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="header-persona-text">
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{getPersonaName()}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{userEmail || 'demo@edutube.com'}</div>
          </div>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-g-1)'
          }}>
            <Users size={18} />
          </div>
          {toggleTheme && (
            <button
              onClick={toggleTheme}
              className="btn btn-secondary btn-icon-only theme-toggle-btn"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              style={{ width: '40px', height: '40px', borderRadius: '50%' }}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          )}
          {onLogout && (
            <button
              onClick={onLogout}
              className="btn btn-secondary btn-icon-only"
              title="Log Out"
              style={{ width: '40px', height: '40px', borderRadius: '50%' }}
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
