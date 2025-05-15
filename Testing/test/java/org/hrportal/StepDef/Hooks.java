package org.hrportal.StepDef;

import io.cucumber.java.After;
import io.cucumber.java.Before;
import org.hrportal.utils.ConfigReader;
import org.hrportal.webdriver.DriverChrome;
import org.hrportal.webdriver.DriverManager;
import org.openqa.selenium.WebDriver;

public class Hooks {

    private WebDriver driver;

    @Before
    public void setUp() {
        System.out.println("Launching browser for scenario...");

        String browser = ConfigReader.getProperty("browser");
        String baseUrl = ConfigReader.getProperty("baseUrl");

        driver = DriverChrome.initializeDriver(browser);
        driver.get(baseUrl);

        DriverManager.setDriver(driver);
    }

    @After
    public void tearDown() {
        System.out.println("Closing browser after scenario...");
        DriverManager.quitDriver();
    }
}