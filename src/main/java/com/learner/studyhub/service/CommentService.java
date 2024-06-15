package com.learner.studyhub.service;

import com.learner.studyhub.dto.CommentDTO;
import com.learner.studyhub.entity.BoardEntity;
import com.learner.studyhub.entity.CommentEntity;
import com.learner.studyhub.repository.BoardRepository;
import com.learner.studyhub.repository.CommentRepository;
import com.learner.studyhub.repository.UserRepository;
import com.learner.studyhub.users.entity.UserEntity;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;

    @Transactional
    public CommentDTO addComment(CommentDTO commentDTO) {
        CommentEntity commentEntity = new CommentEntity();

        Optional<BoardEntity> boardEntityOptional = boardRepository.findById(commentDTO.getBoardId());
        Optional<UserEntity> userEntityOptional = userRepository.findByNickname(commentDTO.getUserNickname());

        if (boardEntityOptional.isPresent() && userEntityOptional.isPresent()) {
            commentEntity.setBoard(boardEntityOptional.get());
            commentEntity.setUser(userEntityOptional.get());
            commentEntity.setCommentText(commentDTO.getCommentText());
            commentEntity.setCreatedDate(new Date());

            CommentEntity savedComment = commentRepository.save(commentEntity);
            commentDTO.setCommentId(savedComment.getCommentId());
            return commentDTO;
        } else {
            throw new IllegalArgumentException("Invalid boardId or userNickname");
        }
    }

    public List<CommentDTO> getCommentsByBoardId(Integer boardId) {
        List<CommentEntity> comments = commentRepository.findByBoardBoardId(boardId);
        return comments.stream().map(comment -> {
            CommentDTO commentDTO = new CommentDTO();
            commentDTO.setCommentId(comment.getCommentId());
            commentDTO.setBoardId(comment.getBoard().getBoardId());
            commentDTO.setUserNickname(comment.getUser().getNickname());
            commentDTO.setCommentText(comment.getCommentText());
            commentDTO.setCreatedDate(comment.getCreatedDate());
            return commentDTO;
        }).collect(Collectors.toList());
    }
}
