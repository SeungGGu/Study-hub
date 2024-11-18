package com.learner.studyhub.repository;

import com.learner.studyhub.entity.StudyEntity;
import com.learner.studyhub.users.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudyRepository extends JpaRepository<StudyEntity, Integer> {
    List<StudyEntity> findByStudyCreator(UserEntity studyCreator); // StudyEntity 목록을 UserEntity 기준으로 조회
    List<StudyEntity> findByStudyCreatorNickname(String nickname);
}
