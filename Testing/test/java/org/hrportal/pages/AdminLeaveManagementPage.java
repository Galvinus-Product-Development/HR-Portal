package org.hrportal.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.File;
import java.time.Duration;
import java.util.List;
import java.util.NoSuchElementException;

public class AdminLeaveManagementPage {

    private final WebDriver driver;
    private Select select;
    public static String All_Status_Dropdown = "//*[@id=\"root\"]/div/div/main/div/div[2]/select";
    public static String Search_Bar = "//*[@id=\"root\"]/div/div/main/div/div[2]/div[1]/input";
    public static String Employee_Not_Found = "//div[text()='No leave history records found for the selected filters.']";
    public static String Month_Dropdown = "//*[@id=\"root\"]/div/div/main/div/div[2]/div[2]/select[1]";
    public static String Status_Dropdown = "//*[@id=\"root\"]/div/div/main/div/div[2]/div[2]/select[2]";
    public static String Upload_Policy = "//button[text()='Upload Policy']";
    public static String Upload_Policy_Popup = "//*[@id=\"root\"]/div/div/main/div/div[3]/div";
    public static String Policy_Name = "name";
    public static String Policy_Type = "//*[@id=\"root\"]/div/div/main/div/div[3]/div/form/div[2]/input";
    public static String Choose_File = "//*[@id=\"root\"]/div/div/main/div/div[3]/div/form/div[3]/input";
    public static String Upload_Button = "//button[text()='Upload']";






    public AdminLeaveManagementPage(WebDriver driver) {

        this.driver = driver;
    }
    public void searchEmployee(String name) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement isEmployeePresent = null;

        try {
            isEmployeePresent = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//div[text()='" + name + " ']")));
        } catch (TimeoutException e) {
            System.out.println("Timeout: Could not find employee '" + name + "' within 10 seconds.");
            e.printStackTrace();
        } catch (NoSuchElementException e) {
            System.out.println("Employee element not found for name: " + name);
            e.printStackTrace();
        } catch (Exception e) {
            System.out.println("Unexpected error while locating employee element: " + e.getMessage());
            e.printStackTrace();
        }

