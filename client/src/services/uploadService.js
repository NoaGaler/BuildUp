import api from './api';

class uploadService {

    // Upload one file to cloud storage. folder: 'projects' | 'profiles'
    static async uploadFile(file, folder = 'projects') {
        const formData = new FormData();
        formData.append('folder', folder);
        formData.append('file', file);

        const response = await api.post('/uploads', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    }
}

export default uploadService;
