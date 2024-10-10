package com.learner.studyhub.service;

import com.learner.studyhub.dto.StudyDTO;
import com.learner.studyhub.entity.StudyEntity;
import com.learner.studyhub.repository.StudyRepository;
import com.learner.studyhub.users.entity.UserEntity;
import com.learner.studyhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StudyService {

    private final StudyRepository studyRepository;
    private final UserRepository userRepository;

    public String studyEdit(StudyDTO studyDTO) {

        StudyEntity studyEntity = new StudyEntity();

        //studyDTO에서 닉네임 가져오기
        String nickname = studyDTO.getStudyCreator();
        //UserEntity 조회
        Optional<UserEntity> userEntityOptional = userRepository.findByNickname(nickname);
        if (userEntityOptional.isPresent()) {
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

    public StudyEntity toggleLike(int studyId, String nickname) {
        UserEntity user = userRepository.findByNickname(nickname)
                .orElseThrow(() -> new IllegalArgumentException("Invalid user nickname: " + nickname));

        StudyEntity study = studyRepository.findById(studyId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid study ID: " + studyId));

        if (user.getLikedStudies().contains(study)) {
            // If user already liked the study, remove like
            user.getLikedStudies().remove(study);
            study.getLikedByUsers().remove(user);
            study.setLikes(Math.max(0, study.getLikes() - 1)); // Ensure likes do not go negative
        } else {
            // User has not liked the study yet, add like
            user.getLikedStudies().add(study);
            study.getLikedByUsers().add(user);
            study.setLikes(study.getLikes() + 1);
        }

        userRepository.save(user);
        studyRepository.save(study);

        return study;
    }
    @Transactional
    public void deleteStudy(int studyId) {
        studyRepository.deleteById(studyId); // studyId를 이용해 스터디 삭제
    }

}
