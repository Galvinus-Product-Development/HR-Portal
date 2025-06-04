Feature: Holiday

  Background:
    Given user log in as an admin

  @ui
 Scenario Outline: Verify the functionality of year dropdown in Holiday module
    Given the user click on Holiday option present in sidebar
    When user select any "<Year>" from the dropdown
    Then the table changes based on selected year
    Examples:
      | Year |
      | 2025 |
      | 2026 |
      | 1999 |

  @ui
   Scenario Outline: Verify the functionality of month dropdown in holiday module
     Given user click on holiday option in the sidebar
     When the user select "<Month>" from the dropdown
     Then user able to select valid month from the dropdown
   Examples:
     | Month   |
     | January |
     | March   |
     | Monday  |

#  @ui
#  Scenario Outline: Verify the functionality of year and month dropdown in holiday module
#    Given the user click on holiday option in the sidebar
#    When the user select any option from "<Year>""<month>" in dropdown
#    Then the table gets changes based on selected year and month
#    Examples:
#      | Year | month  |
#      | 2025 | May    |
#      | 2025 | August |
#      | 2026 | August |
#
#  @ui
# Scenario Outline: Create new holiday
#    Given the user clicks on holiday option from the sidebar
#    When the user selects "<Year>" "<Month>" "<Location>" "<Holiday name>"
#    Then the user click on add to batch button
#    Examples:
#      | Year | Month | Location | Holiday name      |
#      | 2025 | May   | All      | Testing Purpose10 |
#
# @ui
#Scenario Outline: Verify the functionality of Year dropdown from employee portal
#   Given the user clicks on profile and navigate to employee portal
#   When the user click on holiday module from the sidebar
#   Then user select any year from the "<year>" dropdown
#   Examples:
#     | year |
#     | 2025 |
#     | 2024 |
#     | 1999 |
#
#@ui
#Scenario Outline: Verify the functionality of month dropdown from employee portal
#Given the user click on profile and navigate to employee portal
#When  user click on holiday module from the sidebar
#Then user select any month from the "<month>" dropdown
#  Examples:
#    | month    |
#    | January  |
#    | February |
#    | Monday   |
#    | Tuesday  |