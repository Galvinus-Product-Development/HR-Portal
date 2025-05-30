package org.hrportal.pages;

import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class EmployeeRequestLeavePage {

    private final WebDriver driver;

    public Select select;
    public static String Profile_Button = "//*[@id=\"root\"]/div/header/div[2]/div/div[2]/div/img";
    public static String Employee_Dashboard = "//span[text()='Employee Dashboard']";
    public static String Leave_Type = "//*[@id=\"root\"]/div/div/main/div/div[1]/div[1]/div/form/div[1]/select";
    public static String Duration_Dropdown = "//*[@id=\"root\"]/div/div/main/div/div[1]/div[1]/div/form/div[2]/select";
    public static String Start_Date = "//*[@id=\"root\"]/div/div/main/div/div[1]/div[1]/div/form/div[3]/div[1]/input";
    public static String End_Date = "//*[@id=\"root\"]/div/div/main/div/div[1]/div[1]/div/form/div[3]/div[2]/input";
    public static String Upload_File = "//span[text()='Upload a file']";
    public static String Submit_Request = "//button[text()='Submit Request']";
    public static String Reason_Text_Box = "//*[@id=\"root\"]/div/div/main/div/div[1]/div[1]/div/form/div[4]/textarea";
    public static String Success_Notification_Message = "//div[text()='Leave request submitted successfully!']";


    public EmployeeRequestLeavePage(WebDriver driver) {
        this.driver = driver;
    }

    public void clickProfileButton() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        try {
            WebElement profileBtn = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Profile_Button)));
            try {
                profileBtn.click();
                System.out.println("Profile button clicked successfully.");
            } catch (ElementClickInterceptedException e) {
                System.out.println("Error: Profile button was not clickable due to an intercepting element.");
                e.printStackTrace();
            } catch (Exception e) {
                System.out.println("Unexpected error occurred while clicking the Profile button: " + e.getMessage());
                e.printStackTrace();
            }
        } catch (TimeoutException e) {
            System.out.println("Timeout: Profile button not clickable within 10 seconds.");
            e.printStackTrace();
        } catch (NoSuchElementException e) {
            System.out.println("Error: Profile button not found on the page.");
            e.printStackTrace();
        } catch (Exception e) {
            System.out.println("Unexpected error occurred while locating the Profile button: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public void selectEmployeeDashboard() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        try {

            WebElement dashboardElement = wait.until(
                    ExpectedConditions.elementToBeClickable(By.xpath(Employee_Dashboard))
            );

            try {

                dashboardElement.click();
                System.out.println("Employee Dashboard clicked successfully.");
            } catch (ElementClickInterceptedException e) {
                System.out.println("Error: Employee Dashboard element was not clickable due to another overlaying element.");
                e.printStackTrace();
            } catch (Exception e) {
                System.out.println("Unexpected error while clicking Employee Dashboard: " + e.getMessage());
                e.printStackTrace();
            }
        } catch (TimeoutException e) {
            System.out.println("Timeout: Employee Dashboard was not clickable within 10 seconds.");
            e.printStackTrace();
        } catch (NoSuchElementException e) {
            System.out.println("Error: Employee Dashboard element not found.");
            e.printStackTrace();
        } catch (Exception e) {
            System.out.println("Unexpected error while locating Employee Dashboard: " + e.getMessage());
            e.printStackTrace();
        }
    }
    public void selectLeaveType(String leave) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        try {

            WebElement leaveType = wait.until(
                    ExpectedConditions.elementToBeClickable(By.xpath(Leave_Type))
            );

            try {

                leaveType.click();

                try {

                    select = new Select(leaveType);
                    select.selectByVisibleText(leave);
                    System.out.println("Leave type selected successfully: " + leave);
                } catch (NoSuchElementException e) {
                    System.out.println("Error: Leave type option '" + leave + "' not found in the dropdown.");
                    e.printStackTrace();
                } catch (Exception e) {
                    System.out.println("Unexpected error while selecting leave type: " + e.getMessage());
                    e.printStackTrace();
                }

            } catch (ElementClickInterceptedException e) {
                System.out.println("Error: Could not click on Leave Type dropdown due to overlaying element.");
                e.printStackTrace();
            } catch (Exception e) {
                System.out.println("Unexpected error while clicking Leave Type dropdown: " + e.getMessage());
                e.printStackTrace();
            }

        } catch (TimeoutException e) {
            System.out.println("Timeout: Leave Type dropdown was not clickable within 10 seconds.");
            e.printStackTrace();
        } catch (NoSuchElementException e) {
            System.out.println("Error: Leave Type element not found.");
            e.printStackTrace();
        } catch (Exception e) {
            System.out.println("Unexpected error while locating Leave Type element: " + e.getMessage());
            e.printStackTrace();
        }
    }
    public void selectDuration(String duration) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        try {

            WebElement durationDropdown = wait.until(
                    ExpectedConditions.elementToBeClickable(By.xpath(Duration_Dropdown))
            );

            try {

                select = new Select(durationDropdown);
                try {
                    select.selectByVisibleText(duration);
                    System.out.println("Duration selected successfully: " + duration);
                } catch (NoSuchElementException e) {
                    System.out.println("Error: Duration option '" + duration + "' not found in the dropdown.");
                    e.printStackTrace();
                } catch (Exception e) {
                    System.out.println("Unexpected error while selecting duration: " + e.getMessage());
                    e.printStackTrace();
                }

            } catch (Exception e) {
                System.out.println("Error while initializing Select for Duration dropdown: " + e.getMessage());
                e.printStackTrace();
            }

        } catch (TimeoutException e) {
            System.out.println("Timeout: Duration dropdown was not clickable within 10 seconds.");
            e.printStackTrace();
        } catch (NoSuchElementException e) {
            System.out.println("Error: Duration dropdown element not found.");
            e.printStackTrace();
        } catch (Exception e) {
            System.out.println("Unexpected error while locating Duration dropdown: " + e.getMessage());
            e.printStackTrace();
        }
    }
    public void enterDates(String start, String end) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        try {
            WebElement startDateField = null;
            try {
                startDateField = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Start_Date)));
                startDateField.clear();
                startDateField.sendKeys(start);
                System.out.println("Start date entered: " + start);
            } catch (Exception e) {
                System.out.println("Failed to enter Start Date: " + e.getMessage());
                e.printStackTrace();
            }

            WebElement endDateField = null;
            try {
                endDateField = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(End_Date)));
                endDateField.clear();
                endDateField.sendKeys(end);
                System.out.println("End date entered: " + end);
            } catch (Exception e) {
                System.out.println("Failed to enter End Date: " + e.getMessage());
                e.printStackTrace();
            }

        } catch (Exception e) {
            System.out.println("Unexpected error in enterDates method: " + e.getMessage());
            e.printStackTrace();
        }
    }
    public void checkUploadFileButton() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        try {
            WebElement isButtonEnable = null;
            try {
                isButtonEnable = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Upload_File)));
                System.out.println("Upload file button is visible.");
            } catch (Exception e) {
                System.out.println("Failed to locate the Upload File button: " + e.getMessage());
                e.printStackTrace();
            }

            if (isButtonEnable != null) {
                try {
                    if (isButtonEnable.isEnabled()) {
                        System.out.println("Upload file button is enabled.");
                    } else {
                        System.out.println("Upload file button is disabled.");
                    }
                } catch (Exception e) {
                    System.out.println("Error while checking if the Upload File button is enabled: " + e.getMessage());
                    e.printStackTrace();
                }
            }
        } catch (Exception e) {
            System.out.println("Unexpected error in checkUploadFileButton method: " + e.getMessage());
            e.printStackTrace();
        }
    }
    public void checkSubmitRequestButton() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        try {
            WebElement isSubmitRequestEnable = null;

            try {
                isSubmitRequestEnable = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Submit_Request)));
                System.out.println("Submit Request button is visible.");
            } catch (Exception e) {
                System.out.println("Error locating Submit Request button: " + e.getMessage());
                e.printStackTrace();
            }

            if (isSubmitRequestEnable != null) {
                try {
                    if (isSubmitRequestEnable.isEnabled()) {
                        System.out.println("Submit Request button is enabled.");
                    } else {
                        System.out.println("Submit Request button is disabled.");
                    }
                } catch (Exception e) {
                    System.out.println("Error checking Submit Request button status: " + e.getMessage());
                    e.printStackTrace();
                }
            }
        } catch (Exception e) {
            System.out.println("Unexpected error in checkSubmitRequestButton method: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public void enterReason(String reason) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        try {
            WebElement reasonTextBox = null;

            try {
                reasonTextBox = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Reason_Text_Box)));
                System.out.println("Reason text box is visible.");
            } catch (Exception e) {
                System.out.println("Error locating Reason text box: " + e.getMessage());
                e.printStackTrace();
            }

            if (reasonTextBox != null) {
                try {
                    reasonTextBox.clear();
                    reasonTextBox.sendKeys(reason);
                    System.out.println("Entered reason: " + reason);
                } catch (Exception e) {
                    System.out.println("Error entering reason into the text box: " + e.getMessage());
                    e.printStackTrace();
                }
            }

        } catch (Exception e) {
            System.out.println("Unexpected error in enterReason method: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public void clickSubmitRequestButton() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        try {
            WebElement submitButton = null;

            try {
                submitButton = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Submit_Request)));
                System.out.println("Submit Request button is clickable.");
            } catch (Exception e) {
                System.out.println("Error locating or waiting for Submit Request button to be clickable: " + e.getMessage());
                e.printStackTrace();
            }

            if (submitButton != null) {
                try {
                    submitButton.click();
                    System.out.println("Clicked on Submit Request button.");
                } catch (Exception e) {
                    System.out.println("Error clicking Submit Request button: " + e.getMessage());
                    e.printStackTrace();
                }
            }

        } catch (Exception e) {
            System.out.println("Unexpected error in clickSubmitRequestButton method: " + e.getMessage());
            e.printStackTrace();
        }
    }
    public void successNotification() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        try {
            WebElement isNotificationDisplayed = null;

            try {
                isNotificationDisplayed = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Success_Notification_Message)));
                System.out.println("Success notification element located.");
            } catch (Exception e) {
                System.out.println("Error while waiting for success notification to be visible: " + e.getMessage());
                e.printStackTrace();
            }

            if (isNotificationDisplayed != null) {
                try {
                    if (isNotificationDisplayed.isDisplayed()) {
                        System.out.println("Leave request submitted Successfully");
                    } else {
                        System.out.println("Leave request is not sent");
                    }
                } catch (Exception e) {
                    System.out.println("Error while checking visibility of success notification: " + e.getMessage());
                    e.printStackTrace();
                }
            }

        } catch (Exception e) {
            System.out.println("Unexpected error in successNotification method: " + e.getMessage());
            e.printStackTrace();
        }
    }












}
