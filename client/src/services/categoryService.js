import api from './api';

class categoryService {
    static async getAllCategories() {
        const response = await api.get('/categories');
        return response.data;
    }
}

export default categoryService;