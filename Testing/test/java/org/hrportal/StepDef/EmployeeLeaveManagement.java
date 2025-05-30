package org.hrportal.StepDef;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.hrportal.pages.*;
import org.hrportal.webdriver.DriverManager;
import org.openqa.selenium.WebDriver;

public class EmployeeLeaveManagement {

    private WebDriver driver;
    private SignInPage signInPage;
    private AdminHomePage homepage;
    private EmployeeHomePage employeeHomePage;
    private EmployeeRequestLeavePage employeeRequestLeavePage;
    private EmployeeManageLeavesPage employeeManageLeavesPage;


    public EmployeeLeaveManagement() {
        this.driver = DriverManager.getDriver();
        this.signInPage = new SignInPage(driver);
        this.homepage = new AdminHomePage(driver);
        this.employeeHomePage = new EmployeeHomePage(driver);
        this.employeeRequestLeavePage = new EmployeeRequestLeavePage(driver);
        this.employeeManageLeavesPage = new EmployeeManageLeavesPage(driver);

    }

    @Given("the user click on the Request Leave option from the Leave Management")
    public void theUserClickOnTheRequestLeaveOptionFromTheLeaveManagement() {
        employeeRequestLeavePage.clickProfileButton();
        employeeRequestLeavePage.selectEmployeeDashboard();
        employeeHomePage.clickLeaveManagementModule();
        employeeHomePage.clickRequestLeaveOption();

    }

    @When("the user clicks on {string} dropdown")
    public void theUserClicksOnDropdown(String leave) {
        employeeRequestLeavePage.selectLeaveType(leave);

    }

    @Then("the user selects any one option from the dropdown")
    public void theUserSelectsAnyOneOptionFromTheDropdown() {
    }
    
    
    @Given("user click on the Request Leave option from Leave Management")
    public void userClickOnTheRequestLeaveOptionFromLeaveManagement() {
        employeeRequestLeavePage.clickProfileButton();
        employeeRequestLeavePage.selectEmployeeDashboard();
        employeeHomePage.clickLeaveManagementModule();
        employeeHomePage.clickRequestLeaveOption();
    }

    @When("user clicks on {string} dropdown")
    public void userClicksOnDropdown(String duration) {
        employeeRequestLeavePage.selectDuration(duration);

        
    }

    @Then("the user select any one option from the dropdown")
    public void theUserSelectAnyOneOptionFromTheDropdown() {
    }

    @Given("user click on the Request Leave from the Leave Management module")
    public void userClickOnTheRequestLeaveFromTheLeaveManagementModule() {
        employeeRequestLeavePage.clickProfileButton();
        employeeRequestLeavePage.selectEmployeeDashboard();
        employeeHomePage.clickLeaveManagementModule();
        employeeHomePage.clickRequestLeaveOption();


    }

    @When("the user enters {string} and {string}")
    public void theUserEntersAnd(String start, String end) {
        employeeRequestLeavePage.enterDates(start,end);


    }

    @Then("the user able to fill the data")
    public void theUserAbleToFillTheData() {
    }

    @Given("user click on Request Leave from Leave Management")
    public void userClickOnRequestLeaveFromLeaveManagement() {
        employeeRequestLeavePage.clickProfileButton();
        employeeRequestLeavePage.selectEmployeeDashboard();
        employeeHomePage.clickLeaveManagementModule();
        employeeHomePage.clickRequestLeaveOption();

    }

    @When("check upload file is enable or not")
    public void checkUploadFileIsEnableOrNot() {
        employeeRequestLeavePage.checkUploadFileButton();


    }

    @Then("the user able to upload the file")
    public void theUserAbleToUploadTheFile() {
    }

    @Given("user click on Request Leave from the Leave Management module in sidebar")
    public void userClickOnRequestLeaveFromTheLeaveManagementModuleInSidebar() {
        employeeRequestLeavePage.clickProfileButton();
        employeeRequestLeavePage.selectEmployeeDashboard();
        employeeHomePage.clickLeaveManagementModule();
        employeeHomePage.clickRequestLeaveOption();

    }

