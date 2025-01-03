package com.learner.studyhub.controller;

import com.learner.studyhub.dto.BoardDTO;
import com.learner.studyhub.entity.BoardEntity;
import com.learner.studyhub.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/boards")
@RequiredArgsConstructor
public class BoardController {
    private final BoardService boardService;
    private static final Logger logger = LoggerFactory.getLogger(BoardController.class);

    // 게시물 생성
    @PostMapping("/create")
    public BoardDTO createBoard(@RequestBody BoardDTO boardDTO) {
        logger.info("Received BoardDTO: {}", boardDTO);
        return boardService.createBoard(boardDTO);
    }
    // ID로 게시물 조회
    @GetMapping("/{boardId}")
    public BoardDTO getBoardById(@PathVariable Integer boardId) {
//        boardService.incrementBoardView(boardId); // 조회 수 증가 호출
        return boardService.getBoardById(boardId)
                .map(board -> {
                    BoardDTO boardDTO = new BoardDTO();
                    boardDTO.setBoardId(board.getBoardId());
                    boardDTO.setBoardTitle(board.getBoardTitle());
                    boardDTO.setBoardDetail(board.getBoardDetail());
                    boardDTO.setBoardCategory(board.getBoardCategory());
                    boardDTO.setBoardNickname(board.getBoardNickname().getNickname());
                    boardDTO.setUserEmail(board.getBoardNickname().getEmail());
                    boardDTO.setBoardView(board.getBoardView()); // 조회 수 전달
                    return boardDTO;
                })
                .orElseThrow(() -> new IllegalArgumentException("해당 ID를 가진 게시물이 없습니다."));
    }
    // 게시물 클릭 시 조회수를 증가
    @PostMapping("/{boardId}/increment-view")
    public ResponseEntity<Void> incrementBoardView(@PathVariable Integer boardId) {
        boardService.incrementBoardView(boardId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    @GetMapping
    public List<BoardDTO> getAllBoards() {
        List<BoardEntity> boardEntities = boardService.getAllBoards();
        return boardEntities.stream().map(board -> {
            BoardDTO boardDTO = new BoardDTO();
            boardDTO.setBoardId(board.getBoardId());
            boardDTO.setBoardTitle(board.getBoardTitle());
            boardDTO.setBoardDetail(board.getBoardDetail());
            boardDTO.setBoardCategory(board.getBoardCategory());
            boardDTO.setBoardNickname(board.getBoardNickname().getNickname());
            boardDTO.setBoardView(board.getBoardView()); // 조회 수 전달
            return boardDTO;
        }).collect(Collectors.toList());
    }
    @PostMapping("/{boardId}/like")
    public ResponseEntity<Map<String, Object>> toggleLikeBoard(@PathVariable Integer boardId, @RequestParam String userNickname) {
        boolean isLiked = boardService.toggleLikeBoard(boardId, userNickname);
        Map<String, Object> response = new HashMap<>();
        response.put("isLiked", isLiked);
        return ResponseEntity.ok(response);
    }
    // 사용자가 특정 게시물에 좋아요를 눌렀는지 확인
    @GetMapping("/{boardId}/is-liked")
    public ResponseEntity<Map<String, Object>> isBoardLikedByUser(@PathVariable Integer boardId, @RequestParam String userNickname) {
        boolean isLiked = boardService.isBoardLikedByUser(boardId, userNickname);
        Map<String, Object> response = new HashMap<>();
        response.put("isLiked", isLiked);
        return ResponseEntity.ok(response);
    }


    @DeleteMapping("/{boardId}")
    public ResponseEntity<Void> deleteBoard(@PathVariable Integer boardId) {
        try {
            boardService.deleteBoard(boardId);
            logger.info("Board with ID {} deleted successfully", boardId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (IllegalArgumentException e) {
            logger.error("Board not found: {}", e.getMessage());
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            logger.error("Error deleting board: {}", e.getMessage(), e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    // 새로운 게시물 업데이트
    @PutMapping("/{boardId}")
    public ResponseEntity<BoardDTO> updateBoard(@PathVariable Integer boardId, @RequestBody BoardDTO boardDTO) {
        try {
            BoardDTO updatedBoard = boardService.updateBoard(boardId, boardDTO);
            return new ResponseEntity<>(updatedBoard, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    // 인기 태그 목록 가져오기
    @GetMapping("/popular-tags")
    public ResponseEntity<List<String>> getPopularTags() {
        List<String> popularTags = boardService.getPopularTags();
        return new ResponseEntity<>(popularTags, HttpStatus.OK);
    }

    //게시물 제목으로 검색
    @GetMapping("/search")
    public ResponseEntity<List<BoardDTO>> searchBoards(@RequestParam String query,@RequestParam(defaultValue = "title") String type) {
        List<BoardDTO> boards;
        if ("title".equalsIgnoreCase(type)) {
            boards = boardService.searchBoardsByTitle(query);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(boards, HttpStatus.OK);
    }
    // 인기 게시물 목록
    @GetMapping("/popular-boards")
    public ResponseEntity<List<BoardDTO>> getPopularBoards() {
        List<BoardDTO> popularBoards = boardService.getPopularBoards();
        return new ResponseEntity<>(popularBoards, HttpStatus.OK);
    }
}
