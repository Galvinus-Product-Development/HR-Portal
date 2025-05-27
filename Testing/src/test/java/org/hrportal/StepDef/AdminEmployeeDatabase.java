package org.hrportal.StepDef;

import io.cucumber.java.Before;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.hrportal.pages.AdminEmployeeDatabaseMainPage;
import org.hrportal.pages.EmployeePage;
import org.hrportal.pages.AdminHomePage;
import org.hrportal.pages.SignInPage;
import org.hrportal.utils.ConfigReader;
import org.hrportal.webdriver.DriverManager;
import org.openqa.selenium.WebDriver;

import static io.restassured.RestAssured.baseURI;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

public class AdminEmployeeDatabase {


    private WebDriver driver;
    private SignInPage signInPage;
    private AdminHomePage homePage;
    private AdminEmployeeDatabaseMainPage employeeDatabase;
    private EmployeePage employeePage;
    private AdminEmployeeDatabaseMainPage adminEmployeeDatabaseMainPage;
    private String searchedName;

    private Response response;
    private Response loginResponse;
    public String accessToken;
    public String refreshToken;


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
        Thread.sleep(2000);
        signInPage.clickSignInButton();

    }

    @Given("user clicks on the Employee Database module")
    public void userClicksOnTheEmployeeDatabaseModule() {
        homePage.clickEmployeeDataManagement();
    }

    @And("enter the employee {string} in the search bar")
    public void enterTheEmployeeInTheSearchBar(String name) {

        adminEmployeeDatabaseMainPage.searchEmployeeField(name);
    }

    @When("the table filters based on the name")
    public void theTableFiltersBasedOnTheName() {


    }
    @Then("click on that particular employee")
    public void clickOnThatParticularEmployee() {
    }

    @Given("admin click on employee database module")
    public void adminClickOnEmployeeDatabaseModule()  {

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
    public void userClickOnEmployeeDatabaseModule()  {

        homePage.clickEmployeeDataManagement();

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
    public void theUserClickOnEmployeeDatabaseModule()  {

        homePage.clickEmployeeDataManagement();
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
    public void theUserClicksOnTheEmployeeDatabaseModuleFromTheSidebar() {

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
       // employeeDatabase.numberOfEmployees();
    }

    @When("admin fills all the filters like {string}, {string}, {string}, {string} based on these filter employee should comes at top of the table")
    public void adminFillsAllTheFiltersLikeBasedOnTheseFilterEmployeeShouldComesAtTopOfTheTable(String employee, String department, String location, String status) {
        employeeDatabase.searchEmployee(employee, department, location, status );
      //  employeeDatabase.filteredEmployee(employee);

    }
    @Then("admin able to click on that particular {string}")
    public void adminAbleToClickOnThatParticular(String employee) {
        employeeDatabase.selectEmployee(employee);
    }


    @Given("user clicks on the edit profile button")
    public void userClicksOnTheEditProfileButton() {
        homePage.clickEmployeeDataManagement();
        employeePage.clickAddEmployeeButton();
    }

    @And("a popup will appears")
    public void aPopupWillAppears() {
       employeePage.employeePagePopup();
    }
    @When("admin fills all the employment details like {string}, {string}, {string}, {string}, {string}, {string}, {string}, {string}, {string}, {string}")
    public void adminFillsAllTheEmploymentDetailsLike(String employeeName, String gender, String dateOfBirth, String bloodGroup, String phoneNumber, String personalEmail, String maritalStatus, String emergencyContactNumber, String aadharNumber, String panNumber) {

        employeePage.setEmployeeName(employeeName);
        employeePage.setEmployeeGender(gender);
        employeePage.setDateOfBirth(dateOfBirth);
        employeePage.setBloodGroup(bloodGroup);
        employeePage.setPhoneNumber(phoneNumber);
        employeePage.setPersonalEmail(personalEmail);
        employeePage.setMaritalStatus(maritalStatus);
        employeePage.setEmergencyContactNumber(emergencyContactNumber);
        employeePage.setAadharNumber(aadharNumber);
        employeePage.setPanNumber(panNumber);
    }

    @Given("user clicks on Employment tab in the header")
    public void userClicksOnEmploymentTabInTheHeader() {
        homePage.clickEmployeeDataManagement();
        employeePage.clickAddEmployeeButton();
        employeePage.clickEmploymentTab();


    }

    @When("the user enters {string}, {string}, {string}, {string}, {string}, {string}, {string}, {string}, {string}, {string}, {string}, {string}")
    public void theUserEnters(String email, String employeeID, String department, String designation, String location, String status, String joinDate, String manager, String employment, String uanNumber, String pfNumber, String esicNumber) {
        employeePage.fillEmploymentDetails(email,employeeID,department,designation,location,status,joinDate,manager, employment, uanNumber, pfNumber, esicNumber);

    }

    @Then("admin click on Address tab in the header")
    public void adminClickOnAddressTabInTheHeader() {

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



//    @Given("the user is logged in and has access tokens and refresh tokens using {string}")
//    public void theUserIsLoggedInAndHasAccessTokensAndRefreshTokensUsing(String login) {
//        String email = ConfigReader.getProperty("email");
//        String password = ConfigReader.getProperty("password");
//        String baseUrl = ConfigReader.getProperty("baseUrl");
//        System.out.println("Loaded base_url: " + baseUrl);
//        baseURI = baseUrl;
//
//        String loginPayload = String.format("""
//        {
//          "email": "%s",
//          "password": "%s"
//        }
//        """, email, password);
//
//        Response loginResponse = RestAssured.given()
//                .baseUri(baseURI)
//                .contentType(ContentType.JSON)
//                .body(loginPayload)
//                //  .post(baseURI+login);
//                .post(baseURI+login);
//
//        assertEquals(200, loginResponse.getStatusCode());
//
//        accessToken = loginResponse.jsonPath().getString("accessToken");
//        assertNotNull("Access token is null", accessToken);
//    }
//
//    @When("the admin fetches formatted employee route data using {string}")
//    public void theAdminFetchesFormattedEmployeeRouteDataUsing(String endPoint) {
//        String baseUrl = ConfigReader.getProperty("baseUrl");
//        System.out.println("Loaded base_url: " + baseUrl);
//        baseURI = baseUrl;
//
//        response = RestAssured.given()
//                .header("Authorization", "Bearer " + accessToken)
//                .contentType(ContentType.JSON)
//                .get(baseURI+endPoint);
////                .baseUri(baseURI)
////                .basePath(baseURI+endPoint)
////                .header("Authorization", "Bearer " + accessToken)
////                .contentType(ContentType.JSON)
////                .post();
//
//    }
//
//    @Then("the response status should {int}")
//    public void theResponseStatusShould(int expectedStatusCode) {
//        assertEquals(expectedStatusCode, response.getStatusCode());
//    }
}
