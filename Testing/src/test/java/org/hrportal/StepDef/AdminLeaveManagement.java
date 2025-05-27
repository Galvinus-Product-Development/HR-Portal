package org.hrportal.StepDef;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.hrportal.pages.AdminDailyAttendancePage;
import org.hrportal.pages.AdminHomePage;
import org.hrportal.pages.AdminLeaveManagementPage;
import org.hrportal.pages.SignInPage;
import org.hrportal.webdriver.DriverManager;
import org.openqa.selenium.WebDriver;

public class AdminLeaveManagement {


    private WebDriver driver;
    private SignInPage signInPage;
    private AdminHomePage homepage;
    private AdminLeaveManagementPage adminLeaveManagementPage;
    boolean selectionStatus;


    public AdminLeaveManagement() {
        this.driver = DriverManager.getDriver();
        this.signInPage = new SignInPage(driver);
        this.homepage = new AdminHomePage(driver);
      this.adminLeaveManagementPage = new AdminLeaveManagementPage(driver);
    }


    @Given("the user click on Pending Leave Request option under the Leave Management")
    public void theUserClickOnPendingLeaveRequestOptionUnderTheLeaveManagement()  {

        homepage.clickLeaveManagement();

        homepage.pendingLeaveRequest();

    }

    @When("the user enters the {string}")
    public void theUserEntersThe(String name) {
       adminLeaveManagementPage.searchEmployee(name);


    }


    @Then("the table get filter based on the name")
    public void theTableGetFilterBasedOnTheName() {

    }

    @Given("the user clicks on Leave Request option under the Leave Management")
    public void theUserClicksOnLeaveRequestOptionUnderTheLeaveManagement(){
        homepage.clickLeaveManagement();

        homepage.pendingLeaveRequest();

    }

    @When("the user clicks the All Status dropdown")
    public void theUserClicksTheAllStatusDropdown() {
        adminLeaveManagementPage.clickStatusDropdown();


    }

    @And("the user select any {string} from the dropdown")
    public void theUserSelectAnyFromTheDropdown(String status) {
        adminLeaveManagementPage.selectStatusFromDropdown(status);
    }

    @Then("the table changes according to the status")
    public void theTableChangesAccordingToTheStatus() {
    }

    @Given("the user clicks on Leave History option under Leave Management")
    public void theUserClicksOnLeaveHistoryOptionUnderLeaveManagement(){

        homepage.clickLeaveManagement();

        homepage.clickLeaveHistory();

    }

    @When("the user enter the {string}")
    public void theUserEnterThe(String name) {
        adminLeaveManagementPage.enterEmployeeName(name);
    }

    @Then("the table changes according to the employee name")
    public void theTableChangesAccordingToTheEmployeeName() {

    }

    @Given("the user clicks on Leave History option from the Leave Management")
    public void theUserClicksOnLeaveHistoryOptionFromTheLeaveManagement() {
        homepage.clickLeaveManagement();

        homepage.clickLeaveHistory();
        
    }

    @When("the user clicks on month dropdown")
    public void theUserClicksOnMonthDropdown() {
        adminLeaveManagementPage.clickMonth();
        
    }
    
    @And("the user select any option {string} from the dropdown")
    public void theUserSelectAnyOptionFromTheDropdown(String month) {
        adminLeaveManagementPage.selectMonth(month);
    }

    @Then("the table changes according to the month")
    public void theTableChangesAccordingToTheMonth() {

    }

    @Given("the user click on Leave History module from the Leave Management")
    public void theUserClickOnLeaveHistoryModuleFromTheLeaveManagement() {
        homepage.clickLeaveManagement();

        homepage.clickLeaveHistory();

    }

    @When("user click on All Status dropdown")
    public void userClickOnAllStatusDropdown() {

    }
    @And("the user selects any {string} from the dropdown")
    public void theUserSelectsAnyFromTheDropdown(String status) {
        adminLeaveManagementPage.allStatusDropdown(status);
    }

    @Then("the table change automatically based on the status")
    public void theTableChangeAutomaticallyBasedOnTheStatus() {

    }

    @Given("the user selects Leave Policy option under Leave Management")
    public void theUserSelectsLeavePolicyOptionUnderLeaveManagement(){
        homepage.clickLeaveManagement();

        homepage.clickLeavePolicy();
    }

    @When("user click on Upload Policy button")
    public void userClickOnUploadPolicyButton() {
        adminLeaveManagementPage.uploadPolicyButton();

    }

    @Then("the popup will appear")
    public void thePopupWillAppear() {
        adminLeaveManagementPage.uploadPolicyPopup();
    }

    @Given("the user click on Upload Policy button")
    public void theUserClickOnUploadPolicyButton()  {
        homepage.clickLeaveManagement();

        homepage.clickLeavePolicy();

    }

    @When("then user fills all the details {string} {string} from the popup")
    public void thenUserFillsAllTheDetailsFromThePopup(String name, String type)  {
        adminLeaveManagementPage.uploadPolicyPopup();

        adminLeaveManagementPage.fillDetails(name, type);

    }

    @Then("then click on upload button")
    public void thenClickOnUploadButton() {
     //   adminLeaveManagementPage.clickUpload();
    }


}
