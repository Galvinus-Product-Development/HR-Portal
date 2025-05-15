package org.hrportal.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
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
     public static String Edit_Profile = "//*[@id=\"root\"]/div/div/main/div/div[1]/div/button";
    public static String Employee_Page_Popup = "//*[@id=\"root\"]/div/div/main/div/div[6]/div";
    public static final By Employee_ID = By.xpath("//*[@id=\"root\"]/div/div/main/div/div[6]/div/div[2]/div/div[1]/input");
    public static final By Job_Title = By.xpath("//*[@id=\"root\"]/div/div/main/div/div[6]/div/div[2]/div/div[2]/input");
    public static final By Location = By.xpath("//*[@id=\"root\"]/div/div/main/div/div[6]/div/div[2]/div/div[3]/input");
    public static final By Office_Email = By.xpath("//*[@id=\"root\"]/div/div/main/div/div[6]/div/div[2]/div/div[4]/input");
    public static final By Date_Of_Joining = By.xpath("//*[@id=\"root\"]/div/div/main/div/div[6]/div/div[2]/div/div[5]/input");
    public static final By UAN_Number = By.xpath("//*[@id=\"root\"]/div/div/main/div/div[6]/div/div[2]/div/div[6]/input");
    public static final By PF_Number = By.xpath("//*[@id=\"root\"]/div/div/main/div/div[6]/div/div[2]/div/div[7]/input");
    public static final By ESIC_Number = By.xpath("//*[@id=\"root\"]/div/div/main/div/div[6]/div/div[2]/div/div[8]/input");
    public static final By Employment_Type = By.xpath("//*[@id=\"root\"]/div/div/main/div/div[6]/div/div[2]/div/div[9]/select");
    public static final By Line_Manager = By.xpath("//*[@id=\"root\"]/div/div/main/div/div[6]/div/div[2]/div/div[10]/select");
    public static final By Account_Holder = By.xpath("//*[@id=\"root\"]/div/div/main/div/div[6]/div/div[3]/div/div[1]/input");
    public static final By Bank_Name = By.xpath("//*[@id=\"root\"]/div/div/main/div/div[6]/div/div[3]/div/div[2]/input");
    public static final By Account_Number = By.xpath("//*[@id=\"root\"]/div/div/main/div/div[6]/div/div[3]/div/div[3]/input");
    public static final By IFSC_Code = By.xpath("//*[@id=\"root\"]/div/div/main/div/div[6]/div/div[3]/div/div[4]/input");
    public static String Save_Button = "//button[text()='Save']";




    public void clickEditButton(){
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Edit_Profile))).click();
    }
    public boolean employeePagePopup(){
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Employee_Page_Popup))).isDisplayed();
    }
    public void setEmployeeID(String employeeId){
        WebElement employeeID = driver.findElement(Employee_ID);


        JavascriptExecutor js = (JavascriptExecutor) driver;
        js.executeScript("arguments[0].scrollIntoView(true);", employeeID);


        employeeID.clear();
        employeeID.sendKeys(employeeId);
    }
    public void setJobTitle(String title){
        WebElement jobTitle = driver.findElement(Job_Title);
        jobTitle.clear();
        jobTitle.sendKeys(title);
    }
    public void enterLocation(String location){
        WebElement setLocation = driver.findElement(Location);
        setLocation.clear();
        setLocation.sendKeys(location);
    }
    public void enterOfficeEmail(String Email){
        WebElement setOfficeEmail = driver.findElement(Office_Email);
        setOfficeEmail.clear();
        setOfficeEmail.sendKeys(Email);
    }
    public void enterDateOfJoining(String date){
        WebElement setDateOfJoining = driver.findElement(Date_Of_Joining);
        setDateOfJoining.clear();
        setDateOfJoining.sendKeys(date);
    }
    public void enterUanNumber(String uan){
        WebElement setUanNumber = driver.findElement(UAN_Number);
        setUanNumber.clear();
        setUanNumber.sendKeys(uan);
    }
    public void setPfNumber(String pf){
        WebElement pfNumber = driver.findElement(PF_Number);
        pfNumber.clear();
        pfNumber.sendKeys(pf);
    }
    public void setEsicNumber(String esic){
        WebElement esicNumber = driver.findElement(ESIC_Number);
        esicNumber.clear();
        esicNumber.sendKeys(esic);
    }
    public void setEmploymentType(String employment){

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement employmentDropDown = wait.until(ExpectedConditions.elementToBeClickable(Employment_Type));

        Select select = new Select(employmentDropDown);
        select.selectByVisibleText(employment);

    }
    public void setLineManager(String manager){

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement lineManagerDropDown = wait.until(ExpectedConditions.elementToBeClickable(Line_Manager));

        Select select = new Select(lineManagerDropDown);
        select.selectByVisibleText(manager);

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
