package org.hrportal.StepDef;

import io.cucumber.java.Before;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.path.json.JsonPath;
import org.hrportal.pages.AdminHomePage;
import org.hrportal.pages.RolePermission;
import org.hrportal.pages.SignInPage;
import org.hrportal.utils.ConfigReader;
import org.hrportal.webdriver.DriverManager;
import org.joda.time.LocalDate;
import org.junit.Assert;
import org.openqa.selenium.WebDriver;
import io.restassured.response.Response;


import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static io.restassured.RestAssured.baseURI;
import static io.restassured.RestAssured.given;
import static java.lang.Math.log;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hrportal.pages.AdminHomePage.Company_Logo;
import static org.junit.Assert.*;


public class LoginPage {

    private WebDriver driver;
    private SignInPage signInPage;
    private AdminHomePage homepage ;
    private RolePermission rolePermission;
    private AdminHomePage adminHomePage;
    private Response response;
    Map<String, Object> payload;
    Map<String, Object> correctionPayload;
    private Response loginResponse;
    public String accessToken;
    public String refreshToken;
    public Response logoutResponse;
    Response passwordResetResponse;




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

        assertTrue("Role Permission Table is NOT displayed!", isDisplayed);

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

        String email = ConfigReader.getProperty("email");
        String password = ConfigReader.getProperty("password");
        String loginUrl = ConfigReader.getProperty("baseUrl");

        response = given()
                .contentType(ContentType.JSON)
                .body("{ \"email\": \"" + email + "\", \"password\": \"" + password + "\" }")
                .when()
                .get(loginUrl + "/api/v1/auth/login");

