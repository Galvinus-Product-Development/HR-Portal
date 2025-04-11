Feature: LoggedIn User View

  @ui
  Scenario: Verify that the email and password fields have the same dimensions
    Given the user navigates to the login page
    When the user is on the login page
    Then the dimensions of the email and password fields should be the same

  @ui
    Scenario: verify all the buttons in the signin page is enable or not
      Given check the sign-in button and forgot password link is enable or not
      When the user click on the forgot password
      And user navigate to the Reset password page
      And check whether send reset link and Back to login button is enable or not
      Then user enters a mail and wait for the conformation message


  @ui
  Scenario Outline: login in with the invalid credentials
      Given user enters the invalid "<username>" and "<password>"
      When user clicks on the sign-in button
      Then the "<error>" message should be appears
      Examples:
        | username                 |  | password | error                     |
        | debswarnadeep8@gmail.com |  | Deep@123 | Invalid email or password |
        | br6814710@gmail.com      |  | Deep@123 | Invalid email or password |
        | debswarnadeep@gmail.com  |  | Deep@123 | Invalid email or password |


  @ui
  Scenario Outline: Login with the invalid email format and password
    Given user enters the invalid email format "<username>" and "<password>"
    When the user clicks on the sign-in button
    Then the proper "<error>" message appears
    Examples:
      | username                  | password | error                                                       |
      | debswarnadeep85@gamil.com | Deep@123 | Email must be from galvinus.com, galvinus.in, or gmail.com. |
      | debswarnadeep85@gamilcom  | Deep@123 | Email must be from galvinus.com, galvinus.in, or gmail.com. |
      | debswarnadeep85@gamil.    | Deep@123 | Email must be from galvinus.com, galvinus.in, or gmail.com. |



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

  @ui
  Scenario: Verify the Functionality of the Role Permission Module
    Given the user clicks on the Role and Permission module
    When the user is redirected to the Role and Permission page
    Then all the content on the page should be visible

  @ui
   Scenario Outline: Assign random role to the employee
      Given user clicks on the Assign role button
      And enter employee "<name>" in the search bar
      When the user click the dropdown all the roles should visible
      Then Assign the particular "<role>" for a employee
     Examples:
       | name    | role        |
       | Bhaskar | Super Admin |
       | Bhaskar | HR          |
       | Bhaskar | Admin       |


  @ui
 Scenario Outline: Create a new role
    Given the user clicks on the Create Role button
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
    Given the user click on the Delete Role Button
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
        Given check the functionality of the Add permission button for employee
        And Click on the Add permission button
        When the popup opens click on dropdown button
        And select any one "<permission>" from the dropdown
        Then After select permission click on the Add permission button
    Examples:
      | permission              |
      | Reset Employee Password |
      | Assign Admin            |

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










