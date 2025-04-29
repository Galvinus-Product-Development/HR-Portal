package org.hrportal.pages;

import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;
import java.util.NoSuchElementException;

public class AdminDailyAttendancePage {

    private WebDriver driver;
    private Select select;

   // public static String Attendance_Title = "//h2[text()='Daily Attendance']";
    public static final By  All_Location_DropDown = By.name("location");
    public static final By All_Department_DropDown = By.name("department");
    public static final By All_Status_DropDown = By.name("status");
    public static String Reset_Filters = "//button[text()='Reset Filters']";
    public static String Employee_Name = "name";
    public static String Select_Month = "month";
    public static String Select_year = "year";
    public static String Download_Report = "//button[text()='Download Report']";
    public static String Search_Employee = "//*[@id=\"root\"]/div/div/main/div/div[2]/input";
    public static String All_Status = "//*[@id=\"root\"]/div/div/main/div/div[2]/select";
    public AdminDailyAttendancePage(WebDriver driver) {
        this.driver = driver;
    }


    public void dailyAttendancePageTitle(){
        String pageTitle = driver.getTitle();
        System.out.println(pageTitle);
    }

    public void clickLocationOption(){
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement locationDropDown = wait.until(ExpectedConditions.elementToBeClickable((All_Location_DropDown)));
        locationDropDown.click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(All_Location_DropDown));

        select = new Select(locationDropDown);
        List<WebElement> allLocations = select.getOptions();
        System.out.println("Below are the different location available from the dropdown");

