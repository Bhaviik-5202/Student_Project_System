import api from '../utils/api';

// Fetch all resources
const resourceService = {
	async getResources() {
		const response = await api.get('/resources');
		return response.data;
	},
};

export default resourceService;
