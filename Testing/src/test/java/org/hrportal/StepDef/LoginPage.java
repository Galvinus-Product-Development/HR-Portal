package org.hrportal.StepDef;

import io.cucumber.java.Before;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import org.hrportal.pages.AdminHomePage;
import org.hrportal.pages.RolePermission;
import org.hrportal.pages.SignInPage;
import org.hrportal.webdriver.DriverManager;
import org.junit.Assert;
import org.openqa.selenium.WebDriver;
import io.restassured.response.Response;


import java.time.Duration;

import static io.restassured.RestAssured.given;
import static java.lang.Math.log;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hrportal.pages.AdminHomePage.Company_Logo;


public class LoginPage {

    private WebDriver driver;
    private SignInPage signInPage;
    private AdminHomePage homepage ;
    private RolePermission rolePermission;
    private AdminHomePage adminHomePage;
    private Response response;

    public LoginPage() {
        this.driver = DriverManager.getDriver();
        this.signInPage = new SignInPage(driver);
        this.homepage = new AdminHomePage(driver);
        this.rolePermission = new RolePermission(driver);
        this.adminHomePage = new AdminHomePage(driver);
    }

    @Given("the user navigates to the login page")
    public void theUserNavigatesToTheLoginPage() {
        driver.get("http://hr-portal-lb-28083365.us-east-1.elb.amazonaws.com/login");
        driver.manage().window().maximize();

    }

    @When("the user is on the login page")
    public void theUserIsOnTheLoginPage() {
        String loginPageTitle = signInPage.loginPageTitle();
        System.out.println(loginPageTitle + " User is in the signIn page");
    }

    @Then("the dimensions of the email and password fields should be the same")
    public void theDimensionsOfTheEmailAndPasswordFieldsShouldBeTheSame() {
        signInPage.dimensionsOfField();
    }


    @Given("check the sign-in button and forgot password link is enable or not")
    public void checkTheSignInButtonAndForgotPasswordLinkIsEnableOrNot() {
        signInPage.checkSignInButtonEnable();
        signInPage.checkForgotPasswordEnable();

    }

    @When("the user click on the forgot password")
    public void theUserClickOnTheForgotPassword() {
         signInPage.clickForgotPassword();
    }

    @And("user navigate to the Reset password page")
    public void userNavigateToTheResetPasswordPage() {

        signInPage.getResetPasswordTitle();
    }

    @And("check whether send reset link and Back to login button is enable or not")
    public void checkWhetherSendResetLinkAndBackToLoginButtonIsEnableOrNot() {
        signInPage.checkSendResentLink();
        signInPage.checkBackToLogin();
    }

    @Then("user enters a mail and wait for the conformation message")
    public void userEntersAMailAndWaitForTheConformationMessage() {
        signInPage.enterEmail();
        signInPage.clickSendResentLinkButton();
        signInPage.conformationMessage();
        signInPage.clickOnBackToLoginButton();
    }
    @Given("user enters the invalid {string} and {string}")
    public void userEntersTheInvalidCredentials(String username, String password) {
        signInPage.inValidCredentials(username, password);
    }

    @When("user clicks on the sign-in button")
    public void userClicksOnTheSignInButton() {
        signInPage.clickSignInButton();

    }

    @Then("the {string} message should be appears")
    public void theMessageShouldBeAppears(String error) {
        signInPage.errorMessage(error);
    }

    @Given("user enters the invalid email format {string} and {string}")
    public void userEntersTheInvalidEmailFormatAnd(String username, String password) {
        signInPage.inValidCredentials(username, password);
    }

    @When("the user clicks on the sign-in button")
    public void theUserClicksOnTheSignInButton() {
        signInPage.clickSignInButton();

    }

    @Then("the proper {string} message appears")
    public void theProperMessageAppears(String error) {
        signInPage.mailFormatErrorMessage(error);

    }


    @Given("user in the login page")
    public void userInTheLoginPage() {

    }

    @When("user enters valid username and password")
    public void userEntersValidUsernameAndPassword() {
        signInPage.readCredentialsFromFile("src/test/java/org/hrportal/utils/valid credentials.txt");

    }

    @And("user click on signin button")
    public void userClickOnSigninButton() {
        signInPage.clickSignInButton();

    }

