import React from "react";

const ProjectDetails = ({ project }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">{project.name}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-2">Description</h3>
          <p className="text-gray-600">{project.description}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Details</h3>
          <ul className="space-y-2">
            <li>Status: {project.status}</li>
            <li>Start Date: {project.startDate}</li>
            <li>End Date: {project.endDate}</li>
            <li>Team Size: {project.teamSize}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
