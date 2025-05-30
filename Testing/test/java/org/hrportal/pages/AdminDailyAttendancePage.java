package org.hrportal.pages;

import org.junit.Assert;
import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.UnexpectedTagNameException;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;
import java.util.NoSuchElementException;

public class AdminDailyAttendancePage {

    private WebDriver driver;
    private Select select;

   // public static String Attendance_Title = "//h2[text()='Daily Attendance']";
    public static final By  All_Location_DropDown = By.name("location");
    public static final By All_Department_DropDown = By.name("department");
    public static final By All_Status_DropDown = By.name("status");
    public static String Reset_Filters = "//button[text()='Reset Filters']";
    public static String Employee_Name = "name";
    public static String Select_Month = "month";
    public static String Select_year = "year";
    public static String Download_Report = "//button[text()='Download Report']";
    public static String Search_Employee = "//*[@id=\"root\"]/div/div/main/div/div[1]/div[1]/input";
    public static String All_Status = "//*[@id=\"root\"]/div/div/main/div/div[2]/select";
    public static String All_Status_Dropdown = "//*[@id=\"root\"]/div/div/main/div/div[1]/div[2]/div[1]/button";
    public static String Employee_Searchbar = "//*[@id=\"root\"]/div/div/main/div/div[1]/div[1]/input";
    public AdminDailyAttendancePage(WebDriver driver) {
        this.driver = driver;
    }


    public void dailyAttendancePageTitle(){
        String pageTitle = driver.getTitle();
        System.out.println(pageTitle);
    }

    public void clickLocationOption() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement locationDropDown = null;


            try {
                locationDropDown = wait.until(ExpectedConditions.elementToBeClickable(All_Location_DropDown));
                locationDropDown.click();
                System.out.println("Location dropdown clicked successfully.");
            } catch (TimeoutException e) {
                System.out.println("Timeout: Location dropdown not clickable in time. " + e.getMessage());
                return;
            } catch (NoSuchElementException e) {
                System.out.println("Location dropdown not found. " + e.getMessage());
                return;
            } catch (ElementClickInterceptedException e) {
                System.out.println("Click on location dropdown was intercepted. " + e.getMessage());
                return;
            } catch (ElementNotInteractableException e) {
                System.out.println("Location dropdown is not interactable. " + e.getMessage());
                return;
            }


            try {
                wait.until(ExpectedConditions.visibilityOfElementLocated(All_Location_DropDown));
            } catch (TimeoutException e) {
                System.out.println("Timeout: Location dropdown not visible. " + e.getMessage());
                return;
            }


