package org.hrportal.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.File;
import java.time.Duration;
import java.util.List;

public class AdminLeaveManagementPage {

    private final WebDriver driver;
    private Select select;
    public static String All_Status_Dropdown = "//*[@id=\"root\"]/div/div/main/div/div[2]/select";
    public static String Search_Bar = "//*[@id=\"root\"]/div/div/main/div/div[2]/div[1]/input";
    public static String Employee_Not_Found = "//div[text()='No leave history records found for the selected filters.']";
    public static String Month_Dropdown = "//*[@id=\"root\"]/div/div/main/div/div[2]/div[2]/select[1]";
    public static String Status_Dropdown = "//*[@id=\"root\"]/div/div/main/div/div[2]/div[2]/select[2]";
    public static String Upload_Policy = "//button[text()='Upload Policy']";
    public static String Upload_Policy_Popup = "//*[@id=\"root\"]/div/div/main/div/div[3]/div";
    public static String Policy_Name = "name";
    public static String Policy_Type = "//*[@id=\"root\"]/div/div/main/div/div[3]/div/form/div[2]/input";
    public static String Choose_File = "//*[@id=\"root\"]/div/div/main/div/div[3]/div/form/div[3]/input";
    public static String Upload_Button = "//button[text()='Upload']";
    public static String Profile_Button = "//*[@id=\"root\"]/div/header/div[2]/div/div[2]/div[1]/img";
    public static String Employee_Dashboard = "//span[text()='Employee Dashboard']";





    public AdminLeaveManagementPage(WebDriver driver) {
        this.driver = driver;
    }
    public void searchEmployee(String name){
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement isEmployeePresent = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//div[text()='" + name + " ']")));

        if (isEmployeePresent.isDisplayed()){
            System.out.println(isEmployeePresent.getText() + " :Is applied for leave");
        }
        else {
            System.out.println(isEmployeePresent.getText() + " :Is not applied for the leave");
        }
    }
//    public void selectStatusDropdown(){
//        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
//        WebElement dropDown = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(All_Status_Dropdown)));
//        dropDown.click();
//
//        select = new Select(dropDown);
//    }
//    public void allStatusDropdown(String status){
//        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
//        List<WebElement> allStatus = select.getOptions();
//        for (WebElement statuses : allStatus){
//            System.out.println(statuses.getText());
//        }
//        select.selectByVisibleText(status);
//        WebElement isStatusPresent = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//span[text()='" + status + "']")));
//
//        if (isStatusPresent.isDisplayed()){
//            System.out.println( "Status of leave is: " + isStatusPresent.getText());
//        }
//        else {
//            System.out.println(status + " :This Status is not present in the dropdown");
//        }
//    }

    public void clickStatusDropdown() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement dropDown = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(All_Status_Dropdown)));
        dropDown.click();
    }

    public void selectStatusFromDropdown(String status) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        WebElement dropDown = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(All_Status_Dropdown)));
        select = new Select(dropDown);

        List<WebElement> allStatuses = select.getOptions();
        for (WebElement eachStatus : allStatuses) {
            System.out.println("Available Status: " + eachStatus.getText());
        }

         select.selectByVisibleText(status);

        WebElement selectedOption = select.getFirstSelectedOption();
        System.out.println("Selected Status: " + selectedOption.getText());


//        WebElement selectedStatus = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//span[text()='" + status + "']")));
//
//        if (selectedStatus.isDisplayed()) {
//            System.out.println("Selected Status: " + selectedStatus.getText());
//        } else {
//            System.out.println(status + " : This status is not present after selection.");
//        }
    }

        public void enterEmployeeName(String name) {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Search_Bar))).sendKeys(name);

            try {

                WebElement isEmployeeDisplayed = wait.until(ExpectedConditions.visibilityOfElementLocated(
                        By.xpath("//div[text()='" + name + " ']")));
                System.out.println(isEmployeeDisplayed.getText() + " : This employee is present in the table");
            } catch (TimeoutException e) {

                try {
                    WebElement isNotFound = wait.until(ExpectedConditions.visibilityOfElementLocated(
                            By.xpath(Employee_Not_Found)));
                    System.out.println(isNotFound.getText() + " : This employee is not present in the table");
                } catch (TimeoutException ex) {
                    System.out.println("Neither employee nor 'not found' message is present.");
                }
            }
        }
        public void clickMonth(){
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement monthDropdown = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Month_Dropdown)));
            monthDropdown.click();
        }
        public void selectMonth(String month){
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement monthSelection = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Month_Dropdown)));

            select = new Select(monthSelection);
            List<WebElement> availableMonths = select.getOptions();
            for (WebElement singleMonth : availableMonths ){
                System.out.println(singleMonth.getText() + " :These are the available months present in the dropdown");
            }
            select.selectByVisibleText(month);

        }
        public void allStatusDropdown(String status){
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement selectStatus = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Status_Dropdown)));

        select = new Select(selectStatus);
            List<WebElement> allOptions = select.getOptions();
            for (WebElement options : allOptions){
                System.out.println(options.getText() + " :These are the different options present in dropdown");
            }
            select.selectByVisibleText(status);
        }
        public void uploadPolicyButton(){
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement uploadPolicyButton = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Upload_Policy)));

            if (uploadPolicyButton.isEnabled()){
                System.out.println("Upload policy button is visible and enable");
            }
            else {
                System.out.println("Upload policy button is disable");
            }
        }
        public void uploadPolicyPopup(){
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Upload_Policy))).click();

            WebElement isPopupPresent = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Upload_Policy_Popup)));
            if (isPopupPresent.isDisplayed()){
                System.out.println("Upload popup is present ");
            }
            else {
                System.out.println("Upload popup is not present");
            }

        }
        public void fillDetails(String name, String type) throws InterruptedException {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.elementToBeClickable(By.name(Policy_Name))).sendKeys(name);

        wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Policy_Type))).sendKeys(type);


            Thread.sleep(2000);
            File file = new File("src/test/java/org/hrportal/utils/Demo.pdf");
            String absolutePath = file.getAbsolutePath();

            WebElement uploadElement = driver.findElement(By.xpath("//input[@type='file']"));
            uploadElement.sendKeys(absolutePath);
            Thread.sleep(3000);
            wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Upload_Button))).click();
        }
        public void clickUpload(){
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Upload_Button))).click();
        }




}
