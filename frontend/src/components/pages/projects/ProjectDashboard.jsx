/**
 * ProjectDashboard Component
 * Dedicated dashboard view for Project Module overview metrics, status breakdown, and guide workload.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  BarChart2,
  Layers,
} from 'lucide-react';
import projectService from '../../../services/projectService';
import { useAuth } from '../../../hooks/useAuth';
import {
  PageHeader,
  SectionHeader,
  StatsCard,
  Card,
  PrimaryButton,
  SecondaryButton,
  LoadingState,
  EmptyState,
} from './ui';

const ProjectDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const data = await projectService.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load project dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) {
    return <LoadingState message='Loading Project Dashboard...' />;
  }

  const cards = [
    {
      title: 'Total Projects',
      value: stats?.totalProjects || 0,
      icon: FolderKanban,
      textColor: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/30',
      link: '/projects',
    },
    {
      title: 'In Progress',
      value: stats?.activeProjects || 0,
      icon: Clock,
      textColor: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/30',
      link: '/projects?status=in_progress',
    },
    {
      title: 'Under Review',
      value: stats?.underReviewProjects || 0,
      icon: AlertCircle,
      textColor: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-900/30',
      link: '/projects?status=under_review',
    },
    {
      title: 'Completed',
      value: stats?.completedProjects || 0,
      icon: CheckCircle2,
      textColor: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/30',
      link: '/projects?status=completed',
    },
  ];

  return (
    <div className='space-y-6 p-4 md:p-6 animate-fade-in'>
      {/* Header Banner */}
      <PageHeader
        title='Project Governance Dashboard'
        subtitle='Real-time analytics and management for academic final year projects'
        icon={FolderKanban}
        actions={
          <>
            <SecondaryButton onClick={() => navigate('/projects')}>
              Project Catalog
            </SecondaryButton>
            <PrimaryButton icon={Plus} onClick={() => navigate('/projects/new')}>
              Create Project
            </PrimaryButton>
          </>
        }
      />

      {/* Metric Cards Grid */}
      <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4'>
        {cards.map((card, idx) => (
          <StatsCard
            key={idx}
            title={card.title}
            value={card.value}
            icon={card.icon}
            textColor={card.textColor}
            bgColor={card.bgColor}
            onClick={() => navigate(card.link)}
          />
        ))}
      </div>

      {/* Detailed Analytics Grid */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        {/* Department Breakdown */}
        <Card className='lg:col-span-2'>
          <SectionHeader
            title='Department Distribution'
            subtitle='Projects count by academic branch'
            icon={BarChart2}
          />

          <div className='space-y-4 mt-6'>
            {!stats?.departmentBreakdown || stats.departmentBreakdown.length === 0 ? (
              <EmptyState
                title='No Department Data'
                description='No department distribution records available.'
                icon={BarChart2}
              />
            ) : (
              stats.departmentBreakdown.map((dept, idx) => {
                const total = stats?.totalProjects || 1;
                const pct = Math.round((dept.count / total) * 100);
                return (
                  <div key={idx} className='space-y-1.5'>
                    <div className='flex justify-between text-xs font-bold text-gray-700 dark:text-gray-300'>
                      <span>{dept.department}</span>
                      <span>{dept.count} Projects ({pct}%)</span>
                    </div>
                    <div className='h-2.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-slate-900'>
                      <div
                        className='h-full bg-indigo-600 transition-all duration-500 rounded-full'
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <SectionHeader
            title='Domain Categories'
            subtitle='Technology domain distribution'
            icon={Layers}
          />

          <div className='space-y-3 mt-6'>
            {!stats?.categoryBreakdown || stats.categoryBreakdown.length === 0 ? (
              <EmptyState
                title='No Category Data'
                description='No domain category records available.'
                icon={Layers}
              />
            ) : (
              stats.categoryBreakdown.map((cat, idx) => (
                <div
                  key={idx}
                  className='flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 p-3 dark:border-slate-700 dark:bg-slate-900/50'
                >
                  <span className='text-xs font-bold text-gray-800 dark:text-gray-200'>
                    {cat.category}
                  </span>
                  <span className='rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-extrabold text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'>
                    {cat.count}
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProjectDashboard;
