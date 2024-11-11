package com.learner.studyhub.repository;

import com.learner.studyhub.entity.StudyMemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudyMemberRepository extends JpaRepository<StudyMemberEntity, Long> {
    boolean existsByStudyIdAndUserId(int studyId, String userId);
    List<StudyMemberEntity> findByUserId(String userId);
}
