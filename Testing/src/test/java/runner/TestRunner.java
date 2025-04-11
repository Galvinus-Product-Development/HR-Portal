package runner;

import io.cucumber.junit.Cucumber;
import io.cucumber.junit.CucumberOptions;
import org.junit.runner.RunWith;

@RunWith(Cucumber.class)
@CucumberOptions(
        features = {
                "src/test/resources/org.hrportal.features/01_usermanagement.feature",
                "src/test/resources/org.hrportal.features/02_employeedatabase.feature",
                "src/test/resources/org.hrportal.features/03_attendance.feature",
                "src/test/resources/org.hrportal.features/04_Trainingandlearning.feature"
        },
        glue = {"org.hrportal.StepDef"},
        tags = "@ui",
        plugin = {
                "pretty",
                "html:target/cucumber-html-report",
                "json:target/cucumber.json"
        },
        monochrome = true
)
public class TestRunner {
}
