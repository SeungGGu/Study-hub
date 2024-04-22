package com.learner.studyhub.entity;

import com.learner.studyhub.entity.map.MapStudyTagPK;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter
@Table(name = "studyTag")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class StudyTagEntity {
    @Id
    @EmbeddedId
    private MapStudyTagPK MapStudyTagPK;

    @MapsId(value = "studyId")
    @ManyToOne
    @JoinColumn(name = "studyId", referencedColumnName = "studyId")
    private StudyEntity studyId;

    @MapsId(value = "tagId")
    @ManyToOne
    @JoinColumn(name = "tagId", referencedColumnName = "tagId")
    private TagsEntity tagId;
}
