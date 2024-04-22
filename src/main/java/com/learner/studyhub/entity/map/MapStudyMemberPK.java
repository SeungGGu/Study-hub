package com.learner.studyhub.entity.map;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Getter
@Embeddable
@NoArgsConstructor
public class MapStudyMemberPK implements Serializable {
    @Column(name = "userId")
    private String userId;

    @Column(name = "studyId")
    private Integer studyId;

    public MapStudyMemberPK(String userId, Integer studyId){
        this.studyId = studyId;
        this.userId = userId;
    }
}
