import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const TeamDirectory = () => {
  const navigate = useNavigate();
  const [teams] = useState([
    {
      id: 1,
      name: "Database Design Team",
      members: 4,
      projects: 2,
      lead: "John Doe",
    },
    {
      id: 2,
      name: "Web Development Team",
      members: 5,
      projects: 3,
      lead: "Jane Smith",
    },
    {
      id: 3,
      name: "Mobile App Team",
      members: 3,
      projects: 1,
      lead: "Robert Johnson",
    },
    {
      id: 4,
      name: "Testing Team",
      members: 2,
      projects: 2,
      lead: "Sarah Williams",
    },
  ]);

  const [members] = useState([
    {
      id: 1,
      name: "John Doe",
      role: "Team Lead",
      email: "john@example.com",
      team: "Database Design",
      skills: ["SQL", "Python", "DB Design"],
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "Frontend Developer",
      email: "jane@example.com",
      team: "Web Development",
      skills: ["React", "JavaScript", "CSS"],
    },
    {
      id: 3,
      name: "Robert Johnson",
      role: "Backend Developer",
      email: "robert@example.com",
      team: "Mobile App",
      skills: ["Node.js", "MongoDB", "API"],
    },
    {
      id: 4,
      name: "Sarah Williams",
      role: "QA Engineer",
      email: "sarah@example.com",
      team: "Testing",
      skills: ["Testing", "Automation", "Debugging"],
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Team Directory</h1>
            <p className="text-gray-600">Browse teams and team members</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Create Team
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Teams List */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Teams</h3>
            <div className="space-y-4">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-sm"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-medium text-gray-900">
                        {team.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        Lead: {team.lead}
                      </div>
                    </div>
                    <button className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-lg hover:bg-blue-200">
                      View
                    </button>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <div>{team.members} members</div>
                    <div>{team.projects} projects</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Team Members
            </h3>
            <div className="space-y-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-sm"
                >
                  <div className="flex items-start mb-3">
                    <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {member.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {member.role} • {member.team}
                      </div>
                      <div className="text-sm text-gray-500">
                        {member.email}
                      </div>
                    </div>
                    <button className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50">
                      Message
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {member.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDirectory;
