package org.hrportal.pages;

import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class EmployeeHomePage {

    private WebDriver driver;

    public static String Date_Field = "date";
    public static String Time_Start_Filed = "startTime";
    public static String End_Time_Field = "endTime";
    public static String Duration_Text_Field = "duration";
    public static String Reason_Text_Filed = "reason";
    public static String Submit_Request_Button = "//*[@id=\"root\"]/div/div/main/div/div[4]/div[1]/form/button";

    public static final By Employee_Name = By.id("name");
    public static String Attendance_Module = "//a[text()='Attendance']";
    public static String Attendance_Tracker = "//a[text()='Attendance Tracker']";

    public static String Leave_Management = "//a[text()='Leave Management']";
    public static String Request_Leave_Module = "//a[text()='Request Leave']";
    public static String Manage_Leaves = "//a[text()='Manage Leaves']";



    public EmployeeHomePage(WebDriver driver) {

        this.driver = driver;
    }

    public static String Check_In_Button = "//*[@id=\"root\"]/div/div/main/div/div[2]/div[3]/button[1]";

    public boolean checkInButton(){
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Check_In_Button))).isEnabled();
    }

    public void enterDate(String date) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement dateField = null;


            try {
                dateField = wait.until(ExpectedConditions.elementToBeClickable(By.id(Date_Field)));
            } catch (TimeoutException e) {
                System.out.println("Timeout: Date field not clickable in time. " + e.getMessage());
                return;
            } catch (NoSuchElementException e) {
                System.out.println("Date field not found. " + e.getMessage());
                return;
            }


            try {
                dateField.clear();
                dateField.sendKeys(date);
                System.out.println("Date entered successfully: " + date);
            } catch (ElementNotInteractableException e) {
                System.out.println("Date field is not interactable. " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error while entering date: " + e.getMessage());
            }

        } catch (Exception e) {
            System.out.println("General exception in enterDate(): " + e.getMessage());
        }
    }

    public void enterStartTime(String startTime) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement startTimeField = null;


            try {
                startTimeField = wait.until(ExpectedConditions.elementToBeClickable(By.id(Time_Start_Filed)));
            } catch (TimeoutException e) {
                System.out.println("Timeout: Start time field not clickable in time. " + e.getMessage());
                return;
            } catch (NoSuchElementException e) {
                System.out.println("Start time field not found. " + e.getMessage());
                return;
            }


            try {
                startTimeField.clear();
                startTimeField.sendKeys(startTime);
                System.out.println("Start time entered successfully: " + startTime);
            } catch (ElementNotInteractableException e) {
                System.out.println("Start time field is not interactable. " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error while entering start time: " + e.getMessage());
            }

        } catch (Exception e) {
            System.out.println("General exception in enterStartTime(): " + e.getMessage());
        }
    }

    public void enterEndTime(String endTime) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement endTimeField = null;


            try {
                endTimeField = wait.until(ExpectedConditions.elementToBeClickable(By.id(End_Time_Field)));
            } catch (TimeoutException e) {
                System.out.println("Timeout: End time field not clickable in time. " + e.getMessage());
                return;
            } catch (NoSuchElementException e) {
                System.out.println("End time field not found. " + e.getMessage());
                return;
            }


            try {
                endTimeField.clear();
                endTimeField.sendKeys(endTime);
                System.out.println("End time entered successfully: " + endTime);
            } catch (ElementNotInteractableException e) {
                System.out.println("End time field is not interactable. " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error while entering end time: " + e.getMessage());
            }

        } catch (Exception e) {
            System.out.println("General exception in enterEndTime(): " + e.getMessage());
        }
    }

    public void enterOvertimeDuration(String duration) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement durationField = null;


            try {
                durationField = wait.until(ExpectedConditions.elementToBeClickable(By.id(Duration_Text_Field)));
            } catch (TimeoutException e) {
                System.out.println("Timeout: Duration field not clickable in time. " + e.getMessage());
                return;
            } catch (NoSuchElementException e) {
                System.out.println("Duration field not found. " + e.getMessage());
                return;
            }


            try {
                durationField.clear();
                durationField.sendKeys(duration);
                System.out.println("Overtime duration entered successfully: " + duration);
            } catch (ElementNotInteractableException e) {
                System.out.println("Duration field is not interactable. " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error while entering duration: " + e.getMessage());
            }

        } catch (Exception e) {
            System.out.println("General exception in enterOvertimeDuration(): " + e.getMessage());
        }
    }

    public void enterReason(String reason) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement reasonField = null;


            try {
                reasonField = wait.until(ExpectedConditions.elementToBeClickable(By.id(Reason_Text_Filed)));
            } catch (TimeoutException e) {
                System.out.println("Timeout: Reason field not clickable in time. " + e.getMessage());
                return;
            } catch (NoSuchElementException e) {
                System.out.println("Reason field not found. " + e.getMessage());
                return;
            }


            try {
                reasonField.clear();
                reasonField.sendKeys(reason);
                System.out.println("Reason entered successfully: " + reason);
            } catch (ElementNotInteractableException e) {
                System.out.println("Reason field is not interactable. " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error while entering reason: " + e.getMessage());
            }

        } catch (Exception e) {
            System.out.println("General exception in enterReason(): " + e.getMessage());
        }
    }

    public void clickSubmitRequest() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement submitButton = null;


            try {
                submitButton = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Submit_Request_Button)));
            } catch (TimeoutException e) {
                System.out.println("Timeout: Submit Request button not clickable in time. " + e.getMessage());
                return;
            } catch (NoSuchElementException e) {
                System.out.println("Submit Request button not found. " + e.getMessage());
                return;
            }


            try {
                submitButton.click();
                System.out.println("Submit Request button clicked successfully.");
            } catch (ElementClickInterceptedException e) {
                System.out.println("Element intercepted, could not click Submit Request. " + e.getMessage());
            } catch (ElementNotInteractableException e) {
                System.out.println("Submit Request button is not interactable. " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error while clicking Submit Request: " + e.getMessage());
            }

        } catch (Exception e) {
            System.out.println("General exception in clickSubmitRequest(): " + e.getMessage());
        }
    }

    public void clickAttendanceModule() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement attendanceModule = null;


            try {
                attendanceModule = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Attendance_Module)));
            } catch (TimeoutException e) {
                System.out.println("Timeout: Attendance module not clickable in time. " + e.getMessage());
                return;
            } catch (NoSuchElementException e) {
                System.out.println("Attendance module element not found. " + e.getMessage());
                return;
            }


            try {
                attendanceModule.click();
                System.out.println("Attendance module clicked successfully.");
            } catch (ElementClickInterceptedException e) {
                System.out.println("Element click intercepted. Could not click Attendance module. " + e.getMessage());
            } catch (ElementNotInteractableException e) {
                System.out.println("Attendance module element is not interactable. " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error while clicking Attendance module: " + e.getMessage());
            }

        } catch (Exception e) {
            System.out.println("General exception in clickAttendanceModule(): " + e.getMessage());
        }
    }
    public void clickAttendanceTracker() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement attendanceTracker = null;


            try {
                attendanceTracker = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Attendance_Tracker)));
            } catch (TimeoutException e) {
                System.out.println("Timeout: Attendance Tracker not clickable in time. " + e.getMessage());
                return;
            } catch (NoSuchElementException e) {
                System.out.println("Attendance Tracker element not found. " + e.getMessage());
                return;
            }


            try {
                attendanceTracker.click();
                System.out.println("Attendance Tracker clicked successfully.");
            } catch (ElementClickInterceptedException e) {
                System.out.println("Click intercepted: Could not click Attendance Tracker. " + e.getMessage());
            } catch (ElementNotInteractableException e) {
                System.out.println("Attendance Tracker is not interactable. " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error while clicking Attendance Tracker: " + e.getMessage());
            }

        } catch (Exception e) {
            System.out.println("General exception in clickAttendanceTracker(): " + e.getMessage());
        }
    }


    public void clickLeaveManagementModule() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        try {

            WebElement leaveManagementElement = wait.until(
                    ExpectedConditions.elementToBeClickable(By.xpath(Leave_Management))
            );

            try {

                leaveManagementElement.click();
                System.out.println("Leave Management module clicked successfully.");
            } catch (ElementClickInterceptedException e) {
                System.out.println("Error: Unable to click Leave Management module due to an overlapping element.");
                e.printStackTrace();
            } catch (Exception e) {
                System.out.println("Unexpected error while clicking Leave Management module: " + e.getMessage());
                e.printStackTrace();
            }
        } catch (TimeoutException e) {
            System.out.println("Timeout: Leave Management module not clickable within 10 seconds.");
            e.printStackTrace();
        } catch (NoSuchElementException e) {
            System.out.println("Error: Leave Management module element not found.");
            e.printStackTrace();
        } catch (Exception e) {
            System.out.println("Unexpected error while locating Leave Management module: " + e.getMessage());
            e.printStackTrace();
        }
    }
    public void clickRequestLeaveOption() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        try {

            WebElement requestLeaveElement = wait.until(
                    ExpectedConditions.elementToBeClickable(By.xpath(Request_Leave_Module))
            );

            try {

                requestLeaveElement.click();
                System.out.println("Request Leave option clicked successfully.");
            } catch (ElementClickInterceptedException e) {
                System.out.println("Error: Request Leave option could not be clicked due to an overlaying element.");
                e.printStackTrace();
            } catch (Exception e) {
                System.out.println("Unexpected error while clicking Request Leave option: " + e.getMessage());
                e.printStackTrace();
            }

        } catch (TimeoutException e) {
            System.out.println("Timeout: Request Leave option was not clickable within 10 seconds.");
            e.printStackTrace();
        } catch (NoSuchElementException e) {
            System.out.println("Error: Request Leave option not found on the page.");
            e.printStackTrace();
        } catch (Exception e) {
            System.out.println("Unexpected error while locating Request Leave option: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public void selectManageLeaves() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement manageLeavesButton = null;

        try {
            try {
                manageLeavesButton = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Manage_Leaves)));
                System.out.println("Manage Leaves button is clickable.");
            } catch (Exception e) {
                System.out.println("Error while waiting for Manage Leaves button to be clickable: " + e.getMessage());
                e.printStackTrace();
            }

            if (manageLeavesButton != null) {
                try {
                    manageLeavesButton.click();
                    System.out.println("Clicked on Manage Leaves button.");
                } catch (Exception e) {
                    System.out.println("Error while clicking on Manage Leaves button: " + e.getMessage());
                    e.printStackTrace();
                }
            } else {
                System.out.println("Manage Leaves button was not found or not clickable.");
            }

        } catch (Exception e) {
            System.out.println("Unexpected error in selectManageLeaves method: " + e.getMessage());
            e.printStackTrace();
        }
    }






}