        for (WebElement locations : allLocations){
            System.out.println(locations.getText());
        }
    }
    public void selectLocation(String location){
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement locationDropDown = wait.until(ExpectedConditions.elementToBeClickable((All_Location_DropDown)));
            locationDropDown.click();
            wait.until(ExpectedConditions.visibilityOfElementLocated(All_Location_DropDown));

            select = new Select(locationDropDown);
            select.selectByVisibleText(location);
            System.out.println(location);

        } catch (NoSuchElementException e) {
            System.out.println("Location not found in dropdown: " + location);
        }
    }
    public void locationResult(String result) {
        if (result.equalsIgnoreCase("succeed")) {
            System.out.println("Location is valid");
        } else if (result.equalsIgnoreCase("fail")) {
            System.out.println("Location is Invalid");
        }
    }
    public void getDepartmentNames(){
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement departmentDropDown = wait.until(ExpectedConditions.elementToBeClickable((All_Department_DropDown)));
        departmentDropDown.click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(All_Department_DropDown));

        select = new Select(departmentDropDown);
        List<WebElement> allDepartments = select.getOptions();
        System.out.println("Below are the different department available from the dropdown");

        for (WebElement departments : allDepartments){
            System.out.println(departments.getText());
        }
    }
    public void selectDepartment(String department){
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement departmentDropDown = wait.until(ExpectedConditions.elementToBeClickable((All_Department_DropDown)));
            departmentDropDown.click();
            wait.until(ExpectedConditions.visibilityOfElementLocated(All_Department_DropDown));

            select = new Select(departmentDropDown);
            select.selectByVisibleText(department);

        } catch (NoSuchElementException e) {
            System.out.println("Department not found in dropdown: " + department);

        }
    }
    public void departmentResult(String result) {
        if (result.equalsIgnoreCase("succeed")) {
            System.out.println("Valid Department");
        } else if (result.equalsIgnoreCase("fail")) {
            System.out.println("Invalid Department");
        }
    }
    public void getStatusNames(){
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement statusDropDown = wait.until(ExpectedConditions.elementToBeClickable((All_Status_DropDown)));
        statusDropDown.click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(All_Status_DropDown));

        select = new Select(statusDropDown);
        List<WebElement> allStatus = select.getOptions();
        System.out.println("Below are the different status available from the dropdown");

        for (WebElement status : allStatus){
            System.out.println(status.getText());
        }
    }

    public boolean selectStatus(String status){
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement statusDropDown = wait.until(ExpectedConditions.elementToBeClickable((All_Status_DropDown)));
            statusDropDown.click();
            wait.until(ExpectedConditions.visibilityOfElementLocated(All_Status_DropDown));

            select = new Select(statusDropDown);
            select.selectByVisibleText(status);
            return true;
        } catch (NoSuchElementException e) {
            System.out.println("status not found in dropdown: " + status);
            return false;
        }
    }
    public void statusResult(String result) {
        if (result.equalsIgnoreCase("succeed")) {
            System.out.println("Valid status");
        } else if (result.equalsIgnoreCase("fail")) {
            System.out.println("Invalid status");
        }
    }
    public void resetFilter(){
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement resetFilterButton = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Reset_Filters)));

        if (resetFilterButton.isDisplayed()){
            System.out.println("Reset Button is displayed");
        }
        else {
            System.out.println("Reset button us disabled");
        }
    }
    public void isResetFilterEnable(){
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement isEnable = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Reset_Filters)));

        if (isEnable.isEnabled()){
            System.out.println("Reset button is enable");
        }
        else {
            System.out.println("Reset button is disable");
        }
    }
    public void searchEmployee(String name ){
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.elementToBeClickable(By.name(Employee_Name))).sendKeys(name);
    }
    public void employeeTable(String result){
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement employee = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//td[normalize-space(text())='" + result.trim() + "']")));

        if (employee.isDisplayed()){
            System.out.println("Valid employee");
        }
        else{
            System.out.println("Invalid employee");
        }
    }
    public void selectMonth(String month){
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement monthDropDown = wait.until(ExpectedConditions.elementToBeClickable(By.name(Select_Month)));
            monthDropDown.click();
            wait.until(ExpectedConditions.visibilityOfElementLocated(By.name(Select_Month)));

            select = new Select(monthDropDown);
            select.selectByVisibleText(month);

        } catch (NoSuchElementException e) {
            System.out.println(month + " :Month not found in dropdown");

        }
    }
    public void monthResult(String result){
        if (result.equalsIgnoreCase("Pass")) {
            System.out.println("Valid status");
        } else if (result.equalsIgnoreCase("Fail")) {
            System.out.println("Invalid status");
        }
    }
    public void selectYear(String year){
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement yearDropDown = wait.until(ExpectedConditions.elementToBeClickable(By.name(Select_year)));
            yearDropDown.click();
            wait.until(ExpectedConditions.visibilityOfElementLocated(By.name(Select_year)));

            select = new Select(yearDropDown);
            select.selectByVisibleText(year);

        } catch (NoSuchElementException e) {
            System.out.println(year + " :Month not found in dropdown");

        }

    }
    public void yearResult(String result){
        if (result.equalsIgnoreCase("Pass")) {
            System.out.println("Valid status");
        } else if (result.equalsIgnoreCase("Fail")) {
            System.out.println("Invalid status");
        }

    }
    public void downloadReportButton(){
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement isButtonEnable = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Download_Report)));

        if (isButtonEnable.isEnabled()){
            System.out.println("Download Report button is enable");
        }
        else {
            System.out.println("Download Report button is disable");
        }
    }
    public void employeeSearchBar(String name){
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Search_Employee))).sendKeys(name);

    }
    public void allStatusDropDown(String status){
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement allStatusDropDown = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(All_Status)));
            allStatusDropDown.click();
            wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(All_Status)));

            select = new Select(allStatusDropDown);
            List<WebElement> allStatus = select.getOptions();
            for (WebElement listOFStatus : allStatus){
                System.out.println(listOFStatus.getText() + " :These are the different option present in the dropdown");
            }
            select.selectByVisibleText(status);

        } catch (NoSuchElementException e) {
            System.out.println(status + " :Status not found in dropdown");

        }
    }
}
