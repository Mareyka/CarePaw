package com.example.animals.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.upload.posts-dir}")
    private String postsUploadDir;

    @Value("${file.upload.avatars-dir}")
    private String avatarsUploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Для постов
        registry.addResourceHandler("/api/images/posts/**")
                .addResourceLocations("file:" + postsUploadDir);

        // Для аватарок
        registry.addResourceHandler("/api/images/avatars/**")
                .addResourceLocations("file:" + avatarsUploadDir);
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*")
                .allowedMethods("*")
                .allowedHeaders("*")
                .allowCredentials(false);
    }
}