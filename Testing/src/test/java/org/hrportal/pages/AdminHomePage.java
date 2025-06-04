package org.hrportal.pages;

import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.NoSuchElementException;

public class AdminHomePage {

    private WebDriver driver;


    public AdminHomePage(WebDriver driver) {

        this.driver = driver;
    }

    public static String Customize_Dashboard = "//*[@id=\"root\"]/div/div/main/div/div[1]/div[2]/button";
    public static String Add_New_Group = "//*[@id=\"root\"]/div/div/main/div/div[2]/div[1]/button";
    public static String Add_New_Group_Popup = "//*[@id=\"root\"]/div/div/main/div/div[5]/div/div";
    public static String Group_Name_Text_Box = "groupName";
    public static String Add_Group_Button = "//button[text()='Create Group']";
    public static String Title_Text_Field = "title";
    public static String Message_Text_Field = "message";
    public static String Priority_Dropdown = "priority";
    public static String Department_Dropdown = "department";
    public static String Select_All_Button = "//button[text()='Select All']";
    public static String Select_Check_Box = "//*[@id=\"root\"]/div/div/main/div/div[3]/div/div[2]/div[2]/div[2]/div[2]/div[1]/input";
    public static String Send_Notification_Button = "//button[text()='Send Notification']";
    public static String Delete_Button = "//*[@id=\"root\"]/div/div/main/div/div[2]/div/div/div[1]/div/div/button[2]";
    public static String Edit_Button = "//*[@id=\"root\"]/div/div/main/div/div[2]/div/div/div[1]/div/div/button[1]";
    public static String Admin_DashBoard_Title = "//*[@id=\"root\"]/div/div/main/div/div[1]/h1";
    public static final By Company_Logo = By.cssSelector("#root > div > header > div.unique-navbar-header > img");
    public static String Role_And_Permission = "//*[@id=\"root\"]/div/div/div/nav/div[7]/a";
    public static String Employee_Data_Management = "//*[@id=\"root\"]/div/div/div/div/nav/div[3]/a";
    public static String Attendance_Module = "//*[@id=\"root\"]/div/div/div/div/nav/div[2]/div";
    public static String Daily_Attendance = "//a[text()='Daily Attendance ']";
    public static String Attendance_Dashboard = "//a[text()='Attendance Dashboard']";
    public static String Overtime = "//a[text()='Overtime']";
    public static String Attendance_Request = "//a[text()='Attendance Request']";
    public static String Leave_Management = "//span[text()='Leave Management']";
    public static String Pending_Leave_Request = "//a[text()='Pending Leave Requests']";
    public static String Leave_History = "//a[text()='Leave History']";
    public static String Leave_Policy = "//a[text()='Leave Policy']";
    public static String Holiday_Module = "//a[text()='Holiday']";




