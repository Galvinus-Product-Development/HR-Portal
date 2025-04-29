package org.hrportal.StepDef;

import io.cucumber.java.Before;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.hrportal.pages.AdminEmployeeDatabaseMainPage;
import org.hrportal.pages.EmployeePage;
import org.hrportal.pages.AdminHomePage;
import org.hrportal.pages.SignInPage;
import org.hrportal.webdriver.DriverManager;
import org.openqa.selenium.WebDriver;

public class AdminEmployeeDatabase {


    private WebDriver driver;
    private SignInPage signInPage;
    private AdminHomePage homePage;
    private AdminEmployeeDatabaseMainPage employeeDatabase;
    private EmployeePage employeePage;
    private AdminEmployeeDatabaseMainPage adminEmployeeDatabaseMainPage;
    private String searchedName;



    public AdminEmployeeDatabase() {
        this.driver = DriverManager.getDriver();
        this.signInPage = new SignInPage(driver);
        this.homePage = new AdminHomePage(driver);
        this.employeeDatabase = new AdminEmployeeDatabaseMainPage(driver);
        this.employeePage = new EmployeePage(driver);
        this.adminEmployeeDatabaseMainPage = new AdminEmployeeDatabaseMainPage(driver);
    }


    @Given("user log in as an admin")
    public void userLogInAsAnAdmin() throws InterruptedException {
        signInPage.readCredentialsFromFile("src/test/java/org/hrportal/utils/valid credentials.txt");
        signInPage.clickSignInButton();
        Thread.sleep(2000);
    }

    @Given("user clicks on the Employee Database module")
    public void userClicksOnTheEmployeeDatabaseModule() {
        homePage.clickEmployeeDataManagement();
    }

    @And("enter the employee {string} in the search bar")
    public void enterTheEmployeeInTheSearchBar(String name) {
        searchedName = name;
        adminEmployeeDatabaseMainPage.searchEmployeeField(name);
    }

    @When("the table filters based on the name")
    public void theTableFiltersBasedOnTheName() {
        adminEmployeeDatabaseMainPage.isEmployeePresent(searchedName);

    }
    @Then("click on that particular employee")
    public void clickOnThatParticularEmployee() {
    }

    @Given("admin click on employee database module")
    public void adminClickOnEmployeeDatabaseModule() throws InterruptedException {
        Thread.sleep(2000);
        homePage.clickEmployeeDataManagement();
    }

    @When("the admin click on department dropdown")
    public void theAdminClickOnDepartmentDropdown() {
       adminEmployeeDatabaseMainPage.selectDepartment();
    }

    @Then("the table gets filter based on the selected {string}")
    public void theTableGetsFilterBasedOnTheSelected(String department) {
        adminEmployeeDatabaseMainPage.department(department);
    }

    @Given("user click on employee Database module")
    public void userClickOnEmployeeDatabaseModule() throws InterruptedException {
        Thread.sleep(2000);
       // homePage.clickEmployeeDataManagement();

    }

    @When("the user click on all location dropdown")
    public void theUserClickOnAllLocationDropdown() {
        adminEmployeeDatabaseMainPage.selectLocation();
    }

    @Then("the table get filter based on the selected {string}")
    public void theTableGetFilterBasedOnTheSelected(String location) {
        adminEmployeeDatabaseMainPage.location(location);
    }

    @Given("the user click on employee database module")
    public void theUserClickOnEmployeeDatabaseModule() throws InterruptedException {
        Thread.sleep(2000);
       // homePage.clickEmployeeDataManagement();
    }

    @When("the user click on the all status dropdown")
    public void theUserClickOnTheAllStatusDropdown() {
       adminEmployeeDatabaseMainPage.selectStatus();
    }

    @Then("the table get filter based on selected {string}")
    public void theTableGetFilterBasedOnSelected(String status) {
        adminEmployeeDatabaseMainPage.status(status);
    }

