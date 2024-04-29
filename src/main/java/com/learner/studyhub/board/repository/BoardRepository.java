package com.learner.studyhub.Post.repository;

import com.learner.studyhub.Post.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {

}
