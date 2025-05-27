package org.hrportal.pages;

import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;


public class SignInPage {

    private WebDriver driver;


    public SignInPage(WebDriver driver) {

        this.driver = driver;
    }

    public static String Login_Page_Title = "//*[@id=\"root\"]/div/div/div/h2";
    public static final By Username_Field = By.id("email");
    public static final By Password_Field = By.id("password");
    // public static final By SignIn_Button_Xpath = By.xpath("//button[text()='Sign in']");
    public static final By SignIn_Button_Xpath = By.xpath("//button[text()='Sign in']");
    public static final By Forgot_Password_Link = By.xpath("//*[@id=\"root\"]/div/div/div/form/div[3]/p");
    public static final By Forgot_Password_PageTitle = By.xpath("//*[@id=\"root\"]/div/div/div/h2");
    public static String Error_Message = "//*[@id=\"root\"]/div/div/div/form/div[1]/p";
    public static String Unregistered_Error_Message = "//*[@id=\"root\"]/div/div/div/div[2]/span";
    public static final By Mail_Sent_Conformation_Text = By.xpath("//*[@id=\"root\"]/div/div/div/p");
    public static final By Send_Reset_Link_Button = By.xpath("//button[text()='Send Reset Link']");
    public static final By Back_To_Login_Button = By.xpath("//button[text()='Back to Login']");

    public String loginPageTitle() {
        return driver.findElement(By.xpath(Login_Page_Title)).getText();
    }

    public void dimensionsOfField() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement usernameField = wait.until(ExpectedConditions.visibilityOfElementLocated(Username_Field));

            int usernameFieldHeight = usernameField.getSize().getHeight();
            int usernameFieldWidth = usernameField.getSize().getWidth();

            WebElement passwordField = wait.until(ExpectedConditions.visibilityOfElementLocated(Password_Field));
            int passwordFieldHeight = passwordField.getSize().getHeight();
            int passwordFieldWidth = passwordField.getSize().getWidth();

            System.out.println("Username Field - Height: " + usernameFieldHeight + ", Width: " + usernameFieldWidth);
            System.out.println("Password Field - Height: " + passwordFieldHeight + ", Width: " + passwordFieldWidth);

