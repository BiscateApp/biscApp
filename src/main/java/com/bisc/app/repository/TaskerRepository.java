package com.bisc.app.repository;

import com.bisc.app.domain.Tasker;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Tasker entity.
 */
@Repository
public interface TaskerRepository extends JpaRepository<Tasker, Long> {
    @Query("select tasker from Tasker tasker where tasker.user.login = ?#{principal.username}")
    List<Tasker> findByUserIsCurrentUser();

    default Optional<Tasker> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Tasker> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Tasker> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(value = "select tasker from Tasker tasker left join fetch tasker.user", countQuery = "select count(tasker) from Tasker tasker")
    Page<Tasker> findAllWithToOneRelationships(Pageable pageable);

    @Query("select tasker from Tasker tasker left join fetch tasker.user")
    List<Tasker> findAllWithToOneRelationships();

    @Query("select tasker from Tasker tasker left join fetch tasker.user where tasker.id =:id")
    Optional<Tasker> findOneWithToOneRelationships(@Param("id") Long id);
}
