import React, { useState, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  BookOpen,
  Code,
  FileText,
  Users,
  Clock,
  MapPin,
  Plus,
  Trash2,
  Save,
  X,
  ChevronRight,
  ChevronLeft,
  Info,
  Calendar,
} from 'lucide-react';
import courseService from '../../../services/courseService';
import staffService from '../../../services/staffService';

const AddCourse = memo(() => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [staff, setStaff] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    credits: 3,
    semester: 'Fall 2024',
    faculty: '',
    schedule: '',
    room: '',
    syllabus: [{ week: 1, topic: '', description: '' }],
    materials: [],
  });

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await staffService.getAllStaff();
        if (res.success) {
          setStaff(res.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch staff', err);
      }
    };
    fetchStaff();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSyllabusChange = (index, field, value) => {
    const newSyllabus = [...formData.syllabus];
    newSyllabus[index][field] = value;
    setFormData((prev) => ({ ...prev, syllabus: newSyllabus }));
  };

  const addSyllabusWeek = () => {
    setFormData((prev) => ({
      ...prev,
      syllabus: [
        ...prev.syllabus,
        { week: prev.syllabus.length + 1, topic: '', description: '' },
      ],
    }));
  };

  const removeSyllabusWeek = (index) => {
    const newSyllabus = formData.syllabus.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, syllabus: newSyllabus }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await courseService.createCourse(formData);
      if (res.success) {
        toast.success('Course created successfully!');
        navigate('/courses/catalog');
      } else {
        toast.error(res.message || 'Failed to create course');
      }
    } catch (err) {
      toast.error('An error occurred while creating the course');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className='course-page'>
      <div className='course-header'>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => navigate(-1)}
            className='course-btn course-btn-secondary'
            style={{ padding: '8px', borderRadius: '50%' }}
          >
            <X className='course-icon-md' />
          </button>
          <h1 className='course-title'>Create New Course</h1>
        </div>
      </div>

      <div className='course-steps'>
        {[
          { id: 1, label: 'Basic Info', icon: Info },
          { id: 2, label: 'Faculty & Room', icon: Users },
          { id: 3, label: 'Syllabus', icon: FileText },
        ].map((item) => (
          <div
            key={item.id}
            className={`course-step-item ${step >= item.id ? 'active' : ''}`}
          >
            <div className='course-step-icon'>
              <item.icon className='h-5 w-5' />
            </div>
            <div>
              <p
                style={{
                  fontSize: '10px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  color: 'var(--course-text-muted)',
                }}
              >
                Step {item.id}
              </p>
              <p style={{ fontWeight: '700' }}>{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className='course-form-container'>
        <div className='course-form-body'>
          {step === 1 && (
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
            >
              <h2
                style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Info
                  className='course-icon-md'
                  style={{ color: 'var(--course-primary)' }}
                />{' '}
                Basic Information
              </h2>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '24px',
                }}
              >
                <div className='course-form-group'>
                  <label className='course-label'>Course Name</label>
                  <div style={{ position: 'relative' }}>
                    <BookOpen
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '16px',
                        height: '16px',
                        color: 'var(--course-text-muted)',
                      }}
                    />
                    <input
                      type='text'
                      name='name'
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder='e.g. Data Structures'
                      className='course-input'
                      style={{ paddingLeft: '40px' }}
                    />
                  </div>
                </div>

                <div className='course-form-group'>
                  <label className='course-label'>Course Code</label>
                  <div style={{ position: 'relative' }}>
                    <Code
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '16px',
                        height: '16px',
                        color: 'var(--course-text-muted)',
                      }}
                    />
                    <input
                      type='text'
                      name='code'
                      value={formData.code}
                      onChange={handleChange}
                      required
                      placeholder='e.g. CS101'
                      className='course-input'
                      style={{
                        paddingLeft: '40px',
                        textTransform: 'uppercase',
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className='course-form-group'>
                <label className='course-label'>Description</label>
                <textarea
                  name='description'
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder='Provide a brief overview...'
                  className='course-input'
                />
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '24px',
                }}
              >
                <div className='course-form-group'>
                  <label className='course-label'>Semester</label>
                  <select
                    name='semester'
                    value={formData.semester}
                    onChange={handleChange}
                    className='course-input'
                  >
                    <option value='Fall 2024'>Fall 2024</option>
                    <option value='Spring 2025'>Spring 2025</option>
                  </select>
                </div>

                <div className='course-form-group'>
                  <label className='course-label'>Credits</label>
                  <input
                    type='number'
                    name='credits'
                    value={formData.credits}
                    onChange={handleChange}
                    min='1'
                    className='course-input'
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
            >
              <h2
                style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Users
                  className='course-icon-md'
                  style={{ color: 'var(--course-primary)' }}
                />{' '}
                Faculty & Logistics
              </h2>

              <div className='course-form-group'>
                <label className='course-label'>Assigned Faculty</label>
                <select
                  name='faculty'
                  value={formData.faculty}
                  onChange={handleChange}
                  required
                  className='course-input'
                >
                  <option value=''>Select Faculty Member</option>
                  {staff.map((member) => (
                    <option
                      key={member.id || member._id}
                      value={member.id || member._id}
                    >
                      {member.name} ({member.department})
                    </option>
                  ))}
                </select>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '24px',
                }}
              >
                <div className='course-form-group'>
                  <label className='course-label'>Schedule</label>
                  <div style={{ position: 'relative' }}>
                    <Clock
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '16px',
                        height: '16px',
                        color: 'var(--course-text-muted)',
                      }}
                    />
                    <input
                      type='text'
                      name='schedule'
                      value={formData.schedule}
                      onChange={handleChange}
                      placeholder='e.g. Mon 10:00-12:00'
                      className='course-input'
                      style={{ paddingLeft: '40px' }}
                    />
                  </div>
                </div>

                <div className='course-form-group'>
                  <label className='course-label'>Room</label>
                  <div style={{ position: 'relative' }}>
                    <MapPin
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '16px',
                        height: '16px',
                        color: 'var(--course-text-muted)',
                      }}
                    />
                    <input
                      type='text'
                      name='room'
                      value={formData.room}
                      onChange={handleChange}
                      placeholder='e.g. 402-B'
                      className='course-input'
                      style={{ paddingLeft: '40px' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <h2
                  style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <FileText
                    className='course-icon-md'
                    style={{ color: 'var(--course-primary)' }}
                  />{' '}
                  Syllabus / Roadmap
                </h2>
                <button
                  type='button'
                  onClick={addSyllabusWeek}
                  className='course-btn course-btn-secondary'
                  style={{ padding: '4px 12px', fontSize: '12px' }}
                >
                  <Plus className='course-icon-sm course-mr-1' /> Add Week
                </button>
              </div>

              <div
                className='course-syllabus-list'
                style={{
                  maxHeight: '400px',
                  overflowY: 'auto',
                  paddingRight: '8px',
                }}
              >
                {formData.syllabus.map((item, index) => (
                  <div key={index} className='course-syllabus-item'>
                    <button
                      type='button'
                      onClick={() => removeSyllabusWeek(index)}
                      style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--course-text-muted)',
                      }}
                    >
                      <Trash2 className='course-icon-sm' />
                    </button>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 3fr',
                        gap: '16px',
                        marginBottom: '16px',
                      }}
                    >
                      <div>
                        <label
                          className='course-label'
                          style={{
                            fontSize: '10px',
                            color: 'var(--course-text-muted)',
                            textTransform: 'uppercase',
                          }}
                        >
                          Week
                        </label>
                        <input
                          type='number'
                          value={item.week}
                          onChange={(e) =>
                            handleSyllabusChange(index, 'week', e.target.value)
                          }
                          className='course-input'
                          style={{ padding: '4px 8px' }}
                        />
                      </div>
                      <div>
                        <label
                          className='course-label'
                          style={{
                            fontSize: '10px',
                            color: 'var(--course-text-muted)',
                            textTransform: 'uppercase',
                          }}
                        >
                          Topic
                        </label>
                        <input
                          type='text'
                          value={item.topic}
                          onChange={(e) =>
                            handleSyllabusChange(index, 'topic', e.target.value)
                          }
                          placeholder='Topic Headline'
                          className='course-input'
                          style={{ padding: '4px 8px' }}
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        className='course-label'
                        style={{
                          fontSize: '10px',
                          color: 'var(--course-text-muted)',
                          textTransform: 'uppercase',
                        }}
                      >
                        Summary
                      </label>
                      <textarea
                        value={item.description}
                        onChange={(e) =>
                          handleSyllabusChange(
                            index,
                            'description',
                            e.target.value
                          )
                        }
                        placeholder='Key points...'
                        rows={2}
                        className='course-input'
                        style={{ padding: '4px 8px' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className='course-form-footer'>
          {step > 1 ? (
            <button
              type='button'
              onClick={prevStep}
              className='course-btn course-btn-secondary'
            >
              <ChevronLeft className='course-icon-md course-mr-2' /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type='button'
              onClick={nextStep}
              className='course-btn course-btn-primary'
            >
              Next Step <ChevronRight className='course-icon-md course-ml-2' />
            </button>
          ) : (
            <button
              type='submit'
              disabled={loading}
              className='course-btn course-btn-primary'
            >
              {loading ? (
                'Processing...'
              ) : (
                <>
                  Create Course <Save className='course-icon-md course-mr-2' />
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
});

AddCourse.displayName = 'AddCourse';

export default AddCourse;