    public void homePageTitle(){
        WebDriverWait wait =  new WebDriverWait(driver, Duration.ofSeconds(10));
        String Title = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Admin_DashBoard_Title))).getText();
        System.out.println(Title + " This is the title of the Admin home page");
    }
    public void clickRoleAndPermission() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement roleAndPermissionElement = wait.until(
                    ExpectedConditions.elementToBeClickable(By.xpath(Role_And_Permission))
            );
            roleAndPermissionElement.click();
            System.out.println("Clicked on the 'Role and Permission' element successfully.");

        } catch (TimeoutException e) {
            System.out.println("Timed out waiting for the 'Role and Permission' element to be clickable: " + e.getMessage());

        } catch (NoSuchElementException e) {
            System.out.println("'Role and Permission' element was not found: " + e.getMessage());

        } catch (ElementClickInterceptedException e) {
            System.out.println("Click on 'Role and Permission' element was intercepted: " + e.getMessage());

        } catch (ElementNotInteractableException e) {
            System.out.println("'Role and Permission' element is not interactable: " + e.getMessage());

        } catch (StaleElementReferenceException e) {
            System.out.println("'Role and Permission' element is no longer attached to the DOM: " + e.getMessage());

        } catch (InvalidSelectorException e) {
            System.out.println("Invalid XPath selector for 'Role and Permission' element: " + e.getMessage());

        } catch (Exception e) {
            System.out.println("An unexpected error occurred while clicking on 'Role and Permission': " + e.getMessage());
        }
    }
    public void clickEmployeeDataManagement() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement employeeDataElement = wait.until(
                    ExpectedConditions.elementToBeClickable(By.xpath(Employee_Data_Management))
            );
            employeeDataElement.click();
            System.out.println("Clicked on the 'Employee Data Management' element successfully.");

        } catch (TimeoutException e) {
            System.out.println("Timed out waiting for 'Employee Data Management' element to be clickable: " + e.getMessage());

        } catch (NoSuchElementException e) {
            System.out.println("'Employee Data Management' element was not found: " + e.getMessage());

        } catch (ElementClickInterceptedException e) {
            System.out.println("Click on 'Employee Data Management' was intercepted by another element: " + e.getMessage());

        } catch (ElementNotInteractableException e) {
            System.out.println("'Employee Data Management' element is not interactable: " + e.getMessage());

        } catch (StaleElementReferenceException e) {
            System.out.println("'Employee Data Management' element is no longer attached to the DOM: " + e.getMessage());

        } catch (InvalidSelectorException e) {
            System.out.println("Invalid XPath selector for 'Employee Data Management' element: " + e.getMessage());

        } catch (Exception e) {
            System.out.println("An unexpected error occurred while clicking on 'Employee Data Management': " + e.getMessage());
        }
    }

    public void clickAttendanceModule() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement attendanceModuleElement = wait.until(
                    ExpectedConditions.elementToBeClickable(By.xpath(Attendance_Module))
            );
            attendanceModuleElement.click();
            System.out.println("Clicked on the 'Attendance Module' successfully.");

        } catch (TimeoutException e) {
            System.out.println("Timed out waiting for 'Attendance Module' to be clickable: " + e.getMessage());

        } catch (NoSuchElementException e) {
            System.out.println("'Attendance Module' element was not found: " + e.getMessage());

        } catch (ElementClickInterceptedException e) {
            System.out.println("Click on 'Attendance Module' was intercepted: " + e.getMessage());

        } catch (ElementNotInteractableException e) {
            System.out.println("'Attendance Module' element is not interactable: " + e.getMessage());

        } catch (StaleElementReferenceException e) {
            System.out.println("'Attendance Module' element is no longer attached to the DOM: " + e.getMessage());

        } catch (InvalidSelectorException e) {
            System.out.println("Invalid XPath selector for 'Attendance Module': " + e.getMessage());

        } catch (Exception e) {
            System.out.println("An unexpected error occurred while clicking 'Attendance Module': " + e.getMessage());
        }
    }

    public void clickDailyAttendance() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement dailyAttendanceElement = wait.until(
                    ExpectedConditions.elementToBeClickable(By.xpath(Daily_Attendance))
            );
            dailyAttendanceElement.click();
            System.out.println("Clicked on the 'Daily Attendance' successfully.");

        } catch (TimeoutException e) {
            System.out.println("Timed out waiting for 'Daily Attendance' to be clickable: " + e.getMessage());

        } catch (NoSuchElementException e) {
            System.out.println("'Daily Attendance' element was not found: " + e.getMessage());

        } catch (ElementClickInterceptedException e) {
            System.out.println("Click on 'Daily Attendance' was intercepted by another element: " + e.getMessage());

        } catch (ElementNotInteractableException e) {
            System.out.println("'Daily Attendance' element is not interactable: " + e.getMessage());

        } catch (StaleElementReferenceException e) {
            System.out.println("'Daily Attendance' element is no longer attached to the DOM: " + e.getMessage());

        } catch (InvalidSelectorException e) {
            System.out.println("Invalid XPath selector for 'Daily Attendance': " + e.getMessage());

        } catch (Exception e) {
            System.out.println("An unexpected error occurred while clicking 'Daily Attendance': " + e.getMessage());
        }
    }

    public void clickAttendanceDashboard() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement attendanceDashboardElement = wait.until(
                    ExpectedConditions.elementToBeClickable(By.xpath(Attendance_Dashboard))
            );
            attendanceDashboardElement.click();
            System.out.println("Clicked on the 'Attendance Dashboard' successfully.");

        } catch (TimeoutException e) {
            System.out.println("Timed out waiting for 'Attendance Dashboard' to be clickable: " + e.getMessage());

        } catch (NoSuchElementException e) {
            System.out.println("'Attendance Dashboard' element was not found: " + e.getMessage());

        } catch (ElementClickInterceptedException e) {
            System.out.println("Click on 'Attendance Dashboard' was intercepted by another element: " + e.getMessage());

        } catch (ElementNotInteractableException e) {
            System.out.println("'Attendance Dashboard' element is not interactable: " + e.getMessage());

        } catch (StaleElementReferenceException e) {
            System.out.println("'Attendance Dashboard' element is no longer attached to the DOM: " + e.getMessage());

        } catch (InvalidSelectorException e) {
            System.out.println("Invalid XPath selector for 'Attendance Dashboard': " + e.getMessage());

        } catch (Exception e) {
            System.out.println("An unexpected error occurred while clicking 'Attendance Dashboard': " + e.getMessage());
        }
    }

    public void clickOvertime() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement overtimeElement = wait.until(
                    ExpectedConditions.elementToBeClickable(By.xpath(Overtime))
            );
            overtimeElement.click();
            System.out.println("Clicked on the 'Overtime' module successfully.");

        } catch (TimeoutException e) {
            System.out.println("Timed out waiting for 'Overtime' element to be clickable: " + e.getMessage());

        } catch (NoSuchElementException e) {
            System.out.println("'Overtime' element was not found: " + e.getMessage());

        } catch (ElementClickInterceptedException e) {
            System.out.println("Click on 'Overtime' element was intercepted: " + e.getMessage());

        } catch (ElementNotInteractableException e) {
            System.out.println("'Overtime' element is not interactable: " + e.getMessage());

        } catch (StaleElementReferenceException e) {
            System.out.println("'Overtime' element is no longer attached to the DOM: " + e.getMessage());

        } catch (InvalidSelectorException e) {
            System.out.println("Invalid XPath selector for 'Overtime' element: " + e.getMessage());

        } catch (Exception e) {
            System.out.println("An unexpected error occurred while clicking 'Overtime': " + e.getMessage());
        }
    }
    public void clickAttendanceRequest() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement attendanceRequestButton = null;

        try {
            try {
                attendanceRequestButton = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Attendance_Request)));
                System.out.println("Attendance Request button is clickable.");
            } catch (Exception e) {
                System.out.println("Error locating or waiting for the Attendance Request button: " + e.getMessage());
                e.printStackTrace();
            }

            try {
                if (attendanceRequestButton != null) {
                    attendanceRequestButton.click();
                    System.out.println("Clicked on Attendance Request button.");
                } else {
                    System.out.println("Attendance Request button is not available to click.");
                }
            } catch (Exception e) {
                System.out.println("Error clicking the Attendance Request button: " + e.getMessage());
                e.printStackTrace();
            }

        } catch (Exception e) {
            System.out.println("Unexpected error in clickAttendanceRequest method: " + e.getMessage());
            e.printStackTrace();
        }
    }


    public void clickLeaveManagement() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement leaveManagementElement = wait.until(
                    ExpectedConditions.elementToBeClickable(By.xpath(Leave_Management))
            );
            leaveManagementElement.click();
            System.out.println("Clicked on the 'Leave Management' module successfully.");

        } catch (TimeoutException e) {
            System.out.println("Timed out waiting for 'Leave Management' to be clickable: " + e.getMessage());

        } catch (NoSuchElementException e) {
            System.out.println("'Leave Management' element was not found: " + e.getMessage());

        } catch (ElementClickInterceptedException e) {
            System.out.println("Click on 'Leave Management' was intercepted by another element: " + e.getMessage());

        } catch (ElementNotInteractableException e) {
            System.out.println("'Leave Management' element is not interactable: " + e.getMessage());

        } catch (StaleElementReferenceException e) {
            System.out.println("'Leave Management' element is no longer attached to the DOM: " + e.getMessage());

        } catch (InvalidSelectorException e) {
            System.out.println("Invalid XPath selector for 'Leave Management': " + e.getMessage());

        } catch (Exception e) {
            System.out.println("An unexpected error occurred while clicking 'Leave Management': " + e.getMessage());
        }
    }

    public void pendingLeaveRequest() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement pendingLeaveElement = wait.until(
                    ExpectedConditions.elementToBeClickable(By.xpath(Pending_Leave_Request))
            );
            pendingLeaveElement.click();
            System.out.println("Clicked on the 'Pending Leave Request' successfully.");

        } catch (TimeoutException e) {
            System.out.println("Timed out waiting for 'Pending Leave Request' to be clickable: " + e.getMessage());

        } catch (NoSuchElementException e) {
            System.out.println("'Pending Leave Request' element was not found: " + e.getMessage());

        } catch (ElementClickInterceptedException e) {
            System.out.println("Click on 'Pending Leave Request' was intercepted by another element: " + e.getMessage());

        } catch (ElementNotInteractableException e) {
            System.out.println("'Pending Leave Request' element is not interactable: " + e.getMessage());

        } catch (StaleElementReferenceException e) {
            System.out.println("'Pending Leave Request' element is no longer attached to the DOM: " + e.getMessage());

        } catch (InvalidSelectorException e) {
            System.out.println("Invalid XPath selector for 'Pending Leave Request': " + e.getMessage());

        } catch (Exception e) {
            System.out.println("An unexpected error occurred while clicking 'Pending Leave Request': " + e.getMessage());
        }
    }

    public void clickLeaveHistory() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement leaveHistoryElement = wait.until(
                    ExpectedConditions.elementToBeClickable(By.xpath(Leave_History))
            );
            leaveHistoryElement.click();
            System.out.println("Clicked on the 'Leave History' module successfully.");

        } catch (TimeoutException e) {
            System.out.println("Timed out waiting for 'Leave History' to be clickable: " + e.getMessage());

        } catch (NoSuchElementException e) {
            System.out.println("'Leave History' element was not found: " + e.getMessage());

        } catch (ElementClickInterceptedException e) {
            System.out.println("Click on 'Leave History' was intercepted by another element: " + e.getMessage());

        } catch (ElementNotInteractableException e) {
            System.out.println("'Leave History' element is not interactable: " + e.getMessage());

        } catch (StaleElementReferenceException e) {
            System.out.println("'Leave History' element is no longer attached to the DOM: " + e.getMessage());

        } catch (InvalidSelectorException e) {
            System.out.println("Invalid XPath selector for 'Leave History': " + e.getMessage());

        } catch (Exception e) {
            System.out.println("An unexpected error occurred while clicking 'Leave History': " + e.getMessage());
        }
    }

    public void clickLeavePolicy() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement leavePolicyElement = wait.until(
                    ExpectedConditions.elementToBeClickable(By.xpath(Leave_Policy))
            );
            leavePolicyElement.click();
            System.out.println("Clicked on the 'Leave Policy' module successfully.");

        } catch (TimeoutException e) {
            System.out.println("Timed out waiting for 'Leave Policy' to be clickable: " + e.getMessage());

        } catch (NoSuchElementException e) {
            System.out.println("'Leave Policy' element was not found: " + e.getMessage());

        } catch (ElementClickInterceptedException e) {
            System.out.println("Click on 'Leave Policy' was intercepted by another element: " + e.getMessage());

        } catch (ElementNotInteractableException e) {
            System.out.println("'Leave Policy' element is not interactable: " + e.getMessage());

        } catch (StaleElementReferenceException e) {
            System.out.println("'Leave Policy' element is no longer attached to the DOM: " + e.getMessage());

        } catch (InvalidSelectorException e) {
            System.out.println("Invalid XPath selector for 'Leave Policy': " + e.getMessage());

        } catch (Exception e) {
            System.out.println("An unexpected error occurred while clicking 'Leave Policy': " + e.getMessage());
        }
    }

    public void clickHolidayModule() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement holidayModuleElement = wait.until(
                    ExpectedConditions.elementToBeClickable(By.xpath(Holiday_Module))
            );
            holidayModuleElement.click();
            System.out.println("Clicked on the 'Holiday Module' successfully.");

        } catch (TimeoutException e) {
            System.out.println("Timed out waiting for 'Holiday Module' to be clickable: " + e.getMessage());

        } catch (NoSuchElementException e) {
            System.out.println("'Holiday Module' element was not found: " + e.getMessage());

        } catch (ElementClickInterceptedException e) {
            System.out.println("Click on 'Holiday Module' was intercepted by another element: " + e.getMessage());

        } catch (ElementNotInteractableException e) {
            System.out.println("'Holiday Module' element is not interactable: " + e.getMessage());

        } catch (StaleElementReferenceException e) {
            System.out.println("'Holiday Module' element is no longer attached to the DOM: " + e.getMessage());

        } catch (InvalidSelectorException e) {
            System.out.println("Invalid XPath selector for 'Holiday Module': " + e.getMessage());

        } catch (Exception e) {
            System.out.println("An unexpected error occurred while clicking 'Holiday Module': " + e.getMessage());
        }
    }

    public void clickCustomizeDashboard() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement isEnable = null;

            try {
                isEnable = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Customize_Dashboard)));
            } catch (TimeoutException e) {
                System.out.println("Element not visible within the timeout period: " + e.getMessage());
                return;
            } catch (NoSuchElementException e) {
                System.out.println("Customize Dashboard element not found: " + e.getMessage());
                return;
            }

            try {
                if (isEnable.isEnabled()) {
                    System.out.println("Customize Dashboard is enabled");
                    isEnable.click();
                } else {
                    System.out.println("Customize Dashboard is disabled");
                }
            } catch (ElementClickInterceptedException e) {
                System.out.println("Unable to click on Customize Dashboard: " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error while clicking Customize Dashboard: " + e.getMessage());
            }

        } catch (Exception e) {
            System.out.println("General exception in clickCustomizeDashboard(): " + e.getMessage());
        }
    }

    public void clickAddNewGroup() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement isEnable = null;


            try {
                isEnable = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Add_New_Group)));
            } catch (TimeoutException e) {
                System.out.println("Timeout: 'Add New Group' element not visible in time. " + e.getMessage());
                return;
            } catch (NoSuchElementException e) {
                System.out.println("Element 'Add New Group' not found. " + e.getMessage());
                return;
            }


            try {
                if (isEnable.isEnabled()) {
                    System.out.println("Add New Group is enabled.");
                    isEnable.click();
                } else {
                    System.out.println("Add New Group is disabled.");
                }
            } catch (ElementClickInterceptedException e) {
                System.out.println("Element click intercepted for 'Add New Group': " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error while clicking 'Add New Group': " + e.getMessage());
            }

        } catch (Exception e) {
            System.out.println("General exception in clickAddNewGroup(): " + e.getMessage());
        }
    }

    public void addNewCardPopup() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement isPopupPresent = null;


            try {
                isPopupPresent = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Add_New_Group_Popup)));
            } catch (TimeoutException e) {
                System.out.println("Timeout: Add New Card popup did not appear in time. " + e.getMessage());
                return;
            } catch (NoSuchElementException e) {
                System.out.println("Element for Add New Card popup not found. " + e.getMessage());
                return;
            }


            try {
                if (isPopupPresent.isDisplayed()) {
                    System.out.println("Add New Card popup is displayed.");
                } else {
                    System.out.println("Add New Card popup is not displayed.");
                }
            } catch (Exception e) {
                System.out.println("Error checking if Add New Card popup is displayed: " + e.getMessage());
            }

        } catch (Exception e) {
            System.out.println("General exception in addNewCardPopup(): " + e.getMessage());
        }
    }

    public void enterCardName(String name) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement cardNameInput = null;


            try {
                cardNameInput = wait.until(ExpectedConditions.elementToBeClickable(By.id(Group_Name_Text_Box)));
            } catch (TimeoutException e) {
                System.out.println("Timeout: Group Name text box not clickable. " + e.getMessage());
                return;
            } catch (NoSuchElementException e) {
                System.out.println("Group Name text box not found. " + e.getMessage());
                return;
            }


            try {
                cardNameInput.clear();
                cardNameInput.sendKeys(name);
                System.out.println("Entered card name: " + name);
            } catch (InvalidElementStateException e) {
                System.out.println("Text box is not in a state to receive input: " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error while entering card name: " + e.getMessage());
            }

        } catch (Exception e) {
            System.out.println("General exception in enterCardName(): " + e.getMessage());
        }
    }

    public void clickAddGroupButton() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement isButtonEnable = null;


            try {
                isButtonEnable = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Add_Group_Button)));
            } catch (TimeoutException e) {
                System.out.println("Timeout: Add Group button not clickable in time. " + e.getMessage());
                return;
            } catch (NoSuchElementException e) {
                System.out.println("Add Group button not found. " + e.getMessage());
                return;
            }


            try {
                if (isButtonEnable.isEnabled()) {
                    System.out.println("Add Group button is enabled.");
                    isButtonEnable.click();
                } else {
                    System.out.println("Add Group button is disabled.");
                }
            } catch (ElementClickInterceptedException e) {
                System.out.println("Click intercepted on Add Group button: " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error while clicking Add Group button: " + e.getMessage());
            }

        } catch (Exception e) {
            System.out.println("General exception in ClickAddGroupButton(): " + e.getMessage());
        }
    }

    public void enterTitle(String title) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement titleField = null;


            try {
                titleField = wait.until(ExpectedConditions.elementToBeClickable(By.id(Title_Text_Field)));
            } catch (TimeoutException e) {
                System.out.println("Timeout: Title text field not clickable in time. " + e.getMessage());
                return;
            } catch (NoSuchElementException e) {
                System.out.println("Title text field not found. " + e.getMessage());
                return;
            }


            try {
                titleField.clear();
                titleField.sendKeys(title);
                System.out.println("Entered title: " + title);
            } catch (InvalidElementStateException e) {
                System.out.println("Title text field is not ready for input: " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error while entering title: " + e.getMessage());
            }

        } catch (Exception e) {
            System.out.println("General exception in enterTitle(): " + e.getMessage());
        }
    }

    public void messageTextBox(String message) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement messageField = null;


            try {
                messageField = wait.until(ExpectedConditions.elementToBeClickable(By.id(Message_Text_Field)));
            } catch (TimeoutException e) {
                System.out.println("Timeout: Message text field not clickable in time. " + e.getMessage());
                return;
            } catch (NoSuchElementException e) {
                System.out.println("Message text field not found. " + e.getMessage());
                return;
            }


            try {
                messageField.clear();
                messageField.sendKeys(message);
                System.out.println("Entered message: " + message);
            } catch (InvalidElementStateException e) {
                System.out.println("Message text field is not ready for input: " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error while entering message: " + e.getMessage());
            }

        } catch (Exception e) {
            System.out.println("General exception in messageTextBox(): " + e.getMessage());
        }
    }

    public void priorityDropdown(String priority) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement dropDown = null;


            try {
                dropDown = wait.until(ExpectedConditions.elementToBeClickable(By.id(Priority_Dropdown)));
            } catch (TimeoutException e) {
                System.out.println("Timeout: Priority dropdown not clickable in time. " + e.getMessage());
                return;
            } catch (NoSuchElementException e) {
                System.out.println("Priority dropdown element not found. " + e.getMessage());
                return;
            }


            try {
                dropDown.click();
            } catch (ElementClickInterceptedException e) {
                System.out.println("Click intercepted on priority dropdown: " + e.getMessage());
                return;
            } catch (Exception e) {
                System.out.println("Unexpected error while clicking dropdown: " + e.getMessage());
                return;
            }


            try {
                Select select = new Select(dropDown);
                select.selectByVisibleText(priority);
                System.out.println("Selected priority: " + priority);
            } catch (NoSuchElementException e) {
                System.out.println("Priority option '" + priority + "' not found in dropdown. " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error while selecting priority: " + e.getMessage());
            }

        } catch (Exception e) {
            System.out.println("General exception in priorityDropdown(): " + e.getMessage());
        }
    }

    public void selectDepartment(String department) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement departmentDropdown = null;


            try {
                departmentDropdown = wait.until(ExpectedConditions.elementToBeClickable(By.id(Department_Dropdown)));
            } catch (TimeoutException e) {
                System.out.println("Timeout: Department dropdown not clickable in time. " + e.getMessage());
                return;
            } catch (NoSuchElementException e) {
                System.out.println("Department dropdown not found. " + e.getMessage());
                return;
            }


            try {
                Select select = new Select(departmentDropdown);
                select.selectByVisibleText(department);
                System.out.println("Selected department: " + department);
            } catch (NoSuchElementException e) {
                System.out.println("Department option '" + department + "' not found in dropdown. " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error while selecting department: " + e.getMessage());
            }

        } catch (Exception e) {
            System.out.println("General exception in selectDepartment(): " + e.getMessage());
        }
    }

    public void selectAllDepartmentButton() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement isButtonEnable = null;


            try {
                isButtonEnable = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Select_All_Button)));
            } catch (TimeoutException e) {
                System.out.println("Timeout: Select All button not clickable in time. " + e.getMessage());
                return;
            } catch (NoSuchElementException e) {
                System.out.println("Select All button not found. " + e.getMessage());
                return;
            }


            try {
                if (isButtonEnable.isEnabled()) {
                    System.out.println("Button is enabled and clickable.");
                    isButtonEnable.click();
                } else {
                    System.out.println("Button is not enabled and unclickable.");
                }
            } catch (ElementClickInterceptedException e) {
                System.out.println("Click intercepted on Select All button: " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error while clicking Select All button: " + e.getMessage());
            }

        } catch (Exception e) {
            System.out.println("General exception in selectAllDepartmentButton(): " + e.getMessage());
        }
    }
    public void selectEmployee() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement checkBox = null;


            try {
                checkBox = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Select_Check_Box)));
            } catch (TimeoutException e) {
                System.out.println("Timeout: Checkbox not clickable in time. " + e.getMessage());
                return;
            } catch (NoSuchElementException e) {
                System.out.println("Checkbox not found. " + e.getMessage());
                return;
            }


            try {
                checkBox.click();
                System.out.println("Employee checkbox selected.");
            } catch (ElementClickInterceptedException e) {
                System.out.println("Click intercepted on employee checkbox: " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error while clicking checkbox: " + e.getMessage());
            }

        } catch (Exception e) {
            System.out.println("General exception in selectEmployee(): " + e.getMessage());
        }
    }

    public void sendNotificationButton(String message) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement isButtonEnable = null;


            try {
                isButtonEnable = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Send_Notification_Button)));
            } catch (TimeoutException e) {
                System.out.println("Timeout: Send Notification button not clickable in time. " + e.getMessage());
                return;
            } catch (NoSuchElementException e) {
                System.out.println("Send Notification button not found. " + e.getMessage());
                return;
            }


            try {
                if (isButtonEnable.isEnabled()) {
                    System.out.println("Send Notification button is enabled");
                    isButtonEnable.click();
                } else {
                    System.out.println("Send Notification button is disabled");
                    return;
                }
            } catch (ElementClickInterceptedException e) {
                System.out.println("Click intercepted on Send Notification button: " + e.getMessage());
                return;
            } catch (Exception e) {
                System.out.println("Unexpected error while clicking Send Notification button: " + e.getMessage());
                return;
            }


            try {
                WebElement notification = wait.until(ExpectedConditions.visibilityOfElementLocated(
                        By.xpath("//div[text()='" + message + "']")));
                if (notification.isDisplayed()) {
                    System.out.println("Notification displayed: " + notification.getText());
                } else {
                    System.out.println("Notification is not displayed.");
                }
            } catch (TimeoutException e) {
                System.out.println("Timeout: Notification with message '" + message + "' not displayed in time. " + e.getMessage());
            } catch (NoSuchElementException e) {
                System.out.println("Notification element with message '" + message + "' not found. " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error while verifying notification: " + e.getMessage());
            }

        } catch (Exception e) {
            System.out.println("General exception in sendNotificationButton(): " + e.getMessage());
        }
    }

    public void checkDeleteButton() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement isDeleteButtonEnable = null;


            try {
                isDeleteButtonEnable = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Delete_Button)));
            } catch (TimeoutException e) {
                System.out.println("Timeout: Delete button not visible in time. " + e.getMessage());
                return;
            } catch (NoSuchElementException e) {
                System.out.println("Delete button not found. " + e.getMessage());
                return;
            }


            try {
                if (isDeleteButtonEnable.isEnabled()) {
                    System.out.println("Delete button is enabled and clickable.");
                } else {
                    System.out.println("Delete button is disabled and unclickable.");
                }
            } catch (Exception e) {
                System.out.println("Unexpected error while checking Delete button state: " + e.getMessage());
            }

        } catch (Exception e) {
            System.out.println("General exception in checkDeleteButton(): " + e.getMessage());
        }
    }

    public void checkEditButton() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement isEditButtonEnable = null;


            try {
                isEditButtonEnable = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Edit_Button)));
            } catch (TimeoutException e) {
                System.out.println("Timeout: Edit button not visible in time. " + e.getMessage());
                return;
            } catch (NoSuchElementException e) {
                System.out.println("Edit button not found. " + e.getMessage());
                return;
            }

            
            try {
                if (isEditButtonEnable.isEnabled()) {
                    System.out.println("Edit button is enabled and clickable.");
                } else {
                    System.out.println("Edit button is disabled.");
                }
            } catch (Exception e) {
                System.out.println("Error checking if Edit button is enabled: " + e.getMessage());
            }

        } catch (Exception e) {
            System.out.println("General exception in checkEditButton(): " + e.getMessage());
        }
    }











}
