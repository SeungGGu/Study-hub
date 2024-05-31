package com.learner.studyhub.service;

import com.learner.studyhub.dto.BoardDTO;
import com.learner.studyhub.entity.BoardEntity;
import com.learner.studyhub.repository.BoardRepository;
import com.learner.studyhub.repository.UserRepository;
import com.learner.studyhub.users.entity.UserEntity;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BoardService {

    private final BoardRepository boardRepository;
    private final UserRepository userRepository;
    private static final Logger logger = LoggerFactory.getLogger(BoardService.class);
    @Transactional
    public BoardDTO createBoard(BoardDTO boardDTO) {
        logger.info("Creating Board with DTO: {}", boardDTO);

        BoardEntity boardEntity = new BoardEntity();

        String nickname = boardDTO.getBoardNickname();
        Optional<UserEntity> userEntityOptional = userRepository.findByNickname(nickname);

        if (userEntityOptional.isPresent()) {
            UserEntity userEntity = userEntityOptional.get();
            logger.info("User found with nickname: {}", userEntity);

            boardEntity.setBoardNickname(userEntity);
        } else {
            throw new IllegalArgumentException("User with nickname does not exist.");
        }

        boardEntity.setBoardTitle(boardDTO.getBoardTitle());
        boardEntity.setBoardDetail(boardDTO.getBoardDetail());
        boardEntity.setBoardCategory(boardDTO.getBoardCategory());

        boardEntity.setBoardView(0);
        boardEntity.setBoardGreat(0);

        BoardEntity savedBoard = boardRepository.save(boardEntity);
        logger.info("Saved Board: {}", savedBoard);

        boardDTO.setBoardId(savedBoard.getBoardId());
        return boardDTO;
    }

    public Optional<BoardEntity> getBoardById(Integer boardId) {
        return boardRepository.findById(boardId);
    }

    public List<BoardEntity> getAllBoards() {
        return boardRepository.findAll();
    }



}