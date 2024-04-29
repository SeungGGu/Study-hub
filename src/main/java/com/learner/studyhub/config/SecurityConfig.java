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
                .csrf((auth) -> auth.disable())
                .authorizeHttpRequests((auth) -> auth
                        .requestMatchers("/").permitAll()
                        .requestMatchers("api/study/", "/api/study/edit", "/api/study/upload", "/api/study/cardView").permitAll()
                        .requestMatchers("/api/user/loginProc", "/api/user/register", "/api/study/edit").permitAll()
                        .anyRequest().authenticated()
                );
//                .formLogin(form -> form
//                        .loginProcessingUrl("/api/loginProc")
//                        .successHandler(((request, response, authentication) -> response.setStatus(200)))
//                        .failureHandler(((request, response, exception) -> response.setStatus(401)))
//                        .permitAll()
//                )
//                .logout()
//                .permitAll()
//                .and();
//        http.sessionManagement() //중복로그인 제어
//                .maximumSessions(1) //세션 최대 허용 수
//                .maxSessionsPreventsLogin(false); // false: 중복 로그인하면 이전 로그인이 풀림

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
