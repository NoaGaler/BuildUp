import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useProjects } from '../../../context/ProjectContext';
import { useAuth } from '../../../context/authContext';

import ProjectForm from '../ProjectForm/ProjectForm';

const CreateProjectPage = () => {
    const navigate = useNavigate();
    const { createProject } = useProjects();
    const { user } = useAuth();

    const handleCreateSubmit = async (formData, processedMediaArray) => {
        // Send each uploaded file's cloud URL and MIME type to the server
        const serverMediaFiles = processedMediaArray.map(m => ({
            originalName: m.originalName,
            mimetype: m.mimetype,
            media_url: m.media_url
        }));

        const createPayload = {
            title: formData.title,
            description: formData.description,
            category_id: Number(formData.category_id),
            professional_id: Number(user?.id),
            mediaFiles: serverMediaFiles
        };

        const response = await createProject(createPayload);
        if (response.success) {
            const newProjectId = response.data?.id;
            navigate(`/projects/${newProjectId}`, { replace: true });
        } else {
            return response.message;
        }
    };

    return (
        <div className="create-project-page-wrapper">
            <ProjectForm
                initialValues={null}
                onSubmitAction={handleCreateSubmit}
            />
        </div>
    );
};

export default CreateProjectPage;