            if (passwordFieldHeight == usernameFieldHeight) {
                System.out.println("Username and Password fields have the same height.");
            } else {
                System.out.println("Mismatch in field heights.");
            }

        } catch (NoSuchElementException e) {
            System.out.println("One or both fields were not found: " + e.getMessage());

        } catch (StaleElementReferenceException e) {
            System.out.println("One or both fields are no longer attached to the DOM: " + e.getMessage());

        } catch (InvalidSelectorException e) {
            System.out.println("Invalid selector used to locate the fields: " + e.getMessage());

        } catch (Exception e) {
            System.out.println("Unexpected error occurred while getting dimensions: " + e.getMessage());
        }
    }

    public void readCredentialsFromFile(String filePath) {
        try (BufferedReader br = new BufferedReader(new FileReader(filePath))) {
            String line;
            while ((line = br.readLine()) != null) {
                String[] data = line.split(",");
                if (data.length == 2) {
                    String username = data[0].trim();
                    String password = data[1].trim();
                    System.out.println("Testing login with: " + username + " | " + password);
                    credentials(username, password);
                    WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
                    wait.until(ExpectedConditions.elementToBeClickable(SignIn_Button_Xpath)).click();

                } else {
                    System.out.println("Invalid data format in credentials file.");
                }
            }
        } catch (IOException e) {
            System.out.println("Error reading credentials file: " + e.getMessage());
        }
    }

    public void credentials(String username, String password) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));


            try {
                WebElement usernameField = wait.until(ExpectedConditions.visibilityOfElementLocated(Username_Field));
                usernameField.clear();
                usernameField.sendKeys(username);
                System.out.println("Username entered successfully.");
            } catch (TimeoutException e) {
                System.out.println("Timeout: Username field not visible in time. " + e.getMessage());
                return;
            } catch (NoSuchElementException e) {
                System.out.println("Username field not found. " + e.getMessage());
                return;
            } catch (Exception e) {
                System.out.println("Unexpected error while entering username: " + e.getMessage());
                return;
            }


            try {
                WebElement passwordField = wait.until(ExpectedConditions.visibilityOfElementLocated(Password_Field));
                passwordField.clear();
                passwordField.sendKeys(password);
                System.out.println("Password entered successfully.");
            } catch (TimeoutException e) {
                System.out.println("Timeout: Password field not visible in time. " + e.getMessage());
            } catch (NoSuchElementException e) {
                System.out.println("Password field not found. " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error while entering password: " + e.getMessage());
            }

        } catch (Exception e) {
            System.out.println("General exception in credentials(): " + e.getMessage());
        }
    }


    public void inValidCredentials(String username, String password) {
        try {
            driver.findElement(Username_Field).clear();
            driver.findElement(Username_Field).sendKeys(username);

            driver.findElement(Password_Field).clear();
            driver.findElement(Password_Field).sendKeys(password);

        } catch (NoSuchElementException e) {
            System.out.println("One of the input fields (username/password) was not found: " + e.getMessage());
        } catch (ElementNotInteractableException e) {
            System.out.println("One of the input fields (username/password) is not interactable: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("Unexpected error in inValidCredentials: " + e.getMessage());
        }
    }

    public void clickSignInButton() {

        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
            WebElement signInBtn = wait.until(ExpectedConditions.elementToBeClickable(SignIn_Button_Xpath));
            signInBtn.click();

        } catch (TimeoutException e) {
            System.out.println("Sign-in button was not clickable, maybe already navigated: " + e.getMessage());
        } catch (NoSuchElementException e) {
            System.out.println("Sign-in button element not found: " + e.getMessage());
        } catch (ElementClickInterceptedException e) {
            System.out.println("Sign-in button click was intercepted: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("Unexpected error in clickSignInButton: " + e.getMessage());
        }
    }

    public void errorMessage(String error) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            String errorMessageDisplay = wait
                    .until(ExpectedConditions.visibilityOfElementLocated(
                            By.xpath("//div[contains(@class,'login-error')]//span[contains(text(),'" + error + "')]")))
                    .getText();

            System.out.println("Error message displayed: " + errorMessageDisplay);

        } catch (TimeoutException e) {
            System.out.println("Error message did not appear in time: " + e.getMessage());
        } catch (NoSuchElementException e) {
            System.out.println("Error message element not found: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("Unexpected error in errorMessage: " + e.getMessage());
        }
    }

    public void mailFormatErrorMessage(String error) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            String errorMessage = wait.until(ExpectedConditions.visibilityOfElementLocated(
                    By.xpath("//p[contains(@class, 'error-text') and contains(normalize-space(), '" + error + "')]")
            )).getText();

            System.out.println("If the user enters an invalid email format, this error message will appear: " + errorMessage);

        } catch (TimeoutException e) {
            System.out.println("Timed out waiting for the error message to appear: " + e.getMessage());

        } catch (NoSuchElementException e) {
            System.out.println("The error message element was not found on the page: " + e.getMessage());

        } catch (StaleElementReferenceException e) {
            System.out.println("The error message element is no longer attached to the DOM: " + e.getMessage());

        } catch (ElementNotInteractableException e) {
            System.out.println("The error message element is not interactable: " + e.getMessage());

        } catch (Exception e) {
            System.out.println("Unexpected error occurred while retrieving the error message: " + e.getMessage());
        }

    }

    public void unregisteredErrorCredentials() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        String error = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Unregistered_Error_Message))).getText();

        System.out.println(error + " This message is for the unregistered email and password");
    }

    public void checkSignInButtonEnable() {
        try {
            WebElement signInButton = driver.findElement(SignIn_Button_Xpath);

            if (signInButton.isEnabled()) {
                System.out.println("Sign In button is enabled.");
            } else {
                System.out.println("Sign In button is disabled.");
            }

        } catch (NoSuchElementException e) {
            System.out.println("Sign In button was not found on the page: " + e.getMessage());

        } catch (ElementNotInteractableException e) {
            System.out.println("Sign In button exists but is not interactable: " + e.getMessage());

        } catch (StaleElementReferenceException e) {
            System.out.println("Sign In button is no longer attached to the DOM: " + e.getMessage());

        } catch (InvalidSelectorException e) {
            System.out.println("Invalid XPath or selector used for the Sign In button: " + e.getMessage());

        } catch (Exception e) {
            System.out.println("An unexpected error occurred while checking the Sign In button state: " + e.getMessage());
        }
    }

    public void checkForgotPasswordEnable() {
        try {
            WebElement forgotPassword = driver.findElement(Forgot_Password_Link);

            if (forgotPassword.isEnabled()) {
                System.out.println("Forgot Password link is enabled.");
            } else {
                System.out.println("Forgot Password link is disabled.");
            }

        } catch (NoSuchElementException e) {
            System.out.println("Forgot Password link was not found on the page: " + e.getMessage());

        } catch (ElementNotInteractableException e) {
            System.out.println("Forgot Password link exists but is not interactable: " + e.getMessage());

        } catch (StaleElementReferenceException e) {
            System.out.println("Forgot Password link is no longer attached to the DOM: " + e.getMessage());

        } catch (InvalidSelectorException e) {
            System.out.println("Invalid selector used for Forgot Password link: " + e.getMessage());

        } catch (Exception e) {
            System.out.println("An unexpected error occurred while checking the Forgot Password link: " + e.getMessage());
        }
    }

    public void clickForgotPassword() {
        try {
            driver.findElement(Forgot_Password_Link).click();
            System.out.println("Clicked on Forgot Password link.");

        } catch (NoSuchElementException e) {
            System.out.println("Forgot Password link was not found: " + e.getMessage());

        } catch (ElementNotInteractableException e) {
            System.out.println("Forgot Password link exists but is not interactable: " + e.getMessage());

        } catch (StaleElementReferenceException e) {
            System.out.println("Forgot Password link is no longer attached to the DOM: " + e.getMessage());

        } catch (InvalidSelectorException e) {
            System.out.println("Invalid selector used to locate Forgot Password link: " + e.getMessage());

        } catch (Exception e) {
            System.out.println("An unexpected error occurred while clicking Forgot Password: " + e.getMessage());
        }
    }

    public void getResetPasswordTitle() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            String pageTitle = wait.until(ExpectedConditions.visibilityOfElementLocated(Forgot_Password_PageTitle)).getText();

            System.out.println("This is the title of the Reset Password page: " + pageTitle);

        } catch (TimeoutException e) {
            System.out.println("Timeout while waiting for the Reset Password page title to be visible: " + e.getMessage());

        } catch (NoSuchElementException e) {
            System.out.println("Reset Password page title element was not found: " + e.getMessage());

        } catch (StaleElementReferenceException e) {
            System.out.println("Reset Password page title element is no longer attached to the DOM: " + e.getMessage());

        } catch (InvalidSelectorException e) {
            System.out.println("Invalid selector used for Reset Password page title: " + e.getMessage());

        } catch (Exception e) {
            System.out.println("An unexpected error occurred while retrieving the Reset Password page title: " + e.getMessage());
        }
    }

    public void checkSendResentLink() {
        try {
            WebElement sendResetLink = driver.findElement(Send_Reset_Link_Button);

            try {
                if (sendResetLink.isEnabled()) {
                    System.out.println("Send Reset Link is enabled.");
                } else {
                    System.out.println("Send Reset Link is disabled.");
                }

            } catch (ElementNotInteractableException e) {
                System.out.println("Send Reset Link button is not interactable: " + e.getMessage());
            } catch (StaleElementReferenceException e) {
                System.out.println("Send Reset Link button is no longer attached to the DOM: " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error while checking button state: " + e.getMessage());
            }

        } catch (NoSuchElementException e) {
            System.out.println("Send Reset Link button was not found on the page: " + e.getMessage());
        } catch (InvalidSelectorException e) {
            System.out.println("Invalid selector used for Send Reset Link button: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("Unexpected error while finding the Send Reset Link button: " + e.getMessage());
        }
    }

    public void clickSendResentLinkButton() {
        try {
            WebElement sendResetLinkButton = driver.findElement(Send_Reset_Link_Button);
            sendResetLinkButton.click();
            System.out.println("Clicked on the 'Send Reset Link' button.");

        } catch (NoSuchElementException e) {
            System.out.println("Send Reset Link button was not found on the page: " + e.getMessage());

        } catch (ElementNotInteractableException e) {
            System.out.println("Send Reset Link button is not interactable: " + e.getMessage());

        } catch (StaleElementReferenceException e) {
            System.out.println("Send Reset Link button is no longer attached to the DOM: " + e.getMessage());

        } catch (InvalidSelectorException e) {
            System.out.println("Invalid selector used for Send Reset Link button: " + e.getMessage());

        } catch (Exception e) {
            System.out.println("An unexpected error occurred while clicking the Send Reset Link button: " + e.getMessage());
        }
    }

    public void checkBackToLogin() {
        try {
            WebElement backToLoginButton = driver.findElement(Back_To_Login_Button);

            try {
                if (backToLoginButton.isEnabled()) {
                    System.out.println("Back To Login Button is enabled.");
                } else {
                    System.out.println("Back To Login Button is disabled.");
                }

            } catch (ElementNotInteractableException e) {
                System.out.println("Back To Login Button is not interactable: " + e.getMessage());
            } catch (StaleElementReferenceException e) {
                System.out.println("Back To Login Button is no longer attached to the DOM: " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error while checking Back To Login button state: " + e.getMessage());
            }

        } catch (NoSuchElementException e) {
            System.out.println("Back To Login Button was not found on the page: " + e.getMessage());
        } catch (InvalidSelectorException e) {
            System.out.println("Invalid selector used for Back To Login Button: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("Unexpected error while finding the Back To Login Button: " + e.getMessage());
        }
    }

    public void clickOnBackToLoginButton() {
        try {
            WebElement backToLoginButton = driver.findElement(Back_To_Login_Button);
            backToLoginButton.click();
            System.out.println("Clicked on the Back To Login button.");

        } catch (NoSuchElementException e) {
            System.out.println("Back To Login button was not found: " + e.getMessage());

        } catch (ElementNotInteractableException e) {
            System.out.println("Back To Login button is not interactable: " + e.getMessage());

        } catch (StaleElementReferenceException e) {
            System.out.println("Back To Login button is no longer attached to the DOM: " + e.getMessage());

        } catch (InvalidSelectorException e) {
            System.out.println("Invalid selector used for Back To Login button: " + e.getMessage());

        } catch (Exception e) {
            System.out.println("An unexpected error occurred while clicking the Back To Login button: " + e.getMessage());
        }
    }

    public void enterEmail() {
        try {
            WebElement emailField = driver.findElement(Username_Field);
            emailField.sendKeys("bhaskarbasu7070@gmail.com");

            try {
                WebElement sendResetButton = driver.findElement(Send_Reset_Link_Button);
                sendResetButton.click();
                System.out.println("Email entered and Send Reset Link button clicked successfully.");

            } catch (NoSuchElementException e) {
                System.out.println("Send Reset Link button was not found: " + e.getMessage());

            } catch (ElementNotInteractableException e) {
                System.out.println("Send Reset Link button is not interactable: " + e.getMessage());

            } catch (StaleElementReferenceException e) {
                System.out.println("Send Reset Link button is no longer attached to the DOM: " + e.getMessage());

            } catch (InvalidSelectorException e) {
                System.out.println("Invalid selector used for Send Reset Link button: " + e.getMessage());

            } catch (Exception e) {
                System.out.println("Unexpected error occurred while clicking Send Reset Link button: " + e.getMessage());
            }

        } catch (NoSuchElementException e) {
            System.out.println("Email input field was not found: " + e.getMessage());

        } catch (InvalidSelectorException e) {
            System.out.println("Invalid selector used for email input field: " + e.getMessage());

        } catch (Exception e) {
            System.out.println("Unexpected error occurred while entering email: " + e.getMessage());
        }
    }

    public void conformationMessage() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement confirmationMessage = wait.until(ExpectedConditions.visibilityOfElementLocated(Mail_Sent_Conformation_Text));

            if (confirmationMessage.isDisplayed()) {
                System.out.println("Reset Mail sent successfully");
                String text = confirmationMessage.getText();
                System.out.println(text + " This text displayed after the reset link sent to user");
            } else {
                System.out.println("Failed to send Reset link");
            }

        } catch (TimeoutException e) {
            System.out.println("Timeout waiting for confirmation message: " + e.getMessage());

        } catch (NoSuchElementException e) {
            System.out.println("Confirmation message element was not found: " + e.getMessage());

        } catch (StaleElementReferenceException e) {
            System.out.println("Confirmation message is no longer attached to the DOM: " + e.getMessage());

        } catch (InvalidSelectorException e) {
            System.out.println("Invalid selector used for confirmation message: " + e.getMessage());

        } catch (Exception e) {
            System.out.println("An unexpected error occurred while verifying confirmation message: " + e.getMessage());
        }
    }
}

//        private static final Map<String, String> configMap = new HashMap<>();
//
//        static {
//            try (BufferedReader reader = new BufferedReader(new FileReader("src/test/resources/config.txt"))) {
//                String line;
//                while ((line = reader.readLine()) != null) {
//                    if (line.contains("=")) {
//                        String[] parts = line.split("=", 2);
//                        configMap.put(parts[0].trim(), parts[1].trim());
//                    }
//                }
//            } catch (IOException e) {
//                throw new RuntimeException("Error reading config.txt", e);
//            }
//        }
//
//        public static String get(String key) {
//            return configMap.get(key);
//        }




