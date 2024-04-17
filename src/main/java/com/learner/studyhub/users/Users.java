package com.learner.studyhub.users;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Entity
public class Users {
    @Id
    private String id;
    private String password;
    private String name;
    @Column(unique = true)
    private String nickname;
    private String email;
    private String phone;
    private String gender;
    private String birthDate;
}
