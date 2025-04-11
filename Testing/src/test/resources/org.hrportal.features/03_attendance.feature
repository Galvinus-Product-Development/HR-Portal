Feature: Attendance

@ui
 Scenario: Login as a employee and mark the attendance
   Given user logout from the admin portal
   And login as a admin
   When the admin is in the employee page
   Then user clicks on Check-in button and a conformation message will displays