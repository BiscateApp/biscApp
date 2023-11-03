package com.bisc.app.repository;

import com.bisc.app.domain.JobDescriptor;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the JobDescriptor entity.
 */
@SuppressWarnings("unused")
@Repository
public interface JobDescriptorRepository extends JpaRepository<JobDescriptor, Long> {}
