package org.hrportal.pages;

import io.cucumber.java.mk_latn.No;
import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

public class HolidayPage {

    private WebDriver driver;
    private Select select;
    public static String Year_Dropdown = "//*[@id=\"root\"]/div/div/main/div/div[2]/div/div[1]/select";
    public static String No_Holiday_Message = "//td[text()='No holidays found for the selected filters']";
    public static String Month_Dropdown = "//*[@id=\"root\"]/div/div/main/div/div[2]/div/div[2]/select";
    public static String Location_Dropdown = "//*[@id=\"root\"]/div/div/main/div/div[2]/div/div[3]/select";
    public static String Add_Holiday_Button = "//button[contains (@class, 'add-holiday-btn')]";
    public static String Holiday_Name_Text_Box = "//*[@id=\"root\"]/div/div/main/div/div[3]/div[1]/div/div[2]/input";
    public static String Add_To_Batch = "//button[text()='Add to Batch']";
    public static String Save_All_Holidays = "//button[contains (@class, 'save-batch-btn')]";




    public HolidayPage(WebDriver driver) {
        this.driver = driver;
    }
    public void yearDropdown(String year) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement dropDown = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Year_Dropdown)));
        dropDown.click();

        select = new Select(dropDown);
        select.selectByVisibleText(year);


        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        if (year.equals("2025")) {

            List<WebElement> noMessage = driver.findElements(By.xpath(No_Holiday_Message));
            if (noMessage.isEmpty()) {
                System.out.println("Holiday list is displayed for year: " + year);
            } else {
                System.out.println(" Unexpected: No holidays message shown for 2025");
            }
        } else {

            List<WebElement> noHolidayMessage = driver.findElements(By.xpath(No_Holiday_Message));
            if (!noHolidayMessage.isEmpty()) {
                System.out.println(" Negative test passed: No holidays message displayed for year: " + year);
            } else {
                System.out.println(" Test failed: Expected 'no holidays' message for year: " + year);
            }
        }
    }
    public void monthDropdown(String month){
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement dropDown = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Month_Dropdown)));
        dropDown.click();

        select = new Select(dropDown);
        List<WebElement> allMonths = select.getOptions();
        for (WebElement singleMonth : allMonths){
            System.out.println(singleMonth.getText());
        }
        select.selectByVisibleText(month);
        System.out.println("The selected month is: " + month);

    }
    public void fillHolidayDetails(String year, String month, String location, String name ){
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement yearDropdown = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Year_Dropdown)));
        yearDropdown.click();

        select = new Select(yearDropdown);
        select.selectByVisibleText(year);

        WebElement monthDropdown = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Month_Dropdown)));
        monthDropdown.click();

        select = new Select(monthDropdown);
        select.selectByVisibleText(month);

        WebElement locationDropdown = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Location_Dropdown)));
        locationDropdown.click();

        select =new Select(locationDropdown);
        select.selectByVisibleText(location);

        wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Add_Holiday_Button))).click();

        wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Holiday_Name_Text_Box))).sendKeys(name);

        //wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Location_Dropdown)))




    }
    public void createHoliday(){
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));


        wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Add_To_Batch))).click();
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Save_All_Holidays))).click();

        try {

            wait.until(ExpectedConditions.alertIsPresent());

            Alert isAlert = driver.switchTo().alert();
            String alertText = isAlert.getText();
            System.out.println("Alert Text: " + alertText);

            isAlert.accept();
        } catch (NoAlertPresentException e) {
            System.out.println("No alert was present.");
        } catch (TimeoutException e) {
            System.out.println("Alert did not appear within the expected time.");
        }
    }
}
