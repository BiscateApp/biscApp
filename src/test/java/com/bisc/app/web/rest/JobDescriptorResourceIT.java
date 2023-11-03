package com.bisc.app.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.bisc.app.IntegrationTest;
import com.bisc.app.domain.JobDescriptor;
import com.bisc.app.repository.JobDescriptorRepository;
import jakarta.persistence.EntityManager;
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
 * Integration tests for the {@link JobDescriptorResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class JobDescriptorResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/job-descriptors";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private JobDescriptorRepository jobDescriptorRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restJobDescriptorMockMvc;

    private JobDescriptor jobDescriptor;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static JobDescriptor createEntity(EntityManager em) {
        JobDescriptor jobDescriptor = new JobDescriptor().name(DEFAULT_NAME).description(DEFAULT_DESCRIPTION);
        return jobDescriptor;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static JobDescriptor createUpdatedEntity(EntityManager em) {
        JobDescriptor jobDescriptor = new JobDescriptor().name(UPDATED_NAME).description(UPDATED_DESCRIPTION);
        return jobDescriptor;
    }

    @BeforeEach
    public void initTest() {
        jobDescriptor = createEntity(em);
    }

    @Test
    @Transactional
    void createJobDescriptor() throws Exception {
        int databaseSizeBeforeCreate = jobDescriptorRepository.findAll().size();
        // Create the JobDescriptor
        restJobDescriptorMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(jobDescriptor)))
            .andExpect(status().isCreated());

        // Validate the JobDescriptor in the database
        List<JobDescriptor> jobDescriptorList = jobDescriptorRepository.findAll();
        assertThat(jobDescriptorList).hasSize(databaseSizeBeforeCreate + 1);
        JobDescriptor testJobDescriptor = jobDescriptorList.get(jobDescriptorList.size() - 1);
        assertThat(testJobDescriptor.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testJobDescriptor.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createJobDescriptorWithExistingId() throws Exception {
        // Create the JobDescriptor with an existing ID
        jobDescriptor.setId(1L);

        int databaseSizeBeforeCreate = jobDescriptorRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restJobDescriptorMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(jobDescriptor)))
            .andExpect(status().isBadRequest());

        // Validate the JobDescriptor in the database
        List<JobDescriptor> jobDescriptorList = jobDescriptorRepository.findAll();
        assertThat(jobDescriptorList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllJobDescriptors() throws Exception {
        // Initialize the database
        jobDescriptorRepository.saveAndFlush(jobDescriptor);

        // Get all the jobDescriptorList
        restJobDescriptorMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(jobDescriptor.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @Test
    @Transactional
    void getJobDescriptor() throws Exception {
        // Initialize the database
        jobDescriptorRepository.saveAndFlush(jobDescriptor);

        // Get the jobDescriptor
        restJobDescriptorMockMvc
            .perform(get(ENTITY_API_URL_ID, jobDescriptor.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(jobDescriptor.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingJobDescriptor() throws Exception {
        // Get the jobDescriptor
        restJobDescriptorMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingJobDescriptor() throws Exception {
        // Initialize the database
        jobDescriptorRepository.saveAndFlush(jobDescriptor);

        int databaseSizeBeforeUpdate = jobDescriptorRepository.findAll().size();

        // Update the jobDescriptor
        JobDescriptor updatedJobDescriptor = jobDescriptorRepository.findById(jobDescriptor.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedJobDescriptor are not directly saved in db
        em.detach(updatedJobDescriptor);
        updatedJobDescriptor.name(UPDATED_NAME).description(UPDATED_DESCRIPTION);

        restJobDescriptorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedJobDescriptor.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedJobDescriptor))
            )
            .andExpect(status().isOk());

        // Validate the JobDescriptor in the database
        List<JobDescriptor> jobDescriptorList = jobDescriptorRepository.findAll();
        assertThat(jobDescriptorList).hasSize(databaseSizeBeforeUpdate);
        JobDescriptor testJobDescriptor = jobDescriptorList.get(jobDescriptorList.size() - 1);
        assertThat(testJobDescriptor.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testJobDescriptor.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingJobDescriptor() throws Exception {
        int databaseSizeBeforeUpdate = jobDescriptorRepository.findAll().size();
        jobDescriptor.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restJobDescriptorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, jobDescriptor.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(jobDescriptor))
            )
            .andExpect(status().isBadRequest());

        // Validate the JobDescriptor in the database
        List<JobDescriptor> jobDescriptorList = jobDescriptorRepository.findAll();
        assertThat(jobDescriptorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchJobDescriptor() throws Exception {
        int databaseSizeBeforeUpdate = jobDescriptorRepository.findAll().size();
        jobDescriptor.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJobDescriptorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(jobDescriptor))
            )
            .andExpect(status().isBadRequest());

        // Validate the JobDescriptor in the database
        List<JobDescriptor> jobDescriptorList = jobDescriptorRepository.findAll();
        assertThat(jobDescriptorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamJobDescriptor() throws Exception {
        int databaseSizeBeforeUpdate = jobDescriptorRepository.findAll().size();
        jobDescriptor.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJobDescriptorMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(jobDescriptor)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the JobDescriptor in the database
        List<JobDescriptor> jobDescriptorList = jobDescriptorRepository.findAll();
        assertThat(jobDescriptorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateJobDescriptorWithPatch() throws Exception {
        // Initialize the database
        jobDescriptorRepository.saveAndFlush(jobDescriptor);

        int databaseSizeBeforeUpdate = jobDescriptorRepository.findAll().size();

        // Update the jobDescriptor using partial update
        JobDescriptor partialUpdatedJobDescriptor = new JobDescriptor();
        partialUpdatedJobDescriptor.setId(jobDescriptor.getId());

        restJobDescriptorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedJobDescriptor.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedJobDescriptor))
            )
            .andExpect(status().isOk());

        // Validate the JobDescriptor in the database
        List<JobDescriptor> jobDescriptorList = jobDescriptorRepository.findAll();
        assertThat(jobDescriptorList).hasSize(databaseSizeBeforeUpdate);
        JobDescriptor testJobDescriptor = jobDescriptorList.get(jobDescriptorList.size() - 1);
        assertThat(testJobDescriptor.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testJobDescriptor.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateJobDescriptorWithPatch() throws Exception {
        // Initialize the database
        jobDescriptorRepository.saveAndFlush(jobDescriptor);

        int databaseSizeBeforeUpdate = jobDescriptorRepository.findAll().size();

        // Update the jobDescriptor using partial update
        JobDescriptor partialUpdatedJobDescriptor = new JobDescriptor();
        partialUpdatedJobDescriptor.setId(jobDescriptor.getId());

        partialUpdatedJobDescriptor.name(UPDATED_NAME).description(UPDATED_DESCRIPTION);

        restJobDescriptorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedJobDescriptor.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedJobDescriptor))
            )
            .andExpect(status().isOk());

        // Validate the JobDescriptor in the database
        List<JobDescriptor> jobDescriptorList = jobDescriptorRepository.findAll();
        assertThat(jobDescriptorList).hasSize(databaseSizeBeforeUpdate);
        JobDescriptor testJobDescriptor = jobDescriptorList.get(jobDescriptorList.size() - 1);
        assertThat(testJobDescriptor.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testJobDescriptor.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingJobDescriptor() throws Exception {
        int databaseSizeBeforeUpdate = jobDescriptorRepository.findAll().size();
        jobDescriptor.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restJobDescriptorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, jobDescriptor.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(jobDescriptor))
            )
            .andExpect(status().isBadRequest());

        // Validate the JobDescriptor in the database
        List<JobDescriptor> jobDescriptorList = jobDescriptorRepository.findAll();
        assertThat(jobDescriptorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchJobDescriptor() throws Exception {
        int databaseSizeBeforeUpdate = jobDescriptorRepository.findAll().size();
        jobDescriptor.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJobDescriptorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(jobDescriptor))
            )
            .andExpect(status().isBadRequest());

        // Validate the JobDescriptor in the database
        List<JobDescriptor> jobDescriptorList = jobDescriptorRepository.findAll();
        assertThat(jobDescriptorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamJobDescriptor() throws Exception {
        int databaseSizeBeforeUpdate = jobDescriptorRepository.findAll().size();
        jobDescriptor.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJobDescriptorMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(jobDescriptor))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the JobDescriptor in the database
        List<JobDescriptor> jobDescriptorList = jobDescriptorRepository.findAll();
        assertThat(jobDescriptorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteJobDescriptor() throws Exception {
        // Initialize the database
        jobDescriptorRepository.saveAndFlush(jobDescriptor);

        int databaseSizeBeforeDelete = jobDescriptorRepository.findAll().size();

        // Delete the jobDescriptor
        restJobDescriptorMockMvc
            .perform(delete(ENTITY_API_URL_ID, jobDescriptor.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<JobDescriptor> jobDescriptorList = jobDescriptorRepository.findAll();
        assertThat(jobDescriptorList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
