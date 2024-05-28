package com.learner.studyhub.controller;

import com.learner.studyhub.dto.BoardDTO;
import com.learner.studyhub.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/boards")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    // 게시물 생성 엔드포인트
    @PostMapping("/create")
    public BoardDTO createBoard(@RequestBody BoardDTO boardDTO) {
        return boardService.createBoard(boardDTO);
    }

    // 특정 ID로 게시물 가져오기 엔드포인트
    @GetMapping("/{boardId}")
    public BoardDTO getBoardById(@PathVariable Long boardId) {
        return boardService.getBoardById(Math.toIntExact(boardId))
                .map(board -> {
                    BoardDTO boardDTO = new BoardDTO();
                    boardDTO.setBoardId(board.getBoardId());
                    boardDTO.setBoardTitle(board.getBoardTitle());
                    boardDTO.setBoardDetail(board.getBoardDetail());
                    boardDTO.setBoardCategory(board.getBoardCategory());
                    boardDTO.setBoardNickname(board.getBoardNickname().getNickname());
                    boardDTO.setUserEmail(board.getBoardNickname().getEmail());
                    return boardDTO;
                })
                .orElseThrow(() -> new IllegalArgumentException("해당 ID를 가진 게시물이 없습니다."));
    }
}