    @When("check Submit Request button is enable or not")
    public void checkSubmitRequestButtonIsEnableOrNot() {
        employeeRequestLeavePage.checkSubmitRequestButton();

    }

    @Then("user able to apply for the leave")
    public void userAbleToApplyForTheLeave() {
    }

    @Given("user click on Request Leave option")
    public void userClickOnRequestLeaveOption() {
        employeeRequestLeavePage.clickProfileButton();
        employeeRequestLeavePage.selectEmployeeDashboard();
        employeeHomePage.clickLeaveManagementModule();
        employeeHomePage.clickRequestLeaveOption();

    }

    @When("the user fills {string}, {string}, {string}, {string}, {string}")
    public void theUserFills(String leave, String duration, String start, String end, String reason) {
        employeeRequestLeavePage.selectLeaveType(leave);
        employeeRequestLeavePage.selectDuration(duration);
        employeeRequestLeavePage.enterDates(start, end);
        employeeRequestLeavePage.enterReason(reason);


    }

    @And("click on Submit Request button")
    public void clickOnSubmitRequestButton() {
        employeeRequestLeavePage.clickSubmitRequestButton();


    }

    @Then("successful notification is displayed")
    public void successfulNotificationIsDisplayed() {
        employeeRequestLeavePage.successNotification();

    }

    @Given("user click on Manage Leave")
    public void userClickOnManageLeave() {
        employeeRequestLeavePage.clickProfileButton();
        employeeRequestLeavePage.selectEmployeeDashboard();
        employeeHomePage.clickLeaveManagementModule();
        employeeHomePage.selectManageLeaves();

    }

    @When("the user selects {string} from the dropdown")
    public void theUserSelectsFromTheDropdown(String month) {
        employeeManageLeavesPage.selectMonth(month);

    }

    @Then("the table changes accordingly")
    public void theTableChangesAccordingly() {
    }

    @Given("user clicks on Manage Leave")
    public void userClicksOnManageLeave() {
        employeeRequestLeavePage.clickProfileButton();
        employeeRequestLeavePage.selectEmployeeDashboard();
        employeeHomePage.clickLeaveManagementModule();
        employeeHomePage.selectManageLeaves();

    }

    @When("the user select {string} drop down")
    public void theUserSelectDropDown(String year) {
        employeeManageLeavesPage.selectYear(year);

    }

    @Then("the table changes")
    public void theTableChanges() {
    }

    @Given("user clicks on manage Leave option")
    public void userClicksOnManageLeaveOption() {
        employeeRequestLeavePage.clickProfileButton();
        employeeRequestLeavePage.selectEmployeeDashboard();
        employeeHomePage.clickLeaveManagementModule();
        employeeHomePage.selectManageLeaves();

    }

    @When("the user enters {string} in search bar")
    public void theUserEntersInSearchBar(String name) {
        employeeManageLeavesPage.searchEmployee(name);

    }

    @Then("the table changes according to employee name")
    public void theTableChangesAccordingToEmployeeName() {
    }

    @Given("user click on Manage Leave option from the sidebar")
    public void userClickOnManageLeaveOptionFromTheSidebar() {
        employeeRequestLeavePage.clickProfileButton();
        employeeRequestLeavePage.selectEmployeeDashboard();
        employeeHomePage.clickLeaveManagementModule();
        employeeHomePage.selectManageLeaves();

    }

    @When("the user click {string} dropdown")
    public void theUserClickDropdown(String leave) {
        employeeManageLeavesPage.selectLeaveType(leave);


    }

    @Then("the table change accordingly")
    public void theTableChangeAccordingly() {
    }

    @Given("user clicks on Manage Leave from the Leave Management")
    public void userClicksOnManageLeaveFromTheLeaveManagement() {
        employeeRequestLeavePage.clickProfileButton();
        employeeRequestLeavePage.selectEmployeeDashboard();
        employeeHomePage.clickLeaveManagementModule();
        employeeHomePage.selectManageLeaves();

    }

    @When("the user click on {string} dropdown")
    public void theUserClickOnDropdown(String status) {
        employeeManageLeavesPage.statusDropdown(status);


    }

    @Then("the table changes according to selected status")
    public void theTableChangesAccordingToSelectedStatus() {
    }
}
