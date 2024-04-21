package com.learner.studyhub.users.service;

import com.learner.studyhub.users.dto.UsersDTO;
import com.learner.studyhub.users.entity.UserEntity;
import com.learner.studyhub.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public void registerUser(UsersDTO users) {

        boolean isId = userRepository.existsById(users.getId());
        boolean isNickname = userRepository.existsByNickname(users.getNickname());
        boolean isEmail = userRepository.existsByEmail(users.getEmail());
        boolean isPhone = userRepository.existsByPhone(users.getPhone());
        if (isId){
            return;
        }
        if (isNickname){
            return;
        }
        if (isEmail){
            return;
        }
        if (isPhone){
            return;
        }

        UserEntity data = new UserEntity();

        data.setUserid(users.getId());
        data.setPassword(bCryptPasswordEncoder.encode(users.getPassword()));
        data.setName(users.getName());
        data.setNickname(users.getNickname());
        data.setPhone(users.getPhone());
        data.setEmail(users.getEmail());
        data.setBirthDate(users.getBirthDate());
        data.setGender(users.getGender());
        data.setRole("ROLE_USER");

        userRepository.save(data);
    }
}
