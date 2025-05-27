Feature: Attendance

  Background:
    Given user log in as an admin

@ui
Scenario: Verify the functionality of attendance module
  Given the user click on the attendance module from the sidebar
  When the user click on daily attendance from the dropdown
  Then the user navigates to the daily attendance daily attendance page

  @ui
  Scenario Outline: Verify the functionality of the location dropdown
    Given the user clicks on the location dropdown option
    When the user sees all available "<location>" in the dropdown
    Then the user should "<result>" in selecting the location

    Examples:
      | location  | result  |
      | Bengaluru | succeed |
      | Silchar   | succeed |
      | Kerala    | fail    |

    @ui
    Scenario Outline: Verify the functionality of the department dropdown present in Daily Attendance option
      Given the user clicks on the department dropdown option
      When the user sees all the available "<department>" options in the dropdown
      Then the user should "<result>" in selecting the department
      Examples:
        | department | result  |
        | General    | succeed |
        | SAP        | succeed |
        | Salesforce | fail    |

    @ui
    Scenario Outline: Verify the functionality of all status dropdown present in Daily Attendance option
      Given the user click on the all status dropdown option
      When the user can see all the available "<status>" options in the dropdown
      Then the user should "<result>" in the selection of the status
      Examples:
        | status       | result  |
        | Present      | succeed |
#        | Absent       | succeed |
#        | Half Day     | succeed |
#        | On Leave     | succeed |
#        | Not Marked   | succeed |
#        | Not Attended | fail    |

  @ui
  Scenario: Verify the functionality of the reset filters button
    Given the user is on the Daily Attendance page
    When the user sets some filters available on the page
    Then the user clicks the reset button
    And the filters should be reset to their default state
    And the reset button should be enabled

  @ui
  Scenario Outline: Verify the functionality of all location dropdown
    Given the user click on location dropdown
    When the user sees all available "<location>" from the dropdown
    Then the user should "<result>" able to select the location
    Examples:
      | location  | result  |
      | Bengaluru | succeed |
      | Silchar   | succeed |
      | Mumbai    | fail    |

  @ui
  Scenario Outline: Verify the functionality of the department dropdown present in Attendance Dashboard Option
    Given the user click on department dropdown option
    When the user can see the available "<department>" options in the dropdown
    Then the user should "<result>" able to select the department
    Examples:
      | department  | result  |
      | SAP C4C     | succeed |
      | Engineering | succeed |
      | Salesforce  | fail    |

  @ui
  Scenario Outline: Verify the functionality of Employee Name text filed present in Attendance Dashboard option
    Given the user click on Attendance dashboard option present in Attendance module
    When the user enters any employee "<Name>" in employee name text field
    Then the user should "<result>" able to see searched employee
    Examples:
      | Name       | result     |
      | Bhaskar    | Bhaskar    |
      | Swarnadeep | Swarnadeep |
      | Basu       | Basu       |

  @ui
  Scenario Outline: Verify the functionality of month dropdown present in Attendance Dashboard option
    Given user click on Attendance dashboard option present in Attendance module
    When the user selects any "<month>" from dropdown
    Then the "<Result>" should show accordingly
    Examples:
      | month   | Result |
      | January | Pass   |
      | March   | Pass   |
      | Monday  | Fail   |

  @ui
  Scenario Outline: Verify the functionality of year dropdown present in Attendance Dashboard option
    Given admin click on Attendance dashboard option present in Attendance module
    When the admin selects any "<Year>" from the dropdown
    Then the "<Result>" should visible accordingly
    Examples:
      | Year | Result |
      | 2025 | Pass   |
      | 2023 | Pass   |
      | 2026 | Fail   |

  @ui
  Scenario: Verify the functionality of Download Report button
    Given user click on Attendance dashboard option present in Attendance module from the sidebar
    When the user navigate to attendance dashboard
    Then check the Download report is enable or not

  @ui
  Scenario Outline: Verify the functionality of search bar of Overtime Request
    Given user click on Overtime option from the Attendance module
    When the user enters the employee "<Name>" in the search bar
    Then the table changes dynamically based on the employee name
    Examples:
      | Name       |
      | Swarnadeep |
      | Deb        |
      | Bhaskar    |

  @ui
  Scenario Outline: Verify the functionality of All Status dropdown
    Given user clicks on Overtime option from Attendance module
    When user selects any one "<Status>" from the dropdown
    Then the table changes dynamically based on employee name
    Examples:
      | Status   |
      | Pending  |
      | Approved |
      | Rejected |

  @ui
 Scenario Outline: Verify the functionality of Search bar
    Given user click on Attendance Request
    When the user enter employee "<name>" in the search bar
    Then the result will be on the table
    Examples:
      | name      |
      | Shraddha  |
      | Rohan Roy |

 @ui
 Scenario Outline: Verify the functionality of all status dropdown
   Given user click on Attendance request from the sidebar
   When the user select "<All Status>" dropdown
   Then the table get change according to the status value
   Examples:
     | All Status |
     | Approved   |
     | Rejected   |
     | No Value   |

 @ui
 Scenario Outline: Verify the functionality of Department dropdown
   Given user click on Attendance request from the Attendance module
   When user select different "<Department>" from the dropdown
   Then table get change automatically based on department
   Examples:
     | Department |
     | HR         |
     | Testing    |

 @ui
 Scenario: Verify the functionality of Attendance request button
   Given user click on attendance tracker under attendance module
   When user click on attendance request button
   Then a popup should appear

   @ui
   Scenario Outline: Send a punch-in attendance request to admin
     Given user enters "<punch In Time>", "<Reason>"
     When user click on submit button
     Then a successful notification is displayed
     Examples:
       | punch In Time | Reason        |
       | 10.30         |               |
       |               | Network issue |
       | 10.30         | Network issue |

   @ui
   Scenario Outline: Send a punch-out attendance request to admin
     Given user enters details of "<Punch out timings>", "<Reason>"
     When user clicks on submit button
     Then a successful notification displayed
     Examples:
       | Punch out timings | Reason  |
       | 20.00             |         |
       |                   | Testing |
       |20.00              |Testing  |










