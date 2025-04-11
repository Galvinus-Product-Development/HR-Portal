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

}
