package com.bisc.app.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.bisc.app.IntegrationTest;
import com.bisc.app.domain.Portfolio;
import com.bisc.app.repository.PortfolioRepository;
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
 * Integration tests for the {@link PortfolioResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PortfolioResourceIT {

    private static final String DEFAULT_BIO = "AAAAAAAAAA";
    private static final String UPDATED_BIO = "BBBBBBBBBB";

    private static final String DEFAULT_SKILLS = "AAAAAAAAAA";
    private static final String UPDATED_SKILLS = "BBBBBBBBBB";

    private static final String DEFAULT_SPEAKING_LANGUAGES = "AAAAAAAAAA";
    private static final String UPDATED_SPEAKING_LANGUAGES = "BBBBBBBBBB";

    private static final Integer DEFAULT_STARS = 0;
    private static final Integer UPDATED_STARS = 1;

    private static final Integer DEFAULT_COMPLETED_TASKS = 0;
    private static final Integer UPDATED_COMPLETED_TASKS = 1;

    private static final Integer DEFAULT_HOURLY_RATE = 0;
    private static final Integer UPDATED_HOURLY_RATE = 1;

    private static final String ENTITY_API_URL = "/api/portfolios";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPortfolioMockMvc;

    private Portfolio portfolio;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Portfolio createEntity(EntityManager em) {
        Portfolio portfolio = new Portfolio()
            .bio(DEFAULT_BIO)
            .skills(DEFAULT_SKILLS)
            .speakingLanguages(DEFAULT_SPEAKING_LANGUAGES)
            .stars(DEFAULT_STARS)
            .completedTasks(DEFAULT_COMPLETED_TASKS)
            .hourlyRate(DEFAULT_HOURLY_RATE);
        return portfolio;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Portfolio createUpdatedEntity(EntityManager em) {
        Portfolio portfolio = new Portfolio()
            .bio(UPDATED_BIO)
            .skills(UPDATED_SKILLS)
            .speakingLanguages(UPDATED_SPEAKING_LANGUAGES)
            .stars(UPDATED_STARS)
            .completedTasks(UPDATED_COMPLETED_TASKS)
            .hourlyRate(UPDATED_HOURLY_RATE);
        return portfolio;
    }

    @BeforeEach
    public void initTest() {
        portfolio = createEntity(em);
    }

    @Test
    @Transactional
    void createPortfolio() throws Exception {
        int databaseSizeBeforeCreate = portfolioRepository.findAll().size();
        // Create the Portfolio
        restPortfolioMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(portfolio)))
            .andExpect(status().isCreated());

        // Validate the Portfolio in the database
        List<Portfolio> portfolioList = portfolioRepository.findAll();
        assertThat(portfolioList).hasSize(databaseSizeBeforeCreate + 1);
        Portfolio testPortfolio = portfolioList.get(portfolioList.size() - 1);
        assertThat(testPortfolio.getBio()).isEqualTo(DEFAULT_BIO);
        assertThat(testPortfolio.getSkills()).isEqualTo(DEFAULT_SKILLS);
        assertThat(testPortfolio.getSpeakingLanguages()).isEqualTo(DEFAULT_SPEAKING_LANGUAGES);
        assertThat(testPortfolio.getStars()).isEqualTo(DEFAULT_STARS);
        assertThat(testPortfolio.getCompletedTasks()).isEqualTo(DEFAULT_COMPLETED_TASKS);
        assertThat(testPortfolio.getHourlyRate()).isEqualTo(DEFAULT_HOURLY_RATE);
    }

    @Test
    @Transactional
    void createPortfolioWithExistingId() throws Exception {
        // Create the Portfolio with an existing ID
        portfolio.setId(1L);

        int databaseSizeBeforeCreate = portfolioRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPortfolioMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(portfolio)))
            .andExpect(status().isBadRequest());

        // Validate the Portfolio in the database
        List<Portfolio> portfolioList = portfolioRepository.findAll();
        assertThat(portfolioList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPortfolios() throws Exception {
        // Initialize the database
        portfolioRepository.saveAndFlush(portfolio);

        // Get all the portfolioList
        restPortfolioMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(portfolio.getId().intValue())))
            .andExpect(jsonPath("$.[*].bio").value(hasItem(DEFAULT_BIO)))
            .andExpect(jsonPath("$.[*].skills").value(hasItem(DEFAULT_SKILLS)))
            .andExpect(jsonPath("$.[*].speakingLanguages").value(hasItem(DEFAULT_SPEAKING_LANGUAGES)))
            .andExpect(jsonPath("$.[*].stars").value(hasItem(DEFAULT_STARS)))
            .andExpect(jsonPath("$.[*].completedTasks").value(hasItem(DEFAULT_COMPLETED_TASKS)))
            .andExpect(jsonPath("$.[*].hourlyRate").value(hasItem(DEFAULT_HOURLY_RATE)));
    }

    @Test
    @Transactional
    void getPortfolio() throws Exception {
        // Initialize the database
        portfolioRepository.saveAndFlush(portfolio);

        // Get the portfolio
        restPortfolioMockMvc
            .perform(get(ENTITY_API_URL_ID, portfolio.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(portfolio.getId().intValue()))
            .andExpect(jsonPath("$.bio").value(DEFAULT_BIO))
            .andExpect(jsonPath("$.skills").value(DEFAULT_SKILLS))
            .andExpect(jsonPath("$.speakingLanguages").value(DEFAULT_SPEAKING_LANGUAGES))
            .andExpect(jsonPath("$.stars").value(DEFAULT_STARS))
            .andExpect(jsonPath("$.completedTasks").value(DEFAULT_COMPLETED_TASKS))
            .andExpect(jsonPath("$.hourlyRate").value(DEFAULT_HOURLY_RATE));
    }

    @Test
    @Transactional
    void getNonExistingPortfolio() throws Exception {
        // Get the portfolio
        restPortfolioMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPortfolio() throws Exception {
        // Initialize the database
        portfolioRepository.saveAndFlush(portfolio);

        int databaseSizeBeforeUpdate = portfolioRepository.findAll().size();

        // Update the portfolio
        Portfolio updatedPortfolio = portfolioRepository.findById(portfolio.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedPortfolio are not directly saved in db
        em.detach(updatedPortfolio);
        updatedPortfolio
            .bio(UPDATED_BIO)
            .skills(UPDATED_SKILLS)
            .speakingLanguages(UPDATED_SPEAKING_LANGUAGES)
            .stars(UPDATED_STARS)
            .completedTasks(UPDATED_COMPLETED_TASKS)
            .hourlyRate(UPDATED_HOURLY_RATE);

        restPortfolioMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPortfolio.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPortfolio))
            )
            .andExpect(status().isOk());

        // Validate the Portfolio in the database
        List<Portfolio> portfolioList = portfolioRepository.findAll();
        assertThat(portfolioList).hasSize(databaseSizeBeforeUpdate);
        Portfolio testPortfolio = portfolioList.get(portfolioList.size() - 1);
        assertThat(testPortfolio.getBio()).isEqualTo(UPDATED_BIO);
        assertThat(testPortfolio.getSkills()).isEqualTo(UPDATED_SKILLS);
        assertThat(testPortfolio.getSpeakingLanguages()).isEqualTo(UPDATED_SPEAKING_LANGUAGES);
        assertThat(testPortfolio.getStars()).isEqualTo(UPDATED_STARS);
        assertThat(testPortfolio.getCompletedTasks()).isEqualTo(UPDATED_COMPLETED_TASKS);
        assertThat(testPortfolio.getHourlyRate()).isEqualTo(UPDATED_HOURLY_RATE);
    }

    @Test
    @Transactional
    void putNonExistingPortfolio() throws Exception {
        int databaseSizeBeforeUpdate = portfolioRepository.findAll().size();
        portfolio.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPortfolioMockMvc
            .perform(
                put(ENTITY_API_URL_ID, portfolio.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(portfolio))
            )
            .andExpect(status().isBadRequest());

        // Validate the Portfolio in the database
        List<Portfolio> portfolioList = portfolioRepository.findAll();
        assertThat(portfolioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPortfolio() throws Exception {
        int databaseSizeBeforeUpdate = portfolioRepository.findAll().size();
        portfolio.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPortfolioMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(portfolio))
            )
            .andExpect(status().isBadRequest());

        // Validate the Portfolio in the database
        List<Portfolio> portfolioList = portfolioRepository.findAll();
        assertThat(portfolioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPortfolio() throws Exception {
        int databaseSizeBeforeUpdate = portfolioRepository.findAll().size();
        portfolio.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPortfolioMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(portfolio)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Portfolio in the database
        List<Portfolio> portfolioList = portfolioRepository.findAll();
        assertThat(portfolioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePortfolioWithPatch() throws Exception {
        // Initialize the database
        portfolioRepository.saveAndFlush(portfolio);

        int databaseSizeBeforeUpdate = portfolioRepository.findAll().size();

        // Update the portfolio using partial update
        Portfolio partialUpdatedPortfolio = new Portfolio();
        partialUpdatedPortfolio.setId(portfolio.getId());

        partialUpdatedPortfolio
            .skills(UPDATED_SKILLS)
            .speakingLanguages(UPDATED_SPEAKING_LANGUAGES)
            .stars(UPDATED_STARS)
            .completedTasks(UPDATED_COMPLETED_TASKS);

        restPortfolioMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPortfolio.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPortfolio))
            )
            .andExpect(status().isOk());

        // Validate the Portfolio in the database
        List<Portfolio> portfolioList = portfolioRepository.findAll();
        assertThat(portfolioList).hasSize(databaseSizeBeforeUpdate);
        Portfolio testPortfolio = portfolioList.get(portfolioList.size() - 1);
        assertThat(testPortfolio.getBio()).isEqualTo(DEFAULT_BIO);
        assertThat(testPortfolio.getSkills()).isEqualTo(UPDATED_SKILLS);
        assertThat(testPortfolio.getSpeakingLanguages()).isEqualTo(UPDATED_SPEAKING_LANGUAGES);
        assertThat(testPortfolio.getStars()).isEqualTo(UPDATED_STARS);
        assertThat(testPortfolio.getCompletedTasks()).isEqualTo(UPDATED_COMPLETED_TASKS);
        assertThat(testPortfolio.getHourlyRate()).isEqualTo(DEFAULT_HOURLY_RATE);
    }

    @Test
    @Transactional
    void fullUpdatePortfolioWithPatch() throws Exception {
        // Initialize the database
        portfolioRepository.saveAndFlush(portfolio);

        int databaseSizeBeforeUpdate = portfolioRepository.findAll().size();

        // Update the portfolio using partial update
        Portfolio partialUpdatedPortfolio = new Portfolio();
        partialUpdatedPortfolio.setId(portfolio.getId());

        partialUpdatedPortfolio
            .bio(UPDATED_BIO)
            .skills(UPDATED_SKILLS)
            .speakingLanguages(UPDATED_SPEAKING_LANGUAGES)
            .stars(UPDATED_STARS)
            .completedTasks(UPDATED_COMPLETED_TASKS)
            .hourlyRate(UPDATED_HOURLY_RATE);

        restPortfolioMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPortfolio.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPortfolio))
            )
            .andExpect(status().isOk());

        // Validate the Portfolio in the database
        List<Portfolio> portfolioList = portfolioRepository.findAll();
        assertThat(portfolioList).hasSize(databaseSizeBeforeUpdate);
        Portfolio testPortfolio = portfolioList.get(portfolioList.size() - 1);
        assertThat(testPortfolio.getBio()).isEqualTo(UPDATED_BIO);
        assertThat(testPortfolio.getSkills()).isEqualTo(UPDATED_SKILLS);
        assertThat(testPortfolio.getSpeakingLanguages()).isEqualTo(UPDATED_SPEAKING_LANGUAGES);
        assertThat(testPortfolio.getStars()).isEqualTo(UPDATED_STARS);
        assertThat(testPortfolio.getCompletedTasks()).isEqualTo(UPDATED_COMPLETED_TASKS);
        assertThat(testPortfolio.getHourlyRate()).isEqualTo(UPDATED_HOURLY_RATE);
    }

    @Test
    @Transactional
    void patchNonExistingPortfolio() throws Exception {
        int databaseSizeBeforeUpdate = portfolioRepository.findAll().size();
        portfolio.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPortfolioMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, portfolio.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(portfolio))
            )
            .andExpect(status().isBadRequest());

        // Validate the Portfolio in the database
        List<Portfolio> portfolioList = portfolioRepository.findAll();
        assertThat(portfolioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPortfolio() throws Exception {
        int databaseSizeBeforeUpdate = portfolioRepository.findAll().size();
        portfolio.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPortfolioMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(portfolio))
            )
            .andExpect(status().isBadRequest());

        // Validate the Portfolio in the database
        List<Portfolio> portfolioList = portfolioRepository.findAll();
        assertThat(portfolioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPortfolio() throws Exception {
        int databaseSizeBeforeUpdate = portfolioRepository.findAll().size();
        portfolio.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPortfolioMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(portfolio))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Portfolio in the database
        List<Portfolio> portfolioList = portfolioRepository.findAll();
        assertThat(portfolioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePortfolio() throws Exception {
        // Initialize the database
        portfolioRepository.saveAndFlush(portfolio);

        int databaseSizeBeforeDelete = portfolioRepository.findAll().size();

        // Delete the portfolio
        restPortfolioMockMvc
            .perform(delete(ENTITY_API_URL_ID, portfolio.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Portfolio> portfolioList = portfolioRepository.findAll();
        assertThat(portfolioList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
