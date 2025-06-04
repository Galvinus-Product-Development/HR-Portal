package org.hrportal.StepDef;

import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.hrportal.pages.*;
import org.hrportal.webdriver.DriverManager;
import org.openqa.selenium.WebDriver;

public class AdminHolidayCalendarPage {

    private WebDriver driver;
    private SignInPage signInPage;
    private AdminHomePage homepage;
    private HolidayPage holidayPage;

    private EmployeeRequestLeavePage employeeRequestLeavePage;
    private EmployeeHomePage employeeHomePage;

    public AdminHolidayCalendarPage() {
        this.driver = DriverManager.getDriver();
        this.signInPage = new SignInPage(driver);
        this.homepage = new AdminHomePage(driver);
        this.holidayPage = new HolidayPage(driver);
        this.employeeRequestLeavePage =new EmployeeRequestLeavePage(driver);
        this.employeeHomePage = new EmployeeHomePage(driver);

    }
    @Given("the user click on Holiday option present in sidebar")
    public void theUserClickOnHolidayOptionPresentInSidebar() {
        homepage.clickHolidayModule();

    }

    @When("user select any {string} from the dropdown")
    public void userSelectAnyFromTheDropdown(String year) {
         holidayPage.yearDropdown(year);

    }

    @Then("the table changes based on selected year")
    public void theTableChangesBasedOnSelectedYear() {
    }

    @Given("user click on holiday option in the sidebar")
    public void userClickOnHolidayOptionInTheSidebar() {

        homepage.clickHolidayModule();

    }

    @When("the user select {string} from the dropdown")
    public void theUserSelectFromTheDropdown(String month) {
        holidayPage.monthDropdown(month);

    }

    @Then("user able to select valid month from the dropdown")
    public void userAbleToSelectValidMonthFromTheDropdown() {
    }

    @Given("the user click on holiday option in the sidebar")
    public void theUserClickOnHolidayOptionInTheSidebar() {
        homepage.clickHolidayModule();
    }

    @When("the user select any option from {string}{string} in dropdown")
    public void theUserSelectAnyOptionFromInDropdown(String arg0, String arg1) {

    }

    @Then("the table gets changes based on selected year and month")
    public void theTableGetsChangesBasedOnSelectedYearAndMonth() {
    }


    @Given("the user clicks on holiday option from the sidebar")
    public void theUserClicksOnHolidayOptionFromTheSidebar()  {

        homepage.clickHolidayModule();
    }

    @When("the user selects {string} {string} {string} {string}")
    public void theUserSelects(String year, String month, String location, String holidayName) throws InterruptedException {
        holidayPage.fillHolidayDetails(year, month, location,holidayName  );

    }

    @Then("the user click on add to batch button")
    public void theUserClickOnAddToBatchButton() {
        holidayPage.createHoliday();
    }

    @Given("the user clicks on profile and navigate to employee portal")
    public void theUserClicksOnProfileAndNavigateToEmployeePortal() {
        employeeRequestLeavePage.clickProfileButton();
        employeeRequestLeavePage.selectEmployeeDashboard();
        
    }

    @When("the user click on holiday module from the sidebar")
    public void theUserClickOnHolidayModuleFromTheSidebar() {
        employeeHomePage.clickHolidayModule();

        
    }

    @Then("user select any year from the {string} dropdown")
    public void userSelectAnyYearFromTheDropdown(String year) {
        holidayPage.setYearDropdown(year);
    }

    @Given("the user click on profile and navigate to employee portal")
    public void theUserClickOnProfileAndNavigateToEmployeePortal() {
        employeeRequestLeavePage.clickProfileButton();
        employeeRequestLeavePage.selectEmployeeDashboard();

    }

    @When("user click on holiday module from the sidebar")
    public void userClickOnHolidayModuleFromTheSidebar() {
        employeeHomePage.clickHolidayModule();

    }

    @Then("user select any month from the {string} dropdown")
    public void userSelectAnyMonthFromTheDropdown(String month) {
        holidayPage.setMonthDropdown(month);
    }
}
