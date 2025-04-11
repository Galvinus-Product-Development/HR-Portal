package org.hrportal.StepDef;

import io.cucumber.java.After;
import io.cucumber.java.AfterAll;
import io.cucumber.java.Before;
import org.junit.AfterClass;
import org.openqa.selenium.WebDriver;

public class Hooks {

    private static WebDriver driver;

    @Before(order = 1)
    public void setUp() {
        if (driver == null) {
            System.out.println("Initializing WebDriver...");
            driver = new org.galvinus.webdriver.DriverChrome().getDriver();
        }
    }

    @After
    public void tearDown() {
        System.out.println("Scenario completed, but browser remains open for next scenario.");

    }
    @AfterClass
   public static void tearDownAll() {
        if (driver != null) {
            System.out.println("Closing the browser after all scenarios are executed...");
            driver.quit();
            driver = null;
        }
    }


    public static WebDriver getDriver() {
        return driver;
    }
}

