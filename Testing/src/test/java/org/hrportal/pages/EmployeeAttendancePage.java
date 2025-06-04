package org.hrportal.pages;

import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.UnexpectedTagNameException;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.NoSuchElementException;

public class EmployeeAttendancePage {

    private WebDriver driver;
    public static String Attendance_Request_Button = "//button[text()='Attendance Request']";
    public static String Attendance_Request_Popup = "//*[@id=\"root\"]/div/div/main/div/div/div/div/div[3]/div";
    public static String Punch_Out_Button = "//*[@id=\"root\"]/div/div/main/div/div/div/div/div[3]/div/form/div[2]/div/label[2]/input";
    public static String Punch_In_Time = "//*[@id=\"root\"]/div/div/main/div/div/div/div/div[3]/div/form/div[3]/div/input";
    public static String Reason_Text_Field = "//*[@id=\"root\"]/div/div/main/div/div/div/div/div[3]/div/form/div[4]/textarea";
    public static String Submit_Button = "//button[text()='Submit']";
    public static String Calendar_View_Button = "//*[@id=\"root\"]/div/div/main/div/div/div/div/div[4]/div[1]/div[2]/button[1]";
    public static String List_View_Button = "//*[@id=\"root\"]/div/div/main/div/div/div/div/div[4]/div[1]/div[2]/button[2]";

    public static String All_Status_Dropdown = "//*[@id=\"root\"]/div/div/main/div/div/div/div/div[2]/select";



    public EmployeeAttendancePage(WebDriver driver) {

        this.driver = driver;
    }

    public void clickAttendanceRequestButton() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement isButtonEnable = null;


