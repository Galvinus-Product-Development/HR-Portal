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
      | Bhaskar       |
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
        | Paid Leave   |

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
    Scenario: