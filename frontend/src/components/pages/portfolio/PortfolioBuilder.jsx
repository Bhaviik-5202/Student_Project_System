import React, { useState, useCallback, useEffect, memo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../../utils/api';

const PortfolioBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState({
    name: 'My Professional Portfolio',
    description: 'Showcasing my projects and skills',
    visibility: 'public',
    sections: [
      {
        id: 1,
        title: 'About Me',
        type: 'text',
        content: 'Brief introduction...',
        enabled: true,
      },
      {
        id: 2,
        title: 'Projects',
        type: 'projects',
        content: [],
        enabled: true,
      },
      { id: 3, title: 'Skills', type: 'skills', content: [], enabled: true },
      {
        id: 4,
        title: 'Education',
        type: 'education',
        content: [],
        enabled: true,
      },
      {
        id: 5,
        title: 'Experience',
        type: 'experience',
        content: [],
        enabled: false,
      },
      {
        id: 6,
        title: 'Certifications',
        type: 'certifications',
        content: [],
        enabled: false,
      },
    ],
    theme: 'light',
    layout: 'modern',
  });

  const [activeSection, setActiveSection] = useState(1);
  const [realProjects, setRealProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects/my-projects');
        setRealProjects(res.data || []);
      } catch (error) {
        console.error('Failed to fetch projects', error);
      }
    };
    fetchProjects();
  }, []);

  const showNotification = useCallback((type, message) => {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 ${
      type === 'success'
        ? 'bg-emerald-500 text-white'
        : type === 'error'
          ? 'bg-rose-500 text-white'
          : type === 'warning'
            ? 'bg-amber-500 text-white'
            : 'bg-blue-500 text-white'
    }`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }, []);

  const handleSectionToggle = useCallback((sectionId) => {
    setPortfolio((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? { ...section, enabled: !section.enabled }
          : section
      ),
    }));
  }, []);

  const handleSectionOrder = useCallback((fromIndex, toIndex) => {
    setPortfolio((prev) => {
      const newSections = [...prev.sections];
      const [movedSection] = newSections.splice(fromIndex, 1);
      newSections.splice(toIndex, 0, movedSection);
      return { ...prev, sections: newSections };
    });
  }, []);

  const handleSave = useCallback(() => {
    showNotification('success', 'Portfolio saved successfully');
  }, [showNotification]);

  const handlePreview = useCallback(() => {
    showNotification('info', 'Opening preview...');
  }, [showNotification]);

  const handlePublish = useCallback(() => {
    showNotification('success', 'Portfolio published successfully');
  }, [showNotification]);

  return (
    <div className='rounded-lg bg-white p-6 shadow dark:bg-slate-900'>
      <div className='flex flex-col gap-8 lg:flex-row'>
        {/* Left Column - Builder Controls */}
        <div className='lg:w-1/3'>
          <div className='mb-8'>
            <h2 className='mb-6 text-2xl font-bold text-gray-800'>
              Portfolio Builder
            </h2>

            {/* Portfolio Settings */}
            <div className='mb-6 space-y-4'>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Portfolio Name
                </label>
                <input
                  type='text'
                  value={portfolio.name}
                  onChange={(e) =>
                    setPortfolio({ ...portfolio, name: e.target.value })
                  }
                  className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Description
                </label>
                <textarea
                  value={portfolio.description}
                  onChange={(e) =>
                    setPortfolio({ ...portfolio, description: e.target.value })
                  }
                  rows='3'
                  className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Visibility
                </label>
                <select
                  value={portfolio.visibility}
                  onChange={(e) =>
                    setPortfolio({ ...portfolio, visibility: e.target.value })
                  }
                  className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
                >
                  <option value='public'>Public</option>
                  <option value='private'>Private</option>
                  <option value='restricted'>Restricted Access</option>
                </select>
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Theme
                </label>
                <div className='flex space-x-2'>
                  {['light', 'dark', 'blue', 'green'].map((theme) => (
                    <button
                      key={theme}
                      onClick={() => setPortfolio({ ...portfolio, theme })}
                      className={`rounded-lg px-4 py-2 capitalize ${
                        portfolio.theme === theme
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Section Management */}
            <div className='mb-6'>
              <h3 className='mb-3 font-medium text-gray-700'>Sections</h3>
              <div className='space-y-2'>
                {portfolio.sections.map((section, index) => (
                  <div
                    key={section.id}
                    className='flex items-center justify-between rounded-lg border border-gray-200 p-3'
                  >
                    <div className='flex items-center space-x-3'>
                      <button
                        onClick={() => handleSectionToggle(section.id)}
                        className={`flex h-8 w-8 items-center justify-center rounded ${
                          section.enabled
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        <i
                          className={`fas fa-${
                            section.enabled ? 'check' : 'plus'
                          }`}
                        ></i>
                      </button>
                      <div>
                        <div className='font-medium'>{section.title}</div>
                        <div className='text-xs capitalize text-gray-500'>
                          {section.type}
                        </div>
                      </div>
                    </div>
                    <div className='flex space-x-1'>
                      <button
                        onClick={() => setActiveSection(section.id)}
                        className='p-1 text-blue-600 hover:text-blue-800'
                      >
                        <i className='fas fa-edit'></i>
                      </button>
                      <div className='flex flex-col'>
                        {index > 0 && (
                          <button
                            onClick={() => handleSectionOrder(index, index - 1)}
                            className='p-1 text-gray-400 hover:text-gray-600'
                          >
                            <i className='fas fa-chevron-up'></i>
                          </button>
                        )}
                        {index < portfolio.sections.length - 1 && (
                          <button
                            onClick={() => handleSectionOrder(index, index + 1)}
                            className='p-1 text-gray-400 hover:text-gray-600'
                          >
                            <i className='fas fa-chevron-down'></i>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className='space-y-3'>
              <button
                onClick={handleSave}
                className='flex w-full items-center justify-center rounded-lg bg-blue-600 py-3 text-white hover:bg-blue-700'
              >
                <i className='fas fa-save mr-2'></i>
                Save Draft
              </button>
              <button
                onClick={handlePreview}
                className='flex w-full items-center justify-center rounded-lg border border-blue-600 py-3 text-blue-600 hover:bg-blue-50'
              >
                <i className='fas fa-eye mr-2'></i>
                Preview
              </button>
              <button
                onClick={handlePublish}
                className='flex w-full items-center justify-center rounded-lg bg-green-600 py-3 text-white hover:bg-green-700'
              >
                <i className='fas fa-rocket mr-2'></i>
                Publish Portfolio
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Preview */}
        <div className='lg:w-2/3'>
          <div className='rounded-lg border border-gray-200 bg-gray-50 p-6'>
            <div className='mb-6 flex items-center justify-between'>
              <h3 className='text-lg font-bold text-gray-800'>Preview</h3>
              <div className='text-sm text-gray-500'>
                <i className='fas fa-eye mr-1'></i>
                Real-time Preview
              </div>
            </div>

            {/* Portfolio Preview */}
            <div className='rounded-lg bg-white p-6 shadow'>
              {/* Header */}
              <div className='mb-8 text-center'>
                <h1 className='mb-2 text-3xl font-bold text-gray-900'>
                  {portfolio.name}
                </h1>
                <p className='text-gray-600'>{portfolio.description}</p>
                <div className='mt-4 flex justify-center space-x-4'>
                  <button className='rounded-lg bg-blue-600 px-4 py-2 text-white'>
                    Contact
                  </button>
                  <button className='rounded-lg border border-gray-300 px-4 py-2'>
                    Download CV
                  </button>
                  <button className='rounded-lg border border-gray-300 px-4 py-2'>
                    Share
                  </button>
                </div>
              </div>

              {/* Sections Preview */}
              <div className='space-y-8'>
                {portfolio.sections
                  .filter((section) => section.enabled)
                  .map((section) => (
                    <div key={section.id} className='border-t pt-6'>
                      <h2 className='mb-4 text-2xl font-bold text-gray-800'>
                        {section.title}
                      </h2>

                      {section.type === 'text' && (
                        <div className='text-gray-700'>
                          <p>
                            This is a sample text section. You can edit this
                            content in the builder.
                          </p>
                        </div>
                      )}

                      {section.type === 'projects' && (
                        <div className='grid grid-cols-2 gap-4'>
                          {realProjects.length > 0 ? (
                            realProjects.map((proj) => (
                              <div
                                key={proj._id || proj.id}
                                className='rounded-lg border border-gray-200 p-4'
                              >
                                <h3 className='mb-2 font-bold'>{proj.title}</h3>
                                <p className='line-clamp-2 text-sm text-gray-600'>
                                  {proj.abstract ||
                                    proj.description ||
                                    'No description provided.'}
                                </p>
                              </div>
                            ))
                          ) : (
                            <div className='col-span-2 py-4 text-center text-gray-500'>
                              No projects available to display.
                            </div>
                          )}
                        </div>
                      )}

                      {section.type === 'skills' && (
                        <div className='space-y-3'>
                          {[
                            'React',
                            'Node.js',
                            'UI/UX Design',
                            'Project Management',
                          ].map((skill) => (
                            <div
                              key={skill}
                              className='flex items-center justify-between'
                            >
                              <span className='font-medium'>{skill}</span>
                              <div className='h-2 w-32 overflow-hidden rounded-full bg-gray-200'>
                                <div
                                  className='h-full rounded-full bg-blue-500'
                                  style={{ width: '80%' }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {section.type === 'education' && (
                        <div className='space-y-4'>
                          <div className='border-l-4 border-blue-500 pl-4'>
                            <h3 className='font-bold'>University Name</h3>
                            <p className='text-gray-600'>Degree Program</p>
                            <p className='text-sm text-gray-500'>2018 - 2022</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>

              {/* Footer */}
              <div className='mt-8 border-t pt-6 text-center text-sm text-gray-500'>
                <p>Portfolio generated using Project Management System</p>
                <p className='mt-1'>
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className='mt-6 grid grid-cols-3 gap-4'>
            <div className='rounded-lg bg-blue-50 p-4 text-center'>
              <div className='text-2xl font-bold text-blue-600'>
                {portfolio.sections.filter((s) => s.enabled).length}
              </div>
              <div className='text-sm text-gray-600'>Active Sections</div>
            </div>
            <div className='rounded-lg bg-green-50 p-4 text-center'>
              <div className='text-2xl font-bold text-green-600'>8</div>
              <div className='text-sm text-gray-600'>Projects Included</div>
            </div>
            <div className='rounded-lg bg-purple-50 p-4 text-center'>
              <div className='text-2xl font-bold text-purple-600'>
                {portfolio.visibility === 'public' ? 'Public' : 'Private'}
              </div>
              <div className='text-sm text-gray-600'>Visibility</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

PortfolioBuilder.displayName = 'PortfolioBuilder';

export default React.memo(PortfolioBuilder);
