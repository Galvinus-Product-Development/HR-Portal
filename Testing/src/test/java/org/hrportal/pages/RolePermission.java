package org.hrportal.pages;

import org.junit.Assert;
import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;
import java.util.NoSuchElementException;

public class RolePermission {

    private WebDriver driver;


    public RolePermission(WebDriver driver) {
        this.driver = driver;
    }

    public Select select;
    public Select delete;
    public Select add;




    public static String Page_Title_XPath = "//h1[text()='Role Permissions']";
    public static String Role_Permission_Table = "//*[@id=\"root\"]/div/div/main/div/div[2]";
    public static String Assign_Role_Button = "//*[@id=\"root\"]/div/div/main/div/div[1]/button[1]";
    public static final By Search_Bar = By.xpath("//*[@id=\"root\"]/div/div/main/div/div[3]/div/div[2]/div/input");
    public static String Assign_Role_Drop_Down = "//*[@id=\"root\"]/div/div/main/div/div[3]/div/div[3]/div/div[2]/select";
    public static String SuccessFull_Notification = "//*[@id=\"root\"]/div/div/main/div/div[4]/div";
    public static String Close_Button = "//*[@id=\"root\"]/div/div/main/div/div[3]/div/div[1]/button";
    public static String Create_Role_Button = "//*[@id=\"root\"]/div/div/main/div/div[1]/button[2]";
    public static String PopUp_Xpath = "//*[@id=\"root\"]/div/div/main/div/div[2]/div";
    public static final By Enter_Role_Name = By.xpath("//*[@id=\"root\"]/div/div/main/div/div[2]/div/input");
    public static final By Enter_Role_Description = By.xpath("//*[@id=\"root\"]/div/div/main/div/div[2]/div/textarea");
    public static String Click_Create_Role_Button = "//button[text()='Create Role']";
    public static String Click_Delete_Role_Button = "//*[@id=\"root\"]/div/div/main/div/div[1]/button[3]";
    public static String Delete_Role_PopUp = "//*[@id=\"root\"]/div/div/main/div/div[2]/div";
    public static final By Delete_Role_Drop_Down = By.xpath("//*[@id=\"root\"]/div/div/main/div/div[2]/div/select");
    public static String Delete_Role_Button = "//*[@id=\"root\"]/div/div/main/div/div[2]/div/button";
    public static String Close_Delete_Role_PopUp = "//button[text()='×']";
    public static String User_Registration = "//*[@id=\"root\"]/div/div/div/nav/div[8]/a";
    public static String User_Email_Field = "email";
    public static String Send_Registration_Link = "//button[text()='Send Registration Link']";
   // public static String Successful_Message = "//*[@id=\"root\"]/div/div/main/div/div/div/div[2]/span";
    public static String Check_Add_Permission_Employee = "//*[@id=\"root\"]/div/div/main/div/div[2]/div/div[1]/div[1]/button";
    public static String Add_Permission_PopUp = "//*[@id=\"root\"]/div/div/main/div/div[3]/div";
    public static String Click_Select_Permission_DropDown = "//*[@id=\"root\"]/div/div/main/div/div[3]/div/select";
    public static String Click_Add_Permission_Button = "//*[@id=\"root\"]/div/div/main/div/div[3]/div/button";
    public static String Add_Permission_Notification = "//*[@id=\"root\"]/div/div/main/div/div[3]/div";
    public static String Delete_Permission_Role = "//*[@id=\"root\"]/div/div/main/div/div[2]/div/div[1]/div[2]/div[3]/button";
    public static String Remove_Permission = "//button[text()='Remove Permission']";
    public static String Close_Add_Permission_Popup = "//*[@id=\"root\"]/div/div/main/div/div[3]/div/div/button";

    public String getPageTitle() throws InterruptedException {
        driver.navigate().refresh();
        Thread.sleep(3000);
        return driver.findElement(By.xpath(Page_Title_XPath)).getText();
    }

