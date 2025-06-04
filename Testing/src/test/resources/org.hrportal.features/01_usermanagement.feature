Feature: LoggedIn User View

  @ui
  Scenario: Verify that the email and password fields have the same dimensions
    Given the user navigates to the login page
    When the user is on the login page
    Then the dimensions of the email and password fields should be the same

  @ui
   Scenario Outline: verify all the buttons in the signin page is enable or not
      Given check the sign-in button and forgot password link is enable or not
      When the user click on the forgot password
      And user navigate to the Reset password page
      And check whether send reset link and Back to login button is enable or not
      Then user enters a "<mail>" and wait for the conformation "<message>"
    Examples:
      | mail                       | message                                            |
      | bhaskarbasu7070@gmail.com  | Email not found.                                   |
      | swarnadeep.deb@galvinus.in | A password reset link has been sent to your email. |
      | bhaskar.r@galvinus         | Invalid email format                               |


  @ui
  Scenario Outline: login in with the invalid credentials
      Given user enters the invalid "<username>" and "<password>"
      When user clicks on the sign-in button
      Then the "<error>" message should be appears
      Examples:
        | username                  | password     | error                     |
        | swarnadeep.de@galvinus.in | Employee@123 | Invalid email or password |
        | swarnadeepdeb@galvinus.in | Employee@123 | Invalid email or password |
        | swarnadeep@galvinus.in    | Deep@123     | Invalid email or password |


  @ui
  Scenario Outline: Login with the invalid email format and password
    Given user enters the invalid email format "<username>" and "<password>"
    Then the proper "<error>" message appears
    Examples:
      | username                  | password     | error                |
      | swarnadeep.deb@galvinus   | Employee@123 | Invalid email format |
      | swarnadeep.debgalvinus.in | Employee@123 | Invalid email format |
      | swarnadeepgalvinus        | Employee@123 | Invalid email format |


  @ui
  Scenario: Login with the valid credentials Admin
    Given user in the login page
    When user enters valid username and password
    And user click on signin button
    Then user lands on Home page of the application

  @api
  Scenario: Validate login API with valid credentials
    Given the login API is available
    When I send a POST request with valid username and password
    Then the response status code should be 200
    And the response body should contain a valid token

   @api
 Scenario Outline: Successful user login and token retrieval
    Given the API base URI is set
    When the user logs in with email, password and "<end point>"
    Then the response status code should  200
    And the access token and refresh token should be returned
     Examples:
       | end point              |
       | /um/api/v1/auth/login  |

  @api
  Scenario Outline: User successfully logs out
     Given the user is logged in and has access and refresh tokens using "<end point>"
     When the user sends a "<logout request>"
     Then the user should get response status code as 200
     And the logout should be successful
    Examples:
      | end point          | logout request      |
      | /api/v1/auth/login | /api/v1/auth/logout |

  @api
 Scenario Outline: User requests a password reset
    Given the API base URI is set for password reset
    When the user sends "<requests>" password reset with "<email>"
    Then user response status code should be 200
    And the password reset response should contain a success message
    Examples:
      | requests                               | email                     |
      | /um/api/v1/auth/password-reset/request | bhaskar.r@galvinus.in     |
      | /um/api/v1/auth/password-reset/request | bhaskarbasu7070@gmail.com |

  @api
Scenario Outline: Get employee role permissions
   Given the user is logged in and has a valid access token with "<login>"
   When the user sends a GET request to the role-permissions employees "<endpoint>"
   Then the user should get response as 200 in status code
   And the response should contain employee roles and permissions
    Examples:
      | login                 | endpoint                           |  |
      | /um/api/v1/auth/login | /um/api/role-permissions/employees |  |

  @api
