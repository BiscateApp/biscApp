package com.bisc.app.web.rest;

import com.bisc.app.domain.JobDescriptor;
import com.bisc.app.repository.JobDescriptorRepository;
import com.bisc.app.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.bisc.app.domain.JobDescriptor}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class JobDescriptorResource {

    private final Logger log = LoggerFactory.getLogger(JobDescriptorResource.class);

    private static final String ENTITY_NAME = "jobDescriptor";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final JobDescriptorRepository jobDescriptorRepository;

    public JobDescriptorResource(JobDescriptorRepository jobDescriptorRepository) {
        this.jobDescriptorRepository = jobDescriptorRepository;
    }

    /**
     * {@code POST  /job-descriptors} : Create a new jobDescriptor.
     *
     * @param jobDescriptor the jobDescriptor to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new jobDescriptor, or with status {@code 400 (Bad Request)} if the jobDescriptor has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/job-descriptors")
    public ResponseEntity<JobDescriptor> createJobDescriptor(@Valid @RequestBody JobDescriptor jobDescriptor) throws URISyntaxException {
        log.debug("REST request to save JobDescriptor : {}", jobDescriptor);
        if (jobDescriptor.getId() != null) {
            throw new BadRequestAlertException("A new jobDescriptor cannot already have an ID", ENTITY_NAME, "idexists");
        }
        JobDescriptor result = jobDescriptorRepository.save(jobDescriptor);
        return ResponseEntity
            .created(new URI("/api/job-descriptors/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /job-descriptors/:id} : Updates an existing jobDescriptor.
     *
     * @param id the id of the jobDescriptor to save.
     * @param jobDescriptor the jobDescriptor to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated jobDescriptor,
     * or with status {@code 400 (Bad Request)} if the jobDescriptor is not valid,
     * or with status {@code 500 (Internal Server Error)} if the jobDescriptor couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/job-descriptors/{id}")
    public ResponseEntity<JobDescriptor> updateJobDescriptor(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody JobDescriptor jobDescriptor
    ) throws URISyntaxException {
        log.debug("REST request to update JobDescriptor : {}, {}", id, jobDescriptor);
        if (jobDescriptor.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, jobDescriptor.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!jobDescriptorRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        JobDescriptor result = jobDescriptorRepository.save(jobDescriptor);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, jobDescriptor.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /job-descriptors/:id} : Partial updates given fields of an existing jobDescriptor, field will ignore if it is null
     *
     * @param id the id of the jobDescriptor to save.
     * @param jobDescriptor the jobDescriptor to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated jobDescriptor,
     * or with status {@code 400 (Bad Request)} if the jobDescriptor is not valid,
     * or with status {@code 404 (Not Found)} if the jobDescriptor is not found,
     * or with status {@code 500 (Internal Server Error)} if the jobDescriptor couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/job-descriptors/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<JobDescriptor> partialUpdateJobDescriptor(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody JobDescriptor jobDescriptor
    ) throws URISyntaxException {
        log.debug("REST request to partial update JobDescriptor partially : {}, {}", id, jobDescriptor);
        if (jobDescriptor.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, jobDescriptor.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!jobDescriptorRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<JobDescriptor> result = jobDescriptorRepository
            .findById(jobDescriptor.getId())
            .map(existingJobDescriptor -> {
                if (jobDescriptor.getName() != null) {
                    existingJobDescriptor.setName(jobDescriptor.getName());
                }
                if (jobDescriptor.getDescription() != null) {
                    existingJobDescriptor.setDescription(jobDescriptor.getDescription());
                }

                return existingJobDescriptor;
            })
            .map(jobDescriptorRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, jobDescriptor.getId().toString())
        );
    }

    /**
     * {@code GET  /job-descriptors} : get all the jobDescriptors.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of jobDescriptors in body.
     */
    @GetMapping("/job-descriptors")
    public List<JobDescriptor> getAllJobDescriptors(@RequestParam(required = false) String filter) {
        if ("job-is-null".equals(filter)) {
            log.debug("REST request to get all JobDescriptors where job is null");
            return StreamSupport
                .stream(jobDescriptorRepository.findAll().spliterator(), false)
                .filter(jobDescriptor -> jobDescriptor.getJob() == null)
                .toList();
        }
        log.debug("REST request to get all JobDescriptors");
        return jobDescriptorRepository.findAll();
    }

    /**
     * {@code GET  /job-descriptors/:id} : get the "id" jobDescriptor.
     *
     * @param id the id of the jobDescriptor to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the jobDescriptor, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/job-descriptors/{id}")
    public ResponseEntity<JobDescriptor> getJobDescriptor(@PathVariable Long id) {
        log.debug("REST request to get JobDescriptor : {}", id);
        Optional<JobDescriptor> jobDescriptor = jobDescriptorRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(jobDescriptor);
    }

    /**
     * {@code DELETE  /job-descriptors/:id} : delete the "id" jobDescriptor.
     *
     * @param id the id of the jobDescriptor to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/job-descriptors/{id}")
    public ResponseEntity<Void> deleteJobDescriptor(@PathVariable Long id) {
        log.debug("REST request to delete JobDescriptor : {}", id);
        jobDescriptorRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
