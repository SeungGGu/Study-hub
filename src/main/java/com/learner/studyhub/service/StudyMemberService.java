package com.learner.studyhub.service;

import com.learner.studyhub.entity.StudyEntity;
import com.learner.studyhub.entity.StudyMemberEntity;
import com.learner.studyhub.repository.StudyMemberRepository;
import com.learner.studyhub.repository.StudyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudyMemberService {

    private final StudyMemberRepository studyMemberRepository;
    private final StudyRepository studyRepository;

    public List<StudyEntity> findStudiesByUserId(String userId) {
        System.out.println("조회 중인 userId: " + userId);  // userId 로그 출력

        List<StudyMemberEntity> studyMembers = studyMemberRepository.findByUserId(userId);
        System.out.println("찾은 스터디 멤버 수: " + studyMembers.size());  // 찾은 스터디 멤버 수 출력

        // 스터디가 없는 경우 빈 리스트를 반환
        if (studyMembers.isEmpty()) {
            System.out.println("가입한 스터디가 없습니다.");
            return List.of();
        }

        return studyMembers.stream()
                .map(studyMember -> {
                    StudyEntity study = studyRepository.findById(studyMember.getStudyId())
                            .orElseThrow(() -> new IllegalArgumentException("스터디를 찾을 수 없습니다: " + studyMember.getStudyId()));
                    System.out.println("찾은 스터디: " + study.getStudyTitle());  // 각 스터디 타이틀 로그 출력
                    return study;
                })
                .collect(Collectors.toList());
    }
}
