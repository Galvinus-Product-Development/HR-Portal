package org.hrportal.webdriver;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;

public class DriverChrome {

    public static WebDriver initializeDriver(String browser) {
        WebDriver driver;

        if (browser.equalsIgnoreCase("chrome")) {
            System.setProperty("webdriver.chrome.driver", "src/test/resources/drivers/chromedriver.exe");
            ChromeOptions options = new ChromeOptions();
            options.addArguments("--start-maximized");
            driver = new ChromeDriver(options);

        } else if (browser.equalsIgnoreCase("firefox")) {
            System.setProperty("webdriver.gecko.driver", "src/test/resources/drivers/geckodriver.exe");
            FirefoxOptions options = new FirefoxOptions();
            options.addArguments("--width=1920");
            options.addArguments("--height=1080");
            driver = new FirefoxDriver(options);

        } else {
            throw new IllegalArgumentException("Unsupported browser: " + browser);
        }

        return driver;
    }
}