package org.hrportal.StepDef;

import io.cucumber.java.Before;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.cucumber.java.en.Then;
import org.hrportal.pages.AdminDailyAttendancePage;
import org.hrportal.pages.AdminHomePage;
import org.hrportal.pages.RolePermission;
import org.hrportal.pages.SignInPage;
import org.hrportal.webdriver.DriverManager;
import org.junit.Assert;
import org.openqa.selenium.WebDriver;

public class AdminAttendance {

    private WebDriver driver;
    private SignInPage signInPage;
    private AdminHomePage homepage;
    private AdminDailyAttendancePage adminDailyAttendancePage;
    boolean selectionStatus;


    public AdminAttendance() {
        this.driver = DriverManager.getDriver();
        this.signInPage = new SignInPage(driver);
        this.homepage = new AdminHomePage(driver);
        this.adminDailyAttendancePage = new AdminDailyAttendancePage(driver);
    }

    @Given("the user click on the attendance module from the sidebar")
    public void theUserClickOnTheAttendanceModuleFromTheSidebar() {
        homepage.clickAttendanceModule();

    }

    @When("the user click on daily attendance from the dropdown")
    public void theUserClickOnDailyAttendanceFromTheDropdown() {
        homepage.clickDailyAttendance();

    }

    @Then("the user navigates to the daily attendance daily attendance page")
    public void theUserNavigatesToTheDailyAttendanceDailyAttendancePage() {
        adminDailyAttendancePage.dailyAttendancePageTitle();
    }


    @Given("the user clicks on the location dropdown option")
    public void theUserClicksOnTheLocationDropdownOption() {
        homepage.clickAttendanceModule();
        homepage.clickDailyAttendance();
        adminDailyAttendancePage.clickLocationOption();

    }

    @When("the user sees all available {string} in the dropdown")
    public void theUserSeesAllAvailableInTheDropdown(String location) {
         adminDailyAttendancePage.selectLocation(location);

    }

    @Then("the user should {string} in selecting the location")
    public void theUserShouldInSelectingTheLocation(String result) {
       adminDailyAttendancePage.locationResult(result);

    }

    @Given("the user clicks on the department dropdown option")
    public void theUserClicksOnTheDepartmentDropdownOption() {
        homepage.clickAttendanceModule();
        homepage.clickDailyAttendance();
         adminDailyAttendancePage.getDepartmentNames();

    }

    @When("the user sees all the available {string} options in the dropdown")
    public void theUserSeesAllTheAvailableOptionsInTheDropdown(String department ) {
        adminDailyAttendancePage.selectDepartment(department);

    }

    @Then("the user should {string} in selecting the department")
    public void theUserShouldInSelectingTheDepartment(String result) {
        adminDailyAttendancePage.departmentResult(result);

    }


    @Given("the user click on the all status dropdown option")
    public void theUserClickOnTheAllStatusDropdownOption() throws InterruptedException {
        homepage.clickAttendanceModule();
        Thread.sleep(2000);
        homepage.clickDailyAttendance();
        Thread.sleep(2000);
        adminDailyAttendancePage.getStatusNames();

    }

    @When("the user can see all the available {string} options in the dropdown")
    public void theUserCanSeeAllTheAvailableOptionsInTheDropdown(String status) {
        selectionStatus = adminDailyAttendancePage.selectStatus(status);

    }

    @Then("the user should {string} in the selection of the status")
    public void theUserShouldInTheSelectionOfTheStatus(String result) {
        adminDailyAttendancePage.statusResult(result);

    }

    @Given("the user is on the Daily Attendance page")
    public void theUserIsOnTheDailyAttendancePage() {
        
    }

    @When("the user sets some filters available on the page")
    public void theUserSetsSomeFiltersAvailableOnThePage() throws InterruptedException {
        homepage.clickAttendanceModule();
        Thread.sleep(2000);
        homepage.clickDailyAttendance();
        Thread.sleep(2000);
        adminDailyAttendancePage.resetFilter();
        
    }

    @Then("the user clicks the reset button")
    public void theUserClicksTheResetButton() {
        
    }

    @And("the filters should be reset to their default state")
    public void theFiltersShouldBeResetToTheirDefaultState() {
        
    }

    @And("the reset button should be enabled")
    public void theResetButtonShouldBeEnabled() {
        adminDailyAttendancePage.isResetFilterEnable();
    }

    @Given("the user click on location dropdown")
    public void theUserClickOnLocationDropdown() throws InterruptedException {
        homepage.clickAttendanceModule();
        Thread.sleep(2000);
        homepage.clickAttendanceDashboard();
        adminDailyAttendancePage.clickLocationOption();

    }

    @When("the user sees all available {string} from the dropdown")
    public void theUserSeesAllAvailableFromTheDropdown(String location) {
        adminDailyAttendancePage.selectLocation(location);

    }

