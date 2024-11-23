package com.learner.studyhub.service;

import com.learner.studyhub.dto.StudyDTO;
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

    public List<StudyDTO> findStudiesByUserId(String userId) {
        List<StudyMemberEntity> studyMembers = studyMemberRepository.findByUserId(userId);

        return studyMembers.stream()
                .map(member -> {
                    StudyEntity study = studyRepository.findById(member.getStudyId())
                            .orElseThrow(() -> new IllegalArgumentException("스터디를 찾을 수 없습니다: " + member.getStudyId()));
                    return convertToDTO(study);
                })
                .collect(Collectors.toList());
    }

    private StudyDTO convertToDTO(StudyEntity study) {
        return new StudyDTO(
                study.getStudyId(),
                study.getStudyCreator().getNickname(),
                study.getStudyCreateDate(),
                study.getStudyLastDate(),
                study.getStudyTitle(),
                study.getStudyComment(),
                study.getStudyTitlePicture(),
                study.isPwStatus(),
                study.getStudyPw(),
                study.getLikes(),
                false // isLiked는 필요에 따라 설정
        );
    }

}
