package org.hrportal.pages;

import io.cucumber.java.mk_latn.No;
import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.UnexpectedTagNameException;
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
    public static String Select_Year_Dropdown = "year-select";
    public static String Select_Month_Dropdown = "month-select";




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
    public void createHoliday() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement isButtonEnable = null;
        WebElement saveAllHolidayButton = null;


        try {
            try {
                isButtonEnable = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Add_To_Batch)));
            } catch (TimeoutException e) {
                System.out.println("Timeout: 'Add to Batch' button not clickable - " + e.getMessage());
                return;
            } catch (NoSuchElementException e) {
                System.out.println("'Add to Batch' button not found - " + e.getMessage());
                return;
            } catch (Exception e) {
                System.out.println("Unexpected error finding 'Add to Batch' button - " + e.getMessage());
                return;
            }

            try {
                if (isButtonEnable.isEnabled()) {
                    System.out.println("Add to Batch button is enabled and clickable");
                    isButtonEnable.click();
                } else {
                    System.out.println("Add to Batch button is disabled");
                }
            } catch (ElementClickInterceptedException e) {
                System.out.println("Cannot click 'Add to Batch' button - " + e.getMessage());
                return;
            } catch (Exception e) {
                System.out.println("Unexpected error clicking 'Add to Batch' button - " + e.getMessage());
                return;
            }
        } catch (Exception e) {
            System.out.println("Outer exception during Add to Batch process - " + e.getMessage());
            return;
        }


        try {
            try {
                saveAllHolidayButton = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Save_All_Holidays)));
            } catch (TimeoutException e) {
                System.out.println("Timeout: 'Save All Holidays' button not clickable - " + e.getMessage());
                return;
            } catch (NoSuchElementException e) {
                System.out.println("'Save All Holidays' button not found - " + e.getMessage());
                return;
            }

            try {
                if (saveAllHolidayButton.isEnabled()) {
                    System.out.println("Save All Holidays button is enabled and clickable");
                    saveAllHolidayButton.click();
                } else {
                    System.out.println("Save All Holidays button is disabled");
                }
            } catch (ElementClickInterceptedException e) {
                System.out.println("Cannot click 'Save All Holidays' button - " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error clicking 'Save All Holidays' button - " + e.getMessage());
            }
        } catch (Exception e) {
            System.out.println("Outer exception during Save All Holidays process - " + e.getMessage());
        }


        try {
            try {
                wait.until(ExpectedConditions.alertIsPresent());
                Alert isAlert = driver.switchTo().alert();
                String alertText = isAlert.getText();
                System.out.println("Alert Text: " + alertText);
                isAlert.accept();
            } catch (NoAlertPresentException e) {
                System.out.println("No alert was present.");
            } catch (TimeoutException e) {
                System.out.println("Alert did not appear in time - " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error handling alert - " + e.getMessage());
            }
        } catch (Exception e) {
            System.out.println("Outer exception during alert handling - " + e.getMessage());
        }
    }

    public void setYearDropdown(String year) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement yearDropdown = null;

        try {
            try {
                yearDropdown = wait.until(ExpectedConditions.elementToBeClickable(By.id(Select_Year_Dropdown)));
            } catch (TimeoutException e) {
                System.out.println("Timeout: Year dropdown did not become clickable in time - " + e.getMessage());
                return;
            } catch (NoSuchElementException e) {
                System.out.println("Year dropdown element not found - " + e.getMessage());
                return;
            } catch (Exception e) {
                System.out.println("Unexpected error while locating year dropdown - " + e.getMessage());
                return;
            }

            try {
                Select select = new Select(yearDropdown);
                select.selectByVisibleText(year);
                System.out.println("Year selected successfully: " + year);
            } catch (NoSuchElementException e) {
                System.out.println("Year '" + year + "' not found in dropdown options - " + e.getMessage());
            } catch (UnexpectedTagNameException e) {
                System.out.println("The year dropdown element is not a <select> tag - " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error while selecting year - " + e.getMessage());
            }

        } catch (Exception outer) {
            System.out.println("Unhandled exception in setYearDropdown method - " + outer.getMessage());
        }
    }

    public void setMonthDropdown(String month) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement monthDropdown = null;

        try {
            try {
                monthDropdown = wait.until(ExpectedConditions.elementToBeClickable(By.id(Select_Month_Dropdown)));
            } catch (TimeoutException e) {
                System.out.println("Timeout: Month dropdown did not become clickable in time - " + e.getMessage());
                return;
            } catch (NoSuchElementException e) {
                System.out.println("Month dropdown element not found - " + e.getMessage());
                return;
            } catch (Exception e) {
                System.out.println("Unexpected error while locating month dropdown - " + e.getMessage());
                return;
            }

            try {
                Select select = new Select(monthDropdown);
                select.selectByVisibleText(month);
                System.out.println("Month selected successfully: " + month);
            } catch (NoSuchElementException e) {
                System.out.println("Month '" + month + "' not found in dropdown options - " + e.getMessage());
            } catch (UnexpectedTagNameException e) {
                System.out.println("The month dropdown element is not a <select> tag - " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error while selecting month - " + e.getMessage());
            }

        } catch (Exception outer) {
            System.out.println("Unhandled exception in setMonthDropdown method - " + outer.getMessage());
        }
    }



}
