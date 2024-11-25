package com.learner.studyhub.service;

import com.learner.studyhub.dto.StudyDTO;
import com.learner.studyhub.entity.ApplicationStatus;
import com.learner.studyhub.entity.StudyEntity;
import com.learner.studyhub.entity.StudyMemberEntity;
import com.learner.studyhub.repository.ApplicationRepository;
import com.learner.studyhub.repository.StudyMemberRepository;
import com.learner.studyhub.repository.StudyRepository;
import com.learner.studyhub.users.entity.UserEntity;
import com.learner.studyhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudyService {

    private final StudyRepository studyRepository;
    private final UserRepository userRepository;
    private final StudyMemberRepository studyMemberRepository;
    private final ApplicationRepository applicationRepository;

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

    //닉네임으로 스터디 조회
    public List<StudyDTO> getStudiesByCreator(String nickname) {
        UserEntity user = userRepository.findByNickname(nickname)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // StudyEntity -> StudyDTO로 변환하여 반환
        return studyRepository.findByStudyCreator(user).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    @Transactional
    public void deleteStudy(int studyId) {
        studyRepository.deleteById(studyId); // studyId를 이용해 스터디 삭제
    }

    public boolean isMember(int studyId, String userId) {
        return studyMemberRepository.existsByStudyIdAndUserId(studyId, userId);
    }

    @Transactional
    public void saveApplicationStatus(String studyId, String userId) {
        Optional<ApplicationStatus> existingApplication = applicationRepository.findByStudyIdAndUserId(
                Integer.parseInt(studyId), userId
        );

        if (existingApplication.isPresent()) {
            throw new IllegalStateException("이미 가입 신청이 존재합니다.");
        }

        ApplicationStatus application = new ApplicationStatus();
        application.setStudyId(Integer.parseInt(studyId));
        application.setUserId(userId);
        application.setStatus("대기중");

        applicationRepository.save(application);
    }


    // 스터디 ID로 가입 신청 목록을 조회
//    public List<ApplicationStatus> getApplicationsByStudyId(int studyId) {
//        System.out.println(studyId);
//        System.out.println(applicationRepository.findByStudyId(studyId));
//        return applicationRepository.findByStudyId(studyId);
//    }

    public List<ApplicationStatus> getApplicationsByStudyId(int studyId) {
        // APPROVED 상태 제외
        return applicationRepository.findPendingOrRejectedByStudyId(studyId);
    }

    @Transactional
    public void approveApplication(int studyId, String userId) {
        // 가입 신청을 조회하고 상태를 "APPROVED"로 업데이트
        ApplicationStatus application = applicationRepository.findByStudyIdAndUserId(studyId, userId)
                .orElseThrow(() -> new IllegalArgumentException("가입 신청을 찾을 수 없습니다."));

        application.setStatus("승인완료");
        applicationRepository.save(application);

        // StudyMemberEntity에 studyId와 userId 값을 저장하여 승인된 사용자를 추가
        StudyMemberEntity studyMember = new StudyMemberEntity();
        studyMember.setStudyId(studyId);  // studyId를 값으로 설정
        studyMember.setUserId(userId);    // userId를 값으로 설정
        studyMemberRepository.save(studyMember);
    }

    // 가입 거절 메서드
    @Transactional
    public void rejectApplication(int studyId, String userId) {
        ApplicationStatus application = applicationRepository.findByStudyIdAndUserId(studyId, userId)
                .orElseThrow(() -> new IllegalArgumentException("가입 신청을 찾을 수 없습니다."));

        application.setStatus("거절");
        applicationRepository.save(application);
    }

    public String getMembershipStatus(int studyId, String userId) {
        // 이미 멤버인지 확인
        if (studyMemberRepository.existsByStudyIdAndUserId(studyId, userId)) {
            return "승인완료";
        }

        // 가입 신청 상태 확인
        Optional<ApplicationStatus> application = applicationRepository.findByStudyIdAndUserId(studyId, userId);
        if (application.isPresent()) {
            return application.get().getStatus(); // PENDING, REJECTED 등을 반환
        }

        // 가입 신청하지 않은 상태
        return "허용되지 않은 상태";
    }


    @Transactional
    public void leaveStudy(int studyId, String userId) {
        // application_status 테이블에서 해당 스터디와 사용자 정보 삭제
        applicationRepository.deleteByStudyIdAndUserId(studyId, userId);

        // studymemberentity 테이블에서 해당 스터디와 사용자 정보 삭제
        studyMemberRepository.deleteByStudyIdAndUserId(studyId, userId);
    }



    private StudyDTO convertToDTO(StudyEntity entity) {
        return new StudyDTO(
                entity.getStudyId(),
                entity.getStudyCreator().getNickname(),
                entity.getStudyCreateDate(),
                entity.getStudyLastDate(),
                entity.getStudyTitle(),
                entity.getStudyComment(),
                entity.getStudyTitlePicture(),
                entity.isPwStatus(),
                entity.getStudyPw(),
                entity.getLikes(),
                false // `isLiked` 필드는 필요에 따라 설정
        );
    }
}
