import React, { useState, useCallback, memo, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Save,
  Users,
  ArrowLeft,
  Loader2,
  FileText,
  Tag,
  Link as LinkIcon,
  FolderKanban,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import meetingService from '../../../services/meetingService';
import projectService from '../../../services/projectService';
import staffService from '../../../services/staffService';
import studentService from '../../../services/studentService';
import PageHeader from '../../common/PageHeader';
import Input from '../../ui/Input';
import '../../../assets/styles/meetings.css';

const MeetingForm = memo(() => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const isEditing = location.pathname.endsWith('/edit');
  const isViewing = id && !isEditing;

  const [formData, setFormData] = useState({
    title: '',
    type: 'review',
    date: '',
    time: '',
    location: '',
    description: '',
    project: '',
    organizer: '',
    participants: [],
  });

  const [projects, setProjects] = useState([]);
  const [organizers, setOrganizers] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Fetch dynamic lookup lists (Projects, Faculty Organizers, Students)
  useEffect(() => {
    const loadDynamicData = async () => {
      try {
        const [projRes, staffRes, studentRes] = await Promise.allSettled([
          projectService.getAllProjects(),
          staffService.getAllStaff(),
          studentService.getAllStudents(),
        ]);

        // Process Projects
        if (projRes.status === 'fulfilled' && projRes.value) {
          const rawProjects =
            projRes.value.projects ||
            projRes.value.data ||
            (Array.isArray(projRes.value) ? projRes.value : []);

          setProjects(
            rawProjects.map((p) => ({
              id: p._id || p.id,
              title: p.title || p.name || 'Untitled Project',
              guideId: p.guide?._id || p.guide || null,
              studentIds: (p.students || []).map((s) =>
                typeof s === 'object' ? s._id || s.id : s
              ),
            }))
          );
        }

        // Process Staff / Organizers
        if (staffRes.status === 'fulfilled' && staffRes.value) {
          const rawStaff =
            staffRes.value.data ||
            staffRes.value.staff ||
            (Array.isArray(staffRes.value) ? staffRes.value : []);

          setOrganizers(
            rawStaff.map((s) => ({
              id: s._id || s.id || s.staffId,
              name: s.name || s.fullName || 'Faculty Member',
              email: s.email || '',
            }))
          );
        }

        // Process Students
        if (studentRes.status === 'fulfilled' && studentRes.value) {
          const rawStudents =
            studentRes.value.data ||
            studentRes.value.students ||
            (Array.isArray(studentRes.value) ? studentRes.value : []);

          setStudents(
            rawStudents.map((s) => ({
              id: s._id || s.id,
              name: s.name || s.fullName || 'Student',
              email: s.email || '',
              rollNumber: s.rollNumber || s.studentId || '',
            }))
          );
        }
      } catch (err) {
        console.error('Failed to load lookup data:', err);
      }
    };

    loadDynamicData();
  }, []);

  // Fetch existing meeting details in Edit / View mode
  useEffect(() => {
    const fetchMeeting = async () => {
      setInitialLoading(true);
      if (id) {
        const res = await meetingService.getMeetingById(id);
        if (res.success && res.data) {
          const m = res.data;
          const formattedDate = m.date
            ? new Date(m.date).toISOString().split('T')[0]
            : '';
          const formattedTime =
            m.time ||
            (m.date
              ? new Date(m.date).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })
              : '');

          setFormData({
            title: m.title || '',
            type: m.type || 'review',
            date: formattedDate,
            time: formattedTime,
            location: m.location || '',
            description: m.description || '',
            project: m.project?._id || m.project || '',
            organizer: m.organizer?._id || m.organizer || '',
            participants: (m.participants || []).map((p) =>
              typeof p === 'object' ? p._id || p.id : p
            ),
          });
        } else {
          toast.error('Failed to load meeting details');
          navigate('/meetings');
        }
      }
      setInitialLoading(false);
    };

    fetchMeeting();
  }, [id, navigate]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleProjectSelect = (e) => {
    const selectedProjectId = e.target.value;
    setFormData((prev) => {
      const updated = { ...prev, project: selectedProjectId };
      const matchedProject = projects.find(
        (p) => String(p.id) === String(selectedProjectId)
      );
      if (matchedProject) {
        if (matchedProject.guideId && !prev.organizer) {
          updated.organizer = matchedProject.guideId;
        }
        if (
          Array.isArray(matchedProject.studentIds) &&
          matchedProject.studentIds.length > 0
        ) {
          updated.participants = Array.from(
            new Set([...prev.participants, ...matchedProject.studentIds])
          );
        }
      }
      return updated;
    });
  };

  const handleParticipantToggle = (participantId) => {
    if (isViewing) return;
    setFormData((prev) => {
      const exists = prev.participants.includes(participantId);
      const updated = exists
        ? prev.participants.filter((pId) => pId !== participantId)
        : [...prev.participants, participantId];
      return { ...prev, participants: updated };
    });
  };

  const handleClose = useCallback(() => {
    navigate('/meetings/list');
  }, [navigate]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (
        !formData.title.trim() ||
        !formData.date ||
        !formData.time ||
        !formData.location.trim()
      ) {
        toast.error(
          'Please complete all required fields (Title, Date, Time, Location)'
        );
        return;
      }

      // Date & Time Validation: prevent scheduling in past
      const selectedDateTime = new Date(`${formData.date}T${formData.time}`);
      const now = new Date();
      if (selectedDateTime < now - 60000) {
        toast.error('Meeting date and time cannot be in the past');
        return;
      }

      try {
        setLoading(true);
        const meetingPayload = {
          title: formData.title.trim(),
          type: formData.type,
          date: selectedDateTime,
          time: formData.time,
          location: formData.location.trim(),
          description: formData.description.trim(),
          project: formData.project || null,
          organizer: formData.organizer || null,
          participants: formData.participants,
        };

        const res = isEditing
          ? await meetingService.updateMeeting(id, meetingPayload)
          : await meetingService.createMeeting(meetingPayload);

        if (res.success) {
          toast.success(
            `Meeting ${isEditing ? 'updated' : 'scheduled'} successfully!`
          );
          handleClose();
        } else {
          toast.error(
            res.message ||
              `Failed to ${isEditing ? 'update' : 'schedule'} meeting`
          );
        }
      } catch (error) {
        toast.error('An unexpected error occurred while saving meeting');
      } finally {
        setLoading(false);
      }
    },
    [formData, id, isEditing, handleClose]
  );

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className='animate-fade-in space-y-6 pt-0 pb-6 max-w-4xl mx-auto'>
      <PageHeader
        variant='small'
        title={
          isViewing
            ? 'Meeting Details'
            : isEditing
              ? 'Edit Meeting'
              : 'Schedule Meeting'
        }
        subtitle='Project synchronization and academic review session'
        icon={CalendarIcon}
        actions={
          <button
            type='button'
            onClick={handleClose}
            className='flex items-center gap-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 dark:border-slate-700   transition-all'
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
        }
      />

      {initialLoading ? (
        <div className='flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 p-12 shadow-sm dark:border-slate-700 dark:bg-slate-800'>
          <Loader2 className='h-8 w-8 animate-spin text-indigo-600' />
          <p className='mt-3 text-sm font-medium text-slate-500 dark:text-slate-400'>
            Loading meeting form & resources...
          </p>
        </div>
      ) : (
        <div className='rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Title & Type */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <div className='md:col-span-2'>
                <Input
                  label='Meeting Title'
                  name='title'
                  type='text'
                  icon={FileText}
                  placeholder='e.g. Sprint 2 Architecture & Code Review'
                  value={formData.title}
                  onChange={handleChange}
                  readOnly={isViewing}
                  required
                />
              </div>

              <div>
                <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300'>
                  Meeting Type <span className='text-red-500'>*</span>
                </label>
                <div className='relative'>
                  <Tag
                    size={16}
                    className='pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400'
                  />
                  <select
                    name='type'
                    className='w-full appearance-none rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 !pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none transition focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50'
                    value={formData.type}
                    onChange={handleChange}
                    disabled={isViewing}
                  >
                    <option value='review'>Project Review</option>
                    <option value='team'>Team Sync</option>
                    <option value='one_on_one'>One-on-One</option>
                    <option value='faculty'>Faculty Meeting</option>
                    <option value='client'>Client / External Review</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Project & Organizer Dynamic Dropdowns */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300'>
                  Associated Project
                </label>
                <div className='relative'>
                  <FolderKanban
                    size={16}
                    className='pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400'
                  />
                  <select
                    name='project'
                    className='w-full appearance-none rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 !pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none transition focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 font-medium'
                    value={formData.project}
                    onChange={handleProjectSelect}
                    disabled={isViewing}
                  >
                    <option value=''>General / No Specific Project</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300'>
                  Organizer / Faculty Guide
                </label>
                <div className='relative'>
                  <UserCheck
                    size={16}
                    className='pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400'
                  />
                  <select
                    name='organizer'
                    className='w-full appearance-none rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 !pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none transition focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 font-medium'
                    value={formData.organizer}
                    onChange={handleChange}
                    disabled={isViewing}
                  >
                    <option value=''>Select Faculty Organizer</option>
                    {organizers.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name} {o.email ? `(${o.email})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Date & Time Validation */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <Input
                label='Meeting Date'
                name='date'
                type='date'
                icon={CalendarIcon}
                min={todayStr}
                value={formData.date}
                onChange={handleChange}
                readOnly={isViewing}
                required
              />

              <Input
                label='Meeting Time'
                name='time'
                type='time'
                icon={Clock}
                value={formData.time}
                onChange={handleChange}
                readOnly={isViewing}
                required
              />
            </div>

            {/* Location / Video Call Link */}
            <Input
              label='Location / Video Call Link'
              name='location'
              type='text'
              icon={formData.location.includes('http') ? LinkIcon : MapPin}
              placeholder='e.g. Room 101 or https://meet.google.com/abc-defg-hij'
              value={formData.location}
              onChange={handleChange}
              readOnly={isViewing}
              helperText='Enter room number or paste Google Meet / Zoom meeting link'
              required
            />

            {/* Agenda & Description */}
            <div>
              <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300'>
                Agenda & Discussion Topics
              </label>
              <textarea
                name='description'
                rows={4}
                className='w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none transition focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50'
                placeholder='Detail key objectives, deliverables to review, and target outcomes...'
                value={formData.description}
                onChange={handleChange}
                readOnly={isViewing}
              />
            </div>

            {/* Student Participants Selection */}
            {students.length > 0 && (
              <div>
                <label className='mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300'>
                  Select Student Participants ({formData.participants.length}{' '}
                  selected)
                </label>
                <div className='max-h-48 overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-700 p-3 bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-900/50 space-y-2'>
                  {students.map((student) => {
                    const isSelected = formData.participants.includes(
                      student.id
                    );
                    return (
                      <div
                        key={student.id}
                        onClick={() => handleParticipantToggle(student.id)}
                        className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-50/80 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-200'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700  /50'
                        }`}
                      >
                        <div className='flex items-center gap-2.5'>
                          <Users
                            size={16}
                            className={
                              isSelected ? 'text-indigo-600' : 'text-slate-400'
                            }
                          />
                          <div>
                            <p className='text-xs font-bold'>{student.name}</p>
                            <p className='text-[10px] text-slate-500 dark:text-slate-400'>
                              {student.rollNumber || student.email}
                            </p>
                          </div>
                        </div>
                        {isSelected && (
                          <CheckCircle2
                            size={16}
                            className='text-indigo-600 dark:text-indigo-400'
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Actions */}
            {!isViewing && (
              <div className='flex items-center justify-end gap-3 border-t border-slate-100 pt-6 dark:border-slate-700'>
                <button
                  type='button'
                  onClick={handleClose}
                  className='rounded-xl border border-slate-200 bg-white dark:bg-slate-900 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 dark:border-slate-600 dark:bg-slate-700  transition-colors'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={loading}
                  className='flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100 dark:shadow-none disabled:opacity-50'
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className='animate-spin' />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      <span>
                        {isEditing ? 'Update Meeting' : 'Schedule Meeting'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
});

MeetingForm.displayName = 'MeetingForm';
export default MeetingForm;