        System.out.println("Status Code: " + response.getStatusCode());
        System.out.println("Response Body:\n" + response.getBody().prettyPrint());
//         response = given()
//                .contentType(ContentType.JSON)
//                .body("{ \"email\": \"debswarnadeep85@gmail.com\", \"password\": \"Deep@123\" }")
//                .when()
//                .get("https://hr.galvinus.com/api/v1/auth/login");
//
//        System.out.println("Status Code: " + response.getStatusCode());
//        System.out.println("Response Body:\n" + response.getBody().prettyPrint());

    }

    @Then("the response status code should be {int}")
    public void theResponseStatusCodeShouldBe(int expectedStatusCode) {
        response.then().statusCode(expectedStatusCode);
    }

    @And("the response body should contain a valid token")
    public void theResponseBodyShouldContainAValidToken() {
        response.then().body("token", notNullValue());

    }

    @Given("the API base URI is set")
    public void theAPIBaseURIIsSet() {
        String baseUrl = ConfigReader.getProperty("baseUrl");
        RestAssured.baseURI = baseUrl;
    }

    @When("the user logs in with email, password and {string}")
    public void theUserLogsInWithEmailPasswordAnd(String endpoint) {
        String email = ConfigReader.getProperty("email");
        String password = ConfigReader.getProperty("password");


        String loginPayload = String.format("""
    {
      "email": "%s",
      "password": "%s"
    }
    """, email, password);

        loginResponse = RestAssured.given()
                .contentType(ContentType.JSON)
                .body(loginPayload)
                .post(RestAssured.baseURI + endpoint);

        if (loginResponse.getStatusCode() != 200 || !loginResponse.getContentType().contains("application/json")) {
            throw new RuntimeException("Login failed or unexpected response: \n" + loginResponse.getBody().asString());
        }

        accessToken = loginResponse.jsonPath().getString("accessToken");
        refreshToken = loginResponse.jsonPath().getString("refreshToken");
    }

    @Then("the response status code should  {int}")
    public void theResponseStatusCodeShould(Integer expectedStatusCode) {
        assertEquals(expectedStatusCode.intValue(), loginResponse.getStatusCode());
        
    }

    @And("the access token and refresh token should be returned")
    public void theAccessTokenAndRefreshTokenShouldBeReturned() {
        assertNotNull("Access token is null", accessToken);
        assertNotNull("Refresh token is null", refreshToken);
        System.out.println("Access Token: " + accessToken);
        System.out.println("Refresh Token: " + refreshToken);

    }

    @Given("the user is logged in and has access and refresh tokens using {string}")
    public void theUserIsLoggedInAndHasAccessAndRefreshTokensUsing(String endPoint) {
        String baseUrl = ConfigReader.getProperty("baseUrl");
        System.out.println("Loaded base_url: " + baseUrl);
        RestAssured.baseURI = baseUrl;

        String email = ConfigReader.getProperty("email");
        String password = ConfigReader.getProperty("password");

        String loginPayload = String.format("""
    {
      "email": "%s",
      "password": "%s"
    }
    """, email, password);

        Response loginResponse = RestAssured.given()
                .contentType(ContentType.JSON)
                .body(loginPayload)
                // .post(loginEndpoint);
                .post(baseURI+endPoint);

        assertEquals(200, loginResponse.getStatusCode());

        accessToken = loginResponse.jsonPath().getString("accessToken");
        refreshToken = loginResponse.jsonPath().getString("refreshToken");

        assertNotNull("Access token is null", accessToken);
        assertNotNull("Refresh token is null", refreshToken);

    }
    @When("the user sends a {string}")
    public void theUserSendsA(String logout) {
        String logoutPayload = String.format("""
    {
      "refreshToken": "%s"
    }
    """, refreshToken);

        logoutResponse = RestAssured.given()
                .contentType(ContentType.JSON)
                .header("Authorization", "Bearer " + accessToken)
                .body(logoutPayload)
                .post(RestAssured.baseURI + logout);
    }

    @Then("the user should get response status code as {int}")
    public void theUserShouldGetResponseStatusCodeAs(Integer expectedStatusCode) {
        assertEquals(expectedStatusCode.intValue(), logoutResponse.getStatusCode());

        
    }

    @And("the logout should be successful")
    public void theLogoutShouldBeSuccessful() {
        String message = logoutResponse.jsonPath().getString("message");
        assertNotNull("Logout response message is null", message);
        System.out.println("Logout Message: " + message);

    }

    @Given("the API base URI is set for password reset")
    public void theAPIBaseURIIsSetForPasswordReset() {
        String baseUrl = ConfigReader.getProperty("baseUrl");
        System.out.println("Loaded base_url: " + baseUrl);
        RestAssured.baseURI = baseUrl;
        
    }

    @When("the user sends {string} password reset with {string}")
    public void theUserSendsPasswordResetWith(String endPoint, String email) {
        String payload = String.format("""
    {
      "email": "%s"
    }
    """, email);

        passwordResetResponse = RestAssured.given()
                .contentType(ContentType.JSON)
                .body(payload)
                .post( RestAssured.baseURI+endPoint);
    }

    @Then("user response status code should be {int}")
    public void userResponseStatusCodeShouldBe(int expectedStatusCode) {
        assertEquals(expectedStatusCode, passwordResetResponse.getStatusCode());
    }


    @And("the password reset response should contain a success message")
    public void thePasswordResetResponseShouldContainASuccessMessage() {

        String contentType = passwordResetResponse.getHeader("Content-Type");
        String responseBody = passwordResetResponse.getBody().asString();

        System.out.println("Content-Type: " + contentType);
        System.out.println("Response Body: " + responseBody);

        if (contentType != null && contentType.contains("application/json")) {
            String message = passwordResetResponse.jsonPath().getString("message");
            assertNotNull("Password reset message is null", message);
            System.out.println("Password Reset Message: " + message);
        } else {
            fail("Expected JSON response but got: " + contentType + "\nResponse: " + responseBody);
        }

    }



    @Given("the user is logged in and has a valid access token with {string}")
    public void theUserIsLoggedInAndHasAValidAccessTokenWith(String login) {
        String baseUrl = ConfigReader.getProperty("baseUrl");
        System.out.println("Loaded base_url: " + baseUrl);
        RestAssured.baseURI = baseUrl;

        String email = ConfigReader.getProperty("email");
        String password = ConfigReader.getProperty("password");

        String loginPayload = String.format("""
    {
      "email": "%s",
      "password": "%s"
    }
    """, email, password);

        Response loginResponse = given()
                .contentType(ContentType.JSON)
                .body(loginPayload)
                .post(baseURI+login);

        assertEquals(200, loginResponse.getStatusCode());

        accessToken = loginResponse.jsonPath().getString("accessToken");
        assertNotNull("Access token is null", accessToken);

    }

    @When("the user sends a GET request to the role-permissions employees {string}")
    public void theUserSendsAGETRequestToTheRolePermissionsEmployees(String endPoint) {
        response = given()
                .contentType(ContentType.JSON)
                .header("Authorization", "Bearer " + accessToken)
                .when()
                .get(RestAssured.baseURI+endPoint);

        System.out.println("Status Code: " + response.getStatusCode());
        System.out.println("Response Body:\n" + response.getBody().prettyPrint());
    }

    @Then("the user should get response as {int} in status code")
    public void theUserShouldGetResponseAsInStatusCode(int expectedStatusCode) {
        assertEquals(expectedStatusCode, response.getStatusCode());
        
    }

    @And("the response should contain employee roles and permissions")
    public void theResponseShouldContainEmployeeRolesAndPermissions() {
        String responseBody = response.getBody().asString();
        assertTrue("Response does not contain expected fields",
                responseBody.contains("role") &&
                        responseBody.contains("email") &&
                        responseBody.contains("department"));
    }

    @Given("the user is logged in and has access tokens and refresh tokens with {string}")
    public void theUserIsLoggedInAndHasAccessTokensAndRefreshTokensWith(String login) {

        String baseUrl = ConfigReader.getProperty("baseUrl");
        System.out.println("Loaded base_url: " + baseUrl);
        RestAssured.baseURI = baseUrl;

        String email = ConfigReader.getProperty("email");
        String password = ConfigReader.getProperty("password");

        String loginPayload = String.format("""
    {
      "email": "%s",
      "password": "%s"
    }
    """, email, password);

        Response loginResponse = given()
                .contentType(ContentType.JSON)
                .body(loginPayload)
                .post(baseURI+login);

        assertEquals(200, loginResponse.getStatusCode());

        accessToken = loginResponse.jsonPath().getString("accessToken");
        assertNotNull("Access token is null", accessToken);

    }

    @When("the user sends a GET request to the roles {string}")
    public void theUserSendsAGETRequestToTheRoles(String endPoint) {
        response = RestAssured.given()
                .header("Authorization", "Bearer " + accessToken)
                .contentType(ContentType.JSON)
                .get(RestAssured.baseURI+endPoint);
    }

    @Then("user get response status code as {int}")
    public void userGetResponseStatusCodeAs(Integer expectedStatusCode) {
        assertEquals(expectedStatusCode.intValue(), response.getStatusCode());
        
    }

    @And("the response should contain a list of roles")
    public void theResponseShouldContainAListOfRoles() {
        System.out.println("Response Body:\n" + response.getBody().asPrettyString());

        Map<String, Object> roleMap = response.jsonPath().getMap("$");
        assertNotNull("Roles map is null", roleMap);
        assertFalse("Roles map is empty", roleMap.isEmpty());

        List<String> roles = new ArrayList<>(roleMap.keySet());
        System.out.println("Roles: " + roles);
    }

    @Given("the user sends a GET request to the role-permissions {string}")
    public void theUserSendsAGETRequestToTheRolePermissions(String endPoint) {
        String baseUrl = ConfigReader.getProperty("baseUrl");
        System.out.println("Loaded base_url: " + baseUrl);
        RestAssured.baseURI = baseUrl;

        response = given()
                .when()
                .get(baseURI+endPoint)
                .then()
                .extract()
                .response();

        System.out.println("Response Body:\n" + response.getBody().asPrettyString());
    }

    @Then("user should get response status code  {int}")
    public void userShouldGetResponseStatusCode(Integer expectedStatusCode) {
        assertEquals(expectedStatusCode.intValue(), response.getStatusCode());
        
    }

    @And("the response should contain a list of permissions")
    public void theResponseShouldContainAListOfPermissions() {
        List<String> permissionNames = response.jsonPath().getList("name");

        assertNotNull("Permissions list is null", permissionNames);
        assertFalse("Permissions list is empty", permissionNames.isEmpty());
        System.out.println("Permissions: " + permissionNames);
    }
    @Given("the user is logged in and has access tokens and refresh tokens by using {string}api")
    public void theUserIsLoggedInAndHasAccessTokensAndRefreshTokensByUsingApi(String login) {
        String email = ConfigReader.getProperty("email");
        String password = ConfigReader.getProperty("password");
        String baseUrl = ConfigReader.getProperty("baseUrl");
        System.out.println("Loaded base_url: " + baseUrl);
        RestAssured.baseURI = baseUrl;

        String loginPayload = String.format("""
        {
          "email": "%s",
          "password": "%s"
        }
        """, email, password);

        Response loginResponse = RestAssured.given()
                .baseUri(baseURI)
                .contentType(ContentType.JSON)
                .body(loginPayload)
                .post(baseURI+login);

        assertEquals(200, loginResponse.getStatusCode());
        System.out.println(loginResponse.getStatusCode());

        accessToken = loginResponse.jsonPath().getString("accessToken");
        assertNotNull("Access token is null", accessToken);
        System.out.println(accessToken);
    }


    @When("the admin assigns {string} to user {string} with {string}")
    public void theAdminAssignsToUserWith(String userId, String roleName, String api) {
        String baseUrl = ConfigReader.getProperty("baseUrl");
        System.out.println("Loaded base_url: " + baseUrl);
        RestAssured.baseURI = baseUrl;

        String rolePayload = String.format("""
        {
          "userId": "%s",
          "roleName": "%s"
        }
        """, userId, roleName);

        response = RestAssured.given()
                .baseUri(baseURI)
                .header("Authorization", "Bearer " +accessToken)
                .contentType(ContentType.JSON)
                .body(rolePayload)
                .post(baseURI+api);

        System.out.println(accessToken);
    }

    @Then("the response status should be {int}")
    public void theResponseStatusShouldBe(int expectedStatusCode) {
        assertEquals(expectedStatusCode, response.getStatusCode());
    }

    @Given("the user is logged in and has access tokens and refresh tokens using {string}")
    public void theUserIsLoggedInAndHasAccessTokensAndRefreshTokensUsing(String login) {
        String email = ConfigReader.getProperty("email");
        String password = ConfigReader.getProperty("password");
        String baseUrl = ConfigReader.getProperty("baseUrl");
        System.out.println("Loaded base_url: " + baseUrl);
        baseURI = baseUrl;

        String loginPayload = String.format("""
        {
          "email": "%s",
          "password": "%s"
        }
        """, email, password);

        Response loginResponse = RestAssured.given()
                .baseUri(baseURI)
                .contentType(ContentType.JSON)
                .body(loginPayload)
                .post(baseURI+login);

        assertEquals(200, loginResponse.getStatusCode());

        accessToken = loginResponse.jsonPath().getString("accessToken");
        assertNotNull("Access token is null", accessToken);
    }

    @When("the admin fetches formatted employee route data using {string}")
    public void theAdminFetchesFormattedEmployeeRouteDataUsing(String endPoint) {
        String baseUrl = ConfigReader.getProperty("baseUrl");
        System.out.println("Loaded base_url: " + baseUrl);
        baseURI = baseUrl;

        response = RestAssured.given()
                .header("Authorization", "Bearer " + accessToken)
                .contentType(ContentType.JSON)
                .get(baseURI+endPoint);

        System.out.println("=== Full API Response ===");
        response.prettyPrint();
    }

    @Then("the response status should {int}")
    public void theResponseStatusShould(int expectedStatusCode) {
        assertEquals(expectedStatusCode, response.getStatusCode());
    }


    @Given("the user is on the HR system")
    public void theUserIsOnTheHRSystem() {

    }

    @When("the admin fetches a single employee by ID using {string} and {string}")
    public void theAdminFetchesASingleEmployeeByIDUsingAnd(String endPoint, String ID) {
        String baseUrl = ConfigReader.getProperty("baseUrl");
        baseURI = baseUrl;

        response = RestAssured.given()
                .contentType(ContentType.JSON)
                .get(baseURI+endPoint+ID);


        System.out.println("=== Employee Details Response ===");
        response.prettyPrint();

    }

    @Then("the response status be should {int}")
    public void theResponseStatusBeShould(int expectedStatusCode) {
        assertEquals(expectedStatusCode, response.getStatusCode());

    }

    @Given("the HR system base URL is loaded")
    public void theHRSystemBaseURLIsLoaded() {
        RestAssured.baseURI = ConfigReader.getProperty("baseUrl");
    }

    @When("the admin fetches employee details by user ID using {string} and {string}")
    public void theAdminFetchesEmployeeDetailsByUserIDUsingAnd(String endPoint, String userID) {
        response = RestAssured.given()
                .contentType(ContentType.JSON)
                .get(RestAssured.baseURI+endPoint+userID);
        
    }

    @Then("response status should be {int}")
    public void responseStatusShouldBe(int expectedStatusCode) {
        assertEquals(expectedStatusCode, response.getStatusCode());
        
    }

    @And("print the employee details")
    public void printTheEmployeeDetails() {
        System.out.println("=== Employee Details ===");
        response.prettyPrint();
    }

    @Given("the HR portal base URL is configured")
    public void theHRPortalBaseURLIsConfigured() {
        RestAssured.baseURI = ConfigReader.getProperty("baseUrl");
        
    }

    @When("the user fetches employee details from {string} and {string}")
    public void theUserFetchesEmployeeDetailsFromAnd(String endPoint, String userID) {
        response = RestAssured.given()
                .contentType(ContentType.JSON)
                .get(RestAssured.baseURI+endPoint+userID);
        
    }

    @Then("user get response status should as {int}")
    public void userGetResponseStatusShouldAs(int expectedStatusCode) {
        assertEquals(expectedStatusCode, response.getStatusCode());
    }

    @And("the formatted employee details should be printed")
    public void theFormattedEmployeeDetailsShouldBePrinted() {
        System.out.println("=== Fetched Employee Details ===");
        response.prettyPrint();
    }

    @Given("the API base URI is set for employment details")
    public void theAPIBaseURIIsSetForEmploymentDetails() {
        String baseUrl = ConfigReader.getProperty("baseUrl");
        System.out.println("Loaded base_url: " + baseUrl);
        RestAssured.baseURI = baseUrl;
        
    }

    @When("the user sends a GET request for employee ID {string} and {string}")
    public void theUserSendsAGETRequestForEmployeeIDAnd(String endPoint, String ID) {
        String fullUrl = RestAssured.baseURI+endPoint+ID;
        System.out.println("Calling: " + fullUrl);

        response = RestAssured.given()
                .contentType(ContentType.JSON)
                .get(fullUrl);
    }

    @Then("the user response status code should be {int}")
    public void theUserResponseStatusCodeShouldBe(int expectedStatusCode) {
        assertEquals(expectedStatusCode, response.getStatusCode());
        System.out.println("Status Code: " + response.getStatusCode());
        
    }

    @And("the response should contain employee employment details")
    public void theResponseShouldContainEmployeeEmploymentDetails() {
        String contentType = response.getHeader("Content-Type");
        String responseBody = response.getBody().asString();

        System.out.println("Response Content-Type: " + contentType);
        System.out.println("Response Body: " + responseBody);

        assertTrue("Expected JSON response", contentType.contains("application/json"));


        String designation = response.jsonPath().getString("designation");
        assertNotNull("Designation should not be null", designation);
        System.out.println("Designation: " + designation);
    }

    @Given("API base URI set for attendance")
    public void apiBaseURISetForAttendance() {
        String baseUrl = ConfigReader.getProperty("baseUrl");
        System.out.println("Loaded base_url: " + baseUrl);
        RestAssured.baseURI = baseUrl;
    }
    @And("the manual attendance payload is prepared with employeeId {string}, date {string}, punchInTime {string}, status {string}, and method {string}")
    public void theManualAttendancePayloadIsPreparedWithEmployeeIdDatePunchInTimeStatusAndMethod(String employeeId, String date, String punchInTime, String status, String method) {
        payload = new HashMap<>();
        payload.put("employeeId", employeeId);
        payload.put("date", date);
        payload.put("punchInTime", punchInTime);
        payload.put("attendanceStatus", status);
        payload.put("punchInMethod", method);

        System.out.println("Payload: " + payload);
    }


    @When("the user sends a POST request to the manual attendance {string}")
    public void theUserSendsAPOSTRequestToTheManualAttendance(String endpoint) {
        String fullUrl = RestAssured.baseURI+endpoint;
        System.out.println("Calling: " + fullUrl);

        response = RestAssured.given()
                .contentType(ContentType.JSON)
                .body(payload)
                .post(fullUrl);
    }
    @Then("user response status code should {int} after sending request")
    public void userResponseStatusCodeShouldAfterSendingRequest(int expectedStatusCode) {
        assertEquals(expectedStatusCode, response.getStatusCode());
        System.out.println("Status Code: " + response.getStatusCode());
    }

    @And("the response should confirm manual attendance success")
    public void theResponseShouldConfirmManualAttendanceSuccess() {
        String contentType = response.getHeader("Content-Type");
        String responseBody = response.getBody().asString();

        System.out.println("Response Content-Type: " + contentType);
        System.out.println("Response Body: " + responseBody);

        assertTrue("Expected JSON response", contentType.contains("application/json"));
        assertTrue("Expected success message in response",
                responseBody.toLowerCase().contains("success") ||
                        responseBody.toLowerCase().contains("marked"));
    }

    @Given("the API base URI is set for attendance")
    public void theAPIBaseURIIsSetForAttendance() {
        String baseUrl = ConfigReader.getProperty("baseUrl");
        System.out.println("Loaded base_url: " + baseUrl);
        RestAssured.baseURI = baseUrl;

    }

    @When("the user sends a GET request to the present-today {string}")
    public void theUserSendsAGETRequestToThePresentToday(String endPoint) {
        String fullUrl = RestAssured.baseURI+endPoint;
        System.out.println("Calling: " + fullUrl);

        response = RestAssured.given()
                .contentType(ContentType.JSON)
                .get(fullUrl);

    }

    @Then("user response status code should {int}")
    public void userResponseStatusCodeShould(int expectedStatusCode) {
        assertEquals(expectedStatusCode, response.getStatusCode());
        System.out.println("Status Code: " + response.getStatusCode());

    }

    @And("the response should contain today's present employee data")
    public void theResponseShouldContainTodaySPresentEmployeeData() {
        String contentType = response.getHeader("Content-Type");
        String responseBody = response.getBody().asString();

        System.out.println("Response Content-Type: " + contentType);
        System.out.println("Response Body: " + responseBody);

        assertTrue("Expected JSON response", contentType.contains("application/json"));

//        List<String> employeeIds = response.jsonPath().getList("employeeId");
//        assertNotNull("Employee ID list should not be null", employeeIds);
//        assertTrue("Expected at least one employee present", employeeIds.size() > 0);
//
//        System.out.println("Number of employees present today: " + employeeIds.size());
    }

    @Given("API base URI is set for attendance")
    public void apiBaseURIIsSetForAttendance() {
        String baseUrl = ConfigReader.getProperty("baseUrl");
        System.out.println("Loaded base_url: " + baseUrl);
        RestAssured.baseURI = baseUrl;
    }

    @When("the user sends a GET request to the attendance root {string}")
    public void theUserSendsAGETRequestToTheAttendanceRoot(String endPoint) {
        String fullUrl = RestAssured.baseURI+endPoint;
        System.out.println("Calling: " + fullUrl);

        response = RestAssured.given()
                .contentType(ContentType.JSON)
                .get(fullUrl);

    }

    @Then("user response status code should {int} at the end")
    public void userResponseStatusCodeShouldAtTheEnd(int expectedStatusCode) {
        assertEquals(expectedStatusCode, response.getStatusCode());
        System.out.println("Status Code: " + response.getStatusCode());

    }

    @And("the response should contain attendance data")
    public void theResponseShouldContainAttendanceData() {
        String contentType = response.getHeader("Content-Type");
        String responseBody = response.getBody().asString();

        System.out.println("Response Content-Type: " + contentType);
        System.out.println("Response Body: " + responseBody);

        assertTrue("Expected JSON response", contentType.contains("application/json"));
    }

    @Given("the employee API base URI is set")
    public void theEmployeeAPIBaseURIIsSet() {
        String baseUrl = ConfigReader.getProperty("baseUrl");
        RestAssured.baseURI = baseUrl;

    }

    @When("the user sends a POST {string} to add a new employee")
    public void theUserSendsAPOSTToAddANewEmployee(String endPoint) {

        String fullUrl = RestAssured.baseURI+endPoint;

        String requestBody = """
    {
      "personalDetails": {
        "name": "Allan Burg",
        "dateOfBirth": "1990-05-15",
        "gender": "MALE",
        "phoneNumber": "9113576752",
        "personalEmail": "allanburg@example.com",
        "bloodGroup": "A+",
        "maritalStatus": "SINGLE",
        "profilePicture": "https://example.com/profile.jpg",
        "aadharNumber": "123456789756",
        "panNumber": "LDCDE1234F"
      },
      "employmentDetails": {
        "companyEmployeeId": "115",
        "officeEmail": "allan.burg@galvinus.com",
        "jobTitle": "Software Engineer",
        "department": "Engineering",
        "location": "Bangalore",
        "dateOfJoining": "2024-01-10",
        "baseSalary": "600000",
        "stockBonus": "50000",
        "employmentType": "FULL_TIME",
        "lineManagerId": "MGR123",
        "pfNumber": "PF12345079",
        "uanNumber": "UAN9836543280",
        "esicNumber": "ESIC002116",
        "status": "ACTIVE"
      },
      "bankDetails": {
        "bankName": "HDFC Bank",
        "accountNumber": "189456789018",
        "ifscCode": "HDFC0001234",
        "accountHolder": "Allan Burg"
      },
      "emergencyContact": {
        "phoneNumber": "9876503211"
      },
      "currentAddress": {
        "street": "123 1st Main Road",
        "city": "Bangalore",
        "state": "Karnataka",
        "country": "India",
        "zipCode": "560001"
      },
      "permanentAddress": {
        "street": "456 2nd Main Road",
        "city": "Bangalore",
        "state": "Karnataka",
        "country": "India",
        "zipCode": "560002"
      },
      "status": "ACTIVE"
    }
    """;

        response = RestAssured.given()
                .contentType(ContentType.JSON)
                .body(requestBody)
                .post(fullUrl);

    }

    @Then("the user response status code should be {int} at end")
    public void theUserResponseStatusCodeShouldBeAtEnd(int expectedStatusCode) {
        assertEquals(expectedStatusCode, response.getStatusCode());
        System.out.println("Status Code: " + response.getStatusCode());
    }


    @And("the response should confirm the employee was added")
    public void theResponseShouldConfirmTheEmployeeWasAdded() {
        String responseBody = response.getBody().asString();
        System.out.println("Response: " + responseBody);

        // Check if it contains a success message or employee ID
        assertTrue("Response should contain confirmation",
                responseBody.contains("success") || responseBody.contains("employeeId"));
    }

    @Given("user is logged in and has access tokens and refresh tokens with {string}")
    public void userIsLoggedInAndHasAccessTokensAndRefreshTokensWith(String login) {
        String baseUrl = ConfigReader.getProperty("baseUrl");
        RestAssured.baseURI = baseUrl;

        String email = ConfigReader.getProperty("email");
        String password = ConfigReader.getProperty("password");

        String loginPayload = String.format("""
        {
          "email": "%s",
          "password": "%s"
        }
        """, email, password);

        Response loginResponse = given()
                .contentType(ContentType.JSON)
                .body(loginPayload)
                .post(RestAssured.baseURI+login);

        assertEquals(200, loginResponse.getStatusCode());

        accessToken = loginResponse.jsonPath().getString("accessToken");
        assertNotNull("Access token is null", accessToken);

    }

    @When("the user sends a PUT request to update employee {string} {string}")
    public void theUserSendsAPUTRequestToUpdateEmployee(String endpoint, String ID) {
        String employeeId = ID;

        String updatePayload = """
        {
          "personalDetails": {
            "name": "John Doe",
            "gender": "MALE",
            "dateOfBirth": "1990-05-15",
            "bloodGroup": "O+",
            "personalEmail": "john.doe@example.com",
            "phoneNumber": "9876543210",
            "alternatePhoneNumber": "9876543211",
            "nationality": "Indian",
            "maritalStatus": "SINGLE",
            "approvalStatus": "APPROVED",
            "aadharNumber": "123456733012",
            "panNumber": "DVLPR0556R",
            "currentAddress": {
              "street": "123 MG Road",
              "city": "Bangalore",
              "state": "Karnataka",
              "country": "India",
              "zipCode": "560001"
            },
            "permanentAddress": {
              "street": "456 Brigade Road",
              "city": "Bangalore",
              "state": "Karnataka",
              "country": "India",
              "zipCode": "560002"
            }
          },
          "employmentDetails": {
            "employeeId": "%s",
            "jobTitle": "Software Engineer",
            "department": "Engineering",
            "dateOfJoining": "2023-01-01",
            "employmentType": "FULL_TIME",
            "manager_id": null,
            "lineManagerId": "EMP5678",
            "location": "Head Office",
            "status": "ACTIVE",
            "base_salary": 80000,
            "stock_bonus": 5000,
            "officeEmail": "debswarnadeep85@gmail.com",
            "termination_date": null,
            "uanNumber": "100200300400",
            "pfNumber": "123456780312",
            "esicNumber": "987654327656"
          },
          "bankDetails": {
            "employeeId": "%s",
            "bankName": "HDFC Bank",
            "accountNumber": "123456729012",
            "ifscCode": "HDFC0000123",
            "branchName": "Koramangala",
            "accountType": "SAVINGS",
            "accountHolder": "Doe"
          },
          "emergencyContact": {
            "employeeId": "%s",
            "name": "Jane Doe",
            "phoneNumber": "9876500000",
            "relationship": "Sister"
          },
          "documents": []
        }
        """.formatted(employeeId, employeeId, employeeId);

        response = given()
                .header("Authorization", "Bearer " + accessToken)
                .contentType(ContentType.JSON)
                .body(updatePayload)
                .put(RestAssured.baseURI+endpoint+ID);

        System.out.println("PUT Response:\n" + response.getBody().asPrettyString());
    }


    @Then("user get response status code as {int} in the end")
    public void userGetResponseStatusCodeAsInTheEnd(Integer expectedStatusCode) {
        assertEquals(expectedStatusCode.intValue(), response.getStatusCode());

    }

    @And("the employee details should be updated successfully")
    public void theEmployeeDetailsShouldBeUpdatedSuccessfully() {
        String message = response.jsonPath().getString("message");
        assertNotNull("Update message not found", message);
        System.out.println("Success message: " + message);
    }

    @Given("the user logged in and has access tokens and refresh tokens with {string}")
    public void theUserLoggedInAndHasAccessTokensAndRefreshTokensWith(String login) {

        String baseUrl = ConfigReader.getProperty("baseUrl");
        RestAssured.baseURI = baseUrl;

        String email = ConfigReader.getProperty("email");
        String password = ConfigReader.getProperty("password");

        String loginPayload = String.format("""
        {
          "email": "%s",
          "password": "%s"
        }
        """, email, password);

        Response loginResponse = given()
                .contentType(ContentType.JSON)
                .body(loginPayload)
                .post(RestAssured.baseURI + login);

        assertEquals(200, loginResponse.getStatusCode());
        accessToken = loginResponse.jsonPath().getString("accessToken");
        assertNotNull("Access token is null", accessToken);
    }

    @When("the user sends a PUT request to update approval status {string} {string}")
    public void theUserSendsAPUTRequestToUpdateApprovalStatus(String endPoint, String ID) {

        String userId = ID;

        String payload = String.format("""
        {
          "id": "%s",
          "approvalStatus": "APPROVED"
        }
        """, userId);

        response = given()
                .header("Authorization", "Bearer " + accessToken)
                .contentType(ContentType.JSON)
                .body(payload)
                .put(RestAssured.baseURI+endPoint+ID);

        System.out.println("Approval Status PUT Response:\n" + response.getBody().asPrettyString());
    }


    @Then("user response status code as {int}")
    public void userResponseStatusCodeAs(Integer  expectedStatusCode) {

        assertEquals(expectedStatusCode.intValue(), response.getStatusCode());
    }

    @Given("API base URI is set for today's attendance check")
    public void apiBaseURIIsSetForTodaySAttendanceCheck() {
        String baseUrl = ConfigReader.getProperty("baseUrl");
        System.out.println("Loaded base_url: " + baseUrl);
        RestAssured.baseURI = baseUrl;
    }


    @When("the user sends a GET request to fetch today's attendance for employee {string} {string}")
    public void theUserSendsAGETRequestToFetchTodaySAttendanceForEmployee(String endPoint, String ID) {
        String endpoint = endPoint+ID;
        String fullUrl = RestAssured.baseURI + endpoint;
        System.out.println("Calling: " + fullUrl);

        response = RestAssured.given()
                .contentType(ContentType.JSON)
                .get(fullUrl);

    }

    @Then("the user should receive a {int} status code for today's attendance")
    public void theUserShouldReceiveAStatusCodeForTodaySAttendance(int expectedStatusCode) {
        assertEquals(expectedStatusCode, response.getStatusCode());
        System.out.println("Status Code: " + response.getStatusCode());

    }

    @And("the response must contain today's attendance details")
    public void theResponseMustContainTodaySAttendanceDetails() {
        String contentType = response.getHeader("Content-Type");
        String responseBody = response.getBody().asString();

        System.out.println("Response Content-Type: " + contentType);
        System.out.println("Response Body: " + responseBody);


        assertTrue("Expected JSON response", contentType.contains("application/json"));
        assertTrue("Expected attendance data in response", responseBody.contains("date") || responseBody.contains("employeeId"));


        JsonPath jsonPath = new JsonPath(responseBody);
        List<Map<String, Object>> attendanceList = jsonPath.getList("$");


        for (Map<String, Object> attendance : attendanceList) {
            System.out.println("Employee ID: " + attendance.get("employeeId"));
            System.out.println("Date: " + attendance.get("date"));
            System.out.println("Punch In: " + attendance.get("punchInTime"));
            System.out.println("Punch Out: " + attendance.get("punchOutTime"));
            System.out.println("Status: " + attendance.get("attendanceStatus"));
            System.out.println("Working Hours: " + attendance.get("workingHours"));
            System.out.println("----");
        }


        String today = LocalDate.now().toString();
        boolean hasToday = attendanceList.stream().anyMatch(
                record -> record.get("date") != null && record.get("date").toString().startsWith(today)
        );

        assertTrue("Expected attendance entry for today: " + today, hasToday);
//        String contentType = response.getHeader("Content-Type");
//        String responseBody = response.getBody().asString();
//
//        System.out.println("Response Content-Type: " + contentType);
//        System.out.println("Response Body: " + responseBody);
//
//        assertTrue("Expected JSON response", contentType.contains("application/json"));
//        assertTrue("Expected attendance data in response", responseBody.contains("date") || responseBody.contains("employeeId"));
    }

    @Given("the API base URL is set for attendance")
    public void theAPIBaseURLIsSetForAttendance() {
        String baseUrl = ConfigReader.getProperty("baseUrl");
        System.out.println("Loaded base_url: " + baseUrl);
        RestAssured.baseURI = baseUrl;
    }
    @When("the user sends a GET request to today's attendance {string} for employee {string}")
    public void theUserSendsAGETRequestToTodaySAttendanceForEmployee(String endpoint, String ID) {
        String formattedEndpoint = endpoint+ID+"/today";
        String fullUrl = RestAssured.baseURI + formattedEndpoint;
        System.out.println("Calling: " + fullUrl);

        response = RestAssured.given()
                .contentType(ContentType.JSON)
                .get(fullUrl);
    }
    @Then("response status code should {int}")
    public void responseStatusCodeShould(int expectedCode) {
        assertEquals(expectedCode, response.getStatusCode());
        System.out.println("Status Code: " + response.getStatusCode());
    }

    @And("the response should contain today's attendance details for the employee")
    public void theResponseShouldContainTodaySAttendanceDetailsForTheEmployee() {
        String contentType = response.getHeader("Content-Type");
        String body = response.getBody().asString();

        System.out.println("Response Content-Type: " + contentType);
        System.out.println("Response Body: " + body);

        assertTrue("Expected JSON response", contentType.contains("application/json"));
        assertTrue("Response should contain employeeId", body.contains("6824455bde9fba7d44af9541"));
    }

    @Given("the API base URI is set for attendance punch-out")
    public void theAPIBaseURIIsSetForAttendancePunchOut() {
        String baseUrl = ConfigReader.getProperty("baseUrl");
        System.out.println("Loaded base_url: " + baseUrl);
        RestAssured.baseURI = baseUrl;
        
    }

    @When("the user sends a PUT request to punch out attendance for employee {string} and {string}")
    public void theUserSendsAPUTRequestToPunchOutAttendanceForEmployeeAnd(String endPoint, String ID) {
        String endpoint = endPoint+ID;
        String url = RestAssured.baseURI+endpoint;
        System.out.println("Calling: " + url);

        String payload = """
        {
          "punchOutTime": "2025-03-21T02:32:54.800Z",
          "punchOutMethod": "Dashboard"
        }
        """;

        response = RestAssured.given()
                .contentType(ContentType.JSON)
                .body(payload)
                .put(url);
    }
        


    @Then("status code should be {int}")
    public void statusCodeShouldBe(int expectedStatusCode) {
        assertEquals(expectedStatusCode, response.getStatusCode());
        System.out.println("Status Code: " + response.getStatusCode());

    }

    @And("the punch-out response should confirm the update")
    public void thePunchOutResponseShouldConfirmTheUpdate() {
        String contentType = response.getHeader("Content-Type");
        String responseBody = response.getBody().asString();

        System.out.println("Response Content-Type: " + contentType);
        System.out.println("Response Body: " + responseBody);

        assertTrue("Expected JSON response", contentType.contains("application/json"));
        assertTrue("Expected punchOut confirmation", responseBody.contains("punchOutTime") || responseBody.contains("success"));
    }

    @Given("the attendance correction API base URI is configured")
    public void theAttendanceCorrectionAPIBaseURIIsConfigured() {
        String baseUrl = ConfigReader.getProperty("baseUrl");
        RestAssured.baseURI = baseUrl;
        System.out.println("Base URI set to: " + baseUrl);

    }

    @And("the correction request payload is prepared with employeeId {string}, requestDate {string}, attendanceDate {string}, punchInTime {string}, punchOutTime {}, and reason {string}")
    public void theCorrectionRequestPayloadIsPreparedWithEmployeeIdRequestDateAttendanceDatePunchInTimePunchOutTimeAndReason(String employeeId, String requestDate, String attendanceDate, String punchInTime, String punchOutTime, String reason) {

        correctionPayload = new HashMap<>();
        correctionPayload.put("employeeId", employeeId);
        correctionPayload.put("requestDate", requestDate);
        correctionPayload.put("attendanceDate", attendanceDate);
        correctionPayload.put("punchInTime", punchInTime);
        correctionPayload.put("punchOutTime", punchOutTime.equalsIgnoreCase("null") ? null : punchOutTime);
        correctionPayload.put("reason", reason);

        System.out.println("Prepared Payload: " + correctionPayload);
    }

    @When("the user sends a POST request to {string}")
    public void theUserSendsAPOSTRequestTo(String endpoint) {
        String fullUrl = RestAssured.baseURI + endpoint;
        System.out.println("Sending POST to: " + fullUrl);

        response = RestAssured.given()
                .contentType(ContentType.JSON)
                .body(correctionPayload)
                .post(fullUrl);

    }

    @Then("the response status code should be {int} or {int}")
    public void theResponseStatusCodeShouldBeOr(int arg0, int arg1) {
        int statusCode = response.getStatusCode();
        System.out.println("Received Status Code: " + statusCode);
        assertTrue("Expected 200 or 201 but got " + statusCode, statusCode == 200 || statusCode == 201);
    }


    @And("the response should confirm attendance correction success")
    public void theResponseShouldConfirmAttendanceCorrectionSuccess() {
        String responseBody = response.getBody().asString();
        String contentType = response.getHeader("Content-Type");

        System.out.println("Content-Type: " + contentType);
        System.out.println("Response Body: " + responseBody);

        assertTrue("Expected JSON response", contentType.contains("application/json"));
        assertTrue("Expected success message", responseBody.toLowerCase().contains("success") || responseBody.toLowerCase().contains("submitted"));
    }

    @Given("the API base URI is set for attendance requests")
    public void theAPIBaseURIIsSetForAttendanceRequests() {
        String baseUrl = ConfigReader.getProperty("baseUrl");
        RestAssured.baseURI = baseUrl;
        System.out.println("Base URI set to: " + baseUrl);
        
    }

    @When("the user sends a GET request to {string}")
    public void theUserSendsAGETRequestTo(String endPoint) {
        String fullUrl = RestAssured.baseURI + endPoint;
        System.out.println("Sending GET to: " + fullUrl);

        response = RestAssured.given()
                .contentType(ContentType.JSON)
                .get(fullUrl);
        
    }

    @Then("user response status code should be {int} after the request")
    public void userResponseStatusCodeShouldBeAfterTheRequest(int expectedStatusCode) {
        assertEquals(expectedStatusCode, response.getStatusCode());
        System.out.println("Response Status Code: " + response.getStatusCode());
        
    }

    @And("the response should contain attendance correction request data")
    public void theResponseShouldContainAttendanceCorrectionRequestData() {
        String contentType = response.getHeader("Content-Type");
        String responseBody = response.getBody().asString();

        System.out.println("Response Content-Type: " + contentType);
        System.out.println("Response Body: " + responseBody);

        assertTrue("Expected JSON response", contentType.contains("application/json"));
        
        assertFalse("Response body should not be empty", responseBody.isEmpty());
    }

    @Given("the API base URI is set for monthly attendance")
    public void theAPIBaseURIIsSetForMonthlyAttendance() {
        String baseUrl = ConfigReader.getProperty("baseUrl");
        RestAssured.baseURI = baseUrl;
        System.out.println("Base URI set to: " + baseUrl);
    }

    @And("the monthly attendance payload is prepared with employeeId {string}, monthYear {string}, workingDays {string}, presentDays {string}, absentDays {string}, halfDays {string}, lateDays {string}, monthlyLateComing {string}, earlyLeaving {string}, and overtimeHours {string}")
    public void theMonthlyAttendancePayloadIsPreparedWithEmployeeIdMonthYearWorkingDaysPresentDaysAbsentDaysHalfDaysLateDaysMonthlyLateComingEarlyLeavingAndOvertimeHours(String employeeId, String monthYear, String workingDays, String presentDays, String absentDays, String halfDays, String lateDays, String monthlyLateComing, String earlyLeaving, String overtimeHours)
    {
        payload = new HashMap<>();
        payload.put("employeeId", employeeId);
        payload.put("monthYear", monthYear);
        payload.put("workingDays", workingDays);
        payload.put("presentDays", presentDays);
        payload.put("absentDays", absentDays);
        payload.put("halfDays", halfDays);
        payload.put("lateDays", lateDays);
        payload.put("monthlyLateComing", monthlyLateComing);
        payload.put("earlyLeaving", earlyLeaving);
        payload.put("overtimeHours", overtimeHours);

        System.out.println("Payload: " + payload);
        
    }


    @When("user sends a POST request to {string}{string} and {string}")
    public void userSendsAPOSTRequestToAnd(String ID, String end , String point) {
        String fullUrl =   RestAssured.baseURI+end+ID+point;
        System.out.println("POST URL: " + fullUrl);

        response = RestAssured.given()
                .contentType(ContentType.JSON)
                .body(payload)
                .post(fullUrl);
    }

    @Then("user response status should be {int} for the request")
    public void userResponseStatusShouldBeForTheRequest(int expectedStatus) {
        assertEquals(expectedStatus, response.getStatusCode());
        System.out.println("Status Code: " + response.getStatusCode());
        
    }

    @And("the response should confirm monthly attendance submission success")
    public void theResponseShouldConfirmMonthlyAttendanceSubmissionSuccess() {
        assertEquals(200, response.getStatusCode());

        JsonPath json = response.jsonPath();
        String id = json.getString("id");
        String employeeId = json.getString("employeeId");

        System.out.println("Response ID: " + id);
        System.out.println("Employee ID: " + employeeId);

        assertNotNull("ID should not be null", id);
        assertEquals("6815a083653f515d4d712d1e", employeeId);
    }


    @Given("the base URI is set to")
    public void theBaseURIIsSetTo() {
        String baseUrl = ConfigReader.getProperty("baseUrl");
        RestAssured.baseURI = baseUrl;
        System.out.println("Base URI set to: " + baseUrl);

    }

    @When("the user sends a GET request to {string} {string} {string}")
    public void theUserSendsAGETRequestTo(String endpoint, String id, String monthQuery) {
        String fullUrl = endpoint + id + monthQuery;
        System.out.println("Sending GET request to: " + RestAssured.baseURI + fullUrl);

        response = RestAssured
                .given()
                .get(fullUrl);

        System.out.println("Response Body: " + response.getBody().asString());

    }

    @Then("the user response status code should be {int} after the request")
    public void theUserResponseStatusCodeShouldBeAfterTheRequest(int expectedStatusCode) {
        assertEquals(expectedStatusCode, response.getStatusCode());

    }

    @And("the response should contain the employee ID {string}")
    public void theResponseShouldContainTheEmployeeID(String expectedEmployeeId) {
        String actualEmployeeId = response.jsonPath().getString("employeeId");
        assertEquals(expectedEmployeeId, actualEmployeeId);
    }

    @Given("the base URL is set to")
    public void theBaseURLIsSetTo() {
        String baseUrl = ConfigReader.getProperty("baseUrl");
        RestAssured.baseURI = baseUrl;
        System.out.println("Base URI set to: " + baseUrl);
        
    }

    @When("the user sends a GET request to {string} with {string}")
    public void theUserSendsAGETRequestToWith(String endpoint, String employeeId) {
        String fullUrl = endpoint + employeeId;
        System.out.println("Sending GET request to: " + RestAssured.baseURI + fullUrl);

        response = RestAssured
                .given()
                .get(fullUrl);

        System.out.println("Response: " + response.getBody().asString());

    }

    @Then("the user response status code should be {int} after request")
    public void theUserResponseStatusCodeShouldBeAfterRequest(int expectedStatusCode) {
        assertEquals(expectedStatusCode, response.getStatusCode());
    }

    @Given("base URI is set to")
    public void baseURIIsSetTo() {
        String baseUrl = ConfigReader.getProperty("baseUrl");
        RestAssured.baseURI = baseUrl;
        System.out.println("Base URI set to: " + baseUrl);
        
    }

    @When("the user sends a GET request  {string}")
    public void theUserSendsAGETRequest(String endpoint) {
        response = RestAssured
                .given()
                .get(RestAssured.baseURI+endpoint);
        System.out.println("GET request sent to: " + endpoint);
        
    }

    @Then("the user response status code should be {int}  the request")
    public void theUserResponseStatusCodeShouldBeTheRequest(int expectedStatusCode) {
        int actualStatusCode = response.getStatusCode();
        System.out.println("Response Status Code: " + actualStatusCode);
        assertEquals("Unexpected status code", expectedStatusCode, actualStatusCode);
        
    }

    @And("the response should contain the key {string}")
    public void theResponseShouldContainTheKey(String expectedKey) {
        String responseBody = response.getBody().asString();
        System.out.println("Response Body: " + responseBody);
        assertTrue("Response does not contain expected key: " + expectedKey,
                responseBody.contains(expectedKey));
    }
}