    @Then("user lands on Home page of the application")
    public void userLandsOnHomePageOfTheApplication() {
        adminHomePage.homePageTitle();

    }

    @Given("Admin logs into the system")
    public void adminLogsIntoTheSystem() {
        signInPage.readCredentialsFromFile("src/test/java/org/hrportal/utils/valid credentials.txt");
        signInPage.clickSignInButton();
    }


    @And("the user clicks on the Role and Permission module")
    public void theUserClicksOnTheRoleAndPermissionModule() {
       homepage.clickRoleAndPermission();
        
    }

    @When("the user is redirected to the Role and Permission page")
    public void theUserIsRedirectedToTheRoleAndPermissionPage() throws InterruptedException {
        String pageTitle = rolePermission.getPageTitle();
        System.out.println("Page Title: " + pageTitle);
    }

    @Then("all the content on the page should be visible")
    public void allTheContentOnThePageShouldBeVisible() {

        boolean isDisplayed = rolePermission.rolePermissionDetails();

        System.out.println("Is Role Permission Table Displayed? " + isDisplayed);

        Assert.assertTrue("Role Permission Table is NOT displayed!", isDisplayed);

    }

    @Given("Admin log into the system")
    public void adminLogIntoTheSystem() throws InterruptedException {
        signInPage.readCredentialsFromFile("src/test/java/org/hrportal/utils/valid credentials.txt");
        signInPage.clickSignInButton();
       Thread.sleep(2000);
    }

    @And("user clicks on the Assign role button")
    public void userClicksOnTheAssignRoleButton() {
        homepage.clickRoleAndPermission();
        rolePermission.clickAssignRoleButton();

    }

    @And("enter employee {string} in the search bar")
    public void enterEmployeeInTheSearchBar(String name)
    {
        rolePermission.enterEmployeeName(name);
    }


    @When("the user click the dropdown all the roles should visible")
    public void theUserClickTheDropdownAllTheRolesShouldVisible() {
        rolePermission.listRoleFromDropDown();

    }
    @Then("Assign the particular {string} for a employee")
    public void assignTheParticularForAEmployee(String role) throws InterruptedException {
        rolePermission.assignRole(role);
        rolePermission.closeThePopUp();
    }


    @Given("user login as an admin")
    public void userLoginAsAnAdmin() throws InterruptedException {
        signInPage.readCredentialsFromFile("src/test/java/org/hrportal/utils/valid credentials.txt");
        signInPage.clickSignInButton();
        Thread.sleep(2000);
    }

    @And("the user clicks on the Create Role button")
    public void theUserClicksOnTheCreateRoleButton() {

        homepage.clickRoleAndPermission();
        rolePermission.clickCreateRoleButton();
    }

    @And("a popup appears")
    public void aPopupAppears() {
        boolean isDisplayed = rolePermission.createRolePopUp();
        System.out.println("Create New Role PopUp is Open?" +isDisplayed );

    }
    @When("the user enters a {string} name and {string}")
    public void theUserEntersANameAnd(String role, String description) {
        rolePermission.enterNewRoleName(role);
        rolePermission.enterRoleDescription(description);
        System.out.println("Role name and Description entered");
    }
    @And("clicks on the Create Role button")
    public void clicksOnTheCreateRoleButton() throws InterruptedException {
        rolePermission.clickCreateRole();
        System.out.println("User able to click on the create role button");
    }
    @Then("a success {string} or an error message {string} should appear")
    public void aSuccessOrAnErrorMessageShouldAppear(String notification, String error) {
        rolePermission.resultOFRoleCreate(notification, error);
    }

    @Given("login as an admin")
    public void loginAsAnAdmin() throws InterruptedException {
        signInPage.readCredentialsFromFile("src/test/java/org/hrportal/utils/valid credentials.txt");
        signInPage.clickSignInButton();
        Thread.sleep(2000);
    }
    @And("the user click on the Delete Role Button")
    public void theUserClickOnTheDeleteRoleButton() {

        homepage.clickRoleAndPermission();
        rolePermission.clickDeleteRoleButton();
    }

