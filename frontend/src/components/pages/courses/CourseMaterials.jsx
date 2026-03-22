import React, { useState, useEffect, memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  ChevronLeft,
  FileText,
  Download,
  ArrowRight,
  Library,
  MonitorPlay,
  FileCode,
  ExternalLink,
  Folder,
  File,
} from 'lucide-react';
import courseService from '../../../services/courseService';

const CourseMaterials = memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await courseService.getCourseById(id);
        if (response.success) {
          setCourse(response.data);
        } else {
          toast.error(response.message || 'Failed to load materials');
          navigate(`/courses/${id}`);
        }
      } catch (error) {
        console.error('Error fetching course', error);
        toast.error('An error occurred while loading materials');
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
        <p className='course-loading-text'>Loading module resources...</p>
      </div>
    );
  }

  const materials = course?.materials || [];

  return (
    <div className='course-page'>
      <div className='course-header'>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => navigate(-1)}
            className='course-btn course-btn-secondary'
            style={{ padding: '8px', borderRadius: '50%' }}
          >
            <ChevronLeft className='course-icon-md' />
          </button>
          <div>
            <h1 className='course-title'>Learning Resources</h1>
            <p className='course-subtitle'>
              Course materials and documentation
            </p>
          </div>
        </div>
      </div>

      {materials.length === 0 ? (
        <div
          className='course-card-simple'
          style={{
            textAlign: 'center',
            padding: '48px',
            maxWidth: '512px',
            margin: '40px auto',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              backgroundColor: 'var(--course-bg-light)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
            }}
          >
            <FileText
              className='course-icon-xl'
              style={{ color: 'var(--course-text-muted)' }}
            />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: '700' }}>
            No Materials Available
          </h3>
          <p style={{ color: 'var(--course-text-muted)' }}>
            Check back later for course content updates.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className='course-card-simple'>
            <div className='course-card-header'>
              <h3
                style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Folder
                  className='course-icon-md'
                  style={{ color: 'var(--course-primary)' }}
                />{' '}
                Core Resources
              </h3>
              <span className='course-badge course-badge-gray'>
                {materials.length} Files
              </span>
            </div>
            <div className='course-materials-list'>
              {materials.map((material) => (
                <div
                  key={material.id || material._id}
                  className='course-material-item'
                >
                  <div className='course-material-info'>
                    <div className='course-material-icon'>
                      <File className='course-icon-md' />
                    </div>
                    <div>
                      <h4 className='course-material-name'>{material.title}</h4>
                      <p className='course-material-meta'>
                        {material.type?.toUpperCase()} •{' '}
                        {material.size || '2.4 MB'} • Uploaded{' '}
                        {new Date(material.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    className='course-btn course-btn-secondary'
                    style={{ padding: '8px 12px', fontSize: '12px' }}
                  >
                    <Download className='course-icon-sm course-mr-2' /> Download
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div
            className='course-card-simple'
            style={{
              backgroundColor: 'rgba(37,99,235,0.05)',
              borderStyle: 'dashed',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  padding: '10px',
                  backgroundColor: 'var(--course-white)',
                  borderRadius: '8px',
                  border: '1px solid var(--course-border)',
                }}
              >
                <ExternalLink
                  className='course-icon-md'
                  style={{ color: 'var(--course-primary)' }}
                />
              </div>
              <div>
                <h4 style={{ fontWeight: '600', fontSize: '14px' }}>
                  Online Repository
                </h4>
                <p
                  style={{
                    fontSize: '12px',
                    color: 'var(--course-text-muted)',
                  }}
                >
                  Access project source code and laboratory assignments.
                </p>
              </div>
              <button
                className='course-btn course-btn-primary'
                style={{ marginLeft: 'auto', fontSize: '12px' }}
              >
                Go to Repo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

CourseMaterials.displayName = 'CourseMaterials';

export default CourseMaterials;
