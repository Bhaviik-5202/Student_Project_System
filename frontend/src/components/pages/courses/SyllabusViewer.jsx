import React, { memo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  ChevronLeft,
  Printer,
  CheckCircle2,
  Clock,
  BookOpen,
  Target,
  BarChart3,
  Calendar,
  FileText,
  AlertCircle,
} from 'lucide-react';
import courseService from '../../../services/courseService';

const SyllabusViewer = memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeWeek, setActiveWeek] = useState(0);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await courseService.getCourseById(id);
        if (response.success) {
          setCourse(response.data);
        } else {
          toast.error(response.message || 'Failed to load syllabus');
          navigate(`/courses/${id}`);
        }
      } catch (error) {
        console.error('Error fetching course', error);
        toast.error('An error occurred while loading syllabus');
        navigate(`/courses/${id}`);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className='course-loading-container'>
        <div className='course-spinner'></div>
        <p className='course-loading-text'>Loading syllabus...</p>
      </div>
    );
  }

  const syllabus = course?.syllabus || [];

  return (
    <div className='course-page'>
      <div className='course-header'>
        <div>
          <h1 className='course-title'>Master Syllabus</h1>
          <p className='course-subtitle'>
            Academic roadmap for {course?.name || course?.title}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => navigate(`/courses/${id}`)}
            className='course-btn course-btn-secondary'
          >
            <ChevronLeft className='course-icon-md course-mr-2' /> Back to
            Module
          </button>
          <button
            className='course-btn course-btn-secondary'
            onClick={() => window.print()}
          >
            <Printer className='course-icon-sm course-mr-2' /> Print
          </button>
        </div>
      </div>

      <div className='course-details-grid'>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Timeline / Modules List */}
          <div className='course-card-simple'>
            <div
              className='course-section-header'
              style={{ marginBottom: '20px' }}
            >
              <h3
                style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Calendar
                  className='course-icon-md'
                  style={{ color: 'var(--course-primary)' }}
                />{' '}
                Course Timeline
              </h3>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: '12px',
              }}
            >
              {syllabus.length === 0 ? (
                <p
                  style={{
                    color: 'var(--course-text-muted)',
                    gridColumn: '1/-1',
                    textAlign: 'center',
                    padding: '20px',
                  }}
                >
                  No modules defined
                </p>
              ) : (
                syllabus.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveWeek(index)}
                    className={`course-btn ${activeWeek === index ? 'course-btn-primary' : 'course-btn-secondary'}`}
                    style={{
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      height: 'auto',
                      padding: '12px',
                      textAlign: 'left',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        opacity: 0.7,
                        textTransform: 'uppercase',
                      }}
                    >
                      Week {item.week || index + 1}
                    </span>
                    <span
                      style={{
                        fontSize: '13px',
                        fontWeight: '700',
                        marginTop: '4px',
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        width: '100%',
                      }}
                    >
                      {item.topic || item.title}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Detailed View */}
          {syllabus[activeWeek] ? (
            <div className='course-card-simple' style={{ padding: '32px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '24px',
                }}
              >
                <span className='course-badge course-badge-blue'>
                  Module {activeWeek + 1}
                </span>
                <span
                  style={{
                    fontSize: '12px',
                    color: 'var(--course-text-muted)',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                  }}
                >
                  <Clock
                    className='course-icon-sm'
                    style={{ verticalAlign: 'middle', marginRight: '4px' }}
                  />{' '}
                  Week {syllabus[activeWeek].week || activeWeek + 1}
                </span>
              </div>

              <h2
                style={{
                  fontSize: '28px',
                  fontWeight: '800',
                  marginBottom: '24px',
                }}
              >
                {syllabus[activeWeek].topic || syllabus[activeWeek].title}
              </h2>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '32px',
                }}
              >
                <section>
                  <h4
                    style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      color: 'var(--course-text-muted)',
                      textTransform: 'uppercase',
                      marginBottom: '12px',
                    }}
                  >
                    <FileText
                      className='course-icon-sm'
                      style={{ verticalAlign: 'middle', marginRight: '6px' }}
                    />{' '}
                    Session Description
                  </h4>
                  <p
                    style={{
                      fontSize: '16px',
                      lineHeight: '1.6',
                      color: 'var(--course-text-main)',
                    }}
                  >
                    {syllabus[activeWeek].description ||
                      "Guided study session covering core concepts and practical applications relevant to this module's learning outcomes."}
                  </p>
                </section>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '24px',
                  }}
                >
                  <div
                    className='course-card-simple'
                    style={{ backgroundColor: 'var(--course-bg-light)' }}
                  >
                    <h4
                      style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        color: 'var(--course-text-muted)',
                        textTransform: 'uppercase',
                        marginBottom: '16px',
                      }}
                    >
                      <Target
                        className='course-icon-sm'
                        style={{ verticalAlign: 'middle', marginRight: '6px' }}
                      />{' '}
                      Key Outcomes
                    </h4>
                    <ul
                      style={{
                        listStyle: 'none',
                        padding: '0',
                        margin: '0',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                      }}
                    >
                      {[
                        'Concept Mastery',
                        'Practical Skills',
                        'Problem Solving',
                      ].map((text, i) => (
                        <li
                          key={i}
                          style={{
                            display: 'flex',
                            gap: '10px',
                            fontSize: '13px',
                          }}
                        >
                          <CheckCircle2
                            className='h-4 w-4'
                            style={{
                              color: 'var(--course-primary)',
                              flexShrink: 0,
                            }}
                          />
                          <span>{text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div
                    className='course-card-simple'
                    style={{
                      backgroundColor: 'rgba(37, 99, 235, 0.05)',
                      borderColor: 'rgba(37, 99, 235, 0.2)',
                    }}
                  >
                    <h4
                      style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        color: 'var(--course-text-muted)',
                        textTransform: 'uppercase',
                        marginBottom: '16px',
                      }}
                    >
                      <BarChart3
                        className='h-4 w-4'
                        style={{ verticalAlign: 'middle', marginRight: '6px' }}
                      />{' '}
                      Assessment
                    </h4>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                      }}
                    >
                      {[
                        { label: 'Lab Work', val: '20%' },
                        { label: 'Assignment', val: '30%' },
                        { label: 'Session Test', val: '50%' },
                      ].map((item, i) => (
                        <div
                          key={i}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingBottom: '8px',
                            borderBottom:
                              i < 2 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                          }}
                        >
                          <span style={{ fontSize: '13px', fontWeight: '600' }}>
                            {item.label}
                          </span>
                          <span className='course-badge course-badge-blue'>
                            {item.val}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              className='course-card-simple'
              style={{ textAlign: 'center', padding: '80px' }}
            >
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: 'var(--course-bg-light)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                }}
              >
                <BookOpen
                  className='h-10 w-10'
                  style={{ color: 'var(--course-text-muted)' }}
                />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '700' }}>
                Select a module to view details
              </h3>
              <p style={{ color: 'var(--course-text-muted)' }}>
                Use the timeline to navigate through the course curriculum.
              </p>
            </div>
          )}
        </div>

        <div>
          <div
            className='course-card-simple'
            style={{
              backgroundColor: 'var(--course-text-main)',
              color: 'white',
              border: 'none',
            }}
          >
            <div
              style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}
            >
              <div
                style={{
                  padding: '12px',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                }}
              >
                <AlertCircle
                  className='h-6 w-6'
                  style={{ color: 'var(--course-primary)' }}
                />
              </div>
              <div>
                <h4 style={{ fontWeight: '700', marginBottom: '4px' }}>
                  Academic Policy
                </h4>
                <p
                  style={{ fontSize: '12px', opacity: 0.7, lineHeight: '1.5' }}
                >
                  Submissions are subject to verification. 75% attendance
                  required for final assessment eligibility. Late work policy
                  applied.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

SyllabusViewer.displayName = 'SyllabusViewer';

export default SyllabusViewer;