Scenario Outline: Get all roles from role-permissions endpoint
   Given the user is logged in and has access tokens and refresh tokens with "<login>"
   When the user sends a GET request to the roles "<endpoint>"
   Then user get response status code as 200
   And the response should contain a list of roles
    Examples:
      | login                 | endpoint                       |  |
      | /um/api/v1/auth/login | /um/api/role-permissions/roles |  |

  @api
 Scenario Outline: Get all permissions from role-permissions endpoint
    Given the user sends a GET request to the role-permissions "<endpoint>"
    Then user should get response status code  200
    And the response should contain a list of permissions
    Examples:
      | endpoint                             |  |
      | /um/api/role-permissions/permissions |  |

  @api
 Scenario Outline: Admin assigns ADMIN role to a user
    Given the user is logged in and has access tokens and refresh tokens by using "<login>"api
    When the admin assigns "<role>" to user "<ID>" with "<api>"
    Then the response status should be 200
    Examples:
      | login                 |  | role        | ID                       | api                          |  |
      | /um/api/v1/auth/login |  | SUPER_ADMIN | 68199ab5fd35b06261f13699 | /um/api/v1/admin/assign-role |  |

  @api
  Scenario Outline: Admin fetches formatted employee routes
    Given the user is logged in and has access tokens and refresh tokens using "<login>"
    When the admin fetches formatted employee route data using "<endPoint>"
    Then the response status should 200
    Examples:
      | login                 | endPoint                         |
      | /um/api/v1/auth/login | /ed/api/employeeRoutes/formatted |

 @api
Scenario Outline: Fetch single employee details by ID
   Given the user is on the HR system
   When the admin fetches a single employee by ID using "<endPoint>" and "<ID>"
   Then the response status be should 200
   Examples:
     | endPoint                                         | ID                       |
     | /ed/api/employeeRoutes/fetchEmployeeDetailsById/ | 6819b09cfd35b06261f136be |


@api
Scenario Outline: Fetch employee details by User ID
  Given the HR system base URL is loaded
  When the admin fetches employee details by user ID using "<endPoint>" and "<userID>"
  Then response status should be 200
  And print the employee details
  Examples:
    | endPoint                                      | userID                   |
    | /ed/api/employeeRoutes/fetchEmployeeByUserId/ | 6819b09cfd35b06261f136be |

@api
Scenario Outline: Fetch formatted employee details by employee ID
  Given the HR portal base URL is configured
  When the user fetches employee details from "<endPoint>" and "<employeeID>"
  Then user get response status should as 200
  And the formatted employee details should be printed
  Examples:
    | endPoint                                          | employeeID               |
    | /ed/api/employeeRoutes/fetchEmployeeDetailsByyId/ | 6819b09cfd35b06261f136be |
    | /ed/api/employeeRoutes/fetchEmployeeDetailsByyId/ | 15646546546f             |

@api
Scenario Outline: Get employment details for an employee
  Given the API base URI is set for employment details
  When the user sends a GET request for employee ID "<endPoint>" and "<ID>"
  Then the user response status code should be 200
  And the response should contain employee employment details
  Examples:
    | endPoint                            | ID                       |
    | /ed/api/employeeRoutes/employmentt/ | 6815a083653f515d4d712d1e |

@api
Scenario Outline: Add a new employee without authentication
  Given the employee API base URI is set
  When the user sends a POST "<request>" to add a new employee
  Then the user response status code should be 201 at end
  And the response should confirm the employee was added
  Examples:
    | request                    |
    | /ed/api/employeeRoutes/add |

@api
Scenario Outline: Update employee data after login
  Given user is logged in and has access tokens and refresh tokens with "<login>"
  When the user sends a PUT request to update employee "<endPoint>" "<ID>"
  Then user get response status code as 200 in the end
  And the employee details should be updated successfully
  Examples:
    | login                 | endPoint                           | ID                       |  |
    | /um/api/v1/auth/login | /ed/api/employeeRoutes/update-all/ | 6815a083653f515d4d712d1e |  |

