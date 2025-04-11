package org.galvinus.webdriver;


import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

public class DriverChrome  {

    public   WebDriver driver;

    public  DriverChrome()
    {

        //   System.setProperty("webdriver.chrome.driver",System.getProperty("user.dir")+"/src/resources/drivers/chromedriver.exe");

        System.setProperty("webdriver.chrome.driver","src/test/resources/drivers/chromedriver.exe");
        this.driver= new ChromeDriver();
    }

    public  WebDriver getDriver() {

        return driver;
    }
}


