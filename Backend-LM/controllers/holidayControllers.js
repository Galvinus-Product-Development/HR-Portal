const holidayService = require('../services/holidayService');

exports.createHolidays = async (req, res) => {
	try {
		const { holidays } = req.body
		let now = new Date();
		const formattedHolidays = holidays.map(holiday => ({
			...holiday,
			date: new Date(holiday.date),
			createdAt: now,
		}));

		const data = await holidayService.createHolidays(formattedHolidays);
		return res.status(201).json(data);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}

exports.getAllHolidays = async (req, res) => {
	try {
		const data = await holidayService.getAllHolidays();
		return res.status(200).json(data);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}

exports.updateHoliday = async (req, res) => {
	try {
		const data = await holidayService.updateHoliday(req.body);
		return res.status(200).json(data);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}

exports.deleteHoliday = async (req, res) => {
	try {
		const { id } = req.params;
		const data = await holidayService.deleteHoliday(id);
		return res.status(200).json(data);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}