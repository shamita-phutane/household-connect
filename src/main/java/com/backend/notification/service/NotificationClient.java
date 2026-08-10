package com.backend.notification.service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class NotificationClient {

    private static final Logger logger = LoggerFactory.getLogger(NotificationClient.class);
    private static final String NOTIFICATION_API_URL = "http://localhost:5000/api/notifications";

    private final HttpClient httpClient;

    public NotificationClient() {
        this.httpClient = HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_2)
                .connectTimeout(Duration.ofSeconds(10))
                .build();
    }

    public void sendNotificationAsync(Long userId, String email, String message, String type) {
        sendNotificationAsync(userId, email, message, type, null, null, null);
    }

    public void sendNotificationAsync(Long userId, String email, String message, String type, Double amount, String serviceName, java.time.LocalDateTime bookingDate) {
        try {
            JSONObject payload = new JSONObject();
            payload.put("userId", userId);
            if (email != null && !email.trim().isEmpty()) {
                payload.put("email", email);
            }
            payload.put("message", message);
            payload.put("type", type);
            
            if (amount != null) payload.put("amount", amount);
            if (serviceName != null) payload.put("serviceName", serviceName);
            if (bookingDate != null) payload.put("bookingDate", bookingDate.toString());

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(NOTIFICATION_API_URL))
                    .timeout(Duration.ofSeconds(10))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(payload.toString()))
                    .build();

            httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                    .thenAccept(response -> {
                        if (response.statusCode() == 201) {
                            logger.info("Notification sent successfully to .NET service for user {}", userId);
                        } else {
                            logger.error("Failed to send notification to .NET service. Status: {}, Body: {}", 
                                    response.statusCode(), response.body());
                        }
                    })
                    .exceptionally(ex -> {
                        logger.error("Error communicating with .NET NotificationService: {}", ex.getMessage());
                        return null;
                    });

        } catch (Exception e) {
            logger.error("Error building notification request: {}", e.getMessage());
        }
    }
}
