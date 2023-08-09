package com.bisc.app.repository;

import com.bisc.app.domain.Tasker;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Tasker entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TaskerRepository extends JpaRepository<Tasker, Long> {}
