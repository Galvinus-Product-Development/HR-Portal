package org.hrportal.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class EmployeeHomePage {

    private WebDriver driver;


    public EmployeeHomePage(WebDriver driver) {

        this.driver = driver;
    }

    public static String Check_In_Button = "//*[@id=\"root\"]/div/div/main/div/div[2]/div[3]/button[1]";

    public boolean checkInButton(){
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Check_In_Button))).isEnabled();
    }


}
