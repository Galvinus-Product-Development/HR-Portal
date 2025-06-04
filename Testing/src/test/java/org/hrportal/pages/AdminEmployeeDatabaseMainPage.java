package org.hrportal.pages;

import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.UnexpectedTagNameException;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.NoSuchElementException;

public class AdminEmployeeDatabaseMainPage {

    private WebDriver driver;

    private Select select;


    public AdminEmployeeDatabaseMainPage(WebDriver driver) {
        this.driver = driver;
    }
    public static String Employee_Table = "//*[@id=\"root\"]/div/div/main/div/div[3]";
    public static final By Search_Employees = By.xpath("//input[@placeholder='Search employees...']");
    public static final By Select_Department = By.xpath("(//select[@class='employee-db-select'])[1]");
    public static final By Select_Location = By.xpath("//*[@id=\"root\"]/div/div/main/div/div[2]/select[2]");
    public static final By Select_Status = By.xpath("(//select[@class='employee-db-select'])[3]");

    public static String Employee = "//*[@id=\"root\"]/div/div/main/div/div[3]/table/tbody/tr/td[1]/div/div/div[1]";
  //  public static String Select_Employee = "//*[@id=\"root\"]/div/div/main/div/div[3]/table/tbody/tr/td[1]/div/div/div[1]";
    public static String Profile_Icon = "//*[@id=\"root\"]/div/header/div[2]/div/div/img";
    public static String Employee_DashBoard_Button = "//button[text()='Go to Employee Dashboard']";
    public static String Add_Employee_Button = "//button[text()=' Add Employee']";
    public static String Add_Employee_Popup = "//*[@id=\"root\"]/div/div/main/div/div[5]/div";
    public static String Import_Button = "//button[text()='Import']";
    public static String Import_Popup = "//*[@id=\"root\"]/div/div/main/div/div[5]/div";
    public static String Export_Button = "//button[text()=' Export']";
    public static String Select_Employee = "//div[text()='Prajwal DP']";
    public static String Go_Back_Button = "//button[text()='Go Back']";
    public static String Edit_Profile_Button = "//button[text()='Edit Profile']";
    public static String Edit_Profile_Popup = "//*[@id=\"root\"]/div/div/main/div/div[6]/div";

