// Helper function to calculate total working days in a month
const calculateWorkingDays = ({year, month}) => {
    console.log(typeof(year), typeof(month));
    const date = new Date(year, month - 1, 1);
    let totalWorkingDays = 0;

    while (date.getMonth() === month - 1) {
        const day = date.getDay();
        if (day !== 0 && day !== 6) { // 0 = Sunday, 6 = Saturday
            totalWorkingDays++;
        }
        date.setDate(date.getDate() + 1);
    }

    return totalWorkingDays;
}

module.exports = calculateWorkingDays;