package com.learner.studyhub.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable() // Disable CSRF protection
                .authorizeHttpRequests((auth) -> auth
                        .requestMatchers("/").permitAll()
                        .requestMatchers("/api/**").permitAll()
                        .requestMatchers("/api/study/**").permitAll()
                        .requestMatchers("/api/user/**").permitAll()
                        .requestMatchers("/api/sessions/**").permitAll()
                        .requestMatchers("/openvidu/api/sessions/**").permitAll()
                        .requestMatchers("/api/studyMember/**").permitAll()
                        .anyRequest().permitAll()
                )
                .cors(); // Enable CORS
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
