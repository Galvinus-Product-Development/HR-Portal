package org.hrportal.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;
import java.util.NoSuchElementException;

public class AdminTrainingAndLearningPage {

    private WebDriver driver;

    public Select select;


    public AdminTrainingAndLearningPage(WebDriver driver) {

        this.driver = driver;
    }

    public static String Training_And_Learning = "//*[@id=\"root\"]/div/div/div/nav/div[5]/a";
    public static String Training_And_Learning_Title = "//*[@id=\"root\"]/div/div/main/div/div[1]/div/div/h2";
    public static String Add_Trainer_Button = "//*[@id=\"root\"]/div/div/main/div/div[1]/button[1]";
    public static String Add_Trainer_Popup = "//*[@id=\"root\"]/div/div/main/div/div[4]/div";
    public static final By Select_Trainer_DropDown = By.name("trainerId");
    public static final By Enter_Trainer_Expertise = By.xpath("//*[@id=\"root\"]/div/div/main/div/div[4]/div/form/div[2]/input");
    public static String Create_Trainer_Button = "//button[text()='Create Trainer']";
    public static String Cancel_Button = "//button[text()='Cancel']";
    public void isTrainingAndLearningPresent() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement trainingAndLearningModule = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Training_And_Learning)));

        if (trainingAndLearningModule.isDisplayed()) {
            System.out.println("Training and Learning module is present in the sidebar");
        } else {
            System.out.println("Training and learning module is not present in the sidebar");
        }
    }

    public void selectTrainingAndLearning() {
        driver.findElement(By.xpath(Training_And_Learning)).click();
    }

    public void trainingAndLearningPageTitle() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        String pageTitle = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Training_And_Learning_Title))).getText();

        System.out.println(pageTitle + " :This is the title of the page");
    }

    public void addTrainerButton() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement isAddTrainerButtonEnable = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Add_Trainer_Button)));

        if (isAddTrainerButtonEnable.isEnabled()) {
            System.out.println("Add trainer button is enable");
        } else {
            System.out.println("Add Trainer button is disabled");
        }
    }

    public void clickAddTrainer() {
        driver.findElement(By.xpath(Add_Trainer_Button)).click();
    }

    public void addTrainerPopup() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement popUp = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(Add_Trainer_Popup)));

        if (popUp.isDisplayed()) {
            System.out.println("Add Trainer Popup is displayed");
        } else {
            System.out.println("Add Trainer popup is not displayed");
        }
    }
    public void selectTrainer(){
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));


        WebElement dropDown = wait.until(ExpectedConditions.visibilityOfElementLocated((Select_Trainer_DropDown)));
        dropDown.click();
        wait.until(ExpectedConditions.presenceOfElementLocated((Select_Trainer_DropDown)));

        select = new Select(dropDown);


        List<WebElement> options = select.getOptions();
        System.out.println("These all the trainers available:");
        for (WebElement option : options) {
            String listOfElements = option.getText();
            System.out.println(listOfElements);
        }
    }
    public void assignTrainer(String trainer ) {

        try {
            if (trainer == null || trainer.isEmpty()) {
                System.out.println("Invalid input: trainer cannot be null or empty.");
                return;
            }

            List<WebElement> options = select.getOptions();
            boolean roleExists = options.stream().anyMatch(option -> option.getText().equals(trainer));

            if (roleExists) {
                select.selectByVisibleText(trainer);
                System.out.println("Trainer is selected successfully: " + trainer);
            } else {
                System.out.println("Error: Trainer '" + trainer + "' does not exist in the dropdown.");

            }
        } catch (NoSuchElementException e) {
            System.out.println("Dropdown element not found: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("Unexpected error occurred: " + e.getMessage());
        }

    }
    public void enterTrainerExpertise(String expertise){
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.visibilityOfElementLocated(Enter_Trainer_Expertise)).sendKeys(expertise);

    }
    public void clickCreateTrainer(){
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath(Create_Trainer_Button))).click();
    }
    public void cancelButton(){
        WebElement isCancelButtonEnable = driver.findElement(By.xpath(Cancel_Button));

        if (isCancelButtonEnable.isEnabled()){
            System.out.println("Cancel button is enable");
        }
        else {
            System.out.println("Cancel button is disable");
        }

    }
    public void createTrainer(){
        WebElement isCreateTrainerButtonEnable = driver.findElement(By.xpath(Create_Trainer_Button));

        if (isCreateTrainerButtonEnable.isEnabled()){
            System.out.println("Create Trainer button is enable");
        }
        else {
            System.out.println("Create Trainer button is disable");
        }
    }
    public void clickCancelButton(){

    }




}
