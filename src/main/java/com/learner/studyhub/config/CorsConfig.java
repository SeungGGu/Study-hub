package com.learner.studyhub.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin("http://10.202.36.233:3000"); // Allowed origin
        config.addAllowedOrigin("http://localhost:3000"); // Allowed origin
         config.addAllowedOriginPattern("https://*.ngrok-free.app"); // Allow any ngrok subdomain
        config.addAllowedHeader("*"); // Allowed headers
        config.addAllowedMethod("*"); // Allowed methods
        config.setMaxAge(3600L); // Cache duration
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