@api
Scenario Outline: Approve an employee after login
  Given the user logged in and has access tokens and refresh tokens with "<login>"
  When the user sends a PUT request to update approval status "<endPoint>" "<ID>"
  Then user response status code as 200

  Examples:
    | login                 | endPoint                                | ID                       |  |
    | /um/api/v1/auth/login | /ed/api/employeeRoutes/approval-status/ | 6815a083653f515d4d712d1e |  |


  @ui
  Scenario: Verify the Functionality of the Role Permission Module
    Given Admin logs into the system
    And the user clicks on the Role and Permission module
    When the user is redirected to the Role and Permission page
    Then all the content on the page should be visible

  @ui
   Scenario Outline: Assign random role to the employee
    Given Admin log into the system
      And user clicks on the Assign role button
      And enter employee "<name>" in the search bar
      When the user click the dropdown all the roles should visible
      Then Assign the particular "<role>" for a employee
     Examples:
       | name    | role        |
       | Bhaskar | Super Admin |
       | Bhaskar | HR          |
       | Bhaskar | Admin       |


@api
Scenario Outline: Mark manual attendance for an employee
    Given API base URI set for attendance
    And the manual attendance payload is prepared with employeeId "<employeeId>", date "<date>", punchInTime "<punchInTime>", status "<attendanceStatus>", and method "<punchInMethod>"
    When the user sends a POST request to the manual attendance "<endpoint>"
    Then user response status code should 200 after sending request
    And the response should confirm manual attendance success
    Examples:
      | endpoint                  | employeeId               | date                     | punchInTime             | attendanceStatus | punchInMethod |
      | /at/api/attendance/manual | 682441dfde9fba7d44af953f | 2025-05-15T10:00:00.000Z | 2025-05-15T10:00:00.00Z | Present          | Dashboard     |
      | /at/api/attendance/manual | 682441dfde9fba7d44af953f | 2025-05-15T10:00:00.000Z | 2025-05-15T10:00:00.00Z | Not              | Dashboard     |

  @api
  Scenario Outline: Get list of employees present today
   Given the API base URI is set for attendance
   When the user sends a GET request to the present-today "<endpoint>"
   Then user response status code should 200
   And the response should contain today's present employee data
   Examples:
     | endpoint                         |
     | /at/api/attendance/present-today |
     | /at/api/attendance/              |

  @api
Scenario Outline: Get all attendance records
  Given  API base URI is set for attendance
  When the user sends a GET request to the attendance root "<endpoint>"
  Then user response status code should 200 at the end
  And the response should contain attendance data
  Examples:
    | endpoint            |
    | /at/api/attendance/ |
    | api/attendance/     |


  @api
Scenario Outline: Successfully fetch today's attendance data
  Given API base URI is set for today's attendance check
  When the user sends a GET request to fetch today's attendance for employee "<endPoint>" "<ID>"
  Then the user should receive a 200 status code for today's attendance
  And the response must contain today's attendance details
  Examples:
    | endPoint            | ID                                          |
    | /at/api/attendance/ | 6815a083653f515d4d712d1e?year=2025&month=05 |
    | /at/api/attendance/ | 6815a083653f515d4d712d1e?year=2025&month    |
    | attendance/         | 6815a083653f515d4d712d1e?year=2025&month=05 |


  @api
Scenario Outline: Get today's attendance for a specific employee
  Given the API base URL is set for attendance
  When the user sends a GET request to today's attendance "<endpoint>" for employee "<employeeId>"
  Then  response status code should 200
  And the response should contain today's attendance details for the employee
  Examples:
    | endpoint            | employeeId               |
    | /at/api/attendance/ | 6824455bde9fba7d44af9541 |
    | /at/api/attendance/ | 6824455bde9fba7d44af9541 |
    | api/attendance/     | 6824455bde9fba7d44af9541 |

  @api
  Scenario Outline: Update punch-out details for employee
  Given the API base URI is set for attendance punch-out
  When the user sends a PUT request to punch out attendance for employee "<endpoint>" and "<ID>"
  Then status code should be 200
  And the punch-out response should confirm the update
  Examples:
    | endpoint            | ID                       |
    | /at/api/attendance/ | 6815a083653f515d4d712d1e |
    | /at/api/attendance/ | 6815a083653f515d4d7      |
    | api/attendance/     | 6815a083653f515d4d712d1e |

  @api
