package com.learner.studyhub.service;

import com.learner.studyhub.dto.StudyDTO;
import com.learner.studyhub.entity.StudyEntity;
import com.learner.studyhub.repository.StudyRepository;
import com.learner.studyhub.users.entity.UserEntity;
import com.learner.studyhub.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StudyService {

    private final StudyRepository studyRepository;
    private final UserRepository userRepository;

    public String studyEdit(StudyDTO studyDTO){

        StudyEntity studyEntity = new StudyEntity();

        //studyDTO에서 닉네임 가져오기
        String nickname = studyDTO.getStudyCreator();
        //UserEntity 조회
        Optional<UserEntity> userEntityOptional = userRepository.findByNickname(nickname);
        if(userEntityOptional.isPresent()){
            UserEntity userEntity = userEntityOptional.get();

            System.out.println("유저 entity 닉네임 검색부분" + userEntity);

            studyEntity.setStudyCreator(userEntity);
        }

        studyEntity.setStudyTitle(studyDTO.getStudyTitle());
        studyEntity.setStudyCreateDate(studyDTO.getStudyCreateDate());
        studyEntity.setStudyLastDate(studyDTO.getStudyLastDate());
        studyEntity.setPwStatus(studyDTO.isPwStatus());
        studyEntity.setStudyPw(studyDTO.getStudyPw());
        studyEntity.setStudyComment(studyDTO.getStudyComment());
        studyEntity.setStudyTitlePicture(studyDTO.getStudyTitlePicture());

        studyRepository.save(studyEntity);

        return "success";
    }

    public List<StudyEntity> getAllStudyCards() {
        return studyRepository.findAll();
    }
}
