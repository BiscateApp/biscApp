package com.bisc.app.domain;

import com.bisc.app.domain.enumeration.JobStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Job.
 */
@Entity
@Table(name = "job")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Job implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Size(min = 3, max = 500)
    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "date")
    private Instant date;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private JobStatus status;

    @Column(name = "when_created")
    private Instant whenCreated;

    @Column(name = "when_updated")
    private Instant whenUpdated;

    @JsonIgnoreProperties(value = { "tasker", "job" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(unique = true)
    private Address location;

    @JsonIgnoreProperties(value = { "portfolio", "job" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(unique = true)
    private JobDescriptor descriptor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "portfolio", "address", "user" }, allowSetters = true)
    private Tasker jobDoer;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Job id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return this.description;
    }

    public Job description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Instant getDate() {
        return this.date;
    }

    public Job date(Instant date) {
        this.setDate(date);
        return this;
    }

    public void setDate(Instant date) {
        this.date = date;
    }

    public JobStatus getStatus() {
        return this.status;
    }

    public Job status(JobStatus status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(JobStatus status) {
        this.status = status;
    }

    public Instant getWhenCreated() {
        return this.whenCreated;
    }

    public Job whenCreated(Instant whenCreated) {
        this.setWhenCreated(whenCreated);
        return this;
    }

    public void setWhenCreated(Instant whenCreated) {
        this.whenCreated = whenCreated;
    }

    public Instant getWhenUpdated() {
        return this.whenUpdated;
    }

    public Job whenUpdated(Instant whenUpdated) {
        this.setWhenUpdated(whenUpdated);
        return this;
    }

    public void setWhenUpdated(Instant whenUpdated) {
        this.whenUpdated = whenUpdated;
    }

    public Address getLocation() {
        return this.location;
    }

    public void setLocation(Address address) {
        this.location = address;
    }

    public Job location(Address address) {
        this.setLocation(address);
        return this;
    }

    public JobDescriptor getDescriptor() {
        return this.descriptor;
    }

    public void setDescriptor(JobDescriptor jobDescriptor) {
        this.descriptor = jobDescriptor;
    }

    public Job descriptor(JobDescriptor jobDescriptor) {
        this.setDescriptor(jobDescriptor);
        return this;
    }

    public Tasker getJobDoer() {
        return this.jobDoer;
    }

    public void setJobDoer(Tasker tasker) {
        this.jobDoer = tasker;
    }

    public Job jobDoer(Tasker tasker) {
        this.setJobDoer(tasker);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Job)) {
            return false;
        }
        return id != null && id.equals(((Job) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Job{" +
            "id=" + getId() +
            ", description='" + getDescription() + "'" +
            ", date='" + getDate() + "'" +
            ", status='" + getStatus() + "'" +
            ", whenCreated='" + getWhenCreated() + "'" +
            ", whenUpdated='" + getWhenUpdated() + "'" +
            "}";
    }
}
