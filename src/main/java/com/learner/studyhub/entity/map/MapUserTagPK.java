package com.learner.studyhub.entity.map;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Getter
@Embeddable
@NoArgsConstructor
public class MapUserTagPK implements Serializable {
    @Column(name = "userId")
    private String userId;

    @Column(name = "tagId")
    private Integer tagId;

    public MapUserTagPK(String userId, Integer tagId){
        this.userId = userId;
        this.tagId = tagId;
    }
}