    public boolean rolePermissionDetails() {
        return driver.findElement(By.xpath(Role_Permission_Table)).isDisplayed();
    }

    public void clickAssignRoleButton() {

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement assignRoleButton = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Assign_Role_Button)));
        assignRoleButton.click();
    }

    public void enterEmployeeName(String name) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement employeeName = wait.until(ExpectedConditions.visibilityOfElementLocated((Search_Bar)));
        employeeName.clear();
        employeeName.sendKeys(name);
    }

    public void listRoleFromDropDown() {


        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));


        WebElement dropDown = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Assign_Role_Drop_Down)));
        dropDown.click();
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath(Assign_Role_Drop_Down)));

        select = new Select(dropDown);


        List<WebElement> options = select.getOptions();
        System.out.println("Dropdown options available:");
        for (WebElement option : options) {
            String listOfElements = option.getText();
            System.out.println(listOfElements);
        }
    }

    public void assignRole(String role) throws InterruptedException {

        try {
            if (role == null || role.isEmpty()) {
                System.out.println("Invalid input: Role cannot be null or empty.");
                return;
            }

            List<WebElement> options = select.getOptions();
            boolean roleExists = options.stream().anyMatch(option -> option.getText().equals(role));

            if (roleExists) {
                select.selectByVisibleText(role);
                System.out.println("Role is selected successfully: " + role);
                try {
                    WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
                    wait.until(ExpectedConditions.alertIsPresent());
                    Alert alert = driver.switchTo().alert();
                    String alertPopupText = alert.getText();
                    System.out.println(alertPopupText + " : This is the message present in the popup");
                    alert.accept();
                    System.out.println("Alert dismissed successfully.");

                    WebDriverWait wait1 = new WebDriverWait(driver, Duration.ofSeconds(10));
                    WebElement roleChanged = wait1.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(SuccessFull_Notification)));


                    if (roleChanged.isDisplayed()) {
                        String text = roleChanged.getText();
                        System.out.println(text + " :Role changed result notification displayed ");
                    }

                } catch (Exception e) {
                    System.out.println("No alert appeared.");
                }

            } else {
                System.out.println("Error: Role '" + role + "' does not exist in the dropdown.");

            }
        } catch (NoSuchElementException e) {
            System.out.println("Dropdown element not found: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("Unexpected error occurred: " + e.getMessage());
        }

        Thread.sleep(3000);

    }

    public void closeThePopUp() throws InterruptedException {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(15));
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Close_Button))).click();
    }

    public void clickCreateRoleButton() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Create_Role_Button))).click();
    }

    public boolean createRolePopUp() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(PopUp_Xpath))).isDisplayed();
    }

    public void enterNewRoleName(String role) {
        driver.findElement(Enter_Role_Name).sendKeys(role);

    }

    public void enterRoleDescription(String description) {
        driver.findElement(Enter_Role_Description).sendKeys(description);

    }

    public void clickCreateRole() throws InterruptedException {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));


        WebElement createRole = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Click_Create_Role_Button)));
        createRole.click();
        System.out.println("Create Role button clicked successfully");


        try {
            wait.until(ExpectedConditions.alertIsPresent());
            Alert alert = driver.switchTo().alert();
            String alertPopupText = alert.getText();
            System.out.println(alertPopupText + " : This is the message present in the popup");
            alert.accept();
            System.out.println("Alert dismissed successfully.");
        } catch (Exception e) {
            System.out.println("No alert appeared.");
        }

        driver.navigate().refresh();
        Thread.sleep(3000);
    }

    public void resultOFRoleCreate( String confirmationMessage, String errorText ) {
        WebDriverWait wait = new WebDriverWait( driver, Duration.ofSeconds(30));
        WebElement result = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//div[@class='notification-message' and normalize-space(text())='" + confirmationMessage + "']")));

        if (result.isDisplayed()) {
            String actualMessage = result.getText();
            System.out.println("Notification displayed: " + actualMessage);

            String expectedMessage = "Role created successfully!";

            if (actualMessage.equals(expectedMessage)) {
                System.out.println("Success: The expected message is displayed.");
            } else {
                System.out.println("Warning: Message mismatch! Expected: " + expectedMessage + " but found: " + actualMessage);
            }
        } else {
            System.out.println("No notification message displayed.");
        }

        try {
            WebElement error = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//p[@class='error-text' and contains(text(),'" + errorText + "')]")));

//            if (error.isDisplayed()){
//
//            }
            Assert.assertTrue(error.isDisplayed());
            System.out.println(error.getText() + " : This is the error message displayed.");
        } catch (TimeoutException e) {
            Assert.fail("Error message not found: " + errorText);
        }
    }

