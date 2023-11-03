package com.bisc.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Portfolio.
 */
@Entity
@Table(name = "portfolio")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Portfolio implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Size(min = 10, max = 5000)
    @Column(name = "bio", length = 5000)
    private String bio;

    @Size(min = 10, max = 100)
    @Column(name = "skills", length = 100)
    private String skills;

    @Size(min = 2, max = 100)
    @Column(name = "speaking_languages", length = 100)
    private String speakingLanguages;

    @Min(value = 0)
    @Max(value = 1000)
    @Column(name = "stars")
    private Integer stars;

    @Min(value = 0)
    @Max(value = 5000)
    @Column(name = "completed_tasks")
    private Integer completedTasks;

    @Column(name = "hourly_rate")
    private Float hourlyRate;

    @JsonIgnoreProperties(value = { "portfolio", "address", "user" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY, mappedBy = "portfolio")
    private Tasker tasker;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "portfolio")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "portfolio", "job" }, allowSetters = true)
    private Set<JobDescriptor> jobDescriptors = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Portfolio id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBio() {
        return this.bio;
    }

    public Portfolio bio(String bio) {
        this.setBio(bio);
        return this;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getSkills() {
        return this.skills;
    }

    public Portfolio skills(String skills) {
        this.setSkills(skills);
        return this;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getSpeakingLanguages() {
        return this.speakingLanguages;
    }

    public Portfolio speakingLanguages(String speakingLanguages) {
        this.setSpeakingLanguages(speakingLanguages);
        return this;
    }

    public void setSpeakingLanguages(String speakingLanguages) {
        this.speakingLanguages = speakingLanguages;
    }

    public Integer getStars() {
        return this.stars;
    }

    public Portfolio stars(Integer stars) {
        this.setStars(stars);
        return this;
    }

    public void setStars(Integer stars) {
        this.stars = stars;
    }

    public Integer getCompletedTasks() {
        return this.completedTasks;
    }

    public Portfolio completedTasks(Integer completedTasks) {
        this.setCompletedTasks(completedTasks);
        return this;
    }

    public void setCompletedTasks(Integer completedTasks) {
        this.completedTasks = completedTasks;
    }

    public Float getHourlyRate() {
        return this.hourlyRate;
    }

    public Portfolio hourlyRate(Float hourlyRate) {
        this.setHourlyRate(hourlyRate);
        return this;
    }

    public void setHourlyRate(Float hourlyRate) {
        this.hourlyRate = hourlyRate;
    }

    public Tasker getTasker() {
        return this.tasker;
    }

    public void setTasker(Tasker tasker) {
        if (this.tasker != null) {
            this.tasker.setPortfolio(null);
        }
        if (tasker != null) {
            tasker.setPortfolio(this);
        }
        this.tasker = tasker;
    }

    public Portfolio tasker(Tasker tasker) {
        this.setTasker(tasker);
        return this;
    }

    public Set<JobDescriptor> getJobDescriptors() {
        return this.jobDescriptors;
    }

    public void setJobDescriptors(Set<JobDescriptor> jobDescriptors) {
        if (this.jobDescriptors != null) {
            this.jobDescriptors.forEach(i -> i.setPortfolio(null));
        }
        if (jobDescriptors != null) {
            jobDescriptors.forEach(i -> i.setPortfolio(this));
        }
        this.jobDescriptors = jobDescriptors;
    }

    public Portfolio jobDescriptors(Set<JobDescriptor> jobDescriptors) {
        this.setJobDescriptors(jobDescriptors);
        return this;
    }

    public Portfolio addJobDescriptor(JobDescriptor jobDescriptor) {
        this.jobDescriptors.add(jobDescriptor);
        jobDescriptor.setPortfolio(this);
        return this;
    }

    public Portfolio removeJobDescriptor(JobDescriptor jobDescriptor) {
        this.jobDescriptors.remove(jobDescriptor);
        jobDescriptor.setPortfolio(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Portfolio)) {
            return false;
        }
        return id != null && id.equals(((Portfolio) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Portfolio{" +
            "id=" + getId() +
            ", bio='" + getBio() + "'" +
            ", skills='" + getSkills() + "'" +
            ", speakingLanguages='" + getSpeakingLanguages() + "'" +
            ", stars=" + getStars() +
            ", completedTasks=" + getCompletedTasks() +
            ", hourlyRate=" + getHourlyRate() +
            "}";
    }
}
