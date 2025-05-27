package org.hrportal.pages;

import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.annotations.DataProvider;

import java.time.Duration;


public class EmployeePage {

    private WebDriver driver;


    public EmployeePage(WebDriver driver) {
        this.driver = driver;
    }
     public static String Add_Employee_Button = "//*[@id=\"root\"]/div/div/main/div/div[1]/div[2]/button[1]";
    public static String Employee_Page_Popup = "//*[@id=\"root\"]/div/div/main/div/div[5]/div";
    public static final By Employee_Name = By.id("name");
    public static final By Employee_Gender = By.id("gender");
    public static final By Date_Of_Birth = By.id("dateOfBirth");
    public static final By Employee_Blood_Group = By.id("bloodGroup");
    public static final By Employee_Number = By.id("phoneNumber");
    public static final By Employee_Personal_Email = By.id("personalEmail");
    public static final By Marital_Status = By.id("maritalStatus");
    public static final By Emergency_Phone_Number = By.id("emergencyPhoneNumber");
    public static final By Employee_Aadhar_Number = By.id("aadharNumber");
    public static final By Employee_Pan_Number = By.id("panNumber");
    public static final By Employment_Tab = By.xpath("//button[text()='Employment']");
    public static final By Employee_Office_Email = By.id("officeEmail");
    public static final By Employee_ID = By.id("companyEmployeeId");
    public static final By Employee_Department = By.id("department");
    public static final By Employee_Designation = By.id("jobTitle");
    public static final By Employee_Location = By.id("location");
    public static final By Employee_Status = By.id("status");
    public static final By Employee_Join_Date = By.id("dateOfJoining");
    public static final By Employee_Line_Manager = By.id("lineManagerId");
    public static final By Employment_Type = By.id("employmentType");
    public static final By Employee_UAN_Number = By.id("uanNumber");
    public static final By Employee_PF_Number = By.id("pfNumber");
    public static final By Employee_ESIC_Number = By.id("esicNumber");
    public static final By Account_Holder = By.xpath("//*[@id=\"root\"]/div/div/main/div/div[6]/div/div[3]/div/div[1]/input");
    public static final By Bank_Name = By.xpath("//*[@id=\"root\"]/div/div/main/div/div[6]/div/div[3]/div/div[2]/input");
    public static final By Account_Number = By.xpath("//*[@id=\"root\"]/div/div/main/div/div[6]/div/div[3]/div/div[3]/input");
    public static final By IFSC_Code = By.xpath("//*[@id=\"root\"]/div/div/main/div/div[6]/div/div[3]/div/div[4]/input");
    public static String Save_Button = "//button[text()='Save']";
    private Select select;




    public void clickAddEmployeeButton() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement addEmployeeBtn = null;


