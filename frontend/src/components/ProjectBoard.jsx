import React, { useState, useEffect } from 'react';

// A small component for displaying a single project
// 1. We update it to accept a 'status' prop
const ProjectItem = ({ name, type, status }) => {
    const isCompleted = status === 'Completed';
    const badgeText = isCompleted ? 'Completed' : 'In Progress';
    const badgeColor = isCompleted ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';

    return (
        // --- CHANGED: Added hover effects and transition to the wrapper div ---
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex justify-between items-center transition-all duration-300 hover:shadow-md hover:bg-slate-50 hover:-translate-y-1">
            <div>
                <p className="font-semibold text-slate-800">{name}</p>
                <p className="text-sm text-slate-500">{type}</p>
            </div>
            <span className={`text-xs font-medium py-1 px-2 rounded-full ${badgeColor}`}>
                {badgeText}
            </span>
        </div>
    );
};


// The main board component
function ProjectBoard() {
    const [currentProjects, setCurrentProjects] = useState([]);
    const [completedProjects, setCompletedProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('https://web-gengrok.onrender.com/api/projects')
            .then(res => res.json())
            .then(data => {
                setCurrentProjects(data.filter(p => p.status === 'Accepted'));
                setCompletedProjects(data.filter(p => p.status === 'Completed'));
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Failed to fetch projects:", error);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return <div className="text-center py-10">Loading Projects...</div>;
    }

    return (
        <div className="py-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Project Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                {/* Current Orders Column */}
                <div>
                    <h3 className="text-xl font-semibold mb-4 text-slate-700">Current Projects</h3>
                    <div className="space-y-4">
                        {currentProjects.length > 0 ? (
                            currentProjects.map(project => (
                                // 4. Pass the status down to the ProjectItem
                                <ProjectItem key={project._id} name={project.name} type={project.websiteType} status={project.status} />
                            ))
                        ) : (
                            <p className="text-slate-500">No current projects.</p>
                        )}
                    </div>
                </div>

                {/* Completed Orders Column */}
                <div>
                    <h3 className="text-xl font-semibold mb-4 text-slate-700">Completed Projects</h3>
                    <div className="space-y-4">
                         {completedProjects.length > 0 ? (
                            completedProjects.map(project => (
                                // 4. Pass the status down here as well
                                <ProjectItem key={project._id} name={project.name} type={project.websiteType} status={project.status} />
                            ))
                        ) : (
                            <p className="text-slate-500">No completed projects yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProjectBoard;