const express = require('express');
const router = express.Router();
const holidayControllers = require('../controllers/holidayControllers');

router.post('/', holidayControllers.createHolidays);
router.get('/', holidayControllers.getAllHolidays);
// router.get('/:id', holidayControllers.getHolidayById);
router.put('/', holidayControllers.updateHoliday);
router.delete('/:id', holidayControllers.deleteHoliday);

module.exports = router;
