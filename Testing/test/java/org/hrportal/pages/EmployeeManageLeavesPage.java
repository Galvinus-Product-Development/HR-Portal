package org.hrportal.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

public class EmployeeManageLeavesPage {

    private final WebDriver driver;
    private Select select;


    public static String Month_Dropdown = "//*[@id=\"root\"]/div/div/main/div/div[2]/div[1]/select";
    public static String Year_Dropdown = "//*[@id=\"root\"]/div/div/main/div/div[2]/div[2]/select";
    public static String Employee_Searchbar = "search";
    public static String Leave_Type_Dropdown = "//*[@id=\"root\"]/div/div/main/div/div[2]/div[4]/select";
    public static String Status_Dropdown = "//*[@id=\"root\"]/div/div/main/div/div[2]/div[5]/select";


    public EmployeeManageLeavesPage(WebDriver driver) {
        this.driver = driver;
    }


    public void selectMonth(String month) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement monthDropdown = null;

        try {
            try {
                monthDropdown = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Month_Dropdown)));
                System.out.println("Month dropdown is clickable.");
            } catch (Exception e) {
                System.out.println("Error locating month dropdown: " + e.getMessage());
                e.printStackTrace();
            }

            if (monthDropdown != null) {
                try {
                    select = new Select(monthDropdown);
                    List<WebElement> allMonths = select.getOptions();

                    for (WebElement eachMonth : allMonths) {
                        try {
                            System.out.println(eachMonth.getText());
                        } catch (Exception e) {
                            System.out.println("Error reading month option text: " + e.getMessage());
                            e.printStackTrace();
                        }
                    }

                    try {
                        select.selectByVisibleText(month);
                        System.out.println("Selected month: " + month);
                    } catch (Exception e) {
                        System.out.println("Error selecting month from dropdown: " + e.getMessage());
                        e.printStackTrace();
                    }

                } catch (Exception e) {
                    System.out.println("Error interacting with the Select object: " + e.getMessage());
                    e.printStackTrace();
                }
            } else {
                System.out.println("Month dropdown was not found or not clickable.");
            }

        } catch (Exception e) {
            System.out.println("Unexpected error in selectMonth method: " + e.getMessage());
            e.printStackTrace();
        }
    }
    public void selectYear(String year) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement yearDropdown = null;

        try {
            try {
                yearDropdown = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Year_Dropdown)));
                System.out.println("Year dropdown is clickable.");
            } catch (Exception e) {
                System.out.println("Error locating year dropdown: " + e.getMessage());
                e.printStackTrace();
            }

            if (yearDropdown != null) {
                try {
                    select = new Select(yearDropdown);
                    List<WebElement> years = select.getOptions();

                    for (WebElement singleYear : years) {
                        try {
                            System.out.println("Available Year: " + singleYear.getText());
                        } catch (Exception e) {
                            System.out.println("Error reading year option text: " + e.getMessage());
                            e.printStackTrace();
                        }
                    }

                    try {
                        select.selectByVisibleText(year);
                        System.out.println("Selected Year: " + year);
                    } catch (Exception e) {
                        System.out.println("Error selecting year from dropdown: " + e.getMessage());
                        e.printStackTrace();
                    }

                } catch (Exception e) {
                    System.out.println("Error interacting with Select object: " + e.getMessage());
                    e.printStackTrace();
                }
            } else {
                System.out.println("Year dropdown was not found or is not clickable.");
            }

        } catch (Exception e) {
            System.out.println("Unexpected error in selectYear method: " + e.getMessage());
            e.printStackTrace();
        }
    }
    public void searchEmployee(String name) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        try {
            WebElement searchBar = null;

            try {
                searchBar = wait.until(ExpectedConditions.visibilityOfElementLocated(By.name(Employee_Searchbar)));
                System.out.println("Search bar is visible.");
            } catch (Exception e) {
                System.out.println("Error locating the search bar: " + e.getMessage());
                e.printStackTrace();
            }

            if (searchBar != null) {
                try {
                    searchBar.sendKeys(name);
                    System.out.println("Employee name entered: " + name);
                } catch (Exception e) {
                    System.out.println("Error sending keys to the search bar: " + e.getMessage());
                    e.printStackTrace();
                }
            } else {
                System.out.println("Search bar is not available to enter the employee name.");
            }

        } catch (Exception e) {
            System.out.println("Unexpected error in searchEmployee method: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public void selectLeaveType(String leave) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement leaveTypeDropdown = null;

        try {
            try {
                leaveTypeDropdown = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Leave_Type_Dropdown)));
                System.out.println("Leave type dropdown is clickable.");
            } catch (Exception e) {
                System.out.println("Error locating or clicking the leave type dropdown: " + e.getMessage());
                e.printStackTrace();
            }

            if (leaveTypeDropdown != null) {
                try {
                    select = new Select(leaveTypeDropdown);
                    System.out.println("Select object initialized.");
                } catch (Exception e) {
                    System.out.println("Error initializing Select object: " + e.getMessage());
                    e.printStackTrace();
                }

                try {
                    select.selectByVisibleText(leave);
                    System.out.println("Leave type selected: " + leave);
                } catch (Exception e) {
                    System.out.println("Error selecting the leave type: " + e.getMessage());
                    e.printStackTrace();
                }
            } else {
                System.out.println("Leave type dropdown is not available for interaction.");
            }

        } catch (Exception e) {
            System.out.println("Unexpected error in selectLeaveType method: " + e.getMessage());
            e.printStackTrace();
        }
    }
    public void statusDropdown(String status) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement statusDropdown = null;

        try {
            try {
                statusDropdown = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Status_Dropdown)));
                System.out.println("Status dropdown is clickable.");
            } catch (Exception e) {
                System.out.println("Error locating or clicking the status dropdown: " + e.getMessage());
                e.printStackTrace();
            }

            if (statusDropdown != null) {
                try {
                    select = new Select(statusDropdown);
                    System.out.println("Select object initialized for status dropdown.");
                } catch (Exception e) {
                    System.out.println("Error initializing Select object: " + e.getMessage());
                    e.printStackTrace();
                }

                try {
                    select.selectByVisibleText(status);
                    System.out.println("Status selected: " + status);
                } catch (Exception e) {
                    System.out.println("Error selecting the status from dropdown: " + e.getMessage());
                    e.printStackTrace();
                }
            } else {
                System.out.println("Status dropdown is not available for interaction.");
            }

        } catch (Exception e) {
            System.out.println("Unexpected error in statusDropdown method: " + e.getMessage());
            e.printStackTrace();
        }
    }




}
