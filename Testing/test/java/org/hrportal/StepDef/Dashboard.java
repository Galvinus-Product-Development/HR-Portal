package org.hrportal.StepDef;

import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.hrportal.pages.*;
import org.hrportal.webdriver.DriverManager;
import org.openqa.selenium.WebDriver;

public class Dashboard {

    private WebDriver driver;
    private SignInPage signInPage;
    private AdminHomePage homepage;
    private AdminDailyAttendancePage adminDailyAttendancePage;
    private EmployeeHomePage employeeHomePage;
    private EmployeeRequestLeavePage employeeRequestLeavePage;
    boolean selectionStatus;


    public Dashboard() {
        this.driver = DriverManager.getDriver();
        this.signInPage = new SignInPage(driver);
        this.homepage = new AdminHomePage(driver);
        this.adminDailyAttendancePage = new AdminDailyAttendancePage(driver);
        this.employeeRequestLeavePage = new EmployeeRequestLeavePage(driver);
        this.employeeHomePage = new EmployeeHomePage(driver);
    }




    @Given("user click on functionality of customize dashboard")
    public void userClickOnFunctionalityOfCustomizeDashboard() {
        homepage.clickCustomizeDashboard();
    }

    @When("Click on add new group button")
    public void clickOnAddNewGroupButton() {
        homepage.clickAddNewGroup();

    }

    @Then("a popup shows up")
    public void aPopupShowsUp() {
        homepage.addNewCardPopup();
    }

    @Given("the add new popup opens")
    public void theAddNewPopupOpens() {
        homepage.clickCustomizeDashboard();
        homepage.clickAddNewGroup();
        homepage.addNewCardPopup();
    }

    @When("the user enters card {string}")
    public void theUserEntersCard(String name) {
        homepage.enterCardName(name);


    }

    @Then("click on create button")
    public void clickOnCreateButton() {
        homepage.clickAddGroupButton();
    }

    @Given("the user enters the {string}, {string}, {string}")
    public void theUserEntersThe(String title, String message, String priority) {
        homepage.enterTitle(title);
        homepage.messageTextBox(message);
        homepage.priorityDropdown(priority);


    }

    @When("the user selects employee to send the notification")
    public void theUserSelectsEmployeeToSendTheNotification() {
        homepage.selectEmployee();

        
    }

    @Then("user click on send button {string} will shows up")
    public void userClickOnSendButtonWillShowsUp(String message) {
        homepage.sendNotificationButton(message);

    }

    @Given("user enters the {string}, {string}, {string}")
    public void userEntersThe(String title, String message, String priority) {
        homepage.enterTitle(title);
        homepage.messageTextBox(message);
        homepage.priorityDropdown(priority);

    }

    @When("the user doesn't selects any employee to send the notification")
    public void theUserDoesnTSelectsAnyEmployeeToSendTheNotification() {

    }

    @Then("user click send button {string} will shows up")
    public void userClickSendButtonWillShowsUp(String message) {
        homepage.sendNotificationButton(message);

    }

    @Given("the user in admin dashboard")
    public void theUserInAdminDashboard() {
        
    }

    @When("the user mouse hover the delete icon")
    public void theUserMouseHoverTheDeleteIcon() {
        homepage.checkDeleteButton();
        
    }

    @Then("check delete icon is enable or not")
    public void checkDeleteIconIsEnableOrNot() {
    }

    @Given("user in admin dashboard")
    public void userInAdminDashboard() {

    }

    @When("the user mouse over the edit icon")
    public void theUserMouseOverTheEditIcon() {
        homepage.checkEditButton();

    }

    @Then("check edit icon is enable or not")
    public void checkEditIconIsEnableOrNot() {
    }

    @Given("user enters {string} {string}, {string}, {string}, {string}")
    public void userEnters(String date, String startTime, String endTime, String duration, String reason) {
        employeeRequestLeavePage.clickProfileButton();
        employeeRequestLeavePage.selectEmployeeDashboard();
        employeeHomePage.enterDate(date);
        employeeHomePage.enterStartTime(startTime);
        employeeHomePage.enterEndTime(endTime);
        employeeHomePage.enterOvertimeDuration(duration);
        employeeHomePage.enterReason(reason);

    }

    @When("the user click on submit request button")
    public void theUserClickOnSubmitRequestButton() {
        employeeHomePage.clickSubmitRequest();

    }

    @Then("a successful notification will appear")
    public void aSuccessfulNotificationWillAppear() {
    }
}
