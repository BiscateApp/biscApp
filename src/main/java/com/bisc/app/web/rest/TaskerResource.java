package com.bisc.app.web.rest;

import com.bisc.app.domain.Tasker;
import com.bisc.app.repository.TaskerRepository;
import com.bisc.app.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.bisc.app.domain.Tasker}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TaskerResource {

    private final Logger log = LoggerFactory.getLogger(TaskerResource.class);

    private static final String ENTITY_NAME = "tasker";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TaskerRepository taskerRepository;

    public TaskerResource(TaskerRepository taskerRepository) {
        this.taskerRepository = taskerRepository;
    }

    /**
     * {@code POST  /taskers} : Create a new tasker.
     *
     * @param tasker the tasker to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new tasker, or with status {@code 400 (Bad Request)} if the tasker has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/taskers")
    public ResponseEntity<Tasker> createTasker(@Valid @RequestBody Tasker tasker) throws URISyntaxException {
        log.debug("REST request to save Tasker : {}", tasker);
        if (tasker.getId() != null) {
            throw new BadRequestAlertException("A new tasker cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Tasker result = taskerRepository.save(tasker);
        return ResponseEntity
            .created(new URI("/api/taskers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /taskers/:id} : Updates an existing tasker.
     *
     * @param id the id of the tasker to save.
     * @param tasker the tasker to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated tasker,
     * or with status {@code 400 (Bad Request)} if the tasker is not valid,
     * or with status {@code 500 (Internal Server Error)} if the tasker couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/taskers/{id}")
    public ResponseEntity<Tasker> updateTasker(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Tasker tasker
    ) throws URISyntaxException {
        log.debug("REST request to update Tasker : {}, {}", id, tasker);
        if (tasker.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, tasker.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!taskerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Tasker result = taskerRepository.save(tasker);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, tasker.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /taskers/:id} : Partial updates given fields of an existing tasker, field will ignore if it is null
     *
     * @param id the id of the tasker to save.
     * @param tasker the tasker to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated tasker,
     * or with status {@code 400 (Bad Request)} if the tasker is not valid,
     * or with status {@code 404 (Not Found)} if the tasker is not found,
     * or with status {@code 500 (Internal Server Error)} if the tasker couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/taskers/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Tasker> partialUpdateTasker(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Tasker tasker
    ) throws URISyntaxException {
        log.debug("REST request to partial update Tasker partially : {}, {}", id, tasker);
        if (tasker.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, tasker.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!taskerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Tasker> result = taskerRepository
            .findById(tasker.getId())
            .map(existingTasker -> {
                if (tasker.getPhoneNumber() != null) {
                    existingTasker.setPhoneNumber(tasker.getPhoneNumber());
                }
                if (tasker.getValidation() != null) {
                    existingTasker.setValidation(tasker.getValidation());
                }
                if (tasker.getWhenCreated() != null) {
                    existingTasker.setWhenCreated(tasker.getWhenCreated());
                }

                return existingTasker;
            })
            .map(taskerRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, tasker.getId().toString())
        );
    }

    /**
     * {@code GET  /taskers} : get all the taskers.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of taskers in body.
     */
    @GetMapping("/taskers")
    public ResponseEntity<List<Tasker>> getAllTaskers(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Taskers");
        Page<Tasker> page = taskerRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /taskers/:id} : get the "id" tasker.
     *
     * @param id the id of the tasker to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the tasker, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/taskers/{id}")
    public ResponseEntity<Tasker> getTasker(@PathVariable Long id) {
        log.debug("REST request to get Tasker : {}", id);
        Optional<Tasker> tasker = taskerRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(tasker);
    }

    /**
     * {@code DELETE  /taskers/:id} : delete the "id" tasker.
     *
     * @param id the id of the tasker to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/taskers/{id}")
    public ResponseEntity<Void> deleteTasker(@PathVariable Long id) {
        log.debug("REST request to delete Tasker : {}", id);
        taskerRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