        if (isEmployeePresent != null) {
            try {
                if (isEmployeePresent.isDisplayed()) {
                    System.out.println(isEmployeePresent.getText() + " : Is applied for leave");
                } else {
                    System.out.println(isEmployeePresent.getText() + " : Is not applied for the leave");
                }
            } catch (Exception e) {
                System.out.println("Error while checking if employee element is displayed: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.out.println(name + " : Could not determine leave status (element not found).");
        }
    }

//    public void selectStatusDropdown(){
//        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
//        WebElement dropDown = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(All_Status_Dropdown)));
//        dropDown.click();
//
//        select = new Select(dropDown);
//    }
//    public void allStatusDropdown(String status){
//        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
//        List<WebElement> allStatus = select.getOptions();
//        for (WebElement statuses : allStatus){
//            System.out.println(statuses.getText());
//        }
//        select.selectByVisibleText(status);
//        WebElement isStatusPresent = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//span[text()='" + status + "']")));
//
//        if (isStatusPresent.isDisplayed()){
//            System.out.println( "Status of leave is: " + isStatusPresent.getText());
//        }
//        else {
//            System.out.println(status + " :This Status is not present in the dropdown");
//        }
//    }

    public void clickStatusDropdown() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement dropDown = null;

        try {
            dropDown = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(All_Status_Dropdown)));
        } catch (TimeoutException e) {
            System.out.println("Timeout: Status dropdown was not clickable within 10 seconds.");
            e.printStackTrace();
        } catch (NoSuchElementException e) {
            System.out.println("Error: Status dropdown element not found.");
            e.printStackTrace();
        } catch (Exception e) {
            System.out.println("Unexpected error while locating status dropdown: " + e.getMessage());
            e.printStackTrace();
        }

        if (dropDown != null) {
            try {
                dropDown.click();
            } catch (Exception e) {
                System.out.println("Error while clicking the status dropdown: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.out.println("Status dropdown is null. Cannot perform click.");
        }
    }


    public void selectStatusFromDropdown(String status) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement dropDown = null;


        try {
            dropDown = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(All_Status_Dropdown)));
        } catch (TimeoutException e) {
            System.out.println("Timeout: Status dropdown not clickable within 10 seconds.");
            e.printStackTrace();
        } catch (NoSuchElementException e) {
            System.out.println("Error: Status dropdown not found.");
            e.printStackTrace();
        } catch (Exception e) {
            System.out.println("Unexpected error while locating status dropdown: " + e.getMessage());
            e.printStackTrace();
        }

        if (dropDown != null) {
            try {
                select = new Select(dropDown);
            } catch (Exception e) {
                System.out.println("Error while creating Select object for status dropdown: " + e.getMessage());
                e.printStackTrace();
                return;
            }


            try {
                List<WebElement> allStatuses = select.getOptions();
                for (WebElement eachStatus : allStatuses) {
                    System.out.println("Available Status: " + eachStatus.getText());
                }
            } catch (Exception e) {
                System.out.println("Error while retrieving or printing dropdown options: " + e.getMessage());
                e.printStackTrace();
            }


            try {
                select.selectByVisibleText(status);
            } catch (NoSuchElementException e) {
                System.out.println("Error: The status '" + status + "' is not available in the dropdown.");
                e.printStackTrace();
            } catch (Exception e) {
                System.out.println("Unexpected error while selecting status from dropdown: " + e.getMessage());
                e.printStackTrace();
            }


            try {
                WebElement selectedOption = select.getFirstSelectedOption();
                System.out.println("Selected Status: " + selectedOption.getText());
            } catch (Exception e) {
                System.out.println("Error while retrieving the selected status option: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.out.println("Dropdown element was null. Skipping selection.");
        }
    }


    public void enterEmployeeName(String name) {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Search_Bar))).sendKeys(name);

            try {

                WebElement isEmployeeDisplayed = wait.until(ExpectedConditions.visibilityOfElementLocated(
                        By.xpath("//div[text()='" + name + " ']")));
                System.out.println(isEmployeeDisplayed.getText() + " : This employee is present in the table");
            } catch (TimeoutException e) {

                try {
                    WebElement isNotFound = wait.until(ExpectedConditions.visibilityOfElementLocated(
                            By.xpath(Employee_Not_Found)));
                    System.out.println(isNotFound.getText() + " : This employee is not present in the table");
                } catch (TimeoutException ex) {
                    System.out.println("Neither employee nor 'not found' message is present.");
                }
            }
        }
    public void clickMonth() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement monthDropdown = null;


        try {
            monthDropdown = wait.until(
                    ExpectedConditions.elementToBeClickable(By.xpath(Month_Dropdown))
            );
        } catch (TimeoutException e) {
            System.out.println("Timeout: Month dropdown was not clickable within 10 seconds.");
            e.printStackTrace();
        } catch (NoSuchElementException e) {
            System.out.println("Error: Month dropdown element not found.");
            e.printStackTrace();
        } catch (Exception e) {
            System.out.println("Unexpected error while locating month dropdown: " + e.getMessage());
            e.printStackTrace();
        }


        if (monthDropdown != null) {
            try {
                monthDropdown.click();
            } catch (Exception e) {
                System.out.println("Error while clicking the month dropdown: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.out.println("Month dropdown is null. Cannot perform click.");
        }
    }

    public void selectMonth(String month) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement monthSelection = null;


        try {
            monthSelection = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Month_Dropdown)));
        } catch (TimeoutException e) {
            System.out.println("Timeout: Month dropdown was not visible within 10 seconds.");
            e.printStackTrace();
        } catch (NoSuchElementException e) {
            System.out.println("Error: Month dropdown element not found.");
            e.printStackTrace();
        } catch (Exception e) {
            System.out.println("Unexpected error while locating month dropdown: " + e.getMessage());
            e.printStackTrace();
        }


        if (monthSelection != null) {
            try {
                select = new Select(monthSelection);
            } catch (Exception e) {
                System.out.println("Error while initializing Select for month dropdown: " + e.getMessage());
                e.printStackTrace();
                return;
            }


            try {
                List<WebElement> availableMonths = select.getOptions();
                for (WebElement singleMonth : availableMonths) {
                    System.out.println(singleMonth.getText() + " : These are the available months present in the dropdown");
                }
            } catch (Exception e) {
                System.out.println("Error while retrieving or iterating through dropdown options: " + e.getMessage());
                e.printStackTrace();
            }


            try {
                select.selectByVisibleText(month);
            } catch (NoSuchElementException e) {
                System.out.println("Error: The month '" + month + "' is not available in the dropdown.");
                e.printStackTrace();
            } catch (Exception e) {
                System.out.println("Unexpected error while selecting month from dropdown: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.out.println("Month dropdown is null. Cannot proceed with selection.");
        }
    }

    public void allStatusDropdown(String status) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement selectStatus = null;


        try {
            selectStatus = wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Status_Dropdown)));
        } catch (TimeoutException e) {
            System.out.println("Timeout: Status dropdown was not clickable within 10 seconds.");
            e.printStackTrace();
        } catch (NoSuchElementException e) {
            System.out.println("Error: Status dropdown element not found.");
            e.printStackTrace();
        } catch (Exception e) {
            System.out.println("Unexpected error while locating status dropdown: " + e.getMessage());
            e.printStackTrace();
        }


        if (selectStatus != null) {
            try {
                select = new Select(selectStatus);
            } catch (Exception e) {
                System.out.println("Error while initializing Select object for status dropdown: " + e.getMessage());
                e.printStackTrace();
                return;
            }


            try {
                List<WebElement> allOptions = select.getOptions();
                for (WebElement option : allOptions) {
                    System.out.println(option.getText() + " : These are the different options present in dropdown");
                }
            } catch (Exception e) {
                System.out.println("Error while retrieving or printing dropdown options: " + e.getMessage());
                e.printStackTrace();
            }


            try {
                select.selectByVisibleText(status);
            } catch (NoSuchElementException e) {
                System.out.println("Error: The status '" + status + "' is not available in the dropdown.");
                e.printStackTrace();
            } catch (Exception e) {
                System.out.println("Unexpected error while selecting status from dropdown: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.out.println("Status dropdown is null. Skipping selection.");
        }
    }

    public void uploadPolicyButton() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement uploadPolicyButton = null;


        try {
            uploadPolicyButton = wait.until(
                    ExpectedConditions.visibilityOfElementLocated(By.xpath(Upload_Policy))
            );
        } catch (TimeoutException e) {
            System.out.println("Timeout: Upload Policy button not visible within 10 seconds.");
            e.printStackTrace();
        } catch (NoSuchElementException e) {
            System.out.println("Error: Upload Policy button not found on the page.");
            e.printStackTrace();
        } catch (Exception e) {
            System.out.println("Unexpected error while locating Upload Policy button: " + e.getMessage());
            e.printStackTrace();
        }


        if (uploadPolicyButton != null) {
            try {
                if (uploadPolicyButton.isEnabled()) {
                    System.out.println("Upload policy button is visible and enabled.");
                } else {
                    System.out.println("Upload policy button is visible but disabled.");
                }
            } catch (Exception e) {
                System.out.println("Unexpected error while checking the button status: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.out.println("Upload policy button is null. Cannot check status.");
        }
    }

    public void uploadPolicyPopup() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement isPopupPresent = null;


        try {
            WebElement uploadPolicyButton = wait.until(
                    ExpectedConditions.elementToBeClickable(By.xpath(Upload_Policy))
            );
            uploadPolicyButton.click();
        } catch (TimeoutException e) {
            System.out.println("Timeout: Upload Policy button was not clickable.");
            e.printStackTrace();
            return;
        } catch (NoSuchElementException e) {
            System.out.println("Upload Policy button not found on the page.");
            e.printStackTrace();
            return;
        } catch (Exception e) {
            System.out.println("Unexpected error while clicking the Upload Policy button: " + e.getMessage());
            e.printStackTrace();
            return;
        }


        try {
            isPopupPresent = wait.until(
                    ExpectedConditions.visibilityOfElementLocated(By.xpath(Upload_Policy_Popup))
            );
        } catch (TimeoutException e) {
            System.out.println("Timeout: Upload popup not visible after clicking the button.");
            e.printStackTrace();
        } catch (NoSuchElementException e) {
            System.out.println("Upload popup element not found.");
            e.printStackTrace();
        } catch (Exception e) {
            System.out.println("Unexpected error while locating the upload popup: " + e.getMessage());
            e.printStackTrace();
        }


        if (isPopupPresent != null) {
            try {
                if (isPopupPresent.isDisplayed()) {
                    System.out.println("Upload popup is present.");
                } else {
                    System.out.println("Upload popup is not present.");
                }
            } catch (Exception e) {
                System.out.println("Unexpected error while checking popup display status: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.out.println("Upload popup element is null. Skipping display check.");
        }
    }

    public void fillDetails(String name, String type)  {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.elementToBeClickable(By.name(Policy_Name))).sendKeys(name);

        wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Policy_Type))).sendKeys(type);



            File file = new File("src/test/java/org/hrportal/utils/Demo.pdf");
            String absolutePath = file.getAbsolutePath();

            WebElement uploadElement = driver.findElement(By.xpath("//input[@type='file']"));
            uploadElement.sendKeys(absolutePath);

            wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Upload_Button))).click();
        }
        public void clickUpload(){
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Upload_Button))).click();
        }




}
