Feature: Leave Management

  Background:
    Given user log in as an admin

  @ui
  Scenario Outline: Verify the functionality of Search bar in Leave Request
    Given the user click on Pending Leave Request option under the Leave Management
    When the user enters the "<Employee Name>"
    Then the table get filter based on the name
    Examples:
      | Employee Name |
      | Bhaskar       |
      | Mohd Saad     |
      | Rohan         |

  @ui
    Scenario Outline: Verify the functionality of All Status dropdown of pending leave request
      Given  the user clicks on Leave Request option under the Leave Management
      When the user clicks the All Status dropdown
      And the user select any "<Status>" from the dropdown
      Then the table changes according to the status
      Examples:
        | Status    |
        | Pending   |
        | Approved  |
        | Rejected  |
        | Not Given |

  @ui
    Scenario Outline: Verify the functionality of Search bar in Leave History
      Given  the user clicks on Leave History option under Leave Management
      When the user enter the "<Employee name>"
      Then the table changes according to the employee name
      Examples:
        | Employee name |
        | Bhaskar       |
        | Swarnadeep    |
        | Rahul         |
        | 5564646       |
        | *&^^          |

    @ui
    Scenario Outline: Verify the functionality of month dropdown
      Given the user clicks on Leave History option from the Leave Management
      When the user clicks on month dropdown
      And the user select any option "<month>" from the dropdown
      Then the table changes according to the month
      Examples:
        | month        |
        | April 2025   |
        | March 2025   |
        | January 2025 |
        | May 2023     |


    @ui
    Scenario Outline: Verify the functionality of All Status dropdown
      Given the user click on Leave History module from the Leave Management
      When user click on All Status dropdown
      And the user selects any "<status>" from the dropdown
      Then the table change automatically based on the status
      Examples:
        | status   |
        | Approved |
        | Rejected |

    @ui
    Scenario: Verify the functionality of Upload policy button
      Given the user selects Leave Policy option under Leave Management
      When user click on Upload Policy button
      Then the popup will appear

    @ui
   Scenario Outline: Upload any new policy
      Given the user click on Upload Policy button
      When then user fills all the details "<Policy Name>" "<Policy Type>" from the popup
      Then then click on upload button
      Examples:
        | Policy Name | Policy Type     |
        | Demo        | Testing purpose |

  @ui
    Scenario Outline: Verify the functionality of Leave type dropdown
      Given the user click on the Request Leave option from the Leave Management
      When the user clicks on "<Leave Type>" dropdown
      Then the user selects any one option from the dropdown
      Examples:
        | Leave Type   |
        | Casual Leave |
        | Sick Leave   |
        | Demo         |

    @ui
    Scenario Outline: verify the functionality of Duration type dropdown
      Given user click on the Request Leave option from Leave Management
      When user clicks on "<Duration Type>" dropdown
      Then the user select any one option from the dropdown
      Examples:
        | Duration Type |
        | Full Day      |
        | Half Day      |
        | Whole Day     |

    @ui
   Scenario Outline:Verify the functionality of start date and end date field
      Given user click on the Request Leave from the Leave Management module
      When the user enters "<Start date>" and "<End date>"
      Then the user able to fill the data
      Examples:
        | Start date | End date   |
        | 22/05/2025 | 23/05/2025 |
        | 28/05/2025 | 29/05/2025 |

   @ui
   Scenario: Verify the functionality of upload file link
     Given user click on Request Leave from Leave Management
     When check upload file is enable or not
     Then the user able to upload the file

  @ui
  Scenario: Verify the functionality of Submit Request button
    Given user click on Request Leave from the Leave Management module in sidebar
    When check Submit Request button is enable or not
    Then user able to apply for the leave

 @ui
Scenario Outline: Apply for a leave
   Given user click on Request Leave option
   When the user fills "<Leave Type>", "<Duration>", "<Start Date>", "<End Date>", "<Reason>"
   And click on Submit Request button
   Then successful notification is displayed
   Examples:
     | Leave Type   | Duration | Start Date | End Date   | Reason        |
     | Casual Leave | Full Day | 06/06/2025 | 06/06/2025 | Personal work |

@ui
Scenario Outline: Verify the functionality of Month dropdown
  Given user click on Manage Leave
  When the user selects "<month>" from the dropdown
  Then the table changes accordingly
  Examples:
    | month   |
    | January |
    | April   |
    |Monday   |

@ui
Scenario Outline: Verify the functionality of year dropdown
  Given user clicks on Manage Leave
  When the user select "<Year>" drop down
  Then the table changes
  Examples:
    | Year |
    | 2025 |
    | 2026 |
    | 2021 |

@ui
Scenario Outline: Verify the functionality of Search bar
  Given user clicks on manage Leave option
  When the user enters "<name>" in search bar
  Then the table changes according to employee name
  Examples:
    | name     |
    | Shraddha |
    | Bhaskar  |

@ui
Scenario Outline: Verify the functionality of Leave type dropdown
  Given user click on Manage Leave option from the sidebar
  When the user click "<Leave Type>" dropdown
  Then the table change accordingly
  Examples:
    | Leave Type |
    | Casual     |
    | Sick       |
    | Testing    |

@ui
Scenario Outline: Verify the functionality of status dropdown
  Given user clicks on Manage Leave from the Leave Management
  When the user click on "<status>" dropdown
  Then the table changes according to selected status
  Examples:
    | status    |
    | Approved  |
    | Pending   |
    | No Status |
