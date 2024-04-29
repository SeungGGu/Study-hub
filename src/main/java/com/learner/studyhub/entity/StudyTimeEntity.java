package com.learner.studyhub.entity;

import com.learner.studyhub.entity.map.MapStudyMemberPK;
import com.learner.studyhub.users.entity.UserEntity;
import jakarta.persistence.Column;
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
@Table(name = "studyTime")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class StudyTimeEntity {
    @Id
    @EmbeddedId
    private MapStudyMemberPK mapStudyMemberPK;

    @MapsId(value = "userId")
    @ManyToOne
    @JoinColumn(name = "userId", referencedColumnName = "userId")
    private UserEntity userId;

    @MapsId(value = "studyId")
    @ManyToOne
    @JoinColumn(name = "studyId", referencedColumnName = "studyId")
    private StudyEntity studyId;

    @Column(nullable = false)
    private String studyTimeStart;

    @Column(nullable = false)
    private String studyTimeEnd;
}
