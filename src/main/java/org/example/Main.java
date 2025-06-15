package org.example;

import javafx.application.Platform;
import javafx.embed.swing.JFXPanel;
import javafx.scene.Scene;
import javafx.scene.web.WebView;

import javax.swing.*;
import java.io.File;

public class Main {
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            JFrame frame = new JFrame("Java GUI - Swing + JavaFX");
            frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            frame.setSize(1920, 1080);

            JFXPanel jfxPanel = new JFXPanel();
            frame.add(jfxPanel);
            frame.setVisible(true);

            Platform.runLater(() -> {
                WebView webView = new WebView();

                // 🌟 Load index.html RELATIVELY from "data/index.html"
                File htmlFile = new File("DATABASE/index.html");
                webView.getEngine().load(htmlFile.toURI().toString());

                jfxPanel.setScene(new Scene(webView, 1920, 1080));
            });
        });
    }
}

