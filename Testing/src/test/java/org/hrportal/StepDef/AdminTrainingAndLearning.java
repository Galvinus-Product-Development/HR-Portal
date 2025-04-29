package org.hrportal.StepDef;

import io.cucumber.java.Before;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.hrportal.pages.AdminTrainingAndLearningPage;
import org.hrportal.pages.EmployeeHomePage;
import org.hrportal.webdriver.DriverManager;
import org.openqa.selenium.WebDriver;

public class AdminTrainingAndLearning {

    private WebDriver driver;
    private AdminTrainingAndLearningPage adminTrainingAndLearningPage;




    public AdminTrainingAndLearning() {
        this.driver = DriverManager.getDriver();
        this.adminTrainingAndLearningPage = new AdminTrainingAndLearningPage(driver);

    }


    @Given("the user locates the Training and Learning module in the sidebar")
    public void theUserLocatesTheTrainingAndLearningModuleInTheSidebar() {
        adminTrainingAndLearningPage.isTrainingAndLearningPresent();
    }

    @When("the user clicks on the Training and Learning module")
    public void theUserClicksOnTheTrainingAndLearningModule() {
        adminTrainingAndLearningPage.selectTrainingAndLearning();

    }

    @Then("the related page should be visible")
    public void theRelatedPageShouldBeVisible() {
        adminTrainingAndLearningPage.trainingAndLearningPageTitle();
    }

    @Given("check whether add trainer button is enable or not")
    public void checkWhetherAddTrainerButtonIsEnableOrNot() {
        adminTrainingAndLearningPage.addTrainerButton();
        
    }
    

    @When("user clicks on the add trainer module button")
    public void userClicksOnTheAddTrainerModuleButton() {
        adminTrainingAndLearningPage.clickAddTrainer();

    }

    @Then("a popup show ups")
    public void aPopupShowUps() {
        adminTrainingAndLearningPage.addTrainerPopup();
    }

    @Given("click on the add trainer module button")
    public void clickOnTheAddTrainerModuleButton() {
        adminTrainingAndLearningPage.clickAddTrainer();

    }


    @When("the popup appears check whether cancel and create trainer button is enable or not")
    public void thePopupAppearsCheckWhetherCancelAndCreateTrainerButtonIsEnableOrNot() {
           adminTrainingAndLearningPage.cancelButton();
           adminTrainingAndLearningPage.createTrainer();
    }

    @Then("click on create trainer button without filling the details")
    public void clickOnCreateTrainerButtonWithoutFillingTheDetails() {

    }

    @Given("user selects the {string} from the dropdown")
    public void userSelectsTheFromTheDropdown(String trainer ) {
        adminTrainingAndLearningPage.selectTrainer();
        adminTrainingAndLearningPage.assignTrainer(trainer);

        
    }

    @When("user enters the trainer {string}")
    public void userEntersTheTrainer(String expertise) {
        adminTrainingAndLearningPage.enterTrainerExpertise(expertise);

    }

    @Then("clicks on the create trainer button")
    public void clicksOnTheCreateTrainerButton() {
        adminTrainingAndLearningPage.clickCreateTrainer();

    }

}
