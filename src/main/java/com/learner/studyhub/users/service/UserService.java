package com.learner.studyhub.users.service;

import com.learner.studyhub.users.dto.UsersDTO;
import com.learner.studyhub.users.entity.UserEntity;
import com.learner.studyhub.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public String loginUser(UsersDTO usersDTO){
        UserEntity data = userRepository.findByUserId(usersDTO.getId());
        System.out.println(data.getName());
        if (data == null || !passwordEncoder.matches(usersDTO.getPassword(), data.getPassword())) {
            return "로그인 실패";
        }
        // If the user exists and the password matches, return success message
        return data.getName() + "|" + data.getNickname();
    }

    public String registerUser(UsersDTO users) {

        boolean isId = userRepository.existsById(users.getId());
        boolean isNickname = userRepository.existsByNickname(users.getNickname());
        boolean isEmail = userRepository.existsByEmail(users.getEmail());
        boolean isPhone = userRepository.existsByPhone(users.getPhone());
        if (!isId){
            return "아이디 중복";
        }
        if (isNickname){
            return "닉네임 중복";
        }
        if (isEmail){
            return "이메일 중복";
        }
        if (isPhone){
            return "휴대폰번호 중복";
        }

        UserEntity data = new UserEntity();

        data.setUserId(users.getId());
        data.setPassword(passwordEncoder.encode(users.getPassword()));
        data.setName(users.getName());
        data.setNickname(users.getNickname());
        data.setPhone(users.getPhone());
        data.setEmail(users.getEmail());
        data.setBirthDate(users.getBirthDate());
        data.setGender(users.getGender());
        data.setRole("ROLE_USER");

        userRepository.save(data);

        return "success";
    }
}
