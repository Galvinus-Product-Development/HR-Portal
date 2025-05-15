package org.hrportal.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class AdminHomePage {

    private WebDriver driver;


    public AdminHomePage(WebDriver driver) {

        this.driver = driver;
    }

    public static String Admin_DashBoard_Title = "//*[@id=\"root\"]/div/div/main/div/div[1]/h1";
    public static final By Company_Logo = By.cssSelector("#root > div > header > div.unique-navbar-header > img");
    public static String Role_And_Permission = "//*[@id=\"root\"]/div/div/div/nav/div[7]/a";
    public static String Employee_Data_Management = "//*[@id=\"root\"]/div/div/div/nav/div[3]/a";
    public static String Attendance_Module = "//*[@id=\"root\"]/div/div/div/nav/div[2]/div";
    public static String Daily_Attendance = "//a[text()='Daily Attendance ']";
    public static String Attendance_Dashboard = "//a[text()='Attendance Dashboard']";
    public static String Overtime = "//a[text()='Overtime']";
    public static String Leave_Management = "//span[text()='Leave Management']";
    public static String Pending_Leave_Request = "//a[text()='Pending Leave Requests']";
    public static String Leave_History = "//a[text()='Leave History']";
    public static String Leave_Policy = "//a[text()='Leave Policy']";
    public static String Holiday_Module = "//*[@id=\"root\"]/div/div/div/div/nav/div[6]/a";




    public void homePageTitle(){
        WebDriverWait wait =  new WebDriverWait(driver, Duration.ofSeconds(10));
        String Title = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Admin_DashBoard_Title))).getText();
        System.out.println(Title + " This is the title of the Admin home page");
    }
    public void clickRoleAndPermission(){

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Role_And_Permission))).click();

    }
    public void clickEmployeeDataManagement(){
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Employee_Data_Management))).click();
    }
    public void clickAttendanceModule(){
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Attendance_Module))).click();
    }
    public void clickDailyAttendance(){
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Daily_Attendance))).click();
    }
    public void clickAttendanceDashboard(){
        WebDriverWait wait = new WebDriverWait( driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Attendance_Dashboard))).click();
    }
    public void clickOvertime(){
        WebDriverWait wait = new WebDriverWait( driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Overtime))).click();
    }
    public void clickLeaveManagement(){
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Leave_Management))).click();
    }
    public void pendingLeaveRequest(){
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Pending_Leave_Request))).click();
    }
    public void clickLeaveHistory(){
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Leave_History))).click();
    }
    public void clickLeavePolicy(){
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Leave_Policy))).click();
    }
    public void clickHolidayModule(){
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Holiday_Module))).click();
    }



}
