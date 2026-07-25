import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Video,
  FileText,
  Paperclip,
  User,
  Briefcase,
} from 'lucide-react';
import meetingService from '../../../services/meetingService';
import PageHeader from '../../common/PageHeader';
import { useAuth } from '../../../hooks/useAuth';
import { MEETING_TYPES } from '../../../utils/constants';
import '../../../assets/styles/meetings.css';

const TYPE_LABELS = {
  [MEETING_TYPES.TEAM]: 'Team Meeting',
  [MEETING_TYPES.PROJECT]: 'Project Review',
  [MEETING_TYPES.ONE_ON_ONE]: 'One-on-One',
  [MEETING_TYPES.CLIENT]: 'Client Meeting',
  review: 'Project Review',
  faculty: 'Faculty Meeting',
};

const isUrl = (value) => /^https?:\/\//i.test(value || '');

const getMeetingStatus = (date) => {
  if (!date) return 'scheduled';
  const now = new Date();
  const meetingDate = new Date(date);
  const diffMs = meetingDate - now;
  if (diffMs > 60 * 60 * 1000) return 'scheduled';
  if (diffMs >= -60 * 60 * 1000) return 'in_progress';
  return 'completed';
};

const STATUS_STYLES = {
  scheduled:
    'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  in_progress:
    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  completed:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  cancelled: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
};

