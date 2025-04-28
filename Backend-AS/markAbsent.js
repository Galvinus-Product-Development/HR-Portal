// const Fetch = require("node-fetch"); // or axios
// const cron = require("node-cron");
// const dayjs = require("dayjs");

// // Every day at 12:00 AM
// cron.schedule("0 0 * * *", async () => {
//   try {
//     console.log("🕛 Running daily absent marking task...");

//     // const yesterday = dayjs().subtract(1, "day").toISOString();
//     const yesterday = dayjs().subtract(1, "day").toISOString();

//     console.log(yesterday);
//     const response = await fetch(
//       `http://localhost:3000/api/attendance/uncheckedOut?date=${yesterday}`
//     );

//     // Get all employees who checked in yesterday but didn't check out
//     if (!response.ok) {
//       const errorBody = await response.text();
//       console.error("❌ API failed:", response.status, errorBody);
//       return;
//     }

//     const employees = await response.json();

//     if (!Array.isArray(employees)) {
//       console.error("❌ Not an array:", employees);
//       return;
//     }

//     for (const emp of employees) {
//       console.log("HIIIII");
//       // Mark attendance as Absent
//       await fetch(`http://localhost:3000/api/attendance/${emp.employeeId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ attendanceStatus: "Absent", date: yesterday }),
//       });

//       // Update monthly attendance
//       const date = dayjs();
//       const year = date.year();
//       const month = date.month() + 1;
//       const day = date.date();

//       // Get or create monthly attendance
//       const monthlyRes = await fetch(
//         `http://localhost:3000/api/monthlyAttendance/${emp.employeeId}?year=${year}&month=${month}`,
//         { method: "GET", headers: { "Content-Type": "application/json" } }
//       );

//       let data = await monthlyRes.json();

//       const updatedAbsentDays = (Number(data.absentDays) || 0) + 1;
//       console.log("updatedAbsent", updatedAbsentDays);
//       const updatedPresentDays = Math.max(
//         (Number(data.presentDays) || 0) - 1,
//         0
//       ); // ensure no negative presentDays
//       console.log("updatedpresent", updatedPresentDays);

//       const monthly = await fetch(
//         `http://localhost:3000/api/monthlyAttendance/${emp.employeeId}?year=${year}&month=${month}&day=${day}`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             absentDays: updatedAbsentDays,
//             presentDays: updatedPresentDays,
//           }),
//         }
//       );
//       console.log("ajkbscbas", monthly);
//       const respoososoo = await monthly.json();
//       console.log("monthly response", respoososoo);
//     }

//     console.log(`✅ Marked ${employees.length} employees as Absent.`);
//   } catch (error) {
//     console.error("❌ Error in cron job:", error);
//   }
// });




const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const cron = require("node-cron");
const dayjs = require("dayjs");

// Every day at 12:00 AM
cron.schedule("0 0 * * *", async () => {
  try {
    console.log("🕛 Running daily absent marking task...");

    const yesterday = dayjs().subtract(1, "day").toISOString();
    console.log(yesterday);

    const response = await fetch(
      `http://localhost:3000/api/attendance/uncheckedOut?date=${yesterday}`
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("❌ API failed:", response.status, errorBody);
      return;
    }

    const employees = await response.json();

    if (!Array.isArray(employees)) {
      console.error("❌ Not an array:", employees);
      return;
    }

    for (const emp of employees) {
      console.log("🟡 Marking Absent for:", emp.employeeId);

      // Mark attendance as Absent
      await fetch(`http://localhost:3000/api/attendance/${emp.employeeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attendanceStatus: "Absent", date: yesterday }),
      });

      const date = dayjs();
      const year = date.year();
      const month = date.month() + 1;
      const day = date.date();

      // Get or create monthly attendance
      const monthlyRes = await fetch(
        `http://localhost:3000/api/monthlyAttendance/${emp.employeeId}?year=${year}&month=${month}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );

      const data = await monthlyRes.json();

      const updatedAbsentDays = (Number(data.absentDays) || 0) + 1;
      const updatedPresentDays = Math.max((Number(data.presentDays) || 0) - 1, 0);

      const monthly = await fetch(
        `http://localhost:3000/api/monthlyAttendance/${emp.employeeId}?year=${year}&month=${month}&day=${day}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            absentDays: updatedAbsentDays,
            presentDays: updatedPresentDays,
          }),
        }
      );

      const monthlyResponse = await monthly.json();
      console.log("✅ Monthly update response:", monthlyResponse);
    }

    console.log(`✅ Marked ${employees.length} employees as Absent.`);
  } catch (error) {
    console.error("❌ Error in cron job:", error);
  }
});

