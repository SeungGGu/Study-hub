package com.learner.studyhub.entity;

import com.learner.studyhub.entity.map.MapUserTagPK;
import com.learner.studyhub.users.entity.UserEntity;
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
@Table(name = "userTag")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserTagEntity {
    @Id
    @EmbeddedId
    private MapUserTagPK MapUserTagPK;

    @MapsId(value = "userId")
    @ManyToOne
    @JoinColumn(name = "userId", referencedColumnName = "userId")
    private UserEntity userId;

    @MapsId(value = "tagId")
    @ManyToOne
    @JoinColumn(name = "tagId", referencedColumnName = "tagId")
    private TagsEntity tagId;
}
