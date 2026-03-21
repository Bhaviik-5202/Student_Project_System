import React, { useState, useEffect, memo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
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
  Calendar
} from "lucide-react";
import courseService from "../../../services/courseService";
import staffService from "../../../services/staffService";

const AddCourse = memo(() => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [staff, setStaff] = useState([]);
  
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    credits: 3,
    semester: "Fall 2024",
    faculty: "",
    schedule: "",
    room: "",
    syllabus: [{ week: 1, topic: "", description: "" }],
    materials: []
  });

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await staffService.getAllStaff();
        if (res.success) {
          setStaff(res.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch staff", err);
      }
    };
    fetchStaff();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSyllabusChange = (index, field, value) => {
    const newSyllabus = [...formData.syllabus];
    newSyllabus[index][field] = value;
    setFormData(prev => ({ ...prev, syllabus: newSyllabus }));
  };

  const addSyllabusWeek = () => {
    setFormData(prev => ({
      ...prev,
      syllabus: [...prev.syllabus, { week: prev.syllabus.length + 1, topic: "", description: "" }]
    }));
  };

  const removeSyllabusWeek = (index) => {
    const newSyllabus = formData.syllabus.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, syllabus: newSyllabus }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await courseService.createCourse(formData);
      if (res.success) {
        toast.success("Course created successfully!");
        navigate("/courses/catalog");
      } else {
        toast.error(res.message || "Failed to create course");
      }
    } catch (err) {
      toast.error("An error occurred while creating the course");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <div className="dashboard-content">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-gray-500" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Create New Course
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {[
          { id: 1, label: "Basic Info", icon: Info },
          { id: 2, label: "Faculty & Room", icon: Users },
          { id: 3, label: "Syllabus", icon: FileText }
        ].map((item) => (
          <div 
            key={item.id}
            className={`card flex items-center gap-4 p-4 border-b-4 transition-all ${
              step >= item.id ? "border-indigo-600 bg-indigo-50/10" : "border-gray-100"
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              step >= item.id ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-400"
            }`}>
              <item.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-gray-400">Step {item.id}</p>
              <p className="font-bold text-gray-900 dark:text-white">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="card">
        <div className="card-body p-8">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Info className="w-5 h-5 text-indigo-600" /> Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="form-label">Course Name</label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Data Structures"
                      className="form-control pl-10"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Course Code</label>
                  <div className="relative">
                    <Code className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleChange}
                      required
                      placeholder="e.g. CS101"
                      className="form-control pl-10 uppercase"
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Provide a brief overview..."
                  className="form-control"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="form-label">Semester</label>
                  <select 
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="Fall 2024">Fall 2024</option>
                    <option value="Spring 2025">Spring 2025</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Credits</label>
                  <input 
                    type="number"
                    name="credits"
                    value={formData.credits}
                    onChange={handleChange}
                    min="1"
                    className="form-control"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" /> Faculty & Logistics
              </h2>

              <div className="form-group">
                <label className="form-label">Assigned Faculty</label>
                <select 
                  name="faculty"
                  value={formData.faculty}
                  onChange={handleChange}
                  required
                  className="form-control"
                >
                  <option value="">Select Faculty Member</option>
                  {staff.map(member => (
                    <option key={member.id || member._id} value={member.id || member._id}>
                      {member.name} ({member.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="form-label">Schedule</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text"
                      name="schedule"
                      value={formData.schedule}
                      onChange={handleChange}
                      placeholder="e.g. Mon 10:00-12:00"
                      className="form-control pl-10"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Room</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text"
                      name="room"
                      value={formData.room}
                      onChange={handleChange}
                      placeholder="e.g. 402-B"
                      className="form-control pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" /> Syllabus / Roadmap
                </h2>
                <button 
                  type="button"
                  onClick={addSyllabusWeek}
                  className="btn btn-secondary py-1 px-3 text-xs"
                >
                  <Plus className="w-4 h-4 mr-1 inline" /> Add Week
                </button>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {formData.syllabus.map((item, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 space-y-4 relative group">
                    <button 
                      type="button"
                      onClick={() => removeSyllabusWeek(index)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <div className="grid grid-cols-4 gap-4">
                      <div className="col-span-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Week</label>
                        <input 
                          type="number"
                          value={item.week}
                          onChange={(e) => handleSyllabusChange(index, "week", e.target.value)}
                          className="form-control py-1 px-2 text-sm"
                        />
                      </div>
                      <div className="col-span-3">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Topic</label>
                        <input 
                          type="text"
                          value={item.topic}
                          onChange={(e) => handleSyllabusChange(index, "topic", e.target.value)}
                          placeholder="Topic Headline"
                          className="form-control py-1 px-2 text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Summary</label>
                      <textarea 
                        value={item.description}
                        onChange={(e) => handleSyllabusChange(index, "description", e.target.value)}
                        placeholder="Key points..."
                        rows={2}
                        className="form-control py-1 px-2 text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="card-footer bg-gray-50/50 flex justify-between p-6">
          {step > 1 ? (
            <button 
              type="button"
              onClick={prevStep}
              className="btn btn-secondary flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : <div />}

          {step < 3 ? (
            <button 
              type="button"
              onClick={nextStep}
              className="btn btn-primary flex items-center gap-2"
            >
              Next Step <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button 
              type="submit"
              disabled={loading}
              className="btn btn-primary flex items-center gap-2"
            >
              {loading ? "Processing..." : <>Create Course <Save className="w-4 h-4" /></>}
            </button>
          )}
        </div>
      </form>
    </div>
  );
});

AddCourse.displayName = "AddCourse";

export default AddCourse;
