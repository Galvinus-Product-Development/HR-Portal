package org.hrportal.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class AdminEmployeeDatabaseMainPage {

    private WebDriver driver;

    private Select select;


    public AdminEmployeeDatabaseMainPage(WebDriver driver) {
        this.driver = driver;
    }
    public static String Employee_Table = "//*[@id=\"root\"]/div/div/main/div/div[3]/table";
    public static final By Search_Employees = By.xpath("//input[@placeholder='Search employees...']");
    public static final By Select_Department = By.xpath("(//select[@class='employee-db-select'])[1]");
    public static final By Select_Location = By.xpath("(//select[@class='employee-db-select'])[2]");
    public static final By Select_Status = By.xpath("(//select[@class='employee-db-select'])[3]");
    public static String Employee = "//*[@id=\"root\"]/div/div/main/div/div[3]/table/tbody/tr/td[1]/div/div/div[1]";
    public static String Select_Employee = "//*[@id=\"root\"]/div/div/main/div/div[3]/table/tbody/tr/td[1]/div/div/div[1]";
    public static String Profile_Icon = "//*[@id=\"root\"]/div/header/div[2]/div/div/img";
    public static String Employee_DashBoard_Button = "//button[text()='Go to Employee Dashboard']";

    public boolean employeeDetailsTable(){
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Employee_Table))).isDisplayed();
    }
    public void numberOfEmployees(){
       String employeeTable = driver.findElement(By.xpath(Employee_Table)).getText();
//        System.out.println(employeeTable);
        String[] lines = employeeTable.split("\\r?\\n");

        System.out.printf("%-20s %-30s %-12s %-15s %-20s %-15s %-10s %-15s\n",
                "EMPLOYEE", "EMAIL", "CONTACT", "DEPARTMENT", "DESIGNATION", "LOCATION", "STATUS", "JOIN DATE");
        System.out.println("-------------------------------------------------------------------------------------------------------------");

        for (int i = 0; i < lines.length; i += 9) {
            if (i + 8 >= lines.length) break; // Prevents IndexOutOfBounds for last incomplete set

            String name = lines[i];
            String id = lines[i + 1]; // not used
            String email = lines[i + 2];
            String contact = lines[i + 3];
            String department = lines[i + 4];
            String designation = lines[i + 5];
            String location = lines[i + 6];
            String status = lines[i + 7];
            String joinDate = lines[i + 8];

            System.out.printf("%-20s %-30s %-12s %-15s %-20s %-15s %-10s %-15s\n",
                    name, email, contact, department, designation, location, status, joinDate);
        }
    }

    public void searchEmployeeField(String name){
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

            WebElement employeeSearch = wait.until(ExpectedConditions.visibilityOfElementLocated(Search_Employees));
            employeeSearch.clear();
            employeeSearch.sendKeys(name);
    }
    public void isEmployeePresent(String searchedName) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        try {
            WebElement result = wait.until(ExpectedConditions.elementToBeClickable(

                    By.xpath("//div[text()='" + searchedName + " ']")));

            if (result.isDisplayed()) {
                System.out.println(searchedName + " : This employee is present in the Employee table.");
            }
        } catch (TimeoutException e) {
            System.out.println("Employee '" + searchedName + "' not found within timeout.");
        } catch (Exception e) {
            System.out.println("An unexpected error occurred while searching: " + e.getMessage());
        }
    }

    public void searchEmployee(String employee, String department, String location, String status){
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement search = wait.until(ExpectedConditions.visibilityOfElementLocated((Search_Employees)));
        search.clear();
        search.sendKeys(employee);

        WebDriverWait wait1 = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement departmentDropdown = wait1.until(ExpectedConditions.visibilityOfElementLocated(Select_Department));
         select = new Select(departmentDropdown);
         select.selectByVisibleText(department);


        WebDriverWait wait2 = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement locationDropdown = wait2.until(ExpectedConditions.visibilityOfElementLocated((Select_Location)));
        select = new Select(locationDropdown);
        select.selectByVisibleText(location);

        WebDriverWait wait3 = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement statusDropdown = wait3.until(ExpectedConditions.visibilityOfElementLocated((Select_Status)));
        select = new Select(statusDropdown);
        select.selectByVisibleText(status);
    }

    public boolean filteredEmployee(){
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Employee))).isDisplayed();
    }
    public void selectEmployee(){
        driver.findElement(By.xpath(Select_Employee)).click();
    }
    public void clickProfileIcon(){
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Profile_Icon))).click();

    }
    public void clickEmployeeDashboardButton(){
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Employee_DashBoard_Button))).click();
    }

}
