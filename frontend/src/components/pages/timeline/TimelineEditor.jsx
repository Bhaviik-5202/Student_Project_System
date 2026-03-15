import { useCallback, useState, useEffect, memo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../../utils/api";

const TimelineEditor = memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [timeline, setTimeline] = useState({
    name: "",
    description: "",
    milestones: [],
  });
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const response = await api.get(`/timeline/${id}`);
        if (response.data) {
          setTimeline(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch timeline data", error);
      } finally {
        setFetching(false);
      }
    };
    fetchTimeline();
  }, []);

  const [newMilestone, setNewMilestone] = useState({
    name: "",
    date: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const handleNavigate = useCallback(
    (path) => {
      navigate(path);
    },
    [navigate],
  );

  const handleTimelineChange = useCallback((e) => {
    const { name, value } = e.target;
    setTimeline((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleNewMilestoneChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewMilestone((prev) => ({ ...prev, [name]: value }));
  }, []);

  const addMilestone = useCallback(() => {
    if (!newMilestone.name || !newMilestone.date) {
      toast.error("Please fill in milestone name and date");
      return;
    }

    const newId = Math.max(...timeline.milestones.map((m) => m.id)) + 1;
    setTimeline((prev) => ({
      ...prev,
      milestones: [...prev.milestones, { ...newMilestone, id: newId }],
    }));
    setNewMilestone({ name: "", date: "", description: "" });
    toast.success("Milestone added");
  }, [newMilestone, timeline.milestones]);

  const removeMilestone = useCallback((id) => {
    setTimeline((prev) => ({
      ...prev,
      milestones: prev.milestones.filter((milestone) => milestone.id !== id),
    }));
    toast.success("Milestone removed");
  }, []);

  const saveTimeline = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.post('/timeline', timeline);
      if (response.data?.success) {
        toast.success("Timeline saved successfully");
        handleNavigate("/timeline");
      } else {
        toast.error(response.data?.message || "Failed to save timeline");
      }
    } catch (error) {
      toast.error("Failed to save timeline");
    } finally {
      setLoading(false);
    }
  }, [timeline, handleNavigate]);

  const inputClass =
    "w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => handleNavigate("/timeline")}
            className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 flex items-center mb-4"
          >
            ← Back to Timeline
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Timeline Editor
              </h1>
              <p className="text-slate-600 dark:text-slate-300">
                Create and edit project timelines
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={saveTimeline}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Timeline"}
              </button>
              <button className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                Preview
              </button>
            </div>
          </div>
        </div>

        {fetching ? (
          <div className="p-8 text-center text-slate-500">Loading timeline editor...</div>
        ) : (
          <>
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6 mb-8">
          {/* Timeline Info */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Timeline Name
                </label>
                <input
                  type="text"
                  name="name"
                  className={inputClass}
                  value={timeline.name}
                  onChange={handleTimelineChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  className={inputClass}
                  value={timeline.description}
                  onChange={handleTimelineChange}
                />
              </div>
            </div>
          </div>

          {/* Add New Milestone */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Add New Milestone
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Milestone Name
                </label>
                <input
                  type="text"
                  name="name"
                  className={inputClass}
                  value={newMilestone.name}
                  onChange={handleNewMilestoneChange}
                  placeholder="Enter milestone name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  className={inputClass}
                  value={newMilestone.date}
                  onChange={handleNewMilestoneChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  className={inputClass}
                  value={newMilestone.description}
                  onChange={handleNewMilestoneChange}
                  placeholder="Brief description"
                />
              </div>
            </div>
            <button
              onClick={addMilestone}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Add Milestone
            </button>
          </div>

          {/* Milestones List */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Milestones ({timeline.milestones.length})
            </h3>
            <div className="space-y-4">
              {timeline.milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className="border border-slate-200 dark:border-slate-700 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium text-slate-900 dark:text-slate-100">
                        {milestone.name}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                        {milestone.description}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                        Date: {milestone.date}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-lg hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:hover:bg-blue-900/60">
                        Edit
                      </button>
                      <button
                        onClick={() => removeMilestone(milestone.id)}
                        className="px-3 py-1 bg-rose-100 text-rose-700 text-sm rounded-lg hover:bg-rose-200 dark:bg-rose-900/40 dark:text-rose-200 dark:hover:bg-rose-900/60"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline Preview */}
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Preview
          </h3>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-300 dark:bg-slate-700"></div>

            {/* Milestones */}
            <div className="space-y-8">
              {timeline.milestones.map((milestone) => (
                <div key={milestone.id} className="relative pl-16">
                  {/* Timeline Dot */}
                  <div className="absolute left-6 top-2 w-4 h-4 bg-blue-500 rounded-full border-4 border-white dark:border-slate-900"></div>

                  {/* Milestone Card */}
                  <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                        {milestone.name}
                      </h4>
                      <span className="text-sm text-slate-600 dark:text-slate-300">
                        {milestone.date}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    )}
  </div>
</div>
  );
});

TimelineEditor.displayName = "TimelineEditor";

export default TimelineEditor;
