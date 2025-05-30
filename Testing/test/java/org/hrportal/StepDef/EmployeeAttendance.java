package org.hrportal.StepDef;

import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.hrportal.pages.*;
import org.hrportal.webdriver.DriverManager;
import org.openqa.selenium.WebDriver;

public class EmployeeAttendance {

    private WebDriver driver;

    private SignInPage signInPage;
    private AdminHomePage homepage;
    private EmployeeHomePage employeeHomePage;
    private EmployeeAttendancePage employeeAttendancePage;
    private EmployeeRequestLeavePage employeeRequestLeavePage;



    public EmployeeAttendance() {
        this.driver = DriverManager.getDriver();
        this.signInPage = new SignInPage(driver);
        this.homepage = new AdminHomePage(driver);
        this.employeeHomePage = new EmployeeHomePage(driver);
        this.employeeRequestLeavePage = new EmployeeRequestLeavePage(driver);
        this.employeeAttendancePage = new EmployeeAttendancePage(driver);


    }
    @Given("user click on attendance tracker under attendance module")
    public void userClickOnAttendanceTrackerUnderAttendanceModule() {
        employeeRequestLeavePage.clickProfileButton();
        employeeRequestLeavePage.selectEmployeeDashboard();
        employeeHomePage.clickAttendanceModule();
        employeeHomePage.clickAttendanceTracker();

    }

    @When("user click on attendance request button")
    public void userClickOnAttendanceRequestButton() {
        employeeAttendancePage.clickAttendanceRequestButton();

    }

    @Then("a popup should appear")
    public void aPopupShouldAppear() {
        employeeAttendancePage.attendanceRequestPopup();
    }

    @Given("user enters {string}, {string}")
    public void userEnters(String punchInTime, String reason) {
        employeeRequestLeavePage.clickProfileButton();
        employeeRequestLeavePage.selectEmployeeDashboard();
        employeeHomePage.clickAttendanceModule();
        employeeHomePage.clickAttendanceTracker();
        employeeAttendancePage.clickAttendanceRequestButton();
        employeeAttendancePage.enterPunchInTime(punchInTime);
        employeeAttendancePage.enterReason(reason);


    }

    @When("user click on submit button")
    public void userClickOnSubmitButton() {
        employeeAttendancePage.clickSubmitButton();

    }

    @Then("a successful notification is displayed")
    public void aSuccessfulNotificationIsDisplayed() {

    }

    @Given("user enters details of {string}, {string}")
    public void userEntersDetailsOf(String punchOutTime, String reason) {
        employeeRequestLeavePage.clickProfileButton();
        employeeRequestLeavePage.selectEmployeeDashboard();
        employeeHomePage.clickAttendanceModule();
        employeeHomePage.clickAttendanceTracker();
        employeeAttendancePage.clickAttendanceRequestButton();
        employeeAttendancePage.clickPunchOutButton();
        employeeAttendancePage.enterPunchInTime(punchOutTime);
        employeeAttendancePage.enterReason(reason);

    }

    @When("user clicks on submit button")
    public void userClicksOnSubmitButton() {

        employeeAttendancePage.clickSubmitButton();
    }

    @Then("a successful notification displayed")
    public void aSuccessfulNotificationDisplayed() {
    }


    @Given("user in the attendance dashboard page")
    public void userInTheAttendanceDashboardPage() {
        employeeRequestLeavePage.clickProfileButton();
        employeeRequestLeavePage.selectEmployeeDashboard();
        employeeHomePage.clickAttendanceModule();
        employeeHomePage.clickAttendanceDashboard();


    }

    @When("user click on calendar view button and list view button")
    public void userClickOnCalendarViewButtonAndListViewButton() {

        employeeAttendancePage.checkCalendarViewButton();
        employeeAttendancePage.checkListViewButton();

    }

    @Then("table should change")
    public void tableShouldChange() {
    }

    @Given("user in overtime page")
    public void userInOvertimePage() {
        employeeRequestLeavePage.clickProfileButton();
        employeeRequestLeavePage.selectEmployeeDashboard();
        employeeHomePage.clickAttendanceModule();
        employeeHomePage.clickOvertimeModule();

    }

    @When("the user select {string} in the dropdown")
    public void theUserSelectInTheDropdown(String status) {
        employeeAttendancePage.allStatusDropdown(status);

    }

    @Then("table changes accordingly")
    public void tableChangesAccordingly() {
    }
}
