Feature: Employee Database

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
  Scenario Outline: Verify the functionality of Employee Database
    Given admin can able to see all the employees in a table
    When admin fills all the filters like "<Search Employee>", "<All Departments>", "<All Locations>", "<All Statuses>" based on these filter employee should comes at top of the table
    Then admin able to click on that particular employee
    Examples:
      | Search Employee | All Departments | All Locations | All Statuses |
      | Bhaskar         | General         | Bengaluru     | ACTIVE       |

  @ui
  Scenario Outline: Enter Employment Details of new registered employee
      Given user clicks on the edit profile button
      And a popup will appears
      When admin fills all the employment details like "<Employee ID>", "<Job Title>", "<Location>", "<Office Email>", "<Date Of Joining>", "<UAN Number>", "<PF Number>", "<ESIC Number>", "<Employment Type>", "<Line Manager>"
      Examples:
        | Employee ID | Job Title | Location  | Office Email          | Date Of Joining | UAN Number   | PF Number    | ESIC Number  | Employment Type | Line Manager   |
        | GAL001      | QA        | Bengaluru | bhaskar.r@galvinus.in | 16-08-2023      | 445899667723 | 778995621355 | 125587968874 | FULL TIME       | Swarnadeep Deb |

  @ui
  Scenario Outline: Enter Bank Details of new registered employee
        Given user enters all the bank details like "<Account Holder>", "<Bank Name>0", "<Account Number>", "<IFSC Code>"
        When user click the save button all the details stored
        Then Admin click on approve details button
        Examples:
          | Account Holder | Bank Name   | Account Number | IFSC Code   |  |
          | Bhaskar        | Canara Bank | 1228796544365  | CNRB0000569 |  |

