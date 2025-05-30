Feature: Homepage Functionality

  Background:
    Given user log in as an admin

@ui
Scenario: Verify the functionality of Customize dashboard
  Given user click on functionality of customize dashboard
  When Click on add new group button
  Then a popup shows up

@ui
Scenario Outline: Add new card
  Given the add new popup opens
  When the user enters card "<name>"
  Then click on create button
  Examples:
    | name    |
    | Testing |


@ui
  Scenario: Verify the functionality of delete button in summary cards
  Given the user in admin dashboard
  When the user mouse hover the delete icon
  Then check delete icon is enable or not

@ui
 Scenario: Verify the functionality of edit button in summary card
  Given user in admin dashboard
  When the user mouse over the edit icon
  Then check edit icon is enable or not

@ui
Scenario Outline: Send a notification
  Given the user enters the "<Title>", "<Message>", "<Priority>"
  When the user selects employee to send the notification
  Then user click on send button "<message>" will shows up
  Examples:
    | Title     | Message | Priority | message                         |
    | Testing 1 | New     | Normal   | Notification sent successfully! |
    | Testing   |         | Normal   | Title and message are required  |
    |           | Demo    | Low      | Title and message are required  |
    | Testing 2 | Demo 1  | High     | Notification sent successfully! |
    | Testing 3 | Demo 2  | Low      | Notification sent successfully! |

@ui
Scenario Outline: Send a notification without selecting any employee
  Given user enters the "<Title>", "<Message>", "<Priority>"
  When the user doesn't selects any employee to send the notification
  Then user click send button "<message>" will shows up
  Examples:
    | Title     | Message               | Priority | message                             |
    | Testing 3 | Select zero employees | Normal   | Please select at least one employee |

@ui
Scenario Outline: Send a overtime request
  Given user enters "<Date>" "<start time>", "<end time>", "<duration>", "<reason>"
  When the user click on submit request button
  Then a successful notification will appear
  Examples:
    | Date       | start time | end time | duration | reason  |
    | 26/05/2025 | 20.00      | 21.00    | 1        |         |
    |            | 20.00      | 21.00    | 1        | Testing |
    | 26/05/2025 |            | 21.00    | 1        | Testing |
    | 26/05/2025 | 20.00      |          | 1        | Testing |
    | 26/05/2025 | 20.00      | 21.00    | 1        | Testing |





