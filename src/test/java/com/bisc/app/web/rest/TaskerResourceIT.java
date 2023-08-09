package com.bisc.app.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.bisc.app.IntegrationTest;
import com.bisc.app.domain.Tasker;
import com.bisc.app.domain.enumeration.TaskerValidation;
import com.bisc.app.repository.TaskerRepository;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link TaskerResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TaskerResourceIT {

    private static final String DEFAULT_PHONE_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_PHONE_NUMBER = "BBBBBBBBBB";

    private static final TaskerValidation DEFAULT_VALIDATION = TaskerValidation.PENDING;
    private static final TaskerValidation UPDATED_VALIDATION = TaskerValidation.ONGOING;

    private static final Instant DEFAULT_WHEN_CREATED = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_WHEN_CREATED = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/taskers";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TaskerRepository taskerRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTaskerMockMvc;

    private Tasker tasker;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Tasker createEntity(EntityManager em) {
        Tasker tasker = new Tasker().phoneNumber(DEFAULT_PHONE_NUMBER).validation(DEFAULT_VALIDATION).whenCreated(DEFAULT_WHEN_CREATED);
        return tasker;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Tasker createUpdatedEntity(EntityManager em) {
        Tasker tasker = new Tasker().phoneNumber(UPDATED_PHONE_NUMBER).validation(UPDATED_VALIDATION).whenCreated(UPDATED_WHEN_CREATED);
        return tasker;
    }

    @BeforeEach
    public void initTest() {
        tasker = createEntity(em);
    }

    @Test
    @Transactional
    void createTasker() throws Exception {
        int databaseSizeBeforeCreate = taskerRepository.findAll().size();
        // Create the Tasker
        restTaskerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tasker)))
            .andExpect(status().isCreated());

        // Validate the Tasker in the database
        List<Tasker> taskerList = taskerRepository.findAll();
        assertThat(taskerList).hasSize(databaseSizeBeforeCreate + 1);
        Tasker testTasker = taskerList.get(taskerList.size() - 1);
        assertThat(testTasker.getPhoneNumber()).isEqualTo(DEFAULT_PHONE_NUMBER);
        assertThat(testTasker.getValidation()).isEqualTo(DEFAULT_VALIDATION);
        assertThat(testTasker.getWhenCreated()).isEqualTo(DEFAULT_WHEN_CREATED);
    }

    @Test
    @Transactional
    void createTaskerWithExistingId() throws Exception {
        // Create the Tasker with an existing ID
        tasker.setId(1L);

        int databaseSizeBeforeCreate = taskerRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTaskerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tasker)))
            .andExpect(status().isBadRequest());

        // Validate the Tasker in the database
        List<Tasker> taskerList = taskerRepository.findAll();
        assertThat(taskerList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkWhenCreatedIsRequired() throws Exception {
        int databaseSizeBeforeTest = taskerRepository.findAll().size();
        // set the field null
        tasker.setWhenCreated(null);

        // Create the Tasker, which fails.

        restTaskerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tasker)))
            .andExpect(status().isBadRequest());

        List<Tasker> taskerList = taskerRepository.findAll();
        assertThat(taskerList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllTaskers() throws Exception {
        // Initialize the database
        taskerRepository.saveAndFlush(tasker);

        // Get all the taskerList
        restTaskerMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(tasker.getId().intValue())))
            .andExpect(jsonPath("$.[*].phoneNumber").value(hasItem(DEFAULT_PHONE_NUMBER)))
            .andExpect(jsonPath("$.[*].validation").value(hasItem(DEFAULT_VALIDATION.toString())))
            .andExpect(jsonPath("$.[*].whenCreated").value(hasItem(DEFAULT_WHEN_CREATED.toString())));
    }

    @Test
    @Transactional
    void getTasker() throws Exception {
        // Initialize the database
        taskerRepository.saveAndFlush(tasker);

        // Get the tasker
        restTaskerMockMvc
            .perform(get(ENTITY_API_URL_ID, tasker.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(tasker.getId().intValue()))
            .andExpect(jsonPath("$.phoneNumber").value(DEFAULT_PHONE_NUMBER))
            .andExpect(jsonPath("$.validation").value(DEFAULT_VALIDATION.toString()))
            .andExpect(jsonPath("$.whenCreated").value(DEFAULT_WHEN_CREATED.toString()));
    }

    @Test
    @Transactional
    void getNonExistingTasker() throws Exception {
        // Get the tasker
        restTaskerMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTasker() throws Exception {
        // Initialize the database
        taskerRepository.saveAndFlush(tasker);

        int databaseSizeBeforeUpdate = taskerRepository.findAll().size();

        // Update the tasker
        Tasker updatedTasker = taskerRepository.findById(tasker.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedTasker are not directly saved in db
        em.detach(updatedTasker);
        updatedTasker.phoneNumber(UPDATED_PHONE_NUMBER).validation(UPDATED_VALIDATION).whenCreated(UPDATED_WHEN_CREATED);

        restTaskerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTasker.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTasker))
            )
            .andExpect(status().isOk());

        // Validate the Tasker in the database
        List<Tasker> taskerList = taskerRepository.findAll();
        assertThat(taskerList).hasSize(databaseSizeBeforeUpdate);
        Tasker testTasker = taskerList.get(taskerList.size() - 1);
        assertThat(testTasker.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
        assertThat(testTasker.getValidation()).isEqualTo(UPDATED_VALIDATION);
        assertThat(testTasker.getWhenCreated()).isEqualTo(UPDATED_WHEN_CREATED);
    }

    @Test
    @Transactional
    void putNonExistingTasker() throws Exception {
        int databaseSizeBeforeUpdate = taskerRepository.findAll().size();
        tasker.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTaskerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, tasker.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(tasker))
            )
            .andExpect(status().isBadRequest());

        // Validate the Tasker in the database
        List<Tasker> taskerList = taskerRepository.findAll();
        assertThat(taskerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTasker() throws Exception {
        int databaseSizeBeforeUpdate = taskerRepository.findAll().size();
        tasker.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTaskerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(tasker))
            )
            .andExpect(status().isBadRequest());

        // Validate the Tasker in the database
        List<Tasker> taskerList = taskerRepository.findAll();
        assertThat(taskerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTasker() throws Exception {
        int databaseSizeBeforeUpdate = taskerRepository.findAll().size();
        tasker.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTaskerMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tasker)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Tasker in the database
        List<Tasker> taskerList = taskerRepository.findAll();
        assertThat(taskerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTaskerWithPatch() throws Exception {
        // Initialize the database
        taskerRepository.saveAndFlush(tasker);

        int databaseSizeBeforeUpdate = taskerRepository.findAll().size();

        // Update the tasker using partial update
        Tasker partialUpdatedTasker = new Tasker();
        partialUpdatedTasker.setId(tasker.getId());

        partialUpdatedTasker.phoneNumber(UPDATED_PHONE_NUMBER);

        restTaskerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTasker.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTasker))
            )
            .andExpect(status().isOk());

        // Validate the Tasker in the database
        List<Tasker> taskerList = taskerRepository.findAll();
        assertThat(taskerList).hasSize(databaseSizeBeforeUpdate);
        Tasker testTasker = taskerList.get(taskerList.size() - 1);
        assertThat(testTasker.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
        assertThat(testTasker.getValidation()).isEqualTo(DEFAULT_VALIDATION);
        assertThat(testTasker.getWhenCreated()).isEqualTo(DEFAULT_WHEN_CREATED);
    }

    @Test
    @Transactional
    void fullUpdateTaskerWithPatch() throws Exception {
        // Initialize the database
        taskerRepository.saveAndFlush(tasker);

        int databaseSizeBeforeUpdate = taskerRepository.findAll().size();

        // Update the tasker using partial update
        Tasker partialUpdatedTasker = new Tasker();
        partialUpdatedTasker.setId(tasker.getId());

        partialUpdatedTasker.phoneNumber(UPDATED_PHONE_NUMBER).validation(UPDATED_VALIDATION).whenCreated(UPDATED_WHEN_CREATED);

        restTaskerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTasker.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTasker))
            )
            .andExpect(status().isOk());

        // Validate the Tasker in the database
        List<Tasker> taskerList = taskerRepository.findAll();
        assertThat(taskerList).hasSize(databaseSizeBeforeUpdate);
        Tasker testTasker = taskerList.get(taskerList.size() - 1);
        assertThat(testTasker.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
        assertThat(testTasker.getValidation()).isEqualTo(UPDATED_VALIDATION);
        assertThat(testTasker.getWhenCreated()).isEqualTo(UPDATED_WHEN_CREATED);
    }

    @Test
    @Transactional
    void patchNonExistingTasker() throws Exception {
        int databaseSizeBeforeUpdate = taskerRepository.findAll().size();
        tasker.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTaskerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, tasker.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(tasker))
            )
            .andExpect(status().isBadRequest());

        // Validate the Tasker in the database
        List<Tasker> taskerList = taskerRepository.findAll();
        assertThat(taskerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTasker() throws Exception {
        int databaseSizeBeforeUpdate = taskerRepository.findAll().size();
        tasker.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTaskerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(tasker))
            )
            .andExpect(status().isBadRequest());

        // Validate the Tasker in the database
        List<Tasker> taskerList = taskerRepository.findAll();
        assertThat(taskerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTasker() throws Exception {
        int databaseSizeBeforeUpdate = taskerRepository.findAll().size();
        tasker.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTaskerMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(tasker)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Tasker in the database
        List<Tasker> taskerList = taskerRepository.findAll();
        assertThat(taskerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTasker() throws Exception {
        // Initialize the database
        taskerRepository.saveAndFlush(tasker);

        int databaseSizeBeforeDelete = taskerRepository.findAll().size();

        // Delete the tasker
        restTaskerMockMvc
            .perform(delete(ENTITY_API_URL_ID, tasker.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Tasker> taskerList = taskerRepository.findAll();
        assertThat(taskerList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
