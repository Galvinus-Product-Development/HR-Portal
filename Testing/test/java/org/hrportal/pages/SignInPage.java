package org.hrportal.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;


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
        int usernameFieldHeight = driver.findElement(Username_Field).getSize().getHeight();
        int usernameFieldWidth = driver.findElement(Username_Field).getSize().getWidth();

        int passwordFieldHeight = driver.findElement(Username_Field).getSize().getHeight();
        int passwordFieldWidth = driver.findElement(Password_Field).getSize().getWidth();

        System.out.println("Username Field - Height: " + usernameFieldHeight + ", Width: " + usernameFieldWidth);
        System.out.println("Password Field - Height: " + passwordFieldHeight + ", Width: " + passwordFieldWidth);


        if (passwordFieldHeight == usernameFieldHeight) {
            System.out.println(" Username and Password fields have the same height.");
        } else {
            System.out.println(" Mismatch in field heights.");
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
                    WebDriverWait wait = new WebDriverWait(driver,Duration.ofSeconds(10));
                    wait.until(ExpectedConditions.elementToBeClickable(SignIn_Button_Xpath)).click();
                    //driver.findElement(SignIn_Button_Xpath).click();
                } else {
                    System.out.println("Invalid data format in credentials file.");
                }
            }
        } catch (IOException e) {
            System.out.println("Error reading credentials file: " + e.getMessage());
        }
    }

    public void credentials(String username, String password) {
       // driver.findElement(Username_Field).clear();
        WebDriverWait wait = new WebDriverWait(driver,Duration.ofSeconds(10));
        wait.until(ExpectedConditions.visibilityOfElementLocated(Username_Field)).sendKeys(username);
        //driver.findElement(Username_Field).sendKeys(username);

       // driver.findElement(Password_Field).clear();
        wait.until(ExpectedConditions.visibilityOfElementLocated(Password_Field)).sendKeys(password);
       // driver.findElement(Password_Field).sendKeys(password);

    }

    public void inValidCredentials(String username, String password) {
        driver.findElement(Username_Field).clear();
        driver.findElement(Username_Field).sendKeys(username);

        driver.findElement(Password_Field).clear();
        driver.findElement(Password_Field).sendKeys(password);
    }

    public void clickSignInButton() {

        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
            WebElement signInBtn = wait.until(ExpectedConditions.elementToBeClickable(SignIn_Button_Xpath));
            signInBtn.click();

        } catch (TimeoutException e) {
            System.out.println("Sign-in button was not clickable, maybe already navigated.");
        }
    }

    public void errorMessage(String error) {
       WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        String errorMessageDisplay = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//div[contains(@class,'login-error')]//span[contains(text(),'" + error + "')]"))).getText();

        System.out.println("If the user entered the wrong email format then this error message will appears" + errorMessageDisplay);
    }
    public void mailFormatErrorMessage(String error){
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        String errorMessage = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//p[contains(@class, 'error-text') and contains(normalize-space(), '" + error + "')]"))).getText();
        System.out.println("If the user enter the invalid email format then this error message will appears: " + errorMessage);

    }
    public void unregisteredErrorCredentials(){
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        String error = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Unregistered_Error_Message))).getText();

        System.out.println(error + " This message is for the unregistered email and password");
    }
    public void checkSignInButtonEnable(){
        WebElement signInButton = driver.findElement(SignIn_Button_Xpath);
         if (signInButton.isEnabled()){
             System.out.println("Sign In Button is enable");
         }
         else {
             System.out.println("Sign in button is disable");
         }
    }

    public void checkForgotPasswordEnable(){
        WebElement forgotPassword = driver.findElement(Forgot_Password_Link);

        if (forgotPassword.isEnabled()){
            System.out.println("Forgot Password Link is enable");
        }
        else {
            System.out.println("Forgot Password Link is disable");
        }
    }
    public void clickForgotPassword(){
        driver.findElement(Forgot_Password_Link).click();
    }
    public void getResetPasswordTitle() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        String pageTitle = wait.until(ExpectedConditions.visibilityOfElementLocated(Forgot_Password_PageTitle)).getText();

        System.out.println("This is the title of the Reset Password page: " + pageTitle);
    }
    public void checkSendResentLink(){
        WebElement sendResetLink = driver.findElement(Send_Reset_Link_Button);

        if (sendResetLink.isEnabled()){
            System.out.println("Send Reset Link is enabled");
        }
        else {
            System.out.println("Send Reset Link is disabled");
        }

    }
    public void clickSendResentLinkButton(){
        driver.findElement(Send_Reset_Link_Button).click();
    }
    public void checkBackToLogin(){
        WebElement backToLoginButton = driver.findElement(Back_To_Login_Button);

        if (backToLoginButton.isEnabled()){
            System.out.println("Back To Login Button is enabled");
        }
        else {
            System.out.println("back To Login Button is Disabled");
        }
    }
    public void clickOnBackToLoginButton(){
        driver.findElement(Back_To_Login_Button).click();
    }
    public void enterEmail(){
        driver.findElement(Username_Field).sendKeys("bhaskarbasu7070@gmail.com");
        driver.findElement(Send_Reset_Link_Button).click();
    }
    public void conformationMessage(){
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement conformationMessage= wait.until(ExpectedConditions.visibilityOfElementLocated(Mail_Sent_Conformation_Text));


        if (conformationMessage.isDisplayed()){
            System.out.println("Reset Mail sent successfully");
            String text = conformationMessage.getText();
            System.out.println(text + " This text displayed after the reset link send to user");
        }
        else {
            System.out.println("Failed to send Resent link");
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

    public void validCredentials(){

    }
    }



