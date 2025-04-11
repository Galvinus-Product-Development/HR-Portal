package org.hrportal.StepDef;

import io.cucumber.java.Before;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.hrportal.pages.EmployeeHomePage;
import org.openqa.selenium.WebDriver;

public class EmployeeHomePageStepDef {

    private WebDriver driver;
    private EmployeeHomePage employeeHomePage;




    @Before(order = 5)
    public void setUp() {
        this.driver = Hooks.getDriver();
        this.employeeHomePage = new EmployeeHomePage(driver);

    }

    @Given("user logout from the admin portal")
    public void userLogoutFromTheAdminPortal() {
        boolean checkInButton = employeeHomePage.checkInButton();
        System.out.println("Is check-in button is enabled? " + checkInButton);

    }

    @And("login as a admin")
    public void loginAsAAdmin() {

    }

    @When("the admin is in the employee page")
    public void theAdminIsInTheEmployeePage() {

    }

    @Then("user clicks on Check-in button and a conformation message will displays")
    public void userClicksOnCheckInButtonAndAConformationMessageWillDisplays() {
    }
}
