package com.learner.studyhub.repository;

import com.learner.studyhub.entity.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<ApplicationStatus, Long> {

    // 특정 스터디의 모든 가입 신청 목록을 조회
    List<ApplicationStatus> findByStudyId(int studyId);

    // 특정 스터디와 사용자에 해당하는 가입 신청 찾기
    Optional<ApplicationStatus> findByStudyIdAndUserId(int studyId, String userId);

    //APPROVE 빼고 조회
    @Query("SELECT a FROM ApplicationStatus a WHERE a.studyId = :studyId AND a.status <> 'APPROVED'")
    List<ApplicationStatus> findPendingOrRejectedByStudyId(int studyId);

}
