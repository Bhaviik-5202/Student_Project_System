import React, { memo, useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ChevronLeft, FolderKanban, Save } from 'lucide-react';
import api from '../../../utils/api';
import {
  PageHeader,
  Card,
  FormGroup,
  Input,
  Select,
  TextArea,
  PrimaryButton,
  SecondaryButton,
  LoadingState,
  SectionHeader,
} from './ui';

const ProjectArchitectureForm = memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEditing);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    maxStudents: 3,
    category: 'Internal',
    status: 'Active',
  });

  useEffect(() => {
    if (isEditing) {
      const fetchArchitecture = async () => {
        try {
          setLoading(true);
          
          // Prevent hitting the API with dummy IDs (1-6) from DEFAULT_ARCHITECTURES
          // MongoDB ObjectIds are 24 hex characters.
          if (id && id.length < 10) {
            // Provide some default dummy data for these templates
            const templates = {
              '1': { name: 'Web Application Architecture', category: 'Software Development', duration: '12 Weeks' },
              '2': { name: 'Data Pipeline & Analytics', category: 'Data Science', duration: '14 Weeks' },
              '3': { name: 'Mobile App Ecosystem', category: 'Software Development', duration: '12 Weeks' },
              '4': { name: 'AI/ML Model Deployment', category: 'Data Science', duration: '16 Weeks' },
              '5': { name: 'Cloud & DevOps', category: 'Infrastructure', duration: '16 Weeks' },
              '6': { name: 'IoT & Embedded Systems', category: 'Hardware & Systems', duration: '18 Weeks' },
            };
            
            const template = templates[id];
            if (template) {
              setFormData({
                name: template.name || '',
                description: 'Default architecture template description.',
                duration: template.duration || '12 Weeks',
                maxStudents: 4,
                category: template.category || 'Internal',
                status: 'Active',
              });
              setLoading(false);
              return;
            }
          }

          const response = await api.get(`/projects/types/${id}`);
          const data = response.data || response;
          if (data) {
            setFormData({
              name: data.name || '',
              description: data.description || '',
              duration: data.duration || '',
              maxStudents: data.maxStudents || 3,
              category: data.category || 'Internal',
              status: data.status || 'Active',
            });
          }
        } catch (error) {
          toast.error('Failed to load architecture data');
          navigate('/project-types');
        } finally {
          setLoading(false);
        }
      };
      fetchArchitecture();
    }
  }, [id, isEditing, navigate]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'maxStudents' ? parseInt(value) || 0 : value,
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading(isEditing ? 'Updating...' : 'Creating...');

    try {
      // Prevent backend 500 error on dummy templates by simulating success or redirecting to POST
      if (isEditing && id && id.length < 10) {
        // Simulate a successful update for the mock templates since the backend doesn't have them
        setTimeout(() => {
          toast.success('Architecture template updated (Mock)', { id: toastId });
          navigate('/project-types');
        }, 800);
        return;
      }

      const res = isEditing
        ? await api.put(`/projects/types/${id}`, formData)
        : await api.post('/projects/types', formData);

      if (
        res.success ||
        res.id ||
        res._id ||
        (res.data && (res.data.id || res.data._id))
      ) {
        toast.success(
          isEditing ? 'Architecture updated' : 'Architecture created',
          { id: toastId }
        );
        navigate('/project-types');
      } else {
        toast.error(res.message || 'Operation failed', { id: toastId });
      }
    } catch (error) {
      toast.error('Error occurred', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingState message='Loading configuration...' />;
  }

  return (
    <div className='space-y-6 pt-0 pb-6 animate-fade-in'>
      <PageHeader
        title={isEditing ? 'Edit Architecture' : 'New Architecture'}
        subtitle='Define the blueprint for project classification'
        icon={FolderKanban}
        actions={
          <SecondaryButton
            icon={ChevronLeft}
            onClick={() => navigate('/project-types')}
          >
            Back to Types
          </SecondaryButton>
        }
      />

      <form
        onSubmit={handleSubmit}
        className='grid grid-cols-1 gap-6 lg:grid-cols-3'
      >
        <div className='space-y-6 lg:col-span-2'>
          <Card className='space-y-4'>
            <SectionHeader title='General Information' />

            <FormGroup label='Architecture Name' required>
              <Input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleInputChange}
                placeholder='e.g. Research Thesis'
                required
              />
            </FormGroup>

            <FormGroup label='Description / Manifesto' required>
              <TextArea
                name='description'
                value={formData.description}
                onChange={handleInputChange}
                rows={5}
                placeholder='Define scope, objectives, and limitations...'
                required
              />
            </FormGroup>
          </Card>
        </div>

        <div className='space-y-6'>
          <Card className='space-y-4'>
            <SectionHeader title='Operational Data' />

            <FormGroup label='Category'>
              <Select
                name='category'
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value='Internal'>Internal</option>
                <option value='External'>External</option>
                <option value='Research'>Research</option>
                <option value='Industry'>Industry</option>
              </Select>
            </FormGroup>

            <FormGroup label='Timeline (Duration)' required>
              <Input
                type='text'
                name='duration'
                value={formData.duration}
                onChange={handleInputChange}
                placeholder='e.g. 2 Semesters'
                required
              />
            </FormGroup>

            <FormGroup label='Student Limit' required>
              <Input
                type='number'
                name='maxStudents'
                value={formData.maxStudents}
                onChange={handleInputChange}
                min='1'
                required
              />
            </FormGroup>

            {isEditing && (
              <FormGroup label='Status'>
                <Select
                  name='status'
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value='Active'>Active</option>
                  <option value='Inactive'>Inactive</option>
                </Select>
              </FormGroup>
            )}

            <PrimaryButton
              type='submit'
              disabled={isSubmitting}
              icon={Save}
              className='w-full !py-3.5 mt-2'
            >
              {isSubmitting
                ? 'Saving...'
                : isEditing
                  ? 'Update Architecture'
                  : 'Create Architecture'}
            </PrimaryButton>
          </Card>
        </div>
      </form>
    </div>
  );
});

ProjectArchitectureForm.displayName = 'ProjectArchitectureForm';
export default ProjectArchitectureForm;
