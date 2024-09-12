package com.learner.studyhub.service;

import com.learner.studyhub.dto.BoardDTO;
import com.learner.studyhub.entity.BoardEntity;
import com.learner.studyhub.entity.LikeEntity;
import com.learner.studyhub.repository.BoardRepository;
import com.learner.studyhub.repository.LikeRepository;
import com.learner.studyhub.repository.UserRepository;
import com.learner.studyhub.users.entity.UserEntity;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BoardService {
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;
    private final LikeRepository likeRepository;

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

    public BoardEntity save(BoardEntity boardEntity) {
        return boardRepository.save(boardEntity);
    }

    @Transactional
    public void deleteBoard(Integer boardId) {
        Optional<BoardEntity> boardOptional = boardRepository.findById(boardId);
        if (boardOptional.isPresent()) {
            BoardEntity board = boardOptional.get();
            boardRepository.deleteById(boardId); // 게시물 삭제
            logger.info("Deleted board with ID: {}", boardId);
        } else {
            throw new IllegalArgumentException("Board with ID " + boardId + " not found.");
        }
    }
    // 게시물 업데이트 메서드 추가
    @Transactional
    public BoardDTO updateBoard(Integer boardId, BoardDTO boardDTO) {
        Optional<BoardEntity> boardEntityOptional = boardRepository.findById(boardId);
        if (boardEntityOptional.isPresent()) {
            BoardEntity boardEntity = boardEntityOptional.get();

            // 게시물의 제목, 내용, 카테고리 업데이트
            boardEntity.setBoardTitle(boardDTO.getBoardTitle());
            boardEntity.setBoardDetail(boardDTO.getBoardDetail());
            boardEntity.setBoardCategory(boardDTO.getBoardCategory());

            BoardEntity updatedBoard = boardRepository.save(boardEntity);
            boardDTO.setBoardId(updatedBoard.getBoardId());
            return boardDTO;
        } else {
            throw new IllegalArgumentException("Board with ID " + boardId + " not found.");
        }
    }

    // 조회 수 증가 메서드 추가
    @Transactional
    public void incrementBoardView(Integer boardId) {
        Optional<BoardEntity> boardEntityOptional = boardRepository.findById(boardId);
        if (boardEntityOptional.isPresent()) {
            BoardEntity boardEntity = boardEntityOptional.get();
            boardEntity.setBoardView(boardEntity.getBoardView() + 1); // 조회 수 증가
            boardRepository.save(boardEntity);
        } else {
            throw new IllegalArgumentException("Board with ID " + boardId + " not found.");
        }
    }
    @Transactional
    public void toggleLikeBoard(Integer boardId, String userNickname) {
        Optional<BoardEntity> boardOptional = boardRepository.findById(boardId);
        Optional<UserEntity> userOptional = userRepository.findByNickname(userNickname);

        if (boardOptional.isPresent() && userOptional.isPresent()) {
            BoardEntity board = boardOptional.get();
            UserEntity user = userOptional.get();

            // 사용자가 이 게시물에 대해 좋아요를 이미 눌렀는지 확인
            Optional<LikeEntity> likeOptional = likeRepository.findByBoardAndUser(board, user);
            if (likeOptional.isPresent()) {
                // 이미 좋아요를 눌렀다면 좋아요 취소
                likeRepository.delete(likeOptional.get());
                board.setBoardGreat(board.getBoardGreat() - 1);  // 좋아요 수 감소
            } else {
                // 좋아요 누름
                LikeEntity like = new LikeEntity();
                like.setBoard(board);
                like.setUser(user);
                likeRepository.save(like);
                board.setBoardGreat(board.getBoardGreat() + 1);  // 좋아요 수 증가
            }
            boardRepository.save(board);  // 좋아요 수 업데이트
        } else {
            throw new IllegalArgumentException("Invalid boardId or userNickname");
        }
    }
    @Transactional
    public int getLikeCountByBoard(Integer boardId) {
        Optional<BoardEntity> boardOptional = boardRepository.findById(boardId);
        if (boardOptional.isPresent()) {
            return (int) likeRepository.countByBoard(boardOptional.get());
        } else {
            throw new IllegalArgumentException("Invalid boardId");
        }
    }
    // 인기 태그를 계산하는 메서드
    @Transactional
    public List<String> getPopularTags() {
        List<BoardEntity> boards = boardRepository.findAll();
        Map<String, Integer> tagCountMap = new HashMap<>();

        for (BoardEntity board : boards) {
            String[] tags = board.getBoardCategory().split(",");
            for (String tag : tags) {
                tagCountMap.put(tag, tagCountMap.getOrDefault(tag, 0) + 1);
            }
        }

        // 태그를 빈도수에 따라 정렬하고 상위 5개 태그를 반환
        return tagCountMap.entrySet().stream()
                .sorted((entry1, entry2) -> entry2.getValue().compareTo(entry1.getValue()))
                .limit(5)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }

    // 새로운 메서드: 게시물 제목으로 검색
    @Transactional
    // BoardEntity -> BoardDTO 수정
    public List<BoardDTO> searchBoardsByTitle(String title) {
        List<BoardEntity> boards = boardRepository.findByBoardTitleContainingIgnoreCase(title);
        return boards.stream().map(board -> {
            BoardDTO boardDTO = new BoardDTO();
            boardDTO.setBoardId(board.getBoardId());
            boardDTO.setBoardTitle(board.getBoardTitle());
            boardDTO.setBoardDetail(board.getBoardDetail());
            boardDTO.setBoardCategory(board.getBoardCategory());
            // 유저 엔티티의 닉네임을 DTO에 설정
            boardDTO.setBoardNickname(board.getBoardNickname().getNickname());
            boardDTO.setBoardView(board.getBoardView());
            boardDTO.setBoardGreat(board.getBoardGreat());
            return boardDTO;
        }).collect(Collectors.toList());
    }
    // 새로운 메서드: 태그로 검색
    @Transactional
    public List<BoardDTO> searchBoardsByTag(String tag) {
        List<BoardEntity> boards = boardRepository.findByBoardCategoryContainingIgnoreCase(tag);
        return boards.stream().map(board -> {
            BoardDTO boardDTO = new BoardDTO();
            boardDTO.setBoardId(board.getBoardId());
            boardDTO.setBoardTitle(board.getBoardTitle());
            boardDTO.setBoardDetail(board.getBoardDetail());
            boardDTO.setBoardCategory(board.getBoardCategory());
            boardDTO.setBoardNickname(board.getBoardNickname().getNickname());
            boardDTO.setBoardView(board.getBoardView());
            return boardDTO;
        }).collect(Collectors.toList());
    }

    // 조회수가 높은 순으로 인기 게시물 가져오기
    @Transactional
    public List<BoardDTO> getPopularBoards() {
        List<BoardEntity> boards = boardRepository.findAllByOrderByBoardViewDesc();
        return boards.stream().map(board -> {
            BoardDTO boardDTO = new BoardDTO();
            boardDTO.setBoardId(board.getBoardId());
            boardDTO.setBoardTitle(board.getBoardTitle());
            boardDTO.setBoardDetail(board.getBoardDetail());
            boardDTO.setBoardCategory(board.getBoardCategory());
            boardDTO.setBoardNickname(board.getBoardNickname().getNickname());
            boardDTO.setBoardView(board.getBoardView());
            return boardDTO;
        }).collect(Collectors.toList());
    }
}