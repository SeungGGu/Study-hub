package com.learner.studyhub.users.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Data

public class UsersDTO {
    private String id;
    private String password;
    private String name;
    private String nickname;
    private String email;
}