    @And("a popup will appear appears")
    public void aPopupWillAppearAppears() throws InterruptedException {
        rolePermission.deleteRolePopUp();
        rolePermission.listOfRoleFromDeleteDropDown();
    }
    @When("the user selects the {string} which has to deleted from the dropdown")
    public void theUserSelectsTheWhichHasToDeletedFromTheDropdown(String role) throws InterruptedException {
        rolePermission.clickDeleteRoleButton();
        rolePermission.deleteRole(role);
    }



    @Then("the user click on delete role button")
    public void theUserClickOnDeleteRoleButton() throws InterruptedException {
       // rolePermission.setDeleteButton();


    }


    @Given("login the application as a admin")
    public void loginTheApplicationAsAAdmin() throws InterruptedException {
        signInPage.readCredentialsFromFile("src/test/java/org/hrportal/utils/valid credentials.txt");
        signInPage.clickSignInButton();
        Thread.sleep(2000);
    }
    @And("check the functionality of the Add permission button for employee")
    public void checkTheFunctionalityOfTheAddPermissionButtonForEmployee() {
        homepage.clickRoleAndPermission();
        rolePermission.checkEmployeeAddPermissionButton();
    }

    @And("Click on the Add permission button")
    public void clickOnTheAddPermissionButton() {
        rolePermission.clickEmployeeAddPermissionButton();


    }

    @When("the popup opens click on dropdown button")
    public void thePopupOpensClickOnDropdownButton() {
        rolePermission.addPermissionPopup();
        rolePermission.clickSelectPermissionDropdown();

    }

    @And("select any one {string} from the dropdown")
    public void selectAnyOneFromTheDropdown(String permission) throws InterruptedException {
        rolePermission.selectPermission(permission);
    }


    @Then("After select permission click on the Add permission button")
    public void afterSelectPermissionClickOnTheAddPermissionButton() throws InterruptedException {
        System.out.println("Role is selected");
    }

    @Given("user login as a admin")
    public void userLoginAsAAdmin() throws InterruptedException {

        signInPage.readCredentialsFromFile("src/test/java/org/hrportal/utils/valid credentials.txt");
        signInPage.clickSignInButton();
        Thread.sleep(2000);
    }

    @And("click on role permission option from the sidebar")
    public void clickOnRolePermissionOptionFromTheSidebar() {
        homepage.clickRoleAndPermission();

    }

    @When("the admin click on delete icon a validation popup appears")
    public void theAdminClickOnDeleteIconAValidationPopupAppears() {
        rolePermission.deletePermissionRole();
        rolePermission.removePermissionPopUp();

    }

    @Then("admin clicks on Remove permission button the permission will be deleted")
    public void adminClicksOnRemovePermissionButtonThePermissionWillBeDeleted() throws InterruptedException {
        rolePermission.removePermission();

    }

    @Given("the user clicks on the User Registration module")
    public void theUserClicksOnTheUserRegistrationModule() {
        rolePermission.clickUserRegistrationModule();

    }

    @And("enters the {string} of a new employee")
    public void entersTheOfANewEmployee(String email) {

        rolePermission.enterNewEmail(email);
    }

    @When("the user clicks on Send Registration Link")
    public void theUserClicksOnSendRegistrationLink() {
        rolePermission.clickRegistrationButton();

    }

    @Then("a link sent {string} should appear.")
    public void aLinkSentShouldAppear(String notification) {
        rolePermission.linkSentNotification(notification);
    }

    @Given("the login API is available")
    public void theLoginAPIIsAvailable() {
            System.out.println("Login API is assumed available.");
        }

    @When("I send a POST request with valid username and password")
    public void iSendAPOSTRequestWithValidUsernameAndPassword() {
         response = given()
                .contentType(ContentType.JSON)
                .body("{ \"email\": \"debswarnadeep85@gmail.com\", \"password\": \"Deep@123\" }")
                .when()
                .get("http://hr-portal-lb-28083365.us-east-1.elb.amazonaws.com/api/v1/auth/login");

        System.out.println("Status Code: " + response.getStatusCode());
        System.out.println("Response Body:\n" + response.getBody().prettyPrint());

    }

    @Then("the response status code should be {int}")
    public void theResponseStatusCodeShouldBe(int expectedStatusCode) {
        response.then().statusCode(expectedStatusCode);
    }

    @And("the response body should contain a valid token")
    public void theResponseBodyShouldContainAValidToken() {
        response.then().body("token", notNullValue());

    }

}
