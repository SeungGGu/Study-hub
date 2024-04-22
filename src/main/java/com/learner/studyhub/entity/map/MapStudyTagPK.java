package com.learner.studyhub.entity.map;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Getter
@Embeddable
@NoArgsConstructor
public class MapStudyTagPK implements Serializable {
    @Column(name = "studyId")
    private Integer studyId;

    @Column(name = "tagId")
    private Integer tagId;

    public MapStudyTagPK(Integer studyId, Integer tagId){
        this.studyId = studyId;
        this.tagId = tagId;
    }
}