Scenario Outline: Submit attendance correction request due to missed logout
  Given the attendance correction API base URI is configured
  And the correction request payload is prepared with employeeId "<employeeId>", requestDate "<requestDate>", attendanceDate "<attendanceDate>", punchInTime "<punchInTime>", punchOutTime <punchOutTime>, and reason "<reason>"
  When the user sends a POST request to "<endpoint>"
  Then the response status code should be 200 or 201
  And the response should confirm attendance correction success

  Examples:
    | endpoint                   | employeeId               | requestDate              | attendanceDate           | punchInTime              | punchOutTime | reason            |
    | /at/api/attendanceRequest/ | 6815a083653f515d4d712d1e | 2025-05-15T00:00:00.000Z | 2025-05-15T00:00:00.000Z | 2025-04-25T10:30:00.000Z | null         | Forgot to log out |
    | /at/api/attendanceRequest/ | 6815a083653f515d4d712d1e | 2025-05-15T00:00:00.000Z | 2025-05-15T00:00:00.000Z | 2025-04-25T10:30:00.000Z | null         |                   |


  @api
 Scenario Outline: Get all attendance correction requests
    Given the API base URI is set for attendance requests
    When the user sends a GET request to "<endPoint>"
    Then user response status code should be 200 after the request
    And the response should contain attendance correction request data
    Examples:
      | endPoint                   |
      | /at/api/attendanceRequest/ |
      | /at/api/attendance         |

  @api
 Scenario Outline: Submit monthly attendance for an employee
   Given the API base URI is set for monthly attendance
   And the monthly attendance payload is prepared with employeeId "<employeeId>", monthYear "<monthYear>", workingDays "<workingDays>", presentDays "<presentDays>", absentDays "<absentDays>", halfDays "<halfDays>", lateDays "<lateDays>", monthlyLateComing "<monthlyLateComing>", earlyLeaving "<earlyLeaving>", and overtimeHours "<overtimeHours>"
   When  user sends a POST request to "<ID>""<end>" and "<point>"
   Then user response status should be 200 for the request
   And the response should confirm monthly attendance submission success

   Examples:
     | employeeId               | monthYear | workingDays | presentDays | absentDays | halfDays | lateDays | monthlyLateComing | earlyLeaving | overtimeHours | end                        | point              | ID                       |
     | 6815a083653f515d4d712d1e | 2025-03   | 22          | 0           | 0          | 0        | 0        | 0                 | 0            | 0             | /at/api/monthlyAttendance/ | ?year=2025&month=4 | 6815a083653f515d4d712d1e |
     | 6815a083653f515d4d712d1e | 2025-03   | 22          | 0           | 0          | 0        | 0        | 0                 | 0            | 0             | /at/api/monthly            | ?year=2025&month=4 | 6815a083653f515d4d712d1e |
     | 6815a083653f515d4d       | 2025- 03  | 22          | 0           | 0          | 0        | 0        | 0                 | 0            | 0             | /at/api/monthlyAttendance/ | ?year=2025&month=4 | 6815a083653f515d4d7      |



  @api
Scenario Outline: Get monthly attendance for an employee
   Given the base URI is set to
   When the user sends a GET request to "<endpoint>" "<ID>" "<month>"
   Then the user response status code should be 200 after the request
   And the response should contain the employee ID "<result>"
   Examples:
     | endpoint                   | ID                       | month              | result                   |
     | /at/api/monthlyAttendance/ | 6815a083653f515d4d712d1e | ?year=2025&month=4 | 6815a083653f515d4d712d1e |
     | /at/api/monthlyAttendance/ | 6815a083653f515d4d712d1e | ?year=2025&mon     | 6815a083653f515d4d7      |
     | /at/api/monthlyAttendan    | 6815a083653f515d4d       | ?year=2025&mon     | 6815a083653f515d4d712d1e |

  @api
