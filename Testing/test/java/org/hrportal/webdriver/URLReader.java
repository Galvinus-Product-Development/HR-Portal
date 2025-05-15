package org.hrportal.webdriver;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

public class URLReader {

    public static String getBaseUrl() {
        String path = "src/test/java/org/hrportal/utils/URL.txt";
        try {
            return Files.readString(Paths.get(path)).trim();
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
}
