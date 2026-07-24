import { memo } from 'react';

/**
 * Skeleton Components for smooth loading states
 */
export const Skeleton = memo(({ className = '', width, height, circle }) => {
  const style = {
    width: width || '100%',
    height: height || '1em',
    borderRadius: circle ? '50%' : '4px',
  };

  return <div className={`skeleton ${className}`} style={style} />;
});

export const DashboardSkeleton = () => (
  <div className='space-y-6'>
    <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className='rounded-2xl border border-slate-100 bg-white dark:bg-slate-900 p-6 shadow-sm dark:border-slate-700/50 dark:bg-slate-800'
        >
          <Skeleton width='40%' height='12px' className='mb-4' />
          <Skeleton width='70%' height='28px' className='mb-2' />
          <Skeleton width='30%' height='10px' />
        </div>
      ))}
    </div>

    <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
      <div className='min-h-[400px] rounded-2xl border border-slate-100 bg-white dark:bg-slate-900 p-6 shadow-sm dark:border-slate-700/50 dark:bg-slate-800 lg:col-span-2'>
        <div className='mb-6 flex items-center justify-between'>
          <Skeleton width='120px' height='20px' />
          <Skeleton width='80px' height='32px' />
        </div>
        <div className='space-y-4'>
          <Skeleton height='300px' />
        </div>
      </div>

      <div className='rounded-2xl border border-slate-100 bg-white dark:bg-slate-900 p-6 shadow-sm dark:border-slate-700/50 dark:bg-slate-800'>
        <Skeleton width='100px' height='20px' className='mb-6' />
        <div className='space-y-6'>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className='flex gap-4'>
              <Skeleton circle width='40px' height='40px' />
              <div className='flex-1 space-y-2'>
                <Skeleton width='60%' />
                <Skeleton width='40%' height='10px' />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const TableSkeleton = () => (
  <div className='overflow-hidden rounded-2xl border border-slate-100 bg-white dark:bg-slate-900 shadow-sm dark:border-slate-700/50 dark:bg-slate-800'>
    <div className='flex items-center justify-between border-b border-slate-100 p-6 dark:border-slate-700/50'>
      <Skeleton width='150px' height='24px' />
      <div className='flex gap-3'>
        <Skeleton width='100px' height='36px' />
        <Skeleton width='100px' height='36px' />
      </div>
    </div>
    <div className='p-0'>
      <div className='grid grid-cols-5 border-b border-slate-50 bg-slate-50 dark:bg-slate-800/50 p-4 dark:border-slate-800 dark:bg-slate-900/50'>
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} width='60%' height='12px' />
        ))}
      </div>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className='grid grid-cols-5 border-b border-slate-50 p-4 dark:border-slate-800'
        >
          {[1, 2, 3, 4, 5].map((j) => (
            <Skeleton key={j} width='80%' height='14px' />
          ))}
        </div>
      ))}
    </div>
  </div>
);

export default Skeleton;
