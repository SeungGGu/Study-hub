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
    @Transactional
    public CommentDTO updateComment(Integer commentId, CommentDTO commentDTO) {
        Optional<CommentEntity> commentEntityOptional = commentRepository.findById(commentId);

        if (commentEntityOptional.isPresent()) {
            CommentEntity commentEntity = commentEntityOptional.get();
            commentEntity.setCommentText(commentDTO.getCommentText());  // Update comment text
            commentEntity.setCreatedDate(new Date());  // Optionally update the date to now

            CommentEntity updatedComment = commentRepository.save(commentEntity);
            commentDTO.setCreatedDate(updatedComment.getCreatedDate());
            return commentDTO;
        } else {
            throw new IllegalArgumentException("Comment with ID " + commentId + " not found");
        }
    }


    @Transactional
    public void deleteComment(Integer commentId) {
        Optional<CommentEntity> commentEntityOptional = commentRepository.findById(commentId);

        if (commentEntityOptional.isPresent()) {
            commentRepository.deleteById(commentId);
        } else {
            throw new IllegalArgumentException("Comment with ID " + commentId + " not found");
        }
    }


    @Transactional
    public List<CommentDTO> getCommentsByUserNickname(String userNickname) {
        List<CommentEntity> comments = commentRepository.findByUserNickname(userNickname);
        return comments.stream().map(comment -> {
            CommentDTO commentDTO = new CommentDTO();
            commentDTO.setCommentId(comment.getCommentId());
            commentDTO.setBoardId(comment.getBoard().getBoardId());
            commentDTO.setUserNickname(comment.getUser().getNickname());
            commentDTO.setCommentText(comment.getCommentText());
            commentDTO.setCreatedDate(comment.getCreatedDate());
            commentDTO.setBoardTitle(comment.getBoard().getBoardTitle());

            return commentDTO;
        }).collect(Collectors.toList());
    }
}