            try {
                Select select = new Select(locationDropDown);
                List<WebElement> allLocations = select.getOptions();

                System.out.println("Below are the different locations available from the dropdown:");
                for (WebElement location : allLocations) {
                    System.out.println(location.getText());
                }
            } catch (UnexpectedTagNameException e) {
                System.out.println("The dropdown element is not a <select> tag. " + e.getMessage());
            } catch (StaleElementReferenceException e) {
                System.out.println("Location dropdown is no longer attached to the DOM. " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Error while fetching dropdown options: " + e.getMessage());
            }

        } catch (Exception e) {
            System.out.println("General exception in clickLocationOption(): " + e.getMessage());
        }
    }


    public void selectLocation(String location) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement locationDropDown = wait.until(ExpectedConditions.elementToBeClickable(All_Location_DropDown));
            try {
                locationDropDown.click();
            } catch (ElementClickInterceptedException e) {
                System.out.println("Click on location dropdown was intercepted: " + e.getMessage());
                return;
            } catch (ElementNotInteractableException e) {
                System.out.println("Location dropdown is not interactable: " + e.getMessage());
                return;
            }

            try {
                wait.until(ExpectedConditions.visibilityOfElementLocated(All_Location_DropDown));
            } catch (TimeoutException e) {
                System.out.println("Location dropdown was not visible after clicking: " + e.getMessage());
                return;
            }

            Select select;
            try {
                select = new Select(locationDropDown);
            } catch (UnexpectedTagNameException e) {
                System.out.println("Element is not a select tag: " + e.getMessage());
                return;
            }

            try {
                select.selectByVisibleText(location);
                System.out.println("Selected location: " + location);
            } catch (NoSuchElementException e) {
                System.out.println("Location not found in dropdown: " + location);
            }

        } catch (TimeoutException e) {
            System.out.println("Timed out waiting for location dropdown to be clickable: " + e.getMessage());
        } catch (NoSuchElementException e) {
            System.out.println("Location dropdown element not found: " + e.getMessage());
        } catch (StaleElementReferenceException e) {
            System.out.println("Location dropdown element is no longer attached to the DOM: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("An unexpected error occurred while selecting location: " + e.getMessage());
        }
    }

    public void locationResult(String result) {
        try {
            try {
                if (result.equalsIgnoreCase("succeed")) {
                    System.out.println("Location is valid");
                    return;
                }
            } catch (NullPointerException e) {
                System.out.println("NullPointerException while checking 'succeed': " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error while checking 'succeed': " + e.getMessage());
            }

            try {
                if (result.equalsIgnoreCase("fail")) {
                    System.out.println("Location is invalid");
                    return;
                }
            } catch (NullPointerException e) {
                System.out.println("NullPointerException while checking 'fail': " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error while checking 'fail': " + e.getMessage());
            }

            try {
                System.out.println("Unknown result: " + result);
            } catch (Exception e) {
                System.out.println("Unexpected error while printing unknown result: " + e.getMessage());
            }

        } catch (Exception e) {
            System.out.println("General exception in locationResult(): " + e.getMessage());
        }
    }


    public void getDepartmentNames() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement departmentDropDown = wait.until(ExpectedConditions.elementToBeClickable(All_Department_DropDown));
            try {
                departmentDropDown.click();
            } catch (ElementClickInterceptedException e) {
                System.out.println("Click on department dropdown was intercepted: " + e.getMessage());
                return;
            } catch (ElementNotInteractableException e) {
                System.out.println("Department dropdown is not interactable: " + e.getMessage());
                return;
            }

            try {
                wait.until(ExpectedConditions.visibilityOfElementLocated(All_Department_DropDown));
            } catch (TimeoutException e) {
                System.out.println("Department dropdown was not visible after clicking: " + e.getMessage());
                return;
            }

            Select select;
            try {
                select = new Select(departmentDropDown);
            } catch (UnexpectedTagNameException e) {
                System.out.println("Element is not a select tag: " + e.getMessage());
                return;
            }

            try {
                List<WebElement> allDepartments = select.getOptions();
                System.out.println("Below are the different departments available from the dropdown:");

                for (WebElement department : allDepartments) {
                    System.out.println(department.getText());
                }
            } catch (Exception e) {
                System.out.println("Error while retrieving department options: " + e.getMessage());
            }

        } catch (TimeoutException e) {
            System.out.println("Timed out waiting for department dropdown to be clickable: " + e.getMessage());
        } catch (NoSuchElementException e) {
            System.out.println("Department dropdown element not found: " + e.getMessage());
        } catch (StaleElementReferenceException e) {
            System.out.println("Department dropdown element is no longer attached to the DOM: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("An unexpected error occurred while getting department names: " + e.getMessage());
        }
    }

    public void selectDepartment(String department) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement departmentDropDown = wait.until(ExpectedConditions.elementToBeClickable(All_Department_DropDown));

            try {
                departmentDropDown.click();
            } catch (ElementClickInterceptedException e) {
                System.out.println("Click on department dropdown was intercepted: " + e.getMessage());
                return;
            } catch (ElementNotInteractableException e) {
                System.out.println("Department dropdown is not interactable: " + e.getMessage());
                return;
            }

            try {
                wait.until(ExpectedConditions.visibilityOfElementLocated(All_Department_DropDown));
            } catch (TimeoutException e) {
                System.out.println("Department dropdown was not visible after clicking: " + e.getMessage());
                return;
            }

            Select select;
            try {
                select = new Select(departmentDropDown);
            } catch (UnexpectedTagNameException e) {
                System.out.println("Element is not a select tag: " + e.getMessage());
                return;
            }

            try {
                select.selectByVisibleText(department);
                System.out.println("Selected department: " + department);
            } catch (NoSuchElementException e) {
                System.out.println("Department not found in dropdown: " + department);
            }

        } catch (TimeoutException e) {
            System.out.println("Timed out waiting for department dropdown to be clickable: " + e.getMessage());
        } catch (NoSuchElementException e) {
            System.out.println("Department dropdown element not found: " + e.getMessage());
        } catch (StaleElementReferenceException e) {
            System.out.println("Department dropdown element is no longer attached to the DOM: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("An unexpected error occurred while selecting department: " + e.getMessage());
        }
    }

    public void departmentResult(String result) {
        try {
            try {
                if (result.equalsIgnoreCase("succeed")) {
                    System.out.println("Valid Department");
                    return;
                }
            } catch (NullPointerException e) {
                System.out.println("NullPointerException while checking 'succeed': " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error while checking 'succeed': " + e.getMessage());
            }

            try {
                if (result.equalsIgnoreCase("fail")) {
                    System.out.println("Invalid Department");
                    return;
                }
            } catch (NullPointerException e) {
                System.out.println("NullPointerException while checking 'fail': " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error while checking 'fail': " + e.getMessage());
            }

            try {
                System.out.println("Unknown result: " + result);
            } catch (Exception e) {
                System.out.println("Unexpected error while printing unknown result: " + e.getMessage());
            }

        } catch (Exception e) {
            System.out.println("General exception in departmentResult(): " + e.getMessage());
        }
    }


    public void getStatusNames() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement statusDropDown = wait.until(ExpectedConditions.elementToBeClickable(All_Status_DropDown));
            try {
                statusDropDown.click();
            } catch (ElementClickInterceptedException e) {
                System.out.println("Click on status dropdown was intercepted: " + e.getMessage());
                return;
            } catch (ElementNotInteractableException e) {
                System.out.println("Status dropdown is not interactable: " + e.getMessage());
                return;
            }

            try {
                wait.until(ExpectedConditions.visibilityOfElementLocated(All_Status_DropDown));
            } catch (TimeoutException e) {
                System.out.println("Status dropdown was not visible after clicking: " + e.getMessage());
                return;
            }

            Select select;
            try {
                select = new Select(statusDropDown);
            } catch (UnexpectedTagNameException e) {
                System.out.println("Element is not a select tag: " + e.getMessage());
                return;
            }

            try {
                List<WebElement> allStatus = select.getOptions();
                System.out.println("Below are the different status available from the dropdown:");

                for (WebElement status : allStatus) {
                    System.out.println(status.getText());
                }
            } catch (Exception e) {
                System.out.println("Error while retrieving status options: " + e.getMessage());
            }

        } catch (TimeoutException e) {
            System.out.println("Timed out waiting for status dropdown to be clickable: " + e.getMessage());
        } catch (NoSuchElementException e) {
            System.out.println("Status dropdown element not found: " + e.getMessage());
        } catch (StaleElementReferenceException e) {
            System.out.println("Status dropdown element is no longer attached to the DOM: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("An unexpected error occurred while getting status names: " + e.getMessage());
        }
    }


    public boolean selectStatus(String status) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement statusDropDown = wait.until(ExpectedConditions.elementToBeClickable(All_Status_DropDown));

            try {
                statusDropDown.click();
            } catch (ElementClickInterceptedException e) {
                System.out.println("Click on status dropdown was intercepted: " + e.getMessage());
                return false;
            } catch (ElementNotInteractableException e) {
                System.out.println("Status dropdown is not interactable: " + e.getMessage());
                return false;
            }

            try {
                wait.until(ExpectedConditions.visibilityOfElementLocated(All_Status_DropDown));
            } catch (TimeoutException e) {
                System.out.println("Status dropdown was not visible after clicking: " + e.getMessage());
                return false;
            }

            Select select;
            try {
                select = new Select(statusDropDown);
            } catch (UnexpectedTagNameException e) {
                System.out.println("Element is not a select tag: " + e.getMessage());
                return false;
            }

            try {
                select.selectByVisibleText(status);
                System.out.println("Selected status: " + status);
                return true;
            } catch (NoSuchElementException e) {
                System.out.println("Status not found in dropdown: " + status);
                return false;
            }

        } catch (TimeoutException e) {
            System.out.println("Timed out waiting for status dropdown to be clickable: " + e.getMessage());
            return false;
        } catch (NoSuchElementException e) {
            System.out.println("Status dropdown element not found: " + e.getMessage());
            return false;
        } catch (StaleElementReferenceException e) {
            System.out.println("Status dropdown element is no longer attached to the DOM: " + e.getMessage());
            return false;
        } catch (Exception e) {
            System.out.println("An unexpected error occurred while selecting status: " + e.getMessage());
            return false;
        }
    }

    public void statusResult(String result) {
        try {
            try {
                if (result.equalsIgnoreCase("succeed")) {
                    System.out.println("Valid status");
                    return;
                }
            } catch (NullPointerException e) {
                System.out.println("NullPointerException while checking 'succeed': " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error while checking 'succeed': " + e.getMessage());
            }

            try {
                if (result.equalsIgnoreCase("fail")) {
                    System.out.println("Invalid status");
                    return;
                }
            } catch (NullPointerException e) {
                System.out.println("NullPointerException while checking 'fail': " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error while checking 'fail': " + e.getMessage());
            }

            try {
                System.out.println("Unknown status result: " + result);
            } catch (Exception e) {
                System.out.println("Unexpected error while printing unknown result: " + e.getMessage());
            }

        } catch (Exception e) {
            System.out.println("General exception in statusResult(): " + e.getMessage());
        }
    }


    public void resetFilter() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement resetFilterButton = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Reset_Filters)));

            try {
                if (resetFilterButton.isDisplayed()) {
                    System.out.println("Reset Button is displayed");
                } else {
                    System.out.println("Reset button is disabled");
                }
            } catch (StaleElementReferenceException e) {
                System.out.println("Reset button is no longer attached to the DOM: " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Error while checking reset button display: " + e.getMessage());
            }

        } catch (TimeoutException e) {
            System.out.println("Timed out waiting for Reset button to be visible: " + e.getMessage());
        } catch (NoSuchElementException e) {
            System.out.println("Reset button element not found: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("Unexpected error occurred in resetFilter: " + e.getMessage());
        }
    }

    public void isResetFilterEnable() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement resetButton = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Reset_Filters)));

            try {
                if (resetButton.isEnabled()) {
                    System.out.println("Reset button is enabled");
                } else {
                    System.out.println("Reset button is disabled");
                }
            } catch (StaleElementReferenceException e) {
                System.out.println("Reset button is no longer attached to the DOM: " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Error while checking if reset button is enabled: " + e.getMessage());
            }

        } catch (TimeoutException e) {
            System.out.println("Timed out waiting for Reset button to be visible: " + e.getMessage());
        } catch (NoSuchElementException e) {
            System.out.println("Reset button element not found: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("Unexpected error occurred in isResetFilterEnable: " + e.getMessage());
        }
    }

    public void searchEmployee(String name) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement searchField = wait.until(ExpectedConditions.elementToBeClickable(By.name(Employee_Name)));
            try {
                searchField.clear();
                searchField.sendKeys(name);
                System.out.println("Entered employee name: " + name);
            } catch (InvalidElementStateException e) {
                System.out.println("Unable to enter text into search field: " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Error while entering employee name: " + e.getMessage());
            }
        } catch (TimeoutException e) {
            System.out.println("Timed out waiting for employee name field to be clickable: " + e.getMessage());
        } catch (NoSuchElementException e) {
            System.out.println("Employee name field not found: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("Unexpected error occurred in searchEmployee: " + e.getMessage());
        }
    }

    public void employeeTable(String result) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement employee = wait.until(ExpectedConditions.visibilityOfElementLocated(
                    By.xpath("//td[normalize-space(text())='" + result.trim() + "']")));

            try {
                if (employee.isDisplayed()) {
                    System.out.println("Valid employee");
                } else {
                    System.out.println("Invalid employee");
                }
            } catch (StaleElementReferenceException e) {
                System.out.println("Employee element is no longer attached to the DOM: " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Error while checking employee visibility: " + e.getMessage());
            }

        } catch (TimeoutException e) {
            System.out.println("Timed out waiting for employee element: " + e.getMessage());
        } catch (NoSuchElementException e) {
            System.out.println("Employee element not found: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("Unexpected error occurred in employeeTable: " + e.getMessage());
        }
    }

    public void selectMonth(String month) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement monthDropDown = wait.until(ExpectedConditions.elementToBeClickable(By.name(Select_Month)));
            try {
                monthDropDown.click();
                wait.until(ExpectedConditions.visibilityOfElementLocated(By.name(Select_Month)));

                try {
                    select = new Select(monthDropDown);
                    select.selectByVisibleText(month);
                    System.out.println(month + " month selected successfully.");
                } catch (NoSuchElementException e) {
                    System.out.println(month + " : Month not found in dropdown");
                } catch (Exception e) {
                    System.out.println("Error selecting month: " + e.getMessage());
                }
            } catch (ElementClickInterceptedException e) {
                System.out.println("Unable to click month dropdown: " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Error interacting with month dropdown: " + e.getMessage());
            }
        } catch (TimeoutException e) {
            System.out.println("Timed out waiting for month dropdown to be clickable: " + e.getMessage());
        } catch (NoSuchElementException e) {
            System.out.println("Month dropdown element not found: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("Unexpected error in selectMonth: " + e.getMessage());
        }
    }

    public void monthResult(String result) {
        try {
            try {
                if (result == null) {
                    throw new NullPointerException("Result is null");
                }

                if (result.equalsIgnoreCase("Pass")) {
                    System.out.println("Valid month selected");
                } else if (result.equalsIgnoreCase("Fail")) {
                    System.out.println("Invalid month selected");
                } else {
                    System.out.println("Unknown result: " + result);
                }
            } catch (NullPointerException e) {
                System.out.println("Error: " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error during result evaluation: " + e.getMessage());
            }
        } catch (Exception e) {
            System.out.println("Unhandled error in monthResult method: " + e.getMessage());
        }
    }


    public void selectYear(String year) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement yearDropDown = wait.until(ExpectedConditions.elementToBeClickable(By.name(Select_year)));

            try {
                yearDropDown.click();
                wait.until(ExpectedConditions.visibilityOfElementLocated(By.name(Select_year)));

                try {
                    select = new Select(yearDropDown);
                    select.selectByVisibleText(year);
                    System.out.println(year + " year selected successfully.");
                } catch (NoSuchElementException e) {
                    System.out.println(year + " : Year not found in dropdown");
                } catch (Exception e) {
                    System.out.println("Error selecting year: " + e.getMessage());
                }

            } catch (ElementClickInterceptedException e) {
                System.out.println("Unable to click year dropdown: " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Error interacting with year dropdown: " + e.getMessage());
            }

        } catch (TimeoutException e) {
            System.out.println("Timed out waiting for year dropdown to be clickable: " + e.getMessage());
        } catch (NoSuchElementException e) {
            System.out.println("Year dropdown element not found: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("Unexpected error in selectYear: " + e.getMessage());
        }
    }

    public void yearResult(String result) {
        try {
            try {
                if (result == null) {
                    throw new NullPointerException("Result is null");
                }

                if (result.equalsIgnoreCase("Pass")) {
                    System.out.println("Valid status");
                } else if (result.equalsIgnoreCase("Fail")) {
                    System.out.println("Invalid status");
                } else {
                    System.out.println("Unknown result: " + result);
                }
            } catch (NullPointerException e) {
                System.out.println("Error: " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error during result evaluation: " + e.getMessage());
            }
        } catch (Exception e) {
            System.out.println("Unhandled error in yearResult method: " + e.getMessage());
        }
    }

    public void downloadReportButton() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement isButtonEnable = null;

            try {
                isButtonEnable = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Download_Report)));

                try {
                    if (isButtonEnable.isEnabled()) {
                        System.out.println("Download Report button is enabled");
                    } else {
                        System.out.println("Download Report button is disabled");
                    }
                } catch (Exception e) {
                    System.out.println("Error checking if button is enabled: " + e.getMessage());
                }

            } catch (TimeoutException e) {
                System.out.println("Download Report button not visible: " + e.getMessage());
            } catch (NoSuchElementException e) {
                System.out.println("Download Report button element not found: " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error while locating Download Report button: " + e.getMessage());
            }

        } catch (Exception e) {
            System.out.println("Unhandled error in downloadReportButton method: " + e.getMessage());
        }
    }

    public void employeeSearchBar(String name) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

            try {
                WebElement searchField = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Search_Employee)));

                try {
                    searchField.sendKeys(name);
                    System.out.println("Employee name entered in the search bar: " + name);
                } catch (InvalidElementStateException e) {
                    System.out.println("Search field is not ready for input: " + e.getMessage());
                } catch (Exception e) {
                    System.out.println("Unexpected error while entering text in search bar: " + e.getMessage());
                }

            } catch (TimeoutException e) {
                System.out.println("Search field did not appear within time: " + e.getMessage());
            } catch (NoSuchElementException e) {
                System.out.println("Search field not found on the page: " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Error while locating the search field: " + e.getMessage());
            }

        } catch (Exception e) {
            System.out.println("Unhandled exception in employeeSearchBar method: " + e.getMessage());
        }
    }

    public void allStatusDropDown(String status) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement allStatusDropDown = null;

            try {
                allStatusDropDown = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(All_Status)));
                allStatusDropDown.click();
                wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(All_Status)));
            } catch (TimeoutException e) {
                System.out.println("Dropdown did not become clickable/visible in time: " + e.getMessage());
                return;
            } catch (NoSuchElementException e) {
                System.out.println("Status dropdown not found: " + e.getMessage());
                return;
            } catch (Exception e) {
                System.out.println("Unexpected error while accessing dropdown: " + e.getMessage());
                return;
            }

            try {
                select = new Select(allStatusDropDown);
                List<WebElement> allStatus = select.getOptions();

                for (WebElement listOFStatus : allStatus) {
                    System.out.println(listOFStatus.getText() + " : These are the different options present in the dropdown");
                }
            } catch (Exception e) {
                System.out.println("Error while retrieving or printing dropdown options: " + e.getMessage());
            }

            try {
                select.selectByVisibleText(status);
                System.out.println(status + " is selected from dropdown.");
            } catch (NoSuchElementException e) {
                System.out.println(status + " : Status not found in dropdown");
            } catch (Exception e) {
                System.out.println("Error while selecting status from dropdown: " + e.getMessage());
            }

        } catch (Exception e) {
            System.out.println("Unhandled exception in allStatusDropDown method: " + e.getMessage());
        }
    }
    public void searchBar(String name) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement searchInput = null;

        try {
            try {
                searchInput = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Employee_Searchbar)));
                System.out.println("Search bar is visible.");
            } catch (Exception e) {
                System.out.println("Error locating or waiting for the search bar: " + e.getMessage());
                e.printStackTrace();
            }

            try {
                if (searchInput != null) {
                    searchInput.clear();
                    searchInput.sendKeys(name);
                    System.out.println("Entered name into search bar: " + name);
                } else {
                    System.out.println("Search bar element is null, cannot send keys.");
                }
            } catch (Exception e) {
                System.out.println("Error while sending keys to the search bar: " + e.getMessage());
                e.printStackTrace();
            }

        } catch (Exception e) {
            System.out.println("Unexpected error in searchBar method: " + e.getMessage());
            e.printStackTrace();
        }
    }
    public void selectAllStatusDropdown(String status) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement statusDropdown = null;

        try {
            try {
                statusDropdown = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(All_Status_Dropdown)));
                System.out.println("Status dropdown is clickable.");
            } catch (Exception e) {
                System.out.println("Error locating or waiting for status dropdown: " + e.getMessage());
                e.printStackTrace();
            }

            try {
                if (statusDropdown != null) {
                    select = new Select(statusDropdown);
                    select.selectByVisibleText(status);
                    System.out.println("Selected status: " + status);
                } else {
                    System.out.println("Status dropdown element is null, cannot select value.");
                }
            } catch (Exception e) {
                System.out.println("Error selecting value from status dropdown: " + e.getMessage());
                e.printStackTrace();
            }

        } catch (Exception e) {
            System.out.println("Unexpected error in selectAllStatusDropdown method: " + e.getMessage());
            e.printStackTrace();
        }
    }



}
