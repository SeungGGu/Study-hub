package com.learner.studyhub.service;

import com.learner.studyhub.entity.BoardEntity;
import com.learner.studyhub.entity.LikeEntity;
import com.learner.studyhub.repository.BoardRepository;
import com.learner.studyhub.repository.LikeRepository;
import com.learner.studyhub.repository.UserRepository;
import com.learner.studyhub.users.entity.UserEntity;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository likeRepository;
    private final UserRepository userRepository;
    private final BoardRepository boardRepository;

    // 좋아요 토글 메서드
    @Transactional
    public boolean toggleLike(String nickname, Integer boardId) {
        UserEntity user = userRepository.findByNickname(nickname)
                .orElseThrow(() -> new IllegalArgumentException("Invalid nickname."));
        BoardEntity board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid board ID."));

        Optional<LikeEntity> likeOptional = likeRepository.findByBoardAndUser(board, user);

        if (likeOptional.isPresent()) {
            likeRepository.delete(likeOptional.get());
            board.setBoardGreat(board.getBoardGreat() - 1);
        } else {
            LikeEntity like = new LikeEntity();
            like.setBoard(board);
            like.setUser(user);
            likeRepository.save(like);
            board.setBoardGreat(board.getBoardGreat() + 1);
        }

        boardRepository.save(board);
        return likeOptional.isEmpty();  // true if liked, false if unliked
    }

    // 사용자가 특정 게시물을 좋아하는지 확인
    public boolean isBoardLikedByUser(String nickname, Integer boardId) {
        UserEntity user = userRepository.findByNickname(nickname)
                .orElseThrow(() -> new IllegalArgumentException("Invalid nickname."));
        BoardEntity board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid board ID."));

        return likeRepository.existsLikeEntityByBoardAndUser(board, user);
    }

    // 사용자가 좋아요한 모든 게시물 ID 목록 반환
    public List<Integer> getUserLikedBoards(String nickname) {
        UserEntity user = userRepository.findByNickname(nickname)
                .orElseThrow(() -> new IllegalArgumentException("Invalid nickname."));
        return likeRepository.findByUser(user)
                .stream()
                .map(like -> like.getBoard().getBoardId())
                .collect(Collectors.toList());
    }
}