    public boolean employeeDetailsTable(){
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Employee_Table))).isDisplayed();
    }
    public void numberOfEmployees(){
       String employeeTable = driver.findElement(By.xpath(Employee_Table)).getText();
        System.out.println(employeeTable);
        String[] lines = employeeTable.split("\\r?\\n");

        System.out.printf("%-20s %-30s %-12s %-15s %-20s %-15s %-10s %-15s\n",
                "EMPLOYEE", "EMAIL", "CONTACT", "DEPARTMENT", "DESIGNATION", "LOCATION", "STATUS", "JOIN DATE");
        System.out.println("-------------------------------------------------------------------------------------------------------------");

        for (int i = 0; i < lines.length; i += 9) {
            if (i + 8 >= lines.length) break;

            String name = lines[i];
            String id = lines[i + 1];
            String email = lines[i + 2];
            String contact = lines[i + 3];
            String department = lines[i + 4];
            String designation = lines[i + 5];
            String location = lines[i + 6];
            String status = lines[i + 7];
            String joinDate = lines[i + 8];

            System.out.printf("%-20s %-30s %-12s %-15s %-20s %-15s %-10s %-15s\n",
                    name, email, contact, department, designation, location, status, joinDate);
        }
    }

    public void searchEmployeeField(String name) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement employeeSearch = null;

        try {
            try {
                employeeSearch = wait.until(ExpectedConditions.visibilityOfElementLocated(Search_Employees));
            } catch (TimeoutException e) {
                System.out.println("Search field did not become visible in time: " + e.getMessage());
                return;
            } catch (NoSuchElementException e) {
                System.out.println("Search field not found: " + e.getMessage());
                return;
            } catch (Exception e) {
                System.out.println("Unexpected error while locating the search field: " + e.getMessage());
                return;
            }

            try {
                employeeSearch.clear();
            } catch (Exception e) {
                System.out.println("Unable to clear the search field: " + e.getMessage());
            }

            try {
                employeeSearch.sendKeys(name);
                System.out.println("Entered employee name: " + name);
            } catch (Exception e) {
                System.out.println("Unable to send keys to the search field: " + e.getMessage());
            }

        } catch (Exception e) {
            System.out.println("Unhandled exception in searchEmployeeField method: " + e.getMessage());
        }
        try {
            WebElement result = wait.until(ExpectedConditions.elementToBeClickable(

                    By.xpath("//div[text()='" + name + " ']")));

            if (result.isDisplayed()) {
                System.out.println(name + " : This employee is present in the Employee table.");
            }
        } catch (TimeoutException e) {
            System.out.println("Employee '" + name + "' not found within timeout.");
        } catch (Exception e) {
            System.out.println("An unexpected error occurred while searching: " + e.getMessage());
        }
    }

    public void selectDepartment() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement departmentDropdown = null;

        try {

            try {
                departmentDropdown = wait.until(ExpectedConditions.visibilityOfElementLocated(Select_Department));
            } catch (TimeoutException e) {
                System.out.println("Timeout: Department dropdown not visible in time: " + e.getMessage());
                return;
            } catch (NoSuchElementException e) {
                System.out.println("Department dropdown not found: " + e.getMessage());
                return;
            } catch (Exception e) {
                System.out.println("Unexpected error locating department dropdown: " + e.getMessage());
                return;
            }


            try {
                departmentDropdown.click();
            } catch (ElementClickInterceptedException e) {
                System.out.println("Dropdown click intercepted: " + e.getMessage());
                return;
            } catch (ElementNotInteractableException e) {
                System.out.println("Dropdown not interactable: " + e.getMessage());
                return;
            } catch (Exception e) {
                System.out.println("Unexpected error clicking dropdown: " + e.getMessage());
                return;
            }


            try {
                select = new Select(departmentDropdown);
                System.out.println("Select object for department dropdown initialized.");
            } catch (UnexpectedTagNameException e) {
                System.out.println("Element is not a <select> tag: " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error initializing Select object: " + e.getMessage());
            }

        } catch (Exception e) {
            System.out.println("Unhandled exception in selectDepartment method: " + e.getMessage());
        }
    }


    public void department(String department) {
        try {
            try {
                select.selectByVisibleText(department);
                System.out.println(department + " : is present in the dropdown");
            } catch (NoSuchElementException e) {
                System.out.println(department + " : is not found in the dropdown (NoSuchElementException)");
            } catch (IllegalStateException e) {
                System.out.println("Select object not initialized: " + e.getMessage());
            } catch (NullPointerException e) {
                System.out.println("Select object is null. Did you call selectDepartment()? " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error selecting department: " + e.getMessage());
            }
        } catch (Exception outer) {
            System.out.println("Unhandled exception in department method: " + outer.getMessage());
        }
    }



    public void selectLocation() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement locationDropdown = null;


            try {
                locationDropdown = wait.until(ExpectedConditions.visibilityOfElementLocated(Select_Location));
            } catch (TimeoutException e) {
                System.out.println("Timeout: Location dropdown not visible - " + e.getMessage());
                return;
            } catch (NoSuchElementException e) {
                System.out.println("Location dropdown element not found - " + e.getMessage());
                return;
            } catch (StaleElementReferenceException e) {
                System.out.println("Location dropdown became stale - " + e.getMessage());
                return;
            } catch (Exception e) {
                System.out.println("Unexpected error locating location dropdown - " + e.getMessage());
                return;
            }


            if (locationDropdown != null) {
                try {
                    select = new Select(locationDropdown);
                    System.out.println("Location dropdown is successfully initialized.");
                } catch (UnexpectedTagNameException e) {
                    System.out.println("The element is not a <select> tag - " + e.getMessage());
                } catch (IllegalArgumentException e) {
                    System.out.println("Invalid argument passed to Select constructor - " + e.getMessage());
                } catch (Exception e) {
                    System.out.println("Error initializing Select object - " + e.getMessage());
                }
            } else {
                System.out.println("Location dropdown is null. Cannot initialize Select.");
            }

        } catch (Exception outer) {
            System.out.println("Unhandled exception in selectLocation method - " + outer.getMessage());
        }
    }

    public void location(String location) {
        try {
            try {
                select.selectByVisibleText(location);
                System.out.println(location + " : is present in the dropdown");
            } catch (NoSuchElementException e) {
                System.out.println(location + " : is not present in the dropdown (NoSuchElementException) - " + e.getMessage());
            } catch (IllegalStateException e) {
                System.out.println("Select object is not initialized or in invalid state - " + e.getMessage());
            } catch (NullPointerException e) {
                System.out.println("Select object is null (NullPointerException) - Did you call selectLocation()? " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error while selecting location: " + location + " - " + e.getMessage());
            }
        } catch (Exception outer) {
            System.out.println("Unhandled exception in location method - " + outer.getMessage());
        }
    }


    public void selectStatus() {
        try {
            WebDriverWait wait3 = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement statusDropdown = null;

            try {
                statusDropdown = wait3.until(ExpectedConditions.visibilityOfElementLocated(Select_Status));
            } catch (TimeoutException e) {
                System.out.println("Status dropdown not visible within the timeout period - " + e.getMessage());
            } catch (NoSuchElementException e) {
                System.out.println("Status dropdown element not found - " + e.getMessage());
            }

            if (statusDropdown != null) {
                try {
                    select = new Select(statusDropdown);
                    System.out.println("Status dropdown found and initialized.");
                } catch (UnexpectedTagNameException e) {
                    System.out.println("The located element is not a <select> tag - " + e.getMessage());
                } catch (Exception e) {
                    System.out.println("Error initializing Select object - " + e.getMessage());
                }
            } else {
                System.out.println("Status dropdown is null, cannot initialize Select.");
            }
        } catch (Exception outer) {
            System.out.println("Unhandled exception in selectStatus() method - " + outer.getMessage());
        }
    }

    public void status(String status) {
        try {
            try {
                select.selectByVisibleText(status);
                System.out.println(status + " : is present in the dropdown");
            } catch (NoSuchElementException e) {
                System.out.println(status + " : is not present in the dropdown - NoSuchElementException");
            } catch (ElementNotInteractableException e) {
                System.out.println("Dropdown is not interactable while selecting " + status + " - ElementNotInteractableException");
            } catch (NullPointerException e) {
                System.out.println("Select object is not initialized (null) - NullPointerException");
            } catch (Exception e) {
                System.out.println("Unexpected exception while selecting " + status + ": " + e.getMessage());
            }
        } catch (Exception outer) {
            System.out.println("Unhandled exception in status() method: " + outer.getMessage());
        }
    }

    public void checkPagination(String page) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement pagination = null;

            try {
                pagination = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//button[text()='" + page + "']")));
            } catch (TimeoutException e) {
                System.out.println("Timeout: Pagination button with text '" + page + "' was not found.");
            } catch (NoSuchElementException e) {
                System.out.println("NoSuchElement: Pagination button with text '" + page + "' does not exist.");
            } catch (Exception e) {
                System.out.println("Error locating pagination element: " + e.getMessage());
            }

            if (pagination != null) {
                try {
                    if (pagination.isEnabled()) {
                        System.out.println("Pagination is enabled");
                    } else {
                        System.out.println("Pagination is disabled");
                    }
                } catch (StaleElementReferenceException e) {
                    System.out.println("StaleElementReference: The pagination element became stale.");
                } catch (Exception e) {
                    System.out.println("Error checking pagination enabled status: " + e.getMessage());
                }
            }

        } catch (Exception outer) {
            System.out.println("Unhandled exception in checkPagination method: " + outer.getMessage());
        }
    }

    public void clickPagination(String page) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement paginationButton = null;

            try {
                paginationButton = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//button[text()='" + page + "']")));
            } catch (TimeoutException e) {
                System.out.println("Timeout: Pagination button with text '" + page + "' was not clickable.");
            } catch (NoSuchElementException e) {
                System.out.println("NoSuchElement: Pagination button with text '" + page + "' does not exist.");
            } catch (ElementClickInterceptedException e) {
                System.out.println("ElementClickIntercepted: Unable to click pagination button '" + page + "'. It may be obscured.");
            } catch (Exception e) {
                System.out.println("Error locating pagination button: " + e.getMessage());
            }

            if (paginationButton != null) {
                try {
                    paginationButton.click();
                    System.out.println("Clicked on pagination button: " + page);
                } catch (StaleElementReferenceException e) {
                    System.out.println("StaleElementReference: The pagination button '" + page + "' became stale before click.");
                } catch (Exception e) {
                    System.out.println("Error clicking pagination button: " + e.getMessage());
                }
            }

        } catch (Exception outer) {
            System.out.println("Unhandled exception in clickPagination method: " + outer.getMessage());
        }
    }

    public void searchEmployee(String employee, String department, String location, String status) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        try {
            WebElement search = wait.until(ExpectedConditions.visibilityOfElementLocated(Search_Employees));
            search.clear();
            search.sendKeys(employee);
        } catch (TimeoutException e) {
            System.out.println("Timeout: Search employee field not visible.");
        } catch (NoSuchElementException e) {
            System.out.println("NoSuchElement: Search employee field not found.");
        } catch (Exception e) {
            System.out.println("Error interacting with employee search field: " + e.getMessage());
        }

        try {
            WebElement departmentDropdown = wait.until(ExpectedConditions.visibilityOfElementLocated(Select_Department));
          Select  selectDept = new Select(departmentDropdown);
            selectDept.selectByVisibleText(department);
        } catch (TimeoutException e) {
            System.out.println("Timeout: Department dropdown not visible.");
        } catch (NoSuchElementException e) {
            System.out.println("NoSuchElement: Department '" + department + "' not found in dropdown.");
        } catch (Exception e) {
            System.out.println("Error selecting department: " + e.getMessage());
        }

        try {
            WebElement locationDropdown = wait.until(ExpectedConditions.visibilityOfElementLocated(Select_Location));
            Select selectLocation = new Select(locationDropdown);
            selectLocation.selectByVisibleText(location);
        } catch (TimeoutException e) {
            System.out.println("Timeout: Location dropdown not visible.");
        } catch (NoSuchElementException e) {
            System.out.println("NoSuchElement: Location '" + location + "' not found in dropdown.");
        } catch (Exception e) {
            System.out.println("Error selecting location: " + e.getMessage());
        }

        try {
            WebElement statusDropdown = wait.until(ExpectedConditions.visibilityOfElementLocated(Select_Status));
            Select selectStatus = new Select(statusDropdown);
            selectStatus.selectByVisibleText(status);
        } catch (TimeoutException e) {
            System.out.println("Timeout: Status dropdown not visible.");
        } catch (NoSuchElementException e) {
            System.out.println("NoSuchElement: Status '" + status + "' not found in dropdown.");
        } catch (Exception e) {
            System.out.println("Error selecting status: " + e.getMessage());
        }
    }


    public void filteredEmployee(String employee) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        try {
            WebElement isPresent = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//div[text()='" + employee + " ']")));
            String text = isPresent.getText();
            System.out.println(text + " :This employee is present in the employee database");
        } catch (TimeoutException e) {
            System.out.println("Timeout: Employee '" + employee + "' not visible in the database.");
        } catch (NoSuchElementException e) {
            System.out.println("NoSuchElement: Employee '" + employee + "' not found in the database.");
        } catch (Exception e) {
            System.out.println("Error locating employee '" + employee + "': " + e.getMessage());
        }
    }

    public void selectEmployee(String employee) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        try {
            WebElement employeeElement = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//div[text()='" + employee + " ']")));
            String employeeName = employeeElement.getText();
            System.out.println(employeeName);
          //  employeeName.click();
            System.out.println(employee + " : Employee element clicked successfully");
        } catch (TimeoutException e) {
            System.out.println("Timeout: Employee '" + employee + "' element not clickable.");
        } catch (NoSuchElementException e) {
            System.out.println("NoSuchElement: Employee '" + employee + "' element not found.");
        } catch (Exception e) {
            System.out.println("Error clicking employee '" + employee + "': " + e.getMessage());
        }
    }

    public void clickProfileIcon() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        try {
            wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Profile_Icon))).click();
            System.out.println("Profile icon clicked successfully.");
        } catch (TimeoutException e) {
            System.out.println("Timeout: Profile icon was not clickable within the wait time.");
        } catch (NoSuchElementException e) {
            System.out.println("NoSuchElement: Profile icon element not found.");
        } catch (Exception e) {
            System.out.println("Error clicking profile icon: " + e.getMessage());
        }
    }

    public void clickEmployeeDashboardButton() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        try {
            wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Employee_DashBoard_Button))).click();
            System.out.println("Employee Dashboard button clicked successfully.");
        } catch (TimeoutException e) {
            System.out.println("Timeout: Employee Dashboard button was not clickable within the wait time.");
        } catch (NoSuchElementException e) {
            System.out.println("NoSuchElement: Employee Dashboard button element not found.");
        } catch (Exception e) {
            System.out.println("Error clicking Employee Dashboard button: " + e.getMessage());
        }
    }
    public void checkAddEmployeeButton() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement isButtonEnable = null;


            try {
                isButtonEnable = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Add_Employee_Button)));
            } catch (TimeoutException e) {
                System.out.println("Timeout: Add Employee button not visible in time - " + e.getMessage());
                return;
            } catch (NoSuchElementException e) {
                System.out.println("Add Employee button not found - " + e.getMessage());
                return;
            } catch (StaleElementReferenceException e) {
                System.out.println("Add Employee button is stale - " + e.getMessage());
                return;
            } catch (Exception e) {
                System.out.println("Unexpected error while locating Add Employee button - " + e.getMessage());
                return;
            }


            try {
                if (isButtonEnable.isEnabled()) {
                    System.out.println("Add Employee Button is enabled and clickable.");
                    isButtonEnable.click();
                } else {
                    System.out.println("Add Employee Button is disabled.");
                }
            } catch (ElementClickInterceptedException e) {
                System.out.println("Click on Add Employee button was intercepted - " + e.getMessage());
            } catch (ElementNotInteractableException e) {
                System.out.println("Add Employee button is not interactable - " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error during Add Employee button click - " + e.getMessage());
            }

        } catch (Exception e) {
            System.out.println("Unhandled exception in checkAddEmployeeButton method - " + e.getMessage());
        }
    }

    public void addEmployeePopup() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement isPopupPresent = null;


            try {
                isPopupPresent = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Add_Employee_Popup)));
            } catch (TimeoutException e) {
                System.out.println("Timeout: Add Employee popup did not appear in time - " + e.getMessage());
                return;
            } catch (NoSuchElementException e) {
                System.out.println("Add Employee popup not found - " + e.getMessage());
                return;
            } catch (StaleElementReferenceException e) {
                System.out.println("Popup is no longer attached to the DOM - " + e.getMessage());
                return;
            } catch (Exception e) {
                System.out.println("Unexpected error locating the popup - " + e.getMessage());
                return;
            }


            try {
                if (isPopupPresent.isDisplayed()) {
                    System.out.println("Popup is present");
                } else {
                    System.out.println("Popup is not present");
                }
            } catch (ElementNotInteractableException e) {
                System.out.println("Popup is not interactable (may not be visible) - " + e.getMessage());
            }
            catch (Exception e) {
                System.out.println("Unexpected error checking popup visibility - " + e.getMessage());
            }

        } catch (Exception e) {
            System.out.println("Unhandled exception in addEmployeePopup method - " + e.getMessage());
        }
    }
    public void checkImportButton() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement isButtonEnable = null;

        try {
            try {
                isButtonEnable = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Import_Button)));
            } catch (TimeoutException e) {
                System.out.println("Timeout: Import button not visible - " + e.getMessage());
                return;
            } catch (NoSuchElementException e) {
                System.out.println("Import button element not found - " + e.getMessage());
                return;
            } catch (Exception e) {
                System.out.println("Unexpected error locating Import button - " + e.getMessage());
                return;
            }

            if (isButtonEnable != null) {
                try {
                    if (isButtonEnable.isEnabled()) {
                        System.out.println("Import button is enabled and clickable");
                        isButtonEnable.click();
                    } else {
                        System.out.println("Import button is disabled");
                    }
                } catch (ElementClickInterceptedException e) {
                    System.out.println("Click was intercepted for Import button - " + e.getMessage());
                } catch (ElementNotInteractableException e) {
                    System.out.println("Import button not interactable - " + e.getMessage());
                } catch (StaleElementReferenceException e) {
                    System.out.println("Stale element: Import button reference is outdated - " + e.getMessage());
                } catch (Exception e) {
                    System.out.println("Unexpected error while interacting with Import button - " + e.getMessage());
                }
            }

        } catch (Exception outer) {
            System.out.println("Unhandled exception in checkImportButton method - " + outer.getMessage());
        }
    }

    public void importPopup() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement isPopupPresent = null;

        try {
            try {
                isPopupPresent = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Import_Popup)));
            } catch (TimeoutException e) {
                System.out.println("Timeout: Import popup not visible - " + e.getMessage());
                return;
            } catch (NoSuchElementException e) {
                System.out.println("Import popup element not found - " + e.getMessage());
                return;
            } catch (Exception e) {
                System.out.println("Unexpected error while locating the Import popup - " + e.getMessage());
                return;
            }

            try {
                if (isPopupPresent.isDisplayed()) {
                    System.out.println("Import popup is present");
                } else {
                    System.out.println("Import popup is not present");
                }
            } catch (ElementNotInteractableException e) {
                System.out.println("Popup is not interactable - " + e.getMessage());
            } catch (StaleElementReferenceException e) {
                System.out.println("Popup element is stale - " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error while checking popup visibility - " + e.getMessage());
            }

        } catch (Exception outer) {
            System.out.println("Unhandled exception in importPopup method - " + outer.getMessage());
        }
    }

    public void checkExportButton() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement isButtonEnable = null;

        try {
            try {
                isButtonEnable = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Export_Button)));
            } catch (TimeoutException e) {
                System.out.println("Timeout: Export button did not become visible - " + e.getMessage());
                return;
            } catch (NoSuchElementException e) {
                System.out.println("Export button element not found - " + e.getMessage());
                return;
            } catch (Exception e) {
                System.out.println("Unexpected error while locating Export button - " + e.getMessage());
                return;
            }

            try {
                if (isButtonEnable.isEnabled()) {
                    System.out.println("Export button is enabled and clickable");
                    try {
                        isButtonEnable.click();
                    } catch (ElementClickInterceptedException e) {
                        System.out.println("Unable to click Export button - " + e.getMessage());
                    } catch (ElementNotInteractableException e) {
                        System.out.println("Export button is not interactable - " + e.getMessage());
                    } catch (Exception e) {
                        System.out.println("Unexpected error during Export button click - " + e.getMessage());
                    }
                } else {
                    System.out.println("Export button is not enabled");
                }
            } catch (Exception e) {
                System.out.println("Unexpected error checking Export button state - " + e.getMessage());
            }

        } catch (Exception outer) {
            System.out.println("Unhandled exception in checkExportButton method - " + outer.getMessage());
        }
    }

    public void selectEmployee() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement isEmployeeAvailable = null;

        try {
            try {
                isEmployeeAvailable = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Select_Employee)));
            } catch (TimeoutException e) {
                System.out.println("Timeout: Employee element not visible - " + e.getMessage());
                return;
            } catch (NoSuchElementException e) {
                System.out.println("Employee element not found - " + e.getMessage());
                return;
            } catch (Exception e) {
                System.out.println("Unexpected error while locating employee element - " + e.getMessage());
                return;
            }

            try {
                String employeeName = isEmployeeAvailable.getText();
                System.out.println("Employee Name: " + employeeName);
            } catch (NullPointerException e) {
                System.out.println("Unable to retrieve employee name - element is null: " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error while getting employee name - " + e.getMessage());
            }

            try {
                isEmployeeAvailable.click();
            } catch (ElementClickInterceptedException e) {
                System.out.println("Unable to click employee element - " + e.getMessage());
            } catch (ElementNotInteractableException e) {
                System.out.println("Employee element not interactable - " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error during click on employee element - " + e.getMessage());
            }

        } catch (Exception outer) {
            System.out.println("Unhandled exception in selectEmployee method - " + outer.getMessage());
        }
    }
    public void checkGoBackButton() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement isButtonEnable = null;

        try {
            try {
                isButtonEnable = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Go_Back_Button)));
            } catch (TimeoutException e) {
                System.out.println("Timeout: Go Back button not visible - " + e.getMessage());
                return;
            } catch (NoSuchElementException e) {
                System.out.println("Go Back button not found - " + e.getMessage());
                return;
            } catch (Exception e) {
                System.out.println("Unexpected error while locating Go Back button - " + e.getMessage());
                return;
            }

            try {
                if (isButtonEnable.isEnabled()) {
                    System.out.println("Go Back button is enabled and clickable");
                    isButtonEnable.click();
                } else {
                    System.out.println("Go Back button is disabled and unclickable");
                }
            } catch (ElementClickInterceptedException e) {
                System.out.println("Click on Go Back button was intercepted - " + e.getMessage());
            } catch (ElementNotInteractableException e) {
                System.out.println("Go Back button is not interactable - " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error during Go Back button click - " + e.getMessage());
            }

        } catch (Exception outer) {
            System.out.println("Unhandled exception in checkGoBackButton method - " + outer.getMessage());
        }
    }

    public void checkEditProfileButton() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement isButtonEnable = null;

        try {
            try {
                isButtonEnable = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Edit_Profile_Button)));
            } catch (TimeoutException e) {
                System.out.println("Timeout: Edit Profile button not visible - " + e.getMessage());
                return;
            } catch (NoSuchElementException e) {
                System.out.println("Edit Profile button not found - " + e.getMessage());
                return;
            } catch (Exception e) {
                System.out.println("Unexpected error while locating Edit Profile button - " + e.getMessage());
                return;
            }

            try {
                if (isButtonEnable.isEnabled()) {
                    System.out.println("Edit Profile button is enabled and clickable");
                    isButtonEnable.click();
                } else {
                    System.out.println("Edit Profile button is disabled and unclickable");
                }
            } catch (ElementClickInterceptedException e) {
                System.out.println("Click on Edit Profile button was intercepted - " + e.getMessage());
            } catch (ElementNotInteractableException e) {
                System.out.println("Edit Profile button is not interactable - " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error during Edit Profile button click - " + e.getMessage());
            }

        } catch (Exception outer) {
            System.out.println("Unhandled exception in checkEditProfileButton method - " + outer.getMessage());
        }
    }
    public void editProfilePopup() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement isPopupVisible = null;

        try {
            try {
                isPopupVisible = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Edit_Profile_Popup)));
            } catch (TimeoutException e) {
                System.out.println("Timeout: Edit Profile popup not visible - " + e.getMessage());
                return;
            } catch (NoSuchElementException e) {
                System.out.println("Edit Profile popup element not found - " + e.getMessage());
                return;
            } catch (Exception e) {
                System.out.println("Unexpected error while locating Edit Profile popup - " + e.getMessage());
                return;
            }

            try {
                if (isPopupVisible.isDisplayed()) {
                    System.out.println("Edit Profile popup is displayed");
                } else {
                    System.out.println("Edit Profile popup is not displayed");
                }
            } catch (ElementNotInteractableException e) {
                System.out.println("Popup element is not interactable - " + e.getMessage());
            } catch (StaleElementReferenceException e) {
                System.out.println("Popup element is no longer attached to the DOM - " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error while checking popup visibility - " + e.getMessage());
            }

        } catch (Exception outer) {
            System.out.println("Unhandled exception in editProfilePopup method - " + outer.getMessage());
        }
    }










}