    @Then("the user should {string} able to select the location")
    public void theUserShouldAbleToSelectTheLocation(String result) {
        adminDailyAttendancePage.locationResult(result);

    }

    @Given("the user click on department dropdown option")
    public void theUserClickOnDepartmentDropdownOption() throws InterruptedException {
        homepage.clickAttendanceModule();
        Thread.sleep(2000);
        homepage.clickAttendanceDashboard();
        adminDailyAttendancePage.getDepartmentNames();

    }
    @When("the user can see the available {string} options in the dropdown")
    public void theUserCanSeeTheAvailableOptionsInTheDropdown(String department) {
         adminDailyAttendancePage.selectDepartment(department);

    }

    @Then("the user should {string} able to select the department")
    public void theUserShouldAbleToSelectTheDepartment(String result) {
        adminDailyAttendancePage.departmentResult(result);
    }


    @Given("the user click on Attendance dashboard option present in Attendance module")
    public void theUserClickOnAttendanceDashboardOptionPresentInAttendanceModule() throws InterruptedException {
        homepage.clickAttendanceModule();
        Thread.sleep(2000);
        homepage.clickAttendanceDashboard();


    }

    @When("the user enters any employee {string} in employee name text field")
    public void theUserEntersAnyEmployeeInEmployeeNameTextField(String name) {
        adminDailyAttendancePage.searchEmployee(name);

    }

    @Then("the user should {string} able to see searched employee")
    public void theUserShouldAbleToSeeSearchedEmployee(String result) {
        adminDailyAttendancePage.employeeTable(result);

    }

    @Given("user click on Attendance dashboard option present in Attendance module")
    public void userClickOnAttendanceDashboardOptionPresentInAttendanceModule() throws InterruptedException {
        Thread.sleep(2000);
        homepage.clickAttendanceModule();
        Thread.sleep(2000);
        homepage.clickAttendanceDashboard();

    }

    @When("the user selects any {string} from dropdown")
    public void theUserSelectsAnyFromDropdown(String month) {
        adminDailyAttendancePage.selectMonth(month);

    }

    @Then("the {string} should show accordingly")
    public void theShouldShowAccordingly(String result) {
        adminDailyAttendancePage.monthResult(result);
    }

    @Given("admin click on Attendance dashboard option present in Attendance module")
    public void adminClickOnAttendanceDashboardOptionPresentInAttendanceModule() throws InterruptedException {
        homepage.clickAttendanceModule();
        Thread.sleep(2000);
        homepage.clickAttendanceDashboard();

    }

    @When("the admin selects any {string} from the dropdown")
    public void theAdminSelectsAnyFromTheDropdown(String year) {
        adminDailyAttendancePage.selectYear(year);

    }

    @Then("the {string} should visible accordingly")
    public void theShouldVisibleAccordingly(String result) {
        adminDailyAttendancePage.yearResult(result);
    }

    @Given("user click on Attendance dashboard option present in Attendance module from the sidebar")
    public void userClickOnAttendanceDashboardOptionPresentInAttendanceModuleFromTheSidebar() throws InterruptedException {
        homepage.clickAttendanceModule();
        Thread.sleep(2000);
        homepage.clickAttendanceDashboard();

    }

    @When("the user navigate to attendance dashboard")
    public void theUserNavigateToAttendanceDashboard() {


    }

    @Then("check the Download report is enable or not")
    public void checkTheDownloadReportIsEnableOrNot() {
        adminDailyAttendancePage.downloadReportButton();
    }

    @Given("user click on Overtime option from the Attendance module")
    public void userClickOnOvertimeOptionFromTheAttendanceModule() throws InterruptedException {
        homepage.clickAttendanceModule();
        Thread.sleep(2000);
        homepage.clickOvertime();

    }

    @When("the user enters the employee {string} in the search bar")
    public void theUserEntersTheEmployeeInTheSearchBar(String name) {
           adminDailyAttendancePage.employeeSearchBar(name);
    }

    @Then("the table changes dynamically based on the employee name")
    public void theTableChangesDynamicallyBasedOnTheEmployeeName() {
    }

    @Given("user clicks on Overtime option from Attendance module")
    public void userClicksOnOvertimeOptionFromAttendanceModule() throws InterruptedException {
        homepage.clickAttendanceModule();
        Thread.sleep(2000);
        homepage.clickOvertime();

    }

    @When("user selects any one {string} from the dropdown")
    public void userSelectsAnyOneFromTheDropdown(String status) {
        adminDailyAttendancePage.allStatusDropDown(status);

    }

    @Then("the table changes dynamically based on employee name")
    public void theTableChangesDynamicallyBasedOnEmployeeName() {
    }
}