//    public void conformationNotification( String confirmationMessage){
//        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
//        WebElement notification = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath()));
//
//        if (notification.isDisplayed()) {
//            String actualMessage = notification.getText();
//            System.out.println("Notification displayed: " + actualMessage);
//
//            String expectedMessage = "Role created successfully!";
//
//            if (actualMessage.equals(expectedMessage)) {
//                System.out.println("Success: The expected message is displayed.");
//            } else {
//                System.out.println("Warning: Message mismatch! Expected: " + expectedMessage + " but found: " + actualMessage);
//            }
//        } else {
//            System.out.println("No notification message displayed.");
//        }
//
//    }
//    public void descriptionError(String errorText){
//        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
//        WebElement error = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//p[contains(text(),'" + errorText + "')]")));
//
//        if (error.isDisplayed()){
//            System.out.println(error + " :This is the error message displayed when user enter less than 10 characters");
//        }
//    }

    public void clickDeleteRoleButton() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Click_Delete_Role_Button))).click();
    }

    public void deleteRolePopUp() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement isPopUpAppear = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Delete_Role_PopUp)));

        if (isPopUpAppear.isDisplayed()) {
            System.out.println("Delete role popup is present");
        } else {
            System.out.println("Delete role popup is not present");
        }
    }

    public void listOfRoleFromDeleteDropDown() throws InterruptedException {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement dropDown = wait.until(ExpectedConditions.visibilityOfElementLocated((Delete_Role_Drop_Down)));
        dropDown.click();
        wait.until(ExpectedConditions.presenceOfElementLocated(Delete_Role_Drop_Down));

        delete = new Select(dropDown);

        List<WebElement> options = delete.getOptions();
        System.out.println("Options available in the dropdown:");
        for (WebElement option : options) {
            String listOfElements = option.getText();
            System.out.println(listOfElements);
        }
        driver.navigate().refresh();
        Thread.sleep(2000);
    }


    public void deleteRole(String role) throws InterruptedException {

        try {
            if (role == null || role.isEmpty()) {
                System.out.println("Invalid input: Role cannot be null or empty.");
                return;
            }

            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

            WebElement dropDown = wait.until(ExpectedConditions.visibilityOfElementLocated(Delete_Role_Drop_Down));
            dropDown.click();

            Select select = new Select(dropDown);
            List<WebElement> allOptions = select.getOptions();

            boolean roleExists = allOptions.stream().anyMatch(option -> option.getText().equals(role));

            if (roleExists) {
                select.selectByVisibleText(role);
                System.out.println("Role '" + role + "' selected successfully for deletion.");
                wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Delete_Role_Button))).click();

                try {
                    wait.until(ExpectedConditions.alertIsPresent());
                    Alert alert = driver.switchTo().alert();
                    String alertPopupText = alert.getText();
                    System.out.println(alertPopupText + " : This is the message present in the popup");
                    alert.accept();
                    System.out.println("Alert dismissed successfully.");
                } catch (Exception e) {
                    System.out.println("No alert appeared.");
                }

            } else {
                System.out.println("Error: Role '" + role + "' does not exist in the dropdown.");
                wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Close_Delete_Role_PopUp))).click();
            }

        } catch (NoSuchElementException e) {
            System.out.println("Dropdown element not found: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("Unexpected error occurred: " + e.getMessage());
        }
        Thread.sleep(3000);
    }


    public void checkEmployeeAddPermissionButton() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement addPermission = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Check_Add_Permission_Employee)));

        if (addPermission.isEnabled()){
            System.out.println("Add Permission is enable");
        }
        else {
            System.out.println("Add permission button is disable");
        }
    }

    public void clickEmployeeAddPermissionButton() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Check_Add_Permission_Employee))).click();
    }
    public void addPermissionPopup(){
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement addPermissionPopup = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Add_Permission_PopUp)));

        if (addPermissionPopup.isEnabled()){
            System.out.println("Add Permission is displayed");
        }
        else {
            System.out.println("Add Permission popup is not displayed");
        }
    }

    public void clickSelectPermissionDropdown() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement dropDown = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Click_Select_Permission_DropDown)));
        dropDown.click();

        add = new Select(dropDown);
        List<WebElement> options = add.getOptions();
        System.out.println("Below options are available in the dropdown");
        for (WebElement option : options){
            String listOfPermissions = option.getText();
            System.out.println(listOfPermissions);
        }
    }
        public void selectPermission(String permission) throws InterruptedException {

            try {
                if (permission == null || permission.isEmpty()) {
                    System.out.println("Invalid input: Role cannot be null or empty.");
                    return;
                }
                WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
                WebElement dropDown = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Click_Select_Permission_DropDown)));
                dropDown.click();

                List<WebElement> options = add.getOptions();
                boolean roleExists = options.stream().anyMatch(option -> option.getText().equals(permission));

                if (roleExists) {
                    add.selectByVisibleText(permission);
                    Thread.sleep(2000);
                    System.out.println("permission is selected successfully: " + permission);
                    Thread.sleep(3000);
                    driver.findElement(By.xpath(Click_Add_Permission_Button)).click();
                    try {
                        WebDriverWait wait1 = new WebDriverWait(driver, Duration.ofSeconds(10));
                        wait1.until(ExpectedConditions.alertIsPresent());
                        Alert alert = driver.switchTo().alert();
                        String alertPopupText = alert.getText();
                        System.out.println(alertPopupText + " : This is the message present in the popup");
                        alert.accept();
                        System.out.println("Alert dismissed successfully.");

                       WebDriverWait wait2 = new WebDriverWait(driver, Duration.ofSeconds(10));
                        WebElement roleChanged = wait2.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Add_Permission_Notification)));


                        if (roleChanged.isDisplayed()) {
                            String text = roleChanged.getText();
                            System.out.println(text + " :permission given result notification displayed ");
                        }

                    } catch (Exception e) {
                        System.out.println("No alert appeared.");
                    }

                } else {
                    System.out.println("Error: Role '" + permission + "' does not exist in the dropdown.");
                    wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Close_Add_Permission_Popup))).click();

                }
            } catch (NoSuchElementException e) {
                System.out.println("Dropdown element not found: " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error occurred: " + e.getMessage());
            }

            Thread.sleep(3000);

        }


    public void deletePermissionRole() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Delete_Permission_Role))).click();
    }

    public void removePermission() throws InterruptedException {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement isPresent = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Remove_Permission)));
        if (isPresent.isDisplayed()) {
            isPresent.click();
            System.out.println("Role is created and deleted");
            Thread.sleep(3000);
            driver.navigate().refresh();
        }
    }

    public void clickUserRegistrationModule() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath(User_Registration))).click();
    }

    public void enterNewEmail(String email) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement emailField = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(User_Email_Field)));
        emailField.clear();
        emailField.sendKeys(email);
    }

    public void clickRegistrationButton() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Send_Registration_Link))).click();
    }

    public void linkSentNotification( String notification) {

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        String trimmedNotification = notification.trim();

        WebElement message = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//span[normalize-space(text())='" + trimmedNotification + "']")));

        if (message.isDisplayed()) {
            String successfulMessage = message.getText();
            System.out.println(successfulMessage + " :This message is displayed after sending the registration link ");

        }
    }
}

