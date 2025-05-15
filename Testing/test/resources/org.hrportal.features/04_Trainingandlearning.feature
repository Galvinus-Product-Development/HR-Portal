Feature: Training and Learning

  @ui
  Scenario: Verify the functionality of the Training and Learning module
    Given the user locates the Training and Learning module in the sidebar
    When the user clicks on the Training and Learning module
    Then the related page should be visible

    @ui
    Scenario: Verify the functionality of Add Trainer button
      Given check whether add trainer button is enable or not
      When  user clicks on the add trainer module button
      Then a popup show ups

      @ui
      Scenario: Verify clicking the Create trainer button without filling the details
        Given click on the add trainer module button
        When the popup appears check whether cancel and create trainer button is enable or not
        Then click on create trainer button without filling the details

        @ui
     Scenario Outline: Add one trainer
        Given user selects the "<trainer>" from the dropdown
        When user enters the trainer "<expertise>"
        Then clicks on the create trainer button
       Examples:
         | trainer | expertise |
         | Bhaskar | QA        |
