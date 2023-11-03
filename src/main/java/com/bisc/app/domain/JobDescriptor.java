package com.bisc.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A JobDescriptor.
 */
@Entity
@Table(name = "job_descriptor")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class JobDescriptor implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Size(min = 3, max = 20)
    @Column(name = "name", length = 20)
    private String name;

    @Size(min = 3, max = 100)
    @Column(name = "description", length = 100)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "tasker", "jobDescriptors" }, allowSetters = true)
    private Portfolio portfolio;

    @JsonIgnoreProperties(value = { "location", "descriptor", "jobDoer" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY, mappedBy = "descriptor")
    private Job job;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public JobDescriptor id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public JobDescriptor name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public JobDescriptor description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Portfolio getPortfolio() {
        return this.portfolio;
    }

    public void setPortfolio(Portfolio portfolio) {
        this.portfolio = portfolio;
    }

    public JobDescriptor portfolio(Portfolio portfolio) {
        this.setPortfolio(portfolio);
        return this;
    }

    public Job getJob() {
        return this.job;
    }

    public void setJob(Job job) {
        if (this.job != null) {
            this.job.setDescriptor(null);
        }
        if (job != null) {
            job.setDescriptor(this);
        }
        this.job = job;
    }

    public JobDescriptor job(Job job) {
        this.setJob(job);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof JobDescriptor)) {
            return false;
        }
        return id != null && id.equals(((JobDescriptor) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "JobDescriptor{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