Scenario Outline: Get all monthly attendance records for an employee
  Given the base URL is set to
  When the user sends a GET request to "<endPoint>" with "<employeeID>"
  Then the user response status code should be 200 after request
  Examples:
    | endPoint                   | employeeID               |
    | /at/api/monthlyAttendance/ | 6815a083653f515d4d712d1e |
    | /at/api/monthlyAttendance/ | 6815a083653f515d4d71     |

  @api
Scenario Outline: Validate response for GET overtime data
  Given  base URI is set to
  When the user sends a GET request  "<endpoint>"
  Then the user response status code should be 200  the request
  And the response should contain the key "<expectedKey>"

  Examples:
    | endpoint                     | expectedKey              |
    | /at/api/overtime/getOvertime | 6815a083653f515d4d712d1e |
    | /at/api/overtime/getOvertime | 6815a083653f515d4d71     |


  @api
  Scenario Outline: Fetch overtime details by employee ID
  Given the base URI is set to attendance
  When the user sends a GET request to "<endpoint>" with employee ID "<employeeId>"
  Then the user response status code should be 200 after the request sent


  Examples:
    | endpoint                          | employeeId               |
    | /at/api/overtime/getOvertimeById/ | 6815a083653f515d4d712d1e |
    | /at/api/overtime/getOvertimeById/ | 6815a083653f515d         |

  @api
Scenario Outline: Successfully fetch overtime details for a given employee ID
  Given the base URI is set to the request
  When the user sends GET request to "<endpoint>" with employee ID "<employeeId>"
  Then the user should receive an error response
  Examples:
    | endpoint                          | employeeId               |
    | /at/api/overtime/getOvertimeById/ | 6825f1515f5c43ab50cd6611 |
    | /at/api/overtime/getOvertimeById/ | 6825f1515f5c43ab         |

  @api
Scenario Outline: Update overtime status using PATCH method
  Given the base URI is set check the overtime
  And the user prepares a PATCH payload with id "<ID>" and status "<Overtime>"
  When the user sends a PATCH request to "<endpoint>" and "<id>"
  Then the user should get a successful response
  Examples:
    | ID              | Overtime        | endpoint                       | id                       |
    | 723tecbdqygdb23 | REQUESTACCEPTED | /at/api/overtime/updateStatus/ | 6815a083653f515d4d712d1e |
    | 723tecbdqygdb23 | REQUESTACCEPTED | /at/api/overtime/updateStatus/ | 6815a083653f515d4d       |


  @api
Scenario Outline: Claim overtime duration using PATCH method
  Given the base URI is set for claiming overtime
  And the user prepares a PATCH request with overtime id "<claimId>" and duration "<duration>"
  When the user sends a PATCH request to "<endpoint>" with path param "<id>"
  Then print the status code and response body

  Examples:
    | claimId         | duration | endpoint                        | id                       |
    | 723tecbdqygdb23 | 3min     | /at/api/overtime/claimOvertime/ | 6825ea7d5f5c43ab50cd6610 |
    | 723tecbdqygdb23 | 3min     | /at/api/overtime/claimOvertime/ | 6825f5c43ab50cd6610      |


  @api
