const axios = require('axios');

const fetchHolidays = async () => {
	try {
		const response = await axios.get('http://localhost:4000/api/holiday'); // Update port if needed
		return response.data;
	} catch (error) {
		console.error('Error fetching holidays:', error.message);
		return [];
	}
};

module.exports = fetchHolidays;