package com.learner.studyhub.service; // 패키지 선언

import com.learner.studyhub.dto.BoardDTO; // BoardDTO 클래스 임포트
import com.learner.studyhub.entity.BoardEntity; // BoardEntity 클래스 임포트
import com.learner.studyhub.repository.BoardRepository; // BoardRepository 인터페이스 임포트
import com.learner.studyhub.users.entity.UserEntity; // UserEntity 클래스 임포트
import com.learner.studyhub.users.repository.UserRepository; // UserRepository 인터페이스 임포트
import lombok.RequiredArgsConstructor; // Lombok의 RequiredArgsConstructor 어노테이션 임포트
import org.springframework.stereotype.Service; // 스프링의 Service 어노테이션 임포트

import java.util.Optional; // Optional 클래스 임포트

@Service // 이 클래스가 서비스 컴포넌트임을 나타내는 어노테이션
@RequiredArgsConstructor // final 필드에 대해 생성자를 자동으로 생성해주는 Lombok 어노테이션
public class BoardService { // BoardService 클래스 정의
    private final BoardRepository boardRepository; // BoardRepository 의존성 주입
    private final UserRepository userRepository; // UserRepository 의존성 주입

    // 새로운 게시물을 생성하는 메서드
    public BoardDTO createBoard(BoardDTO boardDTO) {

        BoardEntity boardEntity = new BoardEntity();
        // 닉네임으로 유저를 조회하여 Optional 객체로 반환
        Optional<UserEntity> userEntityOptional = userRepository.findByNickname(boardDTO.getBoardNickname());
        // 유저가 존재하는지 확인
        if (userEntityOptional.isPresent()) {
            // 유저가 존재하면 UserEntity 객체를 가져옴
            UserEntity userEntity = userEntityOptional.get();
            // 유저 정보를 출력 (디버깅용)
            System.out.println("유저 nickname 검색: " + userEntity);

            boardEntity.setBoardTitle(boardDTO.getBoardTitle()); // 게시물 제목 설정
            boardEntity.setBoardDetail(boardDTO.getBoardDetail()); // 게시물 내용 설정
            boardEntity.setBoardCategory(boardDTO.getBoardCategory()); // 게시물 카테고리 설정
            boardEntity.setBoardNickname(userEntity); // 게시물 작성자 설정
            boardEntity.setBoardView(0); // 초기 조회수를 0으로 설정
            boardEntity.setBoardGreat(0); // 초기 좋아요 수를 0으로 설정

            // BoardEntity 객체를 데이터베이스에 저장
            BoardEntity savedBoard = boardRepository.save(boardEntity);
            // 저장된 게시물의 ID를 DTO에 설정
            boardDTO.setBoardId(savedBoard.getBoardId());
            // DTO를 반환
            return boardDTO;
        } else {
            // 유저가 존재하지 않는 경우 예외를 발생시킴
            throw new IllegalArgumentException("해당 nickname을 가진 유저가 존재하지 않습니다.");
        }
    }

    // ID로 게시물을 가져오는 메서드
    public Optional<BoardEntity> getBoardById(Integer boardId) {
        // ID로 게시물을 조회하여 Optional 객체로 반환
        return boardRepository.findById(boardId);
    }
}