        try {
            addEmployeeBtn = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Add_Employee_Button)));
        } catch (TimeoutException e) {
            System.out.println("Timeout: Add Employee button was not clickable in time. " + e.getMessage());
            return;
        } catch (NoSuchElementException e) {
            System.out.println("Error: Add Employee button not found on the page. " + e.getMessage());
            return;
        } catch (Exception e) {
            System.out.println("Unexpected error while locating Add Employee button: " + e.getMessage());
            return;
        }


        try {
            addEmployeeBtn.click();
        } catch (ElementClickInterceptedException e) {
            System.out.println("Error: Add Employee button could not be clicked due to interception. " + e.getMessage());
        } catch (ElementNotInteractableException e) {
            System.out.println("Error: Add Employee button is not interactable. " + e.getMessage());
        } catch (Exception e) {
            System.out.println("Unexpected error while clicking Add Employee button: " + e.getMessage());
        }
    }


    public void employeePagePopup() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            WebElement isPopupDisplayed = null;

            try {
                isPopupDisplayed = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Employee_Page_Popup)));
            } catch (TimeoutException e) {
                System.out.println("Timeout: Employee popup not visible within the specified time - " + e.getMessage());
                return;
            } catch (NoSuchElementException e) {
                System.out.println("Employee popup element not found - " + e.getMessage());
                return;
            } catch (Exception e) {
                System.out.println("Unexpected error while locating the employee popup - " + e.getMessage());
                return;
            }

            try {
                if (isPopupDisplayed.isDisplayed()) {
                    System.out.println("Employee popup is displayed");
                } else {
                    System.out.println("Employee popup is not displayed");
                }
            } catch (StaleElementReferenceException e) {
                System.out.println("Popup element is stale - " + e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error while checking popup visibility - " + e.getMessage());
            }

        } catch (Exception outer) {
            System.out.println("Unhandled exception in employeePagePopup() method - " + outer.getMessage());
        }
    }

    public void setEmployeeName(String employeeName) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement employeeNameTextField = null;

        try {
            employeeNameTextField = wait.until(ExpectedConditions.visibilityOfElementLocated(Employee_Name));
        } catch (TimeoutException e) {
            System.out.println("Timeout waiting for employee name field to be visible: " + e.getMessage());
            return;
        } catch (NoSuchElementException e) {
            System.out.println("Employee name field not found: " + e.getMessage());
            return;
        }

        try {
            JavascriptExecutor js = (JavascriptExecutor) driver;
            js.executeScript("arguments[0].scrollIntoView(true);", employeeNameTextField);
        } catch (Exception e) {
            System.out.println("Error while scrolling to the employee name field: " + e.getMessage());
        }

        try {
            employeeNameTextField.clear();
        } catch (InvalidElementStateException e) {
            System.out.println("Unable to clear the employee name field: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("Unexpected error while clearing field: " + e.getMessage());
        }

        try {
            employeeNameTextField.sendKeys(employeeName);
        } catch (InvalidElementStateException e) {
            System.out.println("Unable to send keys to the employee name field: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("Unexpected error while entering text: " + e.getMessage());
        }
    }

    public void setEmployeeGender(String gender) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement genderDropDown = null;

        try {
            genderDropDown = wait.until(ExpectedConditions.elementToBeClickable(Employee_Gender));
        } catch (TimeoutException e) {
            System.out.println("Timeout: Gender dropdown was not clickable within the wait time. " + e.getMessage());
            return;
        } catch (NoSuchElementException e) {
            System.out.println("Gender dropdown element not found. " + e.getMessage());
            return;
        } catch (Exception e) {
            System.out.println("Unexpected error while locating gender dropdown: " + e.getMessage());
            return;
        }

        try {
            genderDropDown.click();
        } catch (ElementClickInterceptedException e) {
            System.out.println("Unable to click on gender dropdown: " + e.getMessage());
            return;
        } catch (Exception e) {
            System.out.println("Unexpected error during click on gender dropdown: " + e.getMessage());
            return;
        }

        try {
            Select select = new Select(genderDropDown);
            select.selectByVisibleText(gender);
        } catch (NoSuchElementException e) {
            System.out.println("Specified gender option not found in the dropdown: " + gender + ". " + e.getMessage());
        } catch (Exception e) {
            System.out.println("Unexpected error while selecting gender: " + e.getMessage());
        }
    }

    public void setDateOfBirth(String dateOfBirth) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement dobField = null;


        try {
            dobField = wait.until(ExpectedConditions.visibilityOfElementLocated(Date_Of_Birth));
        } catch (TimeoutException e) {
            System.out.println("Timeout: Date of Birth field not visible within wait time. " + e.getMessage());
            return;
        } catch (NoSuchElementException e) {
            System.out.println("Date of Birth field not found on the page. " + e.getMessage());
            return;
        } catch (Exception e) {
            System.out.println("Unexpected error locating Date of Birth field: " + e.getMessage());
            return;
        }

        try {
            dobField.clear();
            dobField.sendKeys(dateOfBirth);
        } catch (ElementNotInteractableException e) {
            System.out.println("Cannot interact with the Date of Birth field. " + e.getMessage());
        } catch (Exception e) {
            System.out.println("Unexpected error while entering Date of Birth: " + e.getMessage());
        }
    }

    public void setBloodGroup(String bloodGroup) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement bloodGroupDropdown = null;


        try {
            bloodGroupDropdown = wait.until(ExpectedConditions.elementToBeClickable(Employee_Blood_Group));
        } catch (TimeoutException e) {
            System.out.println("Timeout: Blood group dropdown not clickable within wait time. " + e.getMessage());
            return;
        } catch (NoSuchElementException e) {
            System.out.println("Blood group dropdown not found on the page. " + e.getMessage());
            return;
        } catch (Exception e) {
            System.out.println("Unexpected error locating blood group dropdown: " + e.getMessage());
            return;
        }


        try {
            bloodGroupDropdown.click();
        } catch (ElementNotInteractableException e) {
            System.out.println("Cannot interact with blood group dropdown. " + e.getMessage());
            return;
        } catch (Exception e) {
            System.out.println("Unexpected error while clicking blood group dropdown: " + e.getMessage());
            return;
        }


        try {
            Select select = new Select(bloodGroupDropdown);
            select.selectByVisibleText(bloodGroup);
        } catch (NoSuchElementException e) {
            System.out.println("Blood group option '" + bloodGroup + "' not found in the dropdown. " + e.getMessage());
        } catch (Exception e) {
            System.out.println("Unexpected error while selecting blood group: " + e.getMessage());
        }
    }

    public void setPhoneNumber(String number) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement phoneNumberField = null;


        try {
            phoneNumberField = wait.until(ExpectedConditions.visibilityOfElementLocated(Employee_Number));
        } catch (TimeoutException e) {
            System.out.println("Timeout: Phone number field not visible within wait time. " + e.getMessage());
            return;
        } catch (NoSuchElementException e) {
            System.out.println("Phone number field not found on the page. " + e.getMessage());
            return;
        } catch (Exception e) {
            System.out.println("Unexpected error while locating phone number field: " + e.getMessage());
            return;
        }


        try {
            phoneNumberField.clear();
            phoneNumberField.sendKeys(number);
        } catch (ElementNotInteractableException e) {
            System.out.println("Cannot interact with phone number field. " + e.getMessage());
        } catch (Exception e) {
            System.out.println("Unexpected error while entering phone number: " + e.getMessage());
        }
    }

    public void setPersonalEmail(String email) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement emailField = null;


        try {
            emailField = wait.until(ExpectedConditions.visibilityOfElementLocated(Employee_Personal_Email));
        } catch (TimeoutException e) {
            System.out.println("Timeout: Personal email field not visible within wait time. " + e.getMessage());
            return;
        } catch (NoSuchElementException e) {
            System.out.println("Personal email field not found on the page. " + e.getMessage());
            return;
        } catch (Exception e) {
            System.out.println("Unexpected error while locating personal email field: " + e.getMessage());
            return;
        }


        try {
            emailField.clear();
            emailField.sendKeys(email);
        } catch (ElementNotInteractableException e) {
            System.out.println("Cannot interact with personal email field. " + e.getMessage());
        } catch (Exception e) {
            System.out.println("Unexpected error while entering personal email: " + e.getMessage());
        }
    }

    public void setMaritalStatus(String marital) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement maritalDropdown = null;


        try {
            maritalDropdown = wait.until(ExpectedConditions.elementToBeClickable(Marital_Status));
        } catch (TimeoutException e) {
            System.out.println("Timeout: Marital status dropdown not clickable in expected time. " + e.getMessage());
            return;
        } catch (NoSuchElementException e) {
            System.out.println("Marital status dropdown not found. " + e.getMessage());
            return;
        } catch (Exception e) {
            System.out.println("Unexpected error while locating marital status dropdown: " + e.getMessage());
            return;
        }


        try {
            maritalDropdown.click();
        } catch (ElementClickInterceptedException e) {
            System.out.println("Element not clickable: Marital status dropdown. " + e.getMessage());
            return;
        } catch (Exception e) {
            System.out.println("Unexpected error while clicking marital status dropdown: " + e.getMessage());
            return;
        }


        try {
            Select select = new Select(maritalDropdown);
            select.selectByVisibleText(marital);
        } catch (NoSuchElementException e) {
            System.out.println("Option '" + marital + "' not found in marital status dropdown. " + e.getMessage());
        } catch (Exception e) {
            System.out.println("Unexpected error while selecting marital status: " + e.getMessage());
        }
    }

    public void setEmergencyContactNumber(String number) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement emergencyPhoneField = null;


        try {
            emergencyPhoneField = wait.until(ExpectedConditions.visibilityOfElementLocated(Emergency_Phone_Number));
        } catch (TimeoutException e) {
            System.out.println("Timeout: Emergency phone number field not visible in time. " + e.getMessage());
            return;
        } catch (NoSuchElementException e) {
            System.out.println("Emergency phone number field not found. " + e.getMessage());
            return;
        } catch (Exception e) {
            System.out.println("Unexpected error while locating emergency phone number field: " + e.getMessage());
            return;
        }


        try {
            emergencyPhoneField.clear();
            emergencyPhoneField.sendKeys(number);
        } catch (InvalidElementStateException e) {
            System.out.println("Cannot enter text: Field not in an editable state. " + e.getMessage());
        } catch (Exception e) {
            System.out.println("Unexpected error while entering emergency phone number: " + e.getMessage());
        }
    }

    public void setAadharNumber(String aadharNumber) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement aadharField = null;


        try {
            aadharField = wait.until(ExpectedConditions.visibilityOfElementLocated(Employee_Aadhar_Number));
        } catch (TimeoutException e) {
            System.out.println("Timeout: Aadhar number field not visible within the wait time. " + e.getMessage());
            return;
        } catch (NoSuchElementException e) {
            System.out.println("Error: Aadhar number field not found. " + e.getMessage());
            return;
        } catch (Exception e) {
            System.out.println("Unexpected error while locating Aadhar number field: " + e.getMessage());
            return;
        }


        try {
            aadharField.clear();
            aadharField.sendKeys(aadharNumber);
        } catch (InvalidElementStateException e) {
            System.out.println("Error: Aadhar field is not editable. " + e.getMessage());
        } catch (Exception e) {
            System.out.println("Unexpected error while entering Aadhar number: " + e.getMessage());
        }
    }

    public void setPanNumber(String panNumber) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            try {
                WebElement panInput = wait.until(ExpectedConditions.visibilityOfElementLocated(Employee_Pan_Number));
                try {
                    panInput.sendKeys(panNumber);
                } catch (Exception e) {
                    System.out.println("Error while sending keys to PAN number field: " + e.getMessage());
                    e.printStackTrace();
                }
            } catch (TimeoutException e) {
                System.out.println("Timeout: PAN number field not visible within 10 seconds.");
                e.printStackTrace();
            } catch (NoSuchElementException e) {
                System.out.println("Error: PAN number field not found.");
                e.printStackTrace();
            }
        } catch (Exception e) {
            System.out.println("Unexpected error in setPanNumber method: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public void clickEmploymentTab() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            try {
                WebElement employmentTabElement = wait.until(ExpectedConditions.elementToBeClickable(Employment_Tab));
                try {
                    employmentTabElement.click();
                } catch (Exception e) {
                    System.out.println("Error while clicking the Employment tab: " + e.getMessage());
                    e.printStackTrace();
                }
            } catch (TimeoutException e) {
                System.out.println("Timeout: Employment tab was not clickable within 10 seconds.");
                e.printStackTrace();
            } catch (NoSuchElementException e) {
                System.out.println("Error: Employment tab element not found.");
                e.printStackTrace();
            }
        } catch (Exception e) {
            System.out.println("Unexpected error in clickEmploymentTab method: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public void fillEmploymentDetails(String email, String employeeID, String department, String designation, String location, String status, String joinDate, String manager, String employment, String uanNumber, String pfNumber, String esicNumber) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        try {
            wait.until(ExpectedConditions.elementToBeClickable(Employee_Office_Email)).sendKeys(email);
        } catch (Exception e) {
            System.out.println("Error while entering Office Email: " + e.getMessage());
            e.printStackTrace();
        }

        try {
            wait.until(ExpectedConditions.elementToBeClickable(Employee_ID)).sendKeys(employeeID);
        } catch (Exception e) {
            System.out.println("Error while entering Employee ID: " + e.getMessage());
            e.printStackTrace();
        }

        try {
            WebElement departmentDropdown = wait.until(ExpectedConditions.elementToBeClickable(Employee_Department));
            select = new Select(departmentDropdown);
            select.selectByVisibleText(department);
        } catch (Exception e) {
            System.out.println("Error while selecting Department: " + e.getMessage());
            e.printStackTrace();
        }

        try {
            wait.until(ExpectedConditions.elementToBeClickable(Employee_Designation)).sendKeys(designation);
        } catch (Exception e) {
            System.out.println("Error while entering Designation: " + e.getMessage());
            e.printStackTrace();
        }

        try {
            WebElement locationDropdown = wait.until(ExpectedConditions.elementToBeClickable(Employee_Location));
            select = new Select(locationDropdown);
            select.selectByVisibleText(location);
        } catch (Exception e) {
            System.out.println("Error while selecting Location: " + e.getMessage());
            e.printStackTrace();
        }

        try {
            WebElement statusDropdown = wait.until(ExpectedConditions.elementToBeClickable(Employee_Status));
            select = new Select(statusDropdown);
            select.selectByVisibleText(status);
        } catch (Exception e) {
            System.out.println("Error while selecting Status: " + e.getMessage());
            e.printStackTrace();
        }

        try {
            wait.until(ExpectedConditions.elementToBeClickable(Employee_Join_Date)).sendKeys(joinDate);
        } catch (Exception e) {
            System.out.println("Error while entering Join Date: " + e.getMessage());
            e.printStackTrace();
        }

        try {
            WebElement lineManagerDropdown = wait.until(ExpectedConditions.elementToBeClickable(Employee_Line_Manager));
            select = new Select(lineManagerDropdown);
            select.selectByValue(manager);
        } catch (Exception e) {
            System.out.println("Error while selecting Line Manager: " + e.getMessage());
            e.printStackTrace();
        }

        try {
            WebElement employmentDropdown = wait.until(ExpectedConditions.elementToBeClickable(Employment_Type));
            select = new Select(employmentDropdown);
            select.selectByVisibleText(employment);
        } catch (Exception e) {
            System.out.println("Error while selecting Employment Type: " + e.getMessage());
            e.printStackTrace();
        }

        try {
            wait.until(ExpectedConditions.elementToBeClickable(Employee_UAN_Number)).sendKeys(uanNumber);
        } catch (Exception e) {
            System.out.println("Error while entering UAN Number: " + e.getMessage());
            e.printStackTrace();
        }

        try {
            wait.until(ExpectedConditions.elementToBeClickable(Employee_PF_Number)).sendKeys(pfNumber);
        } catch (Exception e) {
            System.out.println("Error while entering PF Number: " + e.getMessage());
            e.printStackTrace();
        }

        try {
            wait.until(ExpectedConditions.elementToBeClickable(Employee_ESIC_Number)).sendKeys(esicNumber);
        } catch (Exception e) {
            System.out.println("Error while entering ESIC Number: " + e.getMessage());
            e.printStackTrace();
        }
    }


    public void setAccountHolderName(String name){
        WebElement accountHolderName = driver.findElement(Account_Holder);
        accountHolderName.clear();
        accountHolderName.sendKeys(name);
    }
    public void setBankName(String bankName){
        WebElement enterBankName = driver.findElement(Bank_Name);
        enterBankName.clear();
        enterBankName.sendKeys(bankName);
    }
    public void setAccountNumber(String accountNumber){
        WebElement enterAccountNumber = driver.findElement(Account_Number);
        enterAccountNumber.clear();
        enterAccountNumber.sendKeys(accountNumber);
    }
    public void setIFSCCode(String IFSC){
        WebElement enterIFSC = driver.findElement(IFSC_Code);
        enterIFSC.clear();
        enterIFSC.sendKeys(IFSC);
    }
    public void clickSaveButton(){
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Save_Button))).click();
    }




}
