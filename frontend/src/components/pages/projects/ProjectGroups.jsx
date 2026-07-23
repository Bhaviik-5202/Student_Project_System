import React, { memo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, Plus, UserCheck, Users, ExternalLink } from 'lucide-react';
import api from '../../../utils/api';
import {
  PageHeader,
  Card,
  StatusBadge,
  PrimaryButton,
  SecondaryButton,
  LoadingState,
  EmptyState,
} from './ui';

const GroupCard = memo(({ group }) => {
  const navigate = useNavigate();

  const title = group.name || group.title || 'Untitled Project Group';

  const guideName = group.guide
    ? typeof group.guide === 'object'
      ? group.guide.name || group.guide.email || 'Assigned Guide'
      : group.guide
    : 'Not Assigned';

  const membersList = Array.isArray(group.members)
    ? group.members
        .map((m) => (typeof m === 'object' ? m.name || m.email : m))
        .filter(Boolean)
        .join(', ')
    : 'No team members';

  return (
    <Card className='flex flex-col justify-between space-y-4 !p-5'>
      <div className='flex items-start justify-between gap-3'>
        <div className='min-w-0 flex-1'>
          <h3 className='truncate text-base font-bold text-gray-900 dark:text-white'>
            {title}
          </h3>
          <div className='flex items-center gap-2 mt-1.5'>
            <StatusBadge status={group.status || 'assigned'} />
            <span className='text-[10px] font-bold uppercase text-gray-400'>
              {group.progress || 0}% PROGRESS
            </span>
          </div>
        </div>
        <SecondaryButton
          size='sm'
          icon={ExternalLink}
          onClick={() =>
            navigate(
              `/projects/${group.slug || group.projectId || group.id || group._id}`
            )
          }
        >
          Details
        </SecondaryButton>
      </div>

      <div className='space-y-2 border-t border-gray-100 pt-3 dark:border-slate-700/60 text-xs'>
        <div className='flex items-center gap-2 text-gray-600 dark:text-gray-300'>
          <UserCheck size={15} className='text-indigo-500 shrink-0' />
          <span className='truncate'>
            <strong className='font-semibold text-gray-800 dark:text-gray-200'>Guide:</strong> {guideName}
          </span>
        </div>
        <div className='flex items-center gap-2 text-gray-600 dark:text-gray-300'>
          <Users size={15} className='text-indigo-500 shrink-0' />
          <span className='truncate'>
            <strong className='font-semibold text-gray-800 dark:text-gray-200'>Team:</strong> {membersList}
          </span>
        </div>
      </div>

      <div className='border-t border-gray-100 pt-3 dark:border-slate-700'>
        <div className='h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-slate-900'>
          <div
            className='h-full bg-indigo-500 transition-all duration-700 rounded-full'
            style={{ width: `${group.progress || 0}%` }}
          />
        </div>
      </div>
    </Card>
  );
});

GroupCard.displayName = 'GroupCard';

const ProjectGroupsList = memo(() => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await api.get('/projects/groups');
        const data = response.data || [];
        setGroups(data);
      } catch (error) {
        console.error('Failed to fetch project groups', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  return (
    <div className='space-y-6 p-4 md:p-6 animate-fade-in'>
      <PageHeader
        title='Project Groups'
        subtitle='Management for collaborative ventures'
        icon={FolderKanban}
        actions={
          <PrimaryButton
            icon={Plus}
            onClick={() => navigate('/projects/new')}
          >
            Create Group
          </PrimaryButton>
        }
      />

      {loading ? (
        <LoadingState message='Synchronizing groups...' />
      ) : groups.length === 0 ? (
        <EmptyState
          title='No Groups Found'
          description='System is currently clear of any project groups. Initialize a new one to begin.'
          icon={FolderKanban}
          actionText='Create Group'
          onAction={() => navigate('/projects/new')}
        />
      ) : (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3'>
          {groups.map((group) => (
            <GroupCard key={group.id || group._id} group={group} />
          ))}
        </div>
      )}
    </div>
  );
});

ProjectGroupsList.displayName = 'ProjectGroupsList';
export default ProjectGroupsList;