    @Given("the user clicks on the Employee Database module from the sidebar")
    public void theUserClicksOnTheEmployeeDatabaseModuleFromTheSidebar() throws InterruptedException {
        Thread.sleep(2000);
        homePage.clickEmployeeDataManagement();
    }

    @When("the user checks if the {string} buttons are enabled")
    public void theUserChecksIfTheButtonsAreEnabled(String page) {
        adminEmployeeDatabaseMainPage.checkPagination( page);
    }

    @Then("the user clicks on the {string} button to verify navigation to the next page")
    public void theUserClicksOnTheButtonToVerifyNavigationToTheNextPage(String page) {
        adminEmployeeDatabaseMainPage.clickPagination(page);
    }

    @Given("admin can able to see all the employees in a table")
    public void adminCanAbleToSeeAllTheEmployeesInATable() {
        homePage.clickEmployeeDataManagement();
        boolean isDisplayed = employeeDatabase.employeeDetailsTable();
        System.out.println("Is employee Datatable is displayed?" + isDisplayed);
      //  employeeDatabase.numberOfEmployees();
    }

    @When("admin fills all the filters like {string}, {string}, {string}, {string} based on these filter employee should comes at top of the table")
    public void adminFillsAllTheFiltersLikeBasedOnTheseFilterEmployeeShouldComesAtTopOfTheTable(String employee, String department, String location, String status) {
        employeeDatabase.searchEmployee(employee, department, location, status );
        employeeDatabase.filteredEmployee(employee);
    }
    @Then("admin able to click on that particular {string}")
    public void adminAbleToClickOnThatParticular(String employee) {
        employeeDatabase.selectEmployee(employee);
    }

    @Given("user clicks on the edit profile button")
    public void userClicksOnTheEditProfileButton() {
        homePage.clickEmployeeDataManagement();
        employeePage.clickEditButton();
    }

    @And("a popup will appears")
    public void aPopupWillAppears() {
        boolean isDisplayed = employeePage.employeePagePopup();
        System.out.println("Is employee details popup appears? " + isDisplayed);
    }

    @When("admin fills all the employment details like {string}, {string}, {string}, {string}, {string}, {string}, {string}, {string}, {string}, {string}")
    public void adminFillsAllTheEmploymentDetailsLike(
            String employeeId, String jobTitle, String location, String officeEmail,
            String dateOfJoining, String uanNumber, String pfNumber,
            String esicNumber, String employmentType, String lineManager) {

        employeePage.setEmployeeID(employeeId);
        employeePage.setJobTitle(jobTitle);
        employeePage.enterLocation(location);
        employeePage.enterOfficeEmail(officeEmail);
        employeePage.enterDateOfJoining(dateOfJoining);
        employeePage.enterUanNumber(uanNumber);
        employeePage.setPfNumber(pfNumber);
        employeePage.setEsicNumber(esicNumber);
        employeePage.setEmploymentType(employmentType);
        employeePage.setLineManager(lineManager);

        System.out.println("Admin Successfully entered the Employment Details");
    }

    @Given("user enters all the bank details like {string}, {string}, {string}, {string}")
    public void userEntersAllTheBankDetailsLike(String accountHolder, String bankName, String accountNumber, String ifscCode) {
        employeePage.setAccountHolderName(accountHolder);
        employeePage.setBankName(bankName);
        employeePage.setAccountNumber(accountNumber);
        employeePage.setIFSCCode(ifscCode);
    }


    @When("user click the save button all the details stored")
    public void userClickTheSaveButtonAllTheDetailsStored() {
        employeePage.clickSaveButton();
        
    }

    @Then("Admin click on approve details button")
    public void adminClickOnApproveDetailsButton() {
        adminEmployeeDatabaseMainPage.clickProfileIcon();
        adminEmployeeDatabaseMainPage.clickEmployeeDashboardButton();
    }

}