Scenario Outline: Fetch and update overtime details by ID using GET method
  Given the base URI is set to fetch and update overtime
  When  user sends a GET request to "<endpoint>" with employee ID "<id>"
  Then print status code and response body

  Examples:
    | endpoint                                 | id                       |
    | /at/api/overtime/fetchAndUpdateOvertime/ | 6815a083653f515d4d712d1e |
    | /at/api/overtime/fetchAndUpdateOvertime/ | 681653f515d4d712d1e      |


  @api
  Scenario Outline: Create a new holiday using POST method
    Given the base URI is set for holiday creation
    And the user prepares a POST request with date "<date>", createdAt "<createdAt>", location "<location>", and title "<title>"
    When the user send a POST request to "<endpoint>"
    Then print the status code and response body of result

    Examples:
      | date                     | createdAt                | location | title           | endpoint        |
      | 2025-08-21T10:00:00.000Z | 2025-05-16T10:00:00.000Z | GLOBAL   | TESTING PURPOSE | /lm/api/holiday |
      | 2025-08-21T10:00:00.000Z | 2025-05-16T10:00:00.000Z | GLOBAL   | TESTING PURPOSE | /lm/api/holiday |


 @api
Scenario Outline: Retrieve the list of holidays
   Given the base URI is set for holiday retrieval
   When the user send a GET request "<endpoint>"
   Then print the status code and response body for the holiday list
   Examples:
     | endpoint         |
     | /lm/api/holiday/ |

@api
Scenario Outline: Delete a holiday by ID
  Given the base URI is set for deleting a holiday
  When the user sends a DELETE request to "<endPoint>" with ID "<holidayId>"
  Then print the status code and response body of the delete operation

  Examples:
    | endPoint         | holidayId                            |
    | /lm/api/holiday/ | 7740027d-6512-4adc-98bc-c2e12f1eb7e4 |
    | /lm/api/holiday/ | 7740027d-6512-4adc-98bc              |
    | /lm/api/         | 7740027d-6512-4adc-98bc-c2e12f1eb7e4 |


  @ui
  Scenario Outline: Create a new role
    Given user login as an admin
    And the user clicks on the Create Role button
    And a popup appears
    When the user enters a "<role>" name and "<description>"
    And clicks on the Create Role button
    Then a success "<notification>" or an error message "<error>" should appear
   Examples:
     | role            | description                                            | error                                                 | notification               |
     | Testing Purpose | New role is created for testing purpose                |                                                       | Role created successfully! |
     | Demo            | Demo is created for testing purpose                    |                                                       | Role created successfully! |
     | New Role        |                                                        | Role description must be at least 10 characters long. |                            |
     |                 | Trying to Create a Role by not providing the role name |                                                       |                            |


  @ui
  Scenario Outline: Delete a role
    Given login as an admin
    And the user click on the Delete Role Button
    And a popup will appear appears
    When the user selects the "<role>" which has to deleted from the dropdown
    Then the user click on delete role button
    Examples:
       | role            |
       | Testing Purpose |
       | Development     |
       | Testing         |
       | Demo            |


  @ui
  Scenario Outline: Verify the Functionality of the Add Permission button for employee
        Given login the application as a admin
        And check the functionality of the Add permission button for employee
        And Click on the Add permission button
        When the popup opens click on dropdown button
        And select any one "<permission>" from the dropdown
        Then After select permission click on the Add permission button
    Examples:
      | permission              |
      | Reset Employee Password |
      | Assign Admin            |

 @ui
   Scenario: Verify the functionality of delete icon under permissions
    Given user login as a admin
    And click on role permission option from the sidebar
    When the admin click on delete icon a validation popup appears
    Then admin clicks on Remove permission button the permission will be deleted

  @ui
 Scenario Outline: Verify the Functionality of the User Registration Module
    Given the user clicks on the User Registration module
    And enters the "<email>" of a new employee
    When the user clicks on Send Registration Link
    Then a link sent "<notification>" should appear.
    Examples:
      | email                     | notification                                                |
      | br6814710@gmail.com       | Registration link sent successfully!                        |
      | bhaskarbasu7070@gmail.com | User already registered                                     |
      | basubhaskar14@gmail       | Invalid email. Use galvinus.com, galvinus.in, or gmail.com. |
      | bhaskarbasu7070@gmailcom  | Invalid email. Use galvinus.com, galvinus.in, or gmail.com. |
      | bhaskarbasu7070@m.com     | Invalid email. Use galvinus.com, galvinus.in, or gmail.com. |