            try {
                isButtonEnable = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Attendance_Request_Button)));
            } catch (TimeoutException e) {
                System.out.println("Timeout: Attendance Request button not visible in time. " + e.getMessage());
                return;
            } catch (NoSuchElementException e) {
                System.out.println("Attendance Request button not found. " + e.getMessage());
                return;
            }


            try {
                if (isButtonEnable.isEnabled()) {
                    System.out.println("Attendance Request button is enabled and clickable.");
                    isButtonEnable.click();
                } else {
                    System.out.println("Attendance Request button is disabled and unclickable.");
                }
            } catch (ElementClickInterceptedException e) {
                System.out.println("Click intercepted: Could not click Attendance Request button. " + e.getMessage());
            } catch (ElementNotInteractableException e) {
                System.out.println("Attendance Request button is not interactable. " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error while clicking Attendance Request button: " + e.getMessage());
            }

        } catch (Exception e) {
            System.out.println("General exception in clickAttendanceRequestButton(): " + e.getMessage());
        }
    }

    public void attendanceRequestPopup() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement isPopupDisplayed = null;


            try {
                isPopupDisplayed = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Attendance_Request_Popup)));
            } catch (TimeoutException e) {
                System.out.println("Timeout: Attendance Request popup not visible in time. " + e.getMessage());
                return;
            } catch (NoSuchElementException e) {
                System.out.println("Attendance Request popup element not found. " + e.getMessage());
                return;
            }


            try {
                if (isPopupDisplayed.isDisplayed()) {
                    System.out.println("Popup is displayed.");
                } else {
                    System.out.println("Popup is not displayed.");
                }
            } catch (Exception e) {
                System.out.println("Error while checking popup display status: " + e.getMessage());
            }

        } catch (Exception e) {
            System.out.println("General exception in attendanceRequestPopup(): " + e.getMessage());
        }
    }

    public void enterPunchInTime(String punchInTime) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement punchInField = null;


            try {
                punchInField = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Punch_In_Time)));
            } catch (TimeoutException e) {
                System.out.println("Timeout: Punch In Time field not clickable in time. " + e.getMessage());
                return;
            } catch (NoSuchElementException e) {
                System.out.println("Punch In Time field not found. " + e.getMessage());
                return;
            }


            try {
                punchInField.clear();
                punchInField.sendKeys(punchInTime);
                System.out.println("Punch In Time entered successfully.");
            } catch (InvalidElementStateException e) {
                System.out.println("Cannot enter text in Punch In Time field. " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error while entering Punch In Time: " + e.getMessage());
            }

        } catch (Exception e) {
            System.out.println("General exception in enterPunchInTime(): " + e.getMessage());
        }
    }

    public void enterReason(String reason) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement reasonField = null;


            try {
                reasonField = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Reason_Text_Field)));
            } catch (TimeoutException e) {
                System.out.println("Timeout: Reason text field not clickable in time. " + e.getMessage());
                return;
            } catch (NoSuchElementException e) {
                System.out.println("Reason text field not found. " + e.getMessage());
                return;
            }


            try {
                reasonField.clear();
                reasonField.sendKeys(reason);
                System.out.println("Reason entered successfully.");
            } catch (InvalidElementStateException e) {
                System.out.println("Cannot enter text in Reason field. " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error while entering Reason: " + e.getMessage());
            }

        } catch (Exception e) {
            System.out.println("General exception in enterReason(): " + e.getMessage());
        }
    }

    public void clickSubmitButton() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement isButtonEnable = null;


            try {
                isButtonEnable = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Submit_Button)));
            } catch (TimeoutException e) {
                System.out.println("Timeout: Submit button not visible in time. " + e.getMessage());
                return;
            } catch (NoSuchElementException e) {
                System.out.println("Submit button not found. " + e.getMessage());
                return;
            }


            try {
                if (isButtonEnable.isEnabled()) {
                    System.out.println("Submit button is enabled and clickable.");
                    isButtonEnable.click();
                } else {
                    System.out.println("Submit button is disabled.");
                    return;
                }
            } catch (ElementClickInterceptedException e) {
                System.out.println("Submit button is not clickable. " + e.getMessage());
                return;
            } catch (Exception e) {
                System.out.println("Unexpected error during click action: " + e.getMessage());
                return;
            }


            try {
                Alert alert = wait.until(ExpectedConditions.alertIsPresent());
                try {
                    String alertText = alert.getText();
                    System.out.println("Alert text: " + alertText);
                } catch (NoAlertPresentException e) {
                    System.out.println("No alert present to get text. " + e.getMessage());
                }

                try {
                    alert.accept();
                    System.out.println("Alert accepted.");
                } catch (Exception e) {
                    System.out.println("Unable to accept alert. " + e.getMessage());
                }

            } catch (TimeoutException e) {
                System.out.println("No alert appeared within the wait time. " + e.getMessage());
            } catch (NoAlertPresentException e) {
                System.out.println("Alert not found. " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error while handling alert: " + e.getMessage());
            }

        } catch (Exception e) {
            System.out.println("General exception in clickSubmitButton(): " + e.getMessage());
        }
    }

    public void clickPunchOutButton() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement punchOutButton = null;


            try {
                punchOutButton = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Punch_Out_Button)));
            } catch (TimeoutException e) {
                System.out.println("Timeout: Punch Out button not clickable in time. " + e.getMessage());
                return;
            } catch (NoSuchElementException e) {
                System.out.println("Punch Out button not found. " + e.getMessage());
                return;
            }


            try {
                punchOutButton.click();
                System.out.println("Punch Out button clicked successfully.");
            } catch (ElementClickInterceptedException e) {
                System.out.println("Punch Out button is not clickable. " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error during click on Punch Out button: " + e.getMessage());
            }

        } catch (Exception e) {
            System.out.println("General exception in clickPunchOutButton(): " + e.getMessage());
        }
    }

    public void checkCalendarViewButton() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement isButtonEnable = null;


            try {
                isButtonEnable = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Calendar_View_Button)));
            } catch (TimeoutException e) {
                System.out.println("Timeout: Calendar View button not visible in time. " + e.getMessage());
                return;
            } catch (NoSuchElementException e) {
                System.out.println("Calendar View button not found. " + e.getMessage());
                return;
            } catch (Exception e) {
                System.out.println("Unexpected error while locating Calendar View button: " + e.getMessage());
                return;
            }


            try {
                if (isButtonEnable.isEnabled()) {
                    System.out.println("Button is enabled and clickable.");
                    isButtonEnable.click();
                } else {
                    System.out.println("Button is disabled and unclickable.");
                }
            } catch (ElementClickInterceptedException e) {
                System.out.println("Click intercepted: " + e.getMessage());
            } catch (ElementNotInteractableException e) {
                System.out.println("Element not interactable: " + e.getMessage());
            } catch (StaleElementReferenceException e) {
                System.out.println("Stale element reference: " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error during click operation: " + e.getMessage());
            }

        } catch (Exception e) {
            System.out.println("General exception in checkCalendarViewButton(): " + e.getMessage());
        }
    }
    public void checkListViewButton() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement isButtonEnable = null;


            try {
                isButtonEnable = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(List_View_Button)));
            } catch (TimeoutException e) {
                System.out.println("Timeout: List View button not visible in time. " + e.getMessage());
                return;
            } catch (NoSuchElementException e) {
                System.out.println("List View button not found. " + e.getMessage());
                return;
            } catch (Exception e) {
                System.out.println("Unexpected error while locating List View button: " + e.getMessage());
                return;
            }


            try {
                if (isButtonEnable.isEnabled()) {
                    System.out.println("List view button is enabled and clickable.");
                    isButtonEnable.click();
                } else {
                    System.out.println("List view button is disabled and unclickable.");
                }
            } catch (ElementClickInterceptedException e) {
                System.out.println("Click on List View button intercepted: " + e.getMessage());
            } catch (ElementNotInteractableException e) {
                System.out.println("List View button is not interactable: " + e.getMessage());
            } catch (StaleElementReferenceException e) {
                System.out.println("List View button is stale: " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error during List View button click: " + e.getMessage());
            }

        } catch (Exception e) {
            System.out.println("General exception in checkListViewButton(): " + e.getMessage());
        }
    }

    public void allStatusDropdown(String status) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement statusDropdown = null;


            try {
                statusDropdown = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(All_Status_Dropdown)));
            } catch (TimeoutException e) {
                System.out.println("Timeout: Status dropdown not clickable in time. " + e.getMessage());
                return;
            } catch (NoSuchElementException e) {
                System.out.println("Status dropdown element not found. " + e.getMessage());
                return;
            } catch (Exception e) {
                System.out.println("Unexpected error while locating status dropdown: " + e.getMessage());
                return;
            }


            try {
                Select select = new Select(statusDropdown);
                select.selectByVisibleText(status);
                System.out.println("Status '" + status + "' selected successfully.");
            } catch (UnexpectedTagNameException e) {
                System.out.println("Element is not a <select> tag: " + e.getMessage());
            } catch (NoSuchElementException e) {
                System.out.println("Status '" + status + "' not found in the dropdown. " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error while selecting status: " + e.getMessage());
            }

        } catch (Exception e) {
            System.out.println("General exception in allStatusDropdown(): " + e.getMessage());
        }
    }










}
