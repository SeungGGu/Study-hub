//package com.learner.studyhub.repository;
//
//import com.learner.studyhub.entity.BoardEntity;
//import com.learner.studyhub.entity.LikeEntity;
//import com.learner.studyhub.users.entity.UserEntity;
//import org.springframework.data.jpa.repository.JpaRepository;
//
//import java.util.Optional;
//
//public interface LikeRepository extends JpaRepository<LikeEntity, Long> {
//    Optional<LikeEntity> findByBoardAndUser(BoardEntity board, UserEntity user);
//    boolean existsByBoardAndUser(BoardEntity board, UserEntity user);
//
//}
package com.learner.studyhub.repository;

import com.learner.studyhub.entity.BoardEntity;
import com.learner.studyhub.entity.LikeEntity;
import com.learner.studyhub.users.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LikeRepository extends JpaRepository<LikeEntity, Long> {
    // 게시물과 사용자로 좋아요 조회
    Optional<LikeEntity> findByBoardAndUser(BoardEntity board, UserEntity user);

    // 게시물과 사용자로 좋아요 여부 확인 (메서드 이름 변경)
    boolean existsLikeEntityByBoardAndUser(BoardEntity board, UserEntity user);

    // 특정 사용자가 좋아요한 모든 게시물 조회
    List<LikeEntity> findByUser(UserEntity user);
}