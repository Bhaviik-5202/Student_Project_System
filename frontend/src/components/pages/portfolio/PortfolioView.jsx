import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../utils/api';

const PortfolioView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  const [portfolioData, setPortfolioData] = useState({
    student: {
      name: '',
      title: '',
      avatar: '',
      university: '',
      major: '',
      graduation: '',
      email: '',
    },
    stats: { projects: 0, skills: 0, achievements: 0, contributions: 0 },
    projects: [],
    skills: [],
    achievements: [],
    education: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/portfolio/${id || 'me'}`);
        if (response.data) {
          setPortfolioData(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch portfolio data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const tabs = useMemo(
    () => [
      { id: 'overview', name: 'Overview', icon: 'fas fa-home' },
      { id: 'projects', name: 'Projects', icon: 'fas fa-project-diagram' },
      { id: 'skills', name: 'Skills', icon: 'fas fa-code' },
      { id: 'achievements', name: 'Achievements', icon: 'fas fa-trophy' },
      { id: 'education', name: 'Education', icon: 'fas fa-graduation-cap' },
      { id: 'contact', name: 'Contact', icon: 'fas fa-envelope' },
    ],
    []
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className='space-y-6'>
            <div className='rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 p-6'>
              <h3 className='mb-4 text-xl font-bold text-gray-800'>
                Welcome to My Portfolio
              </h3>
              <p className='mb-4 text-gray-700'>
                Passionate software engineering student with expertise in
                full-stack development, machine learning, and project
                management. Seeking opportunities to apply skills in innovative
                projects and collaborative environments.
              </p>
            </div>

            <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
              {Object.entries(portfolioData.stats).map(([key, value]) => (
                <div
                  key={key}
                  className='rounded-lg border border-gray-200 bg-white p-4 text-center'
                >
                  <div className='text-2xl font-bold text-blue-600'>
                    {value}
                  </div>
                  <div className='text-sm capitalize text-gray-600'>{key}</div>
                </div>
              ))}
            </div>

            <div>
              <h3 className='mb-4 text-lg font-bold text-gray-800'>
                Featured Projects
              </h3>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                {portfolioData.projects.slice(0, 2).map((project) => (
                  <div
                    key={project.id}
                    className='overflow-hidden rounded-lg border border-gray-200'
                  >
                    <div className='h-40 bg-gray-200'></div>
                    <div className='p-4'>
                      <h4 className='mb-2 font-bold text-gray-800'>
                        {project.name}
                      </h4>
                      <p className='mb-3 text-sm text-gray-600'>
                        {project.description}
                      </p>
                      <div className='flex flex-wrap gap-2'>
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className='rounded bg-gray-100 px-2 py-1 text-xs text-gray-700'
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'projects':
        return (
          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-bold text-gray-800'>
                Projects ({portfolioData.projects.length})
              </h3>
              <select className='rounded-lg border border-gray-300 px-3 py-2'>
                <option>All Projects</option>
                <option>Completed</option>
                <option>In Progress</option>
              </select>
            </div>

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {portfolioData.projects.map((project) => (
                <div
                  key={project.id}
                  className='overflow-hidden rounded-lg border border-gray-200 transition-shadow hover:shadow-md'
                >
                  <div className='relative h-48 bg-gray-200'>
                    <div className='absolute right-3 top-3'>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          project.status === 'Completed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                  </div>
                  <div className='p-4'>
                    <div className='mb-2 flex items-start justify-between'>
                      <h4 className='font-bold text-gray-800'>
                        {project.name}
                      </h4>
                      <span className='text-sm text-gray-500'>
                        {project.date}
                      </span>
                    </div>
                    <p className='mb-4 text-sm text-gray-600'>
                      {project.description}
                    </p>
                    <div className='mb-4 flex flex-wrap gap-2'>
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className='rounded bg-blue-100 px-2 py-1 text-xs text-blue-700'
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className='flex space-x-2'>
                      <button
                        onClick={() =>
                          navigate(`/projects/${project.id || project._id}`)
                        }
                        className='flex-1 rounded-lg bg-blue-600 py-2 text-sm text-white hover:bg-blue-700'
                      >
                        View Details
                      </button>
                      <button className='rounded-lg border border-gray-300 p-2 hover:bg-gray-50'>
                        <i className='fas fa-external-link-alt'></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'skills':
        return (
          <div className='space-y-6'>
            <h3 className='text-lg font-bold text-gray-800'>
              Skills & Expertise
            </h3>

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              {portfolioData.skills.map((skill, index) => (
                <div
                  key={index}
                  className='rounded-lg border border-gray-200 bg-white p-4'
                >
                  <div className='mb-2 flex items-center justify-between'>
                    <span className='font-medium text-gray-800'>
                      {skill.name}
                    </span>
                    <span className='text-sm text-gray-500'>
                      {skill.category}
                    </span>
                  </div>
                  <div className='h-2 overflow-hidden rounded-full bg-gray-200'>
                    <div
                      className='h-full rounded-full bg-blue-500'
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                  <div className='mt-1 text-right text-sm text-gray-500'>
                    {skill.level}%
                  </div>
                </div>
              ))}
            </div>

            <div className='rounded-lg bg-gray-50 p-6'>
              <h4 className='mb-4 font-bold text-gray-800'>Skill Categories</h4>
              <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                {['Frontend', 'Backend', 'Design', 'Soft Skills'].map(
                  (category) => {
                    const categorySkills = portfolioData.skills.filter(
                      (s) => s.category === category
                    );
                    const avgLevel =
                      categorySkills.length > 0
                        ? Math.round(
                            categorySkills.reduce(
                              (sum, s) => sum + s.level,
                              0
                            ) / categorySkills.length
                          )
                        : 0;

                    return (
                      <div key={category} className='text-center'>
                        <div className='text-2xl font-bold text-blue-600'>
                          {avgLevel}%
                        </div>
                        <div className='text-sm text-gray-600'>{category}</div>
                        <div className='text-xs text-gray-500'>
                          {categorySkills.length} skills
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        );

      case 'achievements':
        return (
          <div className='space-y-6'>
            <h3 className='text-lg font-bold text-gray-800'>
              Achievements & Awards
            </h3>

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {portfolioData.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className='rounded-lg border border-gray-200 p-5 text-center transition-shadow hover:shadow-md'
                >
                  <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100'>
                    <i className='fas fa-trophy text-2xl text-yellow-600'></i>
                  </div>
                  <h4 className='mb-2 font-bold text-gray-800'>
                    {achievement.title}
                  </h4>
                  <div className='mb-2 text-sm text-gray-600'>
                    {achievement.issuer}
                  </div>
                  <div className='text-xs text-gray-500'>
                    {achievement.date}
                  </div>
                </div>
              ))}
            </div>

            <div className='rounded-lg bg-blue-50 p-6'>
              <h4 className='mb-2 font-bold text-gray-800'>Certifications</h4>
              <div className='space-y-3'>
                {[
                  'AWS Certified Developer',
                  'Google Cloud Professional',
                  'React Developer Certification',
                  'Scrum Master Certification',
                ].map((cert) => (
                  <div
                    key={cert}
                    className='flex items-center justify-between rounded-lg bg-white p-3'
                  >
                    <div className='flex items-center space-x-3'>
                      <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-green-100'>
                        <i className='fas fa-certificate text-green-600'></i>
                      </div>
                      <span className='font-medium'>{cert}</span>
                    </div>
                    <button className='text-blue-600 hover:text-blue-800'>
                      <i className='fas fa-external-link-alt'></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'education':
        return (
          <div className='space-y-6'>
            <h3 className='text-lg font-bold text-gray-800'>Education</h3>

            <div className='space-y-4'>
              {portfolioData.education.map((edu, index) => (
                <div
                  key={index}
                  className='border-l-4 border-blue-500 py-2 pl-4'
                >
                  <h4 className='font-bold text-gray-800'>{edu.degree}</h4>
                  <p className='text-gray-600'>{edu.school}</p>
                  <p className='text-sm text-gray-500'>{edu.year}</p>
                </div>
              ))}
            </div>

            <div className='rounded-lg bg-gray-50 p-6'>
              <h4 className='mb-4 font-bold text-gray-800'>
                Academic Performance
              </h4>
              <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-blue-600'>3.8</div>
                  <div className='text-sm text-gray-600'>GPA</div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-green-600'>42</div>
                  <div className='text-sm text-gray-600'>Credits</div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-purple-600'>12</div>
                  <div className='text-sm text-gray-600'>Courses</div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-yellow-600'>95%</div>
                  <div className='text-sm text-gray-600'>Attendance</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className='space-y-6'>
            <h3 className='text-lg font-bold text-gray-800'>
              Contact Information
            </h3>

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <div className='space-y-4'>
                <div className='flex items-center space-x-3 rounded-lg border border-gray-200 p-4'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100'>
                    <i className='fas fa-envelope text-blue-600'></i>
                  </div>
                  <div>
                    <div className='font-medium'>Email</div>
                    <div className='text-gray-600'>
                      {portfolioData.student.email}
                    </div>
                  </div>
                </div>

                <div className='flex items-center space-x-3 rounded-lg border border-gray-200 p-4'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-green-100'>
                    <i className='fas fa-university text-green-600'></i>
                  </div>
                  <div>
                    <div className='font-medium'>University</div>
                    <div className='text-gray-600'>
                      {portfolioData.student.university}
                    </div>
                  </div>
                </div>
              </div>

              <div className='space-y-4'>
                <div className='flex items-center space-x-3 rounded-lg border border-gray-200 p-4'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100'>
                    <i className='fas fa-graduation-cap text-purple-600'></i>
                  </div>
                  <div>
                    <div className='font-medium'>Major</div>
                    <div className='text-gray-600'>
                      {portfolioData.student.major}
                    </div>
                  </div>
                </div>

                <div className='flex items-center space-x-3 rounded-lg border border-gray-200 p-4'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100'>
                    <i className='fas fa-calendar-alt text-yellow-600'></i>
                  </div>
                  <div>
                    <div className='font-medium'>Graduation</div>
                    <div className='text-gray-600'>
                      {portfolioData.student.graduation}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='rounded-lg bg-blue-50 p-6'>
              <h4 className='mb-4 font-bold text-gray-800'>Connect With Me</h4>
              <div className='flex space-x-4'>
                {['linkedin', 'github', 'twitter', 'portfolio'].map(
                  (platform) => (
                    <button
                      key={platform}
                      className='flex-1 rounded-lg border border-gray-300 bg-white py-3 capitalize hover:bg-gray-50'
                    >
                      <i className={`fab fa-${platform} mr-2`}></i>
                      {platform}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
  }, []);

  if (loading)
    return (
      <div className='p-6 text-center text-slate-500'>Loading portfolio...</div>
    );

  return (
    <div className='rounded-lg bg-white shadow dark:bg-slate-900'>
      {/* Header */}
      <div className='rounded-t-lg bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white dark:from-blue-800 dark:to-blue-900'>
        <div className='flex flex-col items-center space-y-4 md:flex-row md:items-start md:space-x-6 md:space-y-0'>
          <div className='h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-white'>
            <img
              src={portfolioData.student.avatar}
              alt='Avatar'
              className='h-full w-full object-cover'
            />
          </div>
          <div className='flex-1 text-center md:text-left'>
            <h1 className='text-3xl font-bold'>{portfolioData.student.name}</h1>
            <p className='text-xl opacity-90'>{portfolioData.student.title}</p>
            <div className='mt-4 flex flex-wrap gap-2'>
              {[
                'Software Engineer',
                'Web Developer',
                'Machine Learning Enthusiast',
                'Team Player',
              ].map((tag) => (
                <span
                  key={tag}
                  className='rounded-full bg-white bg-opacity-20 px-3 py-1 text-sm'
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className='flex space-x-3'>
            <button className='rounded-lg bg-white px-4 py-2 font-medium text-blue-600 hover:bg-opacity-90'>
              <i className='fas fa-download mr-2'></i>
              Download CV
            </button>
            <button className='rounded-lg border border-white px-4 py-2 text-white hover:bg-white hover:text-blue-600'>
              <i className='fas fa-share-alt mr-2'></i>
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className='border-b border-gray-200'>
        <div className='flex overflow-x-auto'>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 whitespace-nowrap px-6 py-4 font-medium ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <i className={tab.icon}></i>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className='p-6'>{renderTabContent()}</div>

      {/* Footer */}
      <div className='border-t border-slate-200 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400'>
        <p>
          Portfolio generated using Project Management System • Last updated:{' '}
          {new Date().toLocaleDateString()}
        </p>
        <p className='mt-1'>
          © {new Date().getFullYear()} {portfolioData.student.name}. All rights
          reserved.
        </p>
      </div>
    </div>
  );
};

PortfolioView.displayName = 'PortfolioView';

export default React.memo(PortfolioView);