const formatTime = (date, time) => {
  if (time) return time;
  if (!date) return 'N/A';
  return new Date(date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const isReviewMeeting = (type) =>
  type === 'review' || type === MEETING_TYPES.PROJECT;

const MeetingDetails = memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joining, setJoining] = useState(false);

  const fetchMeeting = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await meetingService.getMeetingById(id);
      if (response.success && response.data) {
        setMeeting(response.data);
      } else {
        setError(response.message || 'Meeting not found.');
        toast.error(response.message || 'Failed to load meeting details');
      }
    } catch {
      setError('Unable to retrieve meeting information.');
      toast.error('Failed to load meeting details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMeeting();
  }, [fetchMeeting]);

  useEffect(() => {
    if (meeting?.title) {
      document.title = `${meeting.title} | Student Project System`;
    }
    return () => {
      document.title = 'Student Project System';
    };
  }, [meeting]);

  const meetingLink = useMemo(
    () => (isUrl(meeting?.location) ? meeting.location : null),
    [meeting]
  );

  const status = useMemo(
    () => getMeetingStatus(meeting?.date),
    [meeting?.date]
  );

  const canManage = user?.role === 'admin';

  const canJoin = useMemo(() => {
    if (!user || !meeting) return false;
    if (user.role === 'admin' || user.role === 'faculty') return true;
    const userId = user.id || user._id;
    const participants = meeting.participants || [];
    if (participants.length === 0) return true;
    return participants.some(
      (p) => (p._id || p.id || p)?.toString() === userId?.toString()
    );
  }, [user, meeting]);

  const handleJoin = useCallback(async () => {
    if (!meetingLink) {
      toast.error('No meeting link available for this session');
      return;
    }
    if (!canJoin) {
      toast.error('You do not have permission to join this meeting');
      return;
    }
    setJoining(true);
    try {
      const res = await meetingService.joinMeeting(id);
      if (!res.success) {
        toast.error(res.message || 'Unable to join meeting');
        return;
      }
      window.open(meetingLink, '_blank', 'noopener,noreferrer');
    } catch {
      toast.error('Failed to join meeting');
    } finally {
      setJoining(false);
    }
  }, [meetingLink, canJoin, id]);

  const handleDelete = useCallback(async () => {
    if (!window.confirm('Are you sure you want to cancel this meeting?'))
      return;
    const res = await meetingService.deleteMeeting(id);
    if (res.success) {
      toast.success('Meeting cancelled successfully');
      navigate('/meetings/list');
    } else {
      toast.error(res.message || 'Failed to cancel meeting');
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className='flex min-h-[60vh] flex-col items-center justify-center gap-4'>
        <div className='h-12 w-12 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-500' />
        <p className='animate-pulse text-sm font-medium text-gray-400'>
          Loading meeting details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='mx-auto max-w-md p-8 text-center'>
        <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20'>
          <Calendar className='h-8 w-8 text-red-500' />
        </div>
        <h3 className='mb-2 text-lg font-bold text-gray-900 dark:text-white'>
          Meeting Not Found
        </h3>
        <p className='mb-6 text-sm text-gray-500 dark:text-gray-400'>{error}</p>
        <button
          onClick={() => navigate('/meetings/list')}
          className='meeting-btn meeting-btn-primary px-8'
        >
          Back to Meeting Management
        </button>
      </div>
    );
  }

  if (!meeting) return null;

  const typeLabel =
    TYPE_LABELS[meeting.type] || meeting.type?.replace(/_/g, ' ') || 'Meeting';
  const participants = Array.isArray(meeting.participants)
    ? meeting.participants
    : [];
  const project = meeting.project;
  const guide = project?.guide;

  return (
    <div className='meeting-page animate-fade-in'>
      <div className='meeting-container'>
        <PageHeader
          title={meeting.title}
          subtitle={`Type: ${typeLabel}`}
          icon={Calendar}
          badge={status.replace('_', ' ')}
          actions={
            <>
              <button
                onClick={() => navigate('/meetings/list')}
                className='flex items-center gap-2 rounded-xl border border-gray-200 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-bold text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-800 dark:border-slate-700 dark:bg-slate-800  transition-all'
              >
                <ArrowLeft size={16} />
                Back to Meeting Management
              </button>
              {isReviewMeeting(meeting.type) && (
                <button
                  onClick={handleJoin}
                  disabled={joining}
                  className='flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition-all disabled:opacity-50'
                >
                  <Video size={16} />
                  {joining ? 'Joining...' : 'Join Meeting'}
                </button>
              )}
              {canManage && (
                <button
                  onClick={() => navigate(`/meetings/${id}/edit`)}
                  className='rounded-xl border border-gray-200 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-bold text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-800 dark:border-slate-700 dark:bg-slate-800  transition-all'
                >
                  Edit
                </button>
              )}
            </>
          }
        />

        <br />
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          <div className='space-y-6 lg:col-span-2'>
            <div className='meeting-card'>
              <div className='meeting-card-body'>
                <h2 className='meeting-subtitle mb-4'>Description</h2>
                <p className='leading-relaxed text-gray-600 dark:text-gray-400'>
                  {meeting.description || 'No description provided.'}
                </p>
              </div>
            </div>

            <div className='meeting-card'>
              <div className='meeting-card-body'>
                <h2 className='meeting-subtitle mb-4'>Schedule</h2>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                  <div className='flex items-start gap-3'>
                    <Calendar className='mt-0.5 h-5 w-5 text-indigo-500' />
                    <div>
                      <span className='mb-1 block text-[10px] font-black uppercase tracking-widest text-gray-400'>
                        Date
                      </span>
                      <p className='text-sm font-bold text-gray-900 dark:text-white'>
                        {meeting.date
                          ? new Date(meeting.date).toLocaleDateString(
                              undefined,
                              {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              }
                            )
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-start gap-3'>
                    <Clock className='mt-0.5 h-5 w-5 text-indigo-500' />
                    <div>
                      <span className='mb-1 block text-[10px] font-black uppercase tracking-widest text-gray-400'>
                        Time
                      </span>
                      <p className='text-sm font-bold text-gray-900 dark:text-white'>
                        {formatTime(meeting.date, meeting.time)}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-start gap-3'>
                    <Clock className='mt-0.5 h-5 w-5 text-indigo-500' />
                    <div>
                      <span className='mb-1 block text-[10px] font-black uppercase tracking-widest text-gray-400'>
                        Duration
                      </span>
                      <p className='text-sm font-bold text-gray-900 dark:text-white'>
                        {meeting.duration || '1 hour'}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-start gap-3'>
                    <MapPin className='mt-0.5 h-5 w-5 text-indigo-500' />
                    <div>
                      <span className='mb-1 block text-[10px] font-black uppercase tracking-widest text-gray-400'>
                        Location
                      </span>
                      <p className='text-sm font-bold text-gray-900 dark:text-white'>
                        {meeting.location || 'Online'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {meetingLink && (
              <div className='meeting-card'>
                <div className='meeting-card-body'>
                  <h2 className='meeting-subtitle mb-4'>Meeting Link</h2>
                  <a
                    href={meetingLink}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:underline dark:text-indigo-400'
                  >
                    <Video size={16} />
                    {meetingLink}
                  </a>
                </div>
              </div>
            )}

            <div className='meeting-card'>
              <div className='meeting-card-body'>
                <h2 className='meeting-subtitle mb-4'>Notes</h2>
                <div className='flex items-start gap-3'>
                  <FileText className='mt-0.5 h-5 w-5 text-gray-400' />
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    {meeting.notes || meeting.description || 'No notes added.'}
                  </p>
                </div>
              </div>
            </div>

            <div className='meeting-card'>
              <div className='meeting-card-body'>
                <h2 className='meeting-subtitle mb-4'>Attachments</h2>
                {Array.isArray(meeting.attachments) &&
                meeting.attachments.length > 0 ? (
                  <ul className='space-y-2'>
                    {meeting.attachments.map((file, index) => (
                      <li key={index}>
                        <a
                          href={file.url || file}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400'
                        >
                          <Paperclip size={14} />
                          {file.name || file}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className='text-sm italic text-gray-400'>
                    No attachments available.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className='space-y-6'>
            <div className='meeting-card'>
              <div className='meeting-card-body'>
                <h2 className='meeting-subtitle mb-4'>Meeting Info</h2>
                <div className='space-y-4'>
                  <div>
                    <span className='mb-1 block text-[10px] font-black uppercase tracking-widest text-gray-400'>
                      Type
                    </span>
                    <p className='text-sm font-bold text-gray-900 dark:text-white'>
                      {typeLabel}
                    </p>
                  </div>
                  <div>
                    <span className='mb-1 block text-[10px] font-black uppercase tracking-widest text-gray-400'>
                      Status
                    </span>
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${STATUS_STYLES[status]}`}
                    >
                      {status.replace('_', ' ')}
                    </span>
                  </div>
                  <div>
                    <span className='mb-1 block text-[10px] font-black uppercase tracking-widest text-gray-400'>
                      Organizer
                    </span>
                    <p className='text-sm font-bold text-gray-900 dark:text-white'>
                      {meeting.organizer?.name ||
                        guide?.name ||
                        'Faculty Member'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {project && (
              <div className='meeting-card'>
                <div className='meeting-card-body'>
                  <h2 className='meeting-subtitle mb-4'>Project</h2>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-500 dark:border-slate-700 dark:bg-slate-900'>
                      <Briefcase size={18} />
                    </div>
                    <div>
                      <p className='text-sm font-black text-gray-900 dark:text-white'>
                        {project.title || 'Untitled Project'}
                      </p>
                      {project._id && (
                        <button
                          onClick={() =>
                            navigate(`/projects/${project.slug || project._id}`)
                          }
                          className='text-[10px] font-bold uppercase text-indigo-600 hover:underline dark:text-indigo-400'
                        >
                          View Project
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {guide && (
              <div className='meeting-card'>
                <div className='meeting-card-body'>
                  <h2 className='meeting-subtitle mb-4'>Guide / Faculty</h2>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-500 dark:border-slate-700 dark:bg-slate-900'>
                      <User size={18} />
                    </div>
                    <div>
                      <p className='text-sm font-black text-gray-900 dark:text-white'>
                        {guide.name || 'Not Assigned'}
                      </p>
                      <p className='text-[10px] font-bold uppercase text-gray-400'>
                        Faculty Mentor
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className='meeting-card'>
              <div className='meeting-card-body'>
                <h2 className='meeting-subtitle mb-4'>
                  Participants ({participants.length})
                </h2>
                <div className='space-y-3'>
                  {participants.length > 0 ? (
                    participants.map((participant, index) => (
                      <div
                        key={participant._id || index}
                        className='flex items-center gap-3'
                      >
                        <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-500 dark:text-gray-400 dark:bg-slate-900'>
                          {participant.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <span className='text-sm font-bold text-gray-900 dark:text-white'>
                            {participant.name || 'Unknown User'}
                          </span>
                          {participant.role && (
                            <p className='text-[10px] font-bold uppercase text-gray-400'>
                              {participant.role}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className='text-xs italic text-gray-400'>
                      No participants listed
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

MeetingDetails.displayName = 'MeetingDetails';
export default MeetingDetails;
