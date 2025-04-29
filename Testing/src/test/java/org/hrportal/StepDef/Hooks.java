package org.hrportal.StepDef;

import io.cucumber.java.After;
import io.cucumber.java.AfterAll;
import io.cucumber.java.Before;
import org.hrportal.webdriver.DriverManager;
import org.junit.AfterClass;
import org.openqa.selenium.WebDriver;
import org.hrportal.webdriver.URLReader;



public class Hooks {

    private static WebDriver driver;

    @Before
    public void setUp() {
        System.out.println("Launching browser for scenario");
        driver = org.galvinus.webdriver.DriverChrome.initializeDriver();
        String baseUrl = URLReader.getBaseUrl();
        driver.get(baseUrl);
        DriverManager.setDriver(driver);
    }

    @After
    public void tearDown() {
        System.out.println("Closing browser after scenario...");
        DriverManager.quitDriver();
    }
}

