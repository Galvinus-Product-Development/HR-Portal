Feature: Employee Database

  Background:
    Given user log in as an admin

  @ui
    Scenario Outline: Verify the functionality of employee search bar
    Given user clicks on the Employee Database module
    And enter the employee "<name>" in the search bar
    When the table filters based on the name
    Then click on that particular employee
    Examples:
      | name    |
      | Bhaskar |
      | Basu    |
      | Prajwal |
      | Rahul   |

  @ui
    Scenario Outline: Verify the functionality of All Department dropdown
    Given admin click on employee database module
    When the admin click on department dropdown
    Then the table gets filter based on the selected "<department>"
    Examples:
      | department |
      | General    |
      | N/A        |
      | SAP        |
      | Testing    |

  @ui
    Scenario Outline: Verify the functionality of All Location dropdown
    Given user click on employee Database module
    When the user click on all location dropdown
    Then the table get filter based on the selected "<location>"
    Examples:
      | location  |
      | Silchar   |
      | Bengaluru |
      | Delhi     |

  @ui
    Scenario Outline: Verify the functionality of All Status dropdown
    Given the user click on employee database module
    When the user click on the all status dropdown
    Then the table get filter based on selected "<status>"
    Examples:
      | status      |
      | ACTIVE      |
      | PENDING     |
      | DEACTIVATED |
      | REMOVED  |
      | RESIGNED |

  @ui
  Scenario Outline: Verify the functionality of pagination
    Given the user clicks on the Employee Database module from the sidebar
    When the user checks if the "<pagination>" buttons are enabled
    Then the user clicks on the "<pagination>" button to verify navigation to the next page
    Examples:
      | pagination |
      | 2          |
      | Next       |


  @ui
  Scenario Outline: Verify the functionality of Employee Database
    Given admin can able to see all the employees in a table
    When admin fills all the filters like "<Search Employee>", "<All Departments>", "<All Locations>", "<All Statuses>" based on these filter employee should comes at top of the table
    Then admin able to click on that particular "<Employee>"
    Examples:
      | Search Employee | All Departments | All Locations | All Statuses | Employee |
      | Bhaskar         | Testing         | Bengaluru     | ACTIVE       | Bhaskar  |
      | Rahul           | General         | Bengaluru     | ACTIVE       | Rahul    |

  @ui
  Scenario Outline: Enter Employee Personal Details of new registered employee
      Given user clicks on the edit profile button
      And a popup will appears
      When admin fills all the employment details like "<Employee name>", "<Gender>", "<Date of birth>", "<Blood group>", "<Phone number>", "<Personal Email>", "<Marital Status>", "<Emergency Contact Number>", "<Aadhar Number>", "<PAN Number>"
      Examples:
        | Employee name | Gender | Date of birth | Blood group | Phone number | Personal Email       | Marital Status | Emergency Contact Number | Aadhar Number | PAN Number |
        | Yuvaraja      | Male   | 16-07-1999    | O+          | 9113576757   | gbyuvaraj1@gmail.com | Single         | 9113576757               | 332577889612  | DBCDE2234F |

  @ui
    Scenario Outline: Enter Employee Employment Details
    Given user clicks on Employment tab in the header
    When the user enters "<Office Mail>", "<Employee ID>", "<Department>", "<Designation>", "<Location>", "<Status>", "<Join Date>", "<Line Manager>", "<Employment Type>", "<UAN Number>", "<PF Number>", "<ESIC Number>"
    Then admin click on Address tab in the header
    Examples:
      | Office Mail             | Employee ID | Department  | Designation | Location  | Status | Join Date  | Line Manager   | Employment Type | UAN Number   | PF Number    | ESIC Number  |
      | yuvaraja.gb@galvinus.in | 103         | Engineering | Analyst     | Bengaluru | ACTIVE | 16/06/2023 | Swarnadeep Deb | Full-time       | 589635478562 | 251599546648 | 458723654102 |


  @ui
  Scenario Outline: Enter Bank Details of new registered employee
        Given user enters all the bank details like "<Account Holder>", "<Bank Name>0", "<Account Number>", "<IFSC Code>"
        When user click the save button all the details stored
        Then Admin click on approve details button
        Examples:
          | Account Holder | Bank Name   | Account Number | IFSC Code   |  |
          | Bhaskar        | Canara Bank | 1228796544365  | CNRB0000569 |  |

#  @api
# Scenario Outline: Admin fetches formatted employee routes
#    Given the user is logged in and has access tokens and refresh tokens using "<login>"
#    When the admin fetches formatted employee route data using "<endPoint>"
#    Then the response status should 200
#    Examples:
#      | login                 | endPoint                         |
#      | /um/api/v1/auth/login | /ed/api/employeeRoutes/formatted |


