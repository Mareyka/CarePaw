package com.example.animals.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Клиент будет слушать /topic/**
        registry.enableSimpleBroker("/topic");
        // Префикс для отправки сообщений с клиента на сервер: /app/**
        registry.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Endpoint для подключения WebSocket
        registry.addEndpoint("/ws-chat")
                .setAllowedOriginPatterns("*") // при желании можно сузить
                .withSockJS();
    }
}



