import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Play, 
  X, 
  Menu, 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  Mail, 
  GraduationCap, 
  Info, 
  MessageSquare, 
  Phone, 
  MapPin, 
  Search, 
  BookOpen, 
  Star, 
  Clock, 
  Users,
  Sun,
  Moon
} from 'lucide-react';
import type { Course } from '../types';

interface LandingPageProps {
  onLogin: (role: 'student' | 'teacher' | 'admin', email: string) => void;
  courses: Course[];
  theme?: 'dark' | 'light';
  toggleTheme?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin, courses, theme, toggleTheme }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | 'admin'>('student');
  const [error, setError] = useState('');

  // Modals & Navigation States
  const [activeModal, setActiveModal] = useState<'about' | 'contact' | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedExplorerCourse, setSelectedExplorerCourse] = useState<Course | null>(null);
  const [authPromptMessage, setAuthPromptMessage] = useState('');
  const [activeNav, setActiveNav] = useState<'home' | 'features' | 'courses' | 'about' | 'contact'>('home');

  // Disable body scroll when any modal is open
  useEffect(() => {
    if (authModalOpen || activeModal || selectedExplorerCourse) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [authModalOpen, activeModal, selectedExplorerCourse]);

  const handleSetActiveModal = (modal: 'about' | 'contact' | null) => {
    setActiveModal(modal);
    if (modal) {
      setActiveNav(modal);
    } else {
      setActiveNav('home');
    }
  };

  // Contact Modal Form States
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Authentication Mode & Form States
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [signupName, setSignupName] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Course Explorer Filtering & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

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



  const approvedCourses = courses.filter(c => c.status === 'approved');

  // Filtered courses list
  const filteredCourses = approvedCourses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.teacherName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (authMode === 'login') {
      if (!email || !password) {
        setError('Please enter both email and password.');
        return;
      }
      if (password.length < 4) {
        setError('Password must be at least 4 characters.');
        return;
      }
      onLogin(selectedRole, email);
    } else if (authMode === 'signup') {
      if (!signupName || !email || !password || !signupConfirmPassword) {
        setError('Please fill in all fields.');
        return;
      }
      if (password.length < 4) {
        setError('Password must be at least 4 characters.');
        return;
      }
      if (password !== signupConfirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      setSuccessMessage('Registration successful! You can now log in.');
      setAuthMode('login');
      setSignupName('');
      setSignupConfirmPassword('');
      setPassword('');
    } else if (authMode === 'forgot') {
      if (!email) {
        setError('Please enter your email address.');
        return;
      }
      setSuccessMessage('Recovery instructions sent! Check your inbox.');
      setAuthMode('login');
    }
  };

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      
      {/* Landing Header */}
      <header className="landing-header">
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={() => scrollToSection('home')}>
          <div style={{
            background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
            padding: '0.4rem',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-neon)'
          }}>
            <Play size={16} color="white" fill="white" />
          </div>
          <span style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', fontWeight: 800, background: 'linear-gradient(90deg, #f3f4f6 0%, #9ca3af 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            EduTube
          </span>
        </div>

        {/* Desktop Navigation Links & CTA */}
        <div className="desktop-nav-group">
          <nav className="landing-nav" style={{ marginRight: '1.5rem' }}>
            <button
              type="button"
              onClick={() => {
                handleSetActiveModal(null);
                setContactSubmitted(false);
                scrollToSection('home');
                setActiveNav('home');
              }}
              className={`nav-link ${activeNav === 'home' ? 'active' : ''}`}
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => {
                handleSetActiveModal(null);
                scrollToSection('features');
                setActiveNav('features');
              }}
              className={`nav-link ${activeNav === 'features' ? 'active' : ''}`}
            >
              Features
            </button>
            <button
              type="button"
              onClick={() => {
                handleSetActiveModal(null);
                scrollToSection('courses');
                setActiveNav('courses');
              }}
              className={`nav-link ${activeNav === 'courses' ? 'active' : ''}`}
            >
              Explore Courses
            </button>
            <button
              type="button"
              onClick={() => {
                handleSetActiveModal('about');
                setContactSubmitted(false);
              }}
              className={`nav-link ${activeNav === 'about' ? 'active' : ''}`}
            >
              About Us
            </button>
            <button
              type="button"
              onClick={() => {
                handleSetActiveModal('contact');
                setContactSubmitted(false);
              }}
              className={`nav-link ${activeNav === 'contact' ? 'active' : ''}`}
            >
              Contact Us
            </button>
          </nav>

          {/* Moved Login and Register Buttons here */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {toggleTheme && (
              <button
                type="button"
                onClick={toggleTheme}
                className="btn btn-secondary btn-icon-only theme-toggle-btn"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                style={{ width: '38px', height: '38px', borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setError('');
                setSuccessMessage('');
                setAuthPromptMessage('');
                setAuthMode('login');
                setAuthModalOpen(true);
              }}
              className="btn btn-secondary"
              style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', borderRadius: '8px' }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setError('');
                setSuccessMessage('');
                setAuthPromptMessage('');
                setAuthMode('signup');
                setAuthModalOpen(true);
              }}
              className="btn btn-primary"
              style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', borderRadius: '8px', boxShadow: 'var(--shadow-neon)' }}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          className="menu-toggle-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="mobile-dropdown-menu">
            <button
              type="button"
              onClick={() => {
                handleSetActiveModal(null);
                setIsMenuOpen(false);
                scrollToSection('home');
                setActiveNav('home');
              }}
              className={`mobile-nav-link ${activeNav === 'home' ? 'active' : ''}`}
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => {
                handleSetActiveModal(null);
                setIsMenuOpen(false);
                scrollToSection('features');
                setActiveNav('features');
              }}
              className={`mobile-nav-link ${activeNav === 'features' ? 'active' : ''}`}
            >
              Features
            </button>
            <button
              type="button"
              onClick={() => {
                handleSetActiveModal(null);
                setIsMenuOpen(false);
                scrollToSection('courses');
                setActiveNav('courses');
              }}
              className={`mobile-nav-link ${activeNav === 'courses' ? 'active' : ''}`}
            >
              Explore Courses
            </button>
            <button
              type="button"
              onClick={() => {
                handleSetActiveModal('about');
                setIsMenuOpen(false);
              }}
              className={`mobile-nav-link ${activeNav === 'about' ? 'active' : ''}`}
            >
              About Us
            </button>
            <button
              type="button"
              onClick={() => {
                handleSetActiveModal('contact');
                setIsMenuOpen(false);
              }}
              className={`mobile-nav-link ${activeNav === 'contact' ? 'active' : ''}`}
            >
              Contact Us
            </button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              {toggleTheme && (
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="btn btn-secondary"
                  style={{ width: '100%', padding: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                  <span>{theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setError('');
                  setSuccessMessage('');
                  setAuthPromptMessage('');
                  setAuthMode('login');
                  setAuthModalOpen(true);
                  setIsMenuOpen(false);
                }}
                className="btn btn-secondary"
                style={{ width: '100%', padding: '0.6rem' }}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setError('');
                  setSuccessMessage('');
                  setAuthPromptMessage('');
                  setAuthMode('signup');
                  setAuthModalOpen(true);
                  setIsMenuOpen(false);
                }}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.6rem' }}
              >
                Sign Up
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Sections */}
      <main style={{ display: 'flex', flexDirection: 'column', gap: '4rem', width: '100%' }}>
        {/* Hero Section */}
        <section id="home" style={{ minHeight: '65vh', display: 'flex', alignItems: 'center', paddingTop: '0.5rem' }}>
          <div className="grid-2-col" style={{ maxWidth: '1200px', width: '100%', alignItems: 'center', gap: '4rem', margin: '0 auto' }}>
          
          {/* Left Column: Title and Marketing Copy */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '9999px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', marginBottom: '1.25rem' }}>
                <ShieldCheck size={14} style={{ color: 'var(--color-success)' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-success)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Trusted Learning Platform</span>
              </div>
              
              <h1 className="landing-title" style={{ fontSize: '3rem', lineHeight: '1.15', marginBottom: '1.5rem' }}>
                Learn Skills.<br />
                <span style={{ background: 'linear-gradient(90deg, var(--accent-g-1) 0%, var(--accent-g-2) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Teach Knowledge.</span><br />
                Build Your Future.
              </h1>
              
              <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                EduTube connects industry-leading instructors with ambitious students. Access high-quality curated curriculum, track module progression dynamically, and ask questions with automated instructor response support.
              </p>
            </div>

            <div className="hero-cta-group" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => scrollToSection('courses')}
                className="btn btn-primary"
                style={{ padding: '0.8rem 2rem', fontSize: '0.95rem', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', boxShadow: 'var(--shadow-neon)' }}
              >
                Explore Courses <ArrowRight size={16} />
              </button>
              <button
                type="button"
                onClick={() => {
                  setError('');
                  setSuccessMessage('');
                  setAuthPromptMessage('Join EduTube as an instructor to build your studio courses!');
                  setAuthMode('signup');
                  setSelectedRole('teacher');
                  setAuthModalOpen(true);
                }}
                className="btn btn-secondary"
                style={{ padding: '0.8rem 2rem', fontSize: '0.95rem', borderRadius: '10px', border: '1px solid rgba(139, 92, 246, 0.4)' }}
              >
                Become an Instructor
              </button>
            </div>

            {/* Stats Row */}
            <div className="hero-stats-row" style={{ display: 'flex', gap: '2.5rem', marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-g-1)' }}>10k+</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Students</div>
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-g-2)' }}>150+</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Courses</div>
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-g-1)' }}>50+</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Teachers</div>
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-success)' }}>4.9★</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rating</div>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Interactive Mock Player */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
            <div className="glass-panel" style={{
              padding: '0.5rem',
              borderRadius: '16px',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              boxShadow: 'var(--shadow-lg), var(--shadow-neon)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Aspect Ratio 16:9 Canvas */}
              <div style={{
                width: '100%',
                aspectRatio: '16/9',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(79, 70, 229, 0.1) 100%)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                {/* Simulated Grid lines */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: 'radial-gradient(rgba(139, 92, 246, 0.15) 1px, transparent 0)',
                  backgroundSize: '24px 24px'
                }}></div>

                {/* Glowing Play Circle */}
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  cursor: 'pointer',
                  zIndex: 2,
                  boxShadow: '0 0 20px rgba(124, 58, 237, 0.6)',
                  transition: 'transform 0.3s ease'
                }} className="play-pulse-hover">
                  <Play size={24} fill="white" style={{ marginLeft: '4px' }} />
                </div>

                {/* Left Floating Badge */}
                <div className="glass-panel" style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '1rem',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  zIndex: 2
                }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-success)', display: 'inline-block', boxShadow: '0 0 8px var(--color-success)' }}></span>
                  QA Assistant Active
                </div>

                {/* Right Floating Badge */}
                <div className="glass-panel" style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  zIndex: 2
                }}>
                  <Users size={12} style={{ color: 'var(--accent-g-1)' }} />
                  12k+ Studying
                </div>

                {/* Video controls bottom bar simulation */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(to top, rgba(10, 10, 15, 0.9) 0%, transparent 100%)',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  zIndex: 2
                }}>
                  {/* Progress track */}
                  <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '2px', position: 'relative' }}>
                    <div style={{ width: '40%', height: '100%', background: 'linear-gradient(90deg, #7c3aed, #4f46e5)', borderRadius: '2px' }}></div>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'white', position: 'absolute', left: '40%', top: '50%', transform: 'translate(-50%, -50%)', boxShadow: '0 0 6px rgba(0,0,0,0.5)' }}></div>
                  </div>
                  {/* Control Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    <span>04:12 / 18:45</span>
                    <span>HD 1080p</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Player Subtitle Card */}
            <div className="glass-panel" style={{ padding: '1rem', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                background: 'rgba(124, 58, 237, 0.1)',
                padding: '0.5rem',
                borderRadius: '8px',
                color: 'var(--accent-g-1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <BookOpen size={18} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Currently Previewing</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Introduction to React Hooks & State Management</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Explorer Section */}
      <section id="courses" style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', paddingTop: '4rem', scrollMarginTop: '80px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>Curriculum Explorer</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Browse our selection of premium curated training programs without logging in.</p>
        </div>

        {/* Filter Bar & Search Row */}
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginBottom: '2rem' }}>
          {/* Search Input */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search courses or teachers..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              style={{ paddingLeft: '2.5rem', paddingRight: '1rem', fontSize: '0.85rem', width: '100%', margin: 0 }}
            />
          </div>
        </div>

        {/* Dynamic Courses Grid */}
        {currentCourses.length > 0 ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '2rem' }}>
              {currentCourses.map(course => (
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

                    {/* Details Trigger Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedExplorerCourse(course)}
                      className="btn btn-secondary"
                      style={{ width: '100%', padding: '0.5rem', fontSize: '0.8rem', borderRadius: '8px', border: '1px solid rgba(139, 92, 246, 0.3)' }}
                    >
                      View Curriculum Explorer
                    </button>
                  </div>
                </div>
              ))}
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
                    color: currentPage === 1 ? 'var(--text-muted)' : 'var(--accent-g-1)',
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
                    color: currentPage === totalPages ? 'var(--text-muted)' : 'var(--accent-g-1)',
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
        ) : (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', borderRadius: '12px' }}>
            <BookOpen size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Courses Found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Try refining your search terms or selecting another category.</p>
          </div>
        )}
      </section>

      {/* Features Grid Section */}
      <section id="features" style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', paddingTop: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>Platform Features</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem' }}>
            EduTube Studio combines video delivery with active, hands-on tracking and instructor support panels.
          </p>
        </div>

        <div className="grid-3-col" style={{ gap: '2rem' }}>
          
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: '14px', border: '1px solid rgba(139, 92, 246, 0.15)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'rgba(124, 58, 237, 0.1)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', color: 'var(--accent-g-1)' }}>
              <Play size={20} fill="currentColor" />
            </div>
            <h3 style={{ fontSize: '1.15rem' }}>Interactive Studio Player</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Track your lecture-by-lecture completion progress dynamically. Checkboxes synchronize automatically with your user profile.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '2rem', borderRadius: '14px', border: '1px solid rgba(139, 92, 246, 0.15)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'rgba(124, 58, 237, 0.1)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', color: 'var(--accent-g-1)' }}>
              <MessageSquare size={20} />
            </div>
            <h3 style={{ fontSize: '1.15rem' }}>Lecture-Bound Q&A</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Ask questions directly linked to specific lectures. Our system provides automated reply simulation to guide your code immediately.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '2rem', borderRadius: '14px', border: '1px solid rgba(139, 92, 246, 0.15)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'rgba(124, 58, 237, 0.1)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', color: 'var(--accent-g-1)' }}>
              <ShieldCheck size={20} />
            </div>
            <h3 style={{ fontSize: '1.15rem' }}>Three-Role Workspace</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Experience the platform as a student learning skills, an instructor publishing content, or an administrator auditing course quality.
            </p>
          </div>
        </div>
      </section>
      </main>

      {/* Authentication Modal Overlay */}
      {createPortal(
        <div 
          className={`auth-modal-overlay ${authModalOpen ? 'open' : ''}`}
          onClick={() => {
            setAuthModalOpen(false);
            setAuthPromptMessage('');
          }}
        >
          <div 
            className="auth-modal-card-wrapper"
          onClick={(e) => e.stopPropagation()}
          style={{ position: 'relative' }}
        >
          {/* Close trigger button */}
          <button
            onClick={() => {
              setAuthModalOpen(false);
              setAuthPromptMessage('');
            }}
            style={{
              position: 'absolute',
              top: '-2.5rem',
              right: '0',
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.85rem',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            <X size={18} /> Close
          </button>

          <div 
            id="login-portal-card" 
            className="kids-card" 
            style={{ 
              padding: '2.5rem', 
              width: '100%', 
              transition: 'all 0.3s ease'
            }}
          >
            {/* Playful Floating Kids Icons */}
            <span className="kids-floating-element kids-float-1">🦖</span>
            <span className="kids-floating-element kids-float-2">🦄</span>
            <span className="kids-floating-element kids-float-3">🎨</span>
            <span className="kids-floating-element kids-float-4">🚀</span>

            {authPromptMessage && (
              <div style={{
                backgroundColor: 'rgba(251, 191, 36, 0.15)',
                color: 'white',
                fontSize: '0.9rem',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                border: '2px solid rgba(251, 191, 36, 0.3)',
                marginBottom: '1.25rem',
                textAlign: 'center',
                fontWeight: 600
              }}>
                {authPromptMessage}
              </div>
            )}

            {authMode === 'login' && (
              <div key="login" className="auth-form-animate">
                <div style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '0.25rem' }}>
                  <span style={{ display: 'inline-block', animation: 'float-slow 3s ease-in-out infinite' }}>🎒</span>
                </div>
                <h2 style={{ fontSize: '1.85rem', marginBottom: '0.5rem', textAlign: 'center', color: '#ffb03a', fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>Welcome to EduTube! 🌟</h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '1.75rem' }}>Ready for a fun learning adventure? Sign in below!</p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {successMessage && (
                    <div style={{ color: 'var(--color-success)', fontSize: '0.85rem', textAlign: 'center', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)', marginBottom: '0.5rem' }}>
                      {successMessage}
                    </div>
                  )}
                  {error && (
                    <div style={{ color: 'var(--color-danger)', fontSize: '0.85rem', textAlign: 'center', backgroundColor: 'var(--color-danger-bg)', padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)', marginBottom: '0.5rem' }}>
                      {error}
                    </div>
                  )}

                  {/* Role Tab Selector */}
                  <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                    <label className="form-label" style={{ textAlign: 'center', display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 700 }}>Choose Your Portal 🎈</label>
                    <div className="tab-nav" style={{ padding: '0.25rem', width: '100%', borderRadius: '16px', background: 'rgba(10, 10, 20, 0.5)' }}>
                      <button
                        type="button"
                        className={`tab-btn kids-role-tab ${selectedRole === 'student' ? 'active' : ''}`}
                        onClick={() => setSelectedRole('student')}
                        style={{ flex: 1, justifyContent: 'center' }}
                      >
                        <GraduationCap size={15} />
                        Little Explorer 🎒
                      </button>
                      <button
                        type="button"
                        className={`tab-btn kids-role-tab ${selectedRole === 'teacher' ? 'active' : ''}`}
                        onClick={() => setSelectedRole('teacher')}
                        style={{ flex: 1, justifyContent: 'center' }}
                      >
                        <Play size={15} />
                        Teacher Guide 🧙‍♂️
                      </button>
                      <button
                        type="button"
                        className={`tab-btn kids-role-tab ${selectedRole === 'admin' ? 'active' : ''}`}
                        onClick={() => setSelectedRole('admin')}
                        style={{ flex: 1, justifyContent: 'center' }}
                      >
                        <ShieldCheck size={15} />
                        Supervisor 👑
                      </button>
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="form-group">
                    <label className="form-label">Email Address ✉</label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="email"
                        className="form-input kids-input-style"
                        placeholder="e.g. yourname@edutube.com 🌈"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ paddingLeft: '2.75rem' }}
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <label className="form-label" style={{ margin: 0 }}>Password 🔑</label>
                      <button
                        type="button"
                        onClick={() => {
                          setError('');
                          setSuccessMessage('');
                          setAuthMode('forgot');
                        }}
                        style={{ background: 'none', border: 'none', color: '#ffb03a', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 700, padding: 0 }}
                      >
                        Forgot Password? 🤫
                      </button>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="password"
                        className="form-input kids-input-style"
                        placeholder="your secret code 🤫"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ paddingLeft: '2.75rem' }}
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button type="submit" className="kids-btn-bounce" style={{ width: '100%', marginTop: '0.5rem' }}>
                    Let's Start Learning! 🚀
                  </button>

                  <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    New explorer?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setError('');
                        setSuccessMessage('');
                        setAuthMode('signup');
                      }}
                      style={{ background: 'none', border: 'none', color: '#fbbf24', cursor: 'pointer', fontWeight: 800, padding: 0 }}
                    >
                      Sign Up Here! 🌟
                    </button>
                  </div>
                </form>
              </div>
            )}

            {authMode === 'signup' && (
              <div key="signup" className="auth-form-animate">
                <div style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '0.25rem' }}>
                  <span style={{ display: 'inline-block', animation: 'float-slow 3s ease-in-out infinite' }}>🎨</span>
                </div>
                <h2 style={{ fontSize: '1.85rem', marginBottom: '0.5rem', textAlign: 'center', color: '#8b5cf6', fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>Join the Adventure! 🎨</h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '1.75rem' }}>Create a free profile to track your progress & earn badges!</p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {error && (
                    <div style={{ color: 'var(--color-danger)', fontSize: '0.85rem', textAlign: 'center', backgroundColor: 'var(--color-danger-bg)', padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)', marginBottom: '0.5rem' }}>
                      {error}
                    </div>
                  )}

                  {/* Role Tab Selector */}
                  <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                    <label className="form-label" style={{ textAlign: 'center', display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 700 }}>Choose Your Role 🎈</label>
                    <div className="tab-nav" style={{ padding: '0.25rem', width: '100%', borderRadius: '16px', background: 'rgba(10, 10, 20, 0.5)' }}>
                      <button
                        type="button"
                        className={`tab-btn kids-role-tab ${selectedRole === 'student' ? 'active' : ''}`}
                        onClick={() => setSelectedRole('student')}
                        style={{ flex: 1, justifyContent: 'center' }}
                      >
                        <GraduationCap size={15} />
                        Little Explorer 🎒
                      </button>
                      <button
                        type="button"
                        className={`tab-btn kids-role-tab ${selectedRole === 'teacher' ? 'active' : ''}`}
                        onClick={() => setSelectedRole('teacher')}
                        style={{ flex: 1, justifyContent: 'center' }}
                      >
                        <Play size={15} />
                        Teacher Guide 🧙‍♂️
                      </button>
                      <button
                        type="button"
                        className={`tab-btn kids-role-tab ${selectedRole === 'admin' ? 'active' : ''}`}
                        onClick={() => setSelectedRole('admin')}
                        style={{ flex: 1, justifyContent: 'center' }}
                      >
                        <ShieldCheck size={15} />
                        Supervisor 👑
                      </button>
                    </div>
                  </div>

                  {/* Full Name Field */}
                  <div className="form-group">
                    <label className="form-label">Full Name Aa</label>
                    <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Aa</span>
                      </div>
                      <input
                        type="text"
                        className="form-input kids-input-style"
                        placeholder="e.g. John Doe 🌈"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        style={{ paddingLeft: '2.75rem' }}
                        required
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="form-group">
                    <label className="form-label">Email Address ✉</label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="email"
                        className="form-input kids-input-style"
                        placeholder="e.g. name@edutube.com 🌈"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ paddingLeft: '2.75rem' }}
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="form-group">
                    <label className="form-label">Password 🔑</label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="password"
                        className="form-input kids-input-style"
                        placeholder="create your secret code 🤫"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ paddingLeft: '2.75rem' }}
                        required
                      />
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div className="form-group">
                    <label className="form-label">Confirm Password 🔑</label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="password"
                        className="form-input kids-input-style"
                        placeholder="type your secret code again 🤫"
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        style={{ paddingLeft: '2.75rem' }}
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button type="submit" className="kids-btn-bounce" style={{ width: '100%', marginTop: '0.5rem' }}>
                    Create My Account! 🎉
                  </button>

                  <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setError('');
                        setSuccessMessage('');
                        setAuthMode('login');
                      }}
                      style={{ background: 'none', border: 'none', color: '#fbbf24', cursor: 'pointer', fontWeight: 800, padding: 0 }}
                    >
                      Sign In Here! 🎒
                    </button>
                  </div>
                </form>
              </div>
            )}

            {authMode === 'forgot' && (
              <div key="forgot" className="auth-form-animate">
                <div style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '0.25rem' }}>
                  <span style={{ display: 'inline-block', animation: 'float-slow 3s ease-in-out infinite' }}>🔑</span>
                </div>
                <h2 style={{ fontSize: '1.85rem', marginBottom: '0.5rem', textAlign: 'center', color: '#ef4444', fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>Reset Password 🤫</h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '1.75rem' }}>Enter email address below to receive recovery link</p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {error && (
                    <div style={{ color: 'var(--color-danger)', fontSize: '0.85rem', textAlign: 'center', backgroundColor: 'var(--color-danger-bg)', padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)', marginBottom: '0.5rem' }}>
                      {error}
                    </div>
                  )}

                  {/* Email Field */}
                  <div className="form-group">
                    <label className="form-label">Email Address ✉</label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="email"
                        className="form-input kids-input-style"
                        placeholder="e.g. name@edutube.com 🌈"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ paddingLeft: '2.75rem' }}
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button type="submit" className="kids-btn-bounce" style={{ width: '100%', marginTop: '0.5rem' }}>
                    Send Recovery Link ✉
                  </button>

                  <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setError('');
                        setSuccessMessage('');
                        setAuthMode('login');
                      }}
                      style={{ background: 'none', border: 'none', color: '#fbbf24', cursor: 'pointer', fontWeight: 800, padding: 0 }}
                    >
                      Back to Sign In 🎒
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>,
      document.body
      )}

      {/* Course Explorer Details Modal Overlay */}
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

                    {/* Enroll CTA */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedExplorerCourse(null);
                        setError('');
                        setSuccessMessage('');
                        setAuthPromptMessage('Create a free account or Sign In to enroll in this course and begin learning!');
                        setAuthMode('signup');
                        setSelectedRole('student');
                        setAuthModalOpen(true);
                      }}
                      className="btn btn-primary"
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: 'var(--shadow-neon)' }}
                    >
                      Enroll in Course <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* About Us Modal */}
      {activeModal === 'about' && createPortal(
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
            width: '90%',
            maxWidth: '600px',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            boxShadow: 'var(--shadow-lg), var(--shadow-neon)',
            position: 'relative'
          }}>
            <button
              onClick={() => handleSetActiveModal(null)}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <Info size={24} style={{ color: 'var(--accent-g-1)' }} />
              <h3 style={{ fontSize: '1.5rem', margin: 0 }}>About EduTube</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              EduTube Studio is an immersive digital education ecosystem designed to redefine online learning. It connects passionate content creators (Teachers) with career-focused learners (Students), all monitored and facilitated by robust administrative controls.
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Our platform bridges the gap between passive video viewing and active hands-on guidance. With real-time completion checkmarks, interactive review metrics, and automated Q&A instructors, students gain an educational experience tailored to modern demands.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span style={{ color: 'var(--color-success)' }}>✔</span> Direct upload pipelines
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span style={{ color: 'var(--color-success)' }}>✔</span> Interactive progress tracking
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span style={{ color: 'var(--color-success)' }}>✔</span> Course safety audits
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span style={{ color: 'var(--color-success)' }}>✔</span> Auto-responding Q&A forums
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Contact Us Modal */}
      {activeModal === 'contact' && createPortal(
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
            maxWidth: '750px',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            boxShadow: 'var(--shadow-lg), var(--shadow-neon)',
            position: 'relative'
          }}>
            <button
              onClick={() => {
                handleSetActiveModal(null);
                setContactSubmitted(false);
              }}
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
            
            <div className="grid-2-col" style={{ gap: '2rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <MessageSquare size={24} style={{ color: 'var(--accent-g-1)' }} />
                  <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Get In Touch</h3>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Have questions about the studio workspace or custom curriculum design? Send us a message and we'll reply shortly.
                </p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Mail size={16} style={{ color: 'var(--accent-g-2)' }} />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>support@edutube.com</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Phone size={16} style={{ color: 'var(--accent-g-2)' }} />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>+1 (800) EDUTUBE</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <MapPin size={16} style={{ color: 'var(--accent-g-2)' }} />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>100 Learning Way, San Francisco</span>
                  </div>
                </div>
              </div>
              
              <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '2rem' }}>
                {contactSubmitted ? (
                  <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-success-bg)',
                      color: 'var(--color-success)',
                      marginBottom: '1rem'
                    }}>
                      ✔
                    </div>
                    <h4>Message Received!</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                      Thank you for contacting us. We will get back to you shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    setContactSubmitted(true);
                    setContactName('');
                    setContactEmail('');
                    setContactMessage('');
                  }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Your Name</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="John Doe"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        required
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Email Address</label>
                      <input
                        type="email"
                        className="form-input"
                        placeholder="john@example.com"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        required
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Your Message</label>
                      <textarea
                        className="form-textarea"
                        placeholder="Type your inquiry here..."
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        required
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', minHeight: '80px' }}
                      ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};
