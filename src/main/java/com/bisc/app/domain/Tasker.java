package com.bisc.app.domain;

import com.bisc.app.domain.enumeration.TaskerType;
import com.bisc.app.domain.enumeration.TaskerValidation;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Tasker.
 */
@Entity
@Table(name = "tasker")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Tasker implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Size(min = 9, max = 13)
    @Column(name = "phone_number", length = 13)
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "validation")
    private TaskerValidation validation;

    @Enumerated(EnumType.STRING)
    @Column(name = "tasker_type")
    private TaskerType taskerType;

    @JsonIgnoreProperties(value = { "tasker", "jobDescriptors" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(unique = true)
    private Portfolio portfolio;

    @JsonIgnoreProperties(value = { "tasker", "job" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(unique = true)
    private Address address;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Tasker id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPhoneNumber() {
        return this.phoneNumber;
    }

    public Tasker phoneNumber(String phoneNumber) {
        this.setPhoneNumber(phoneNumber);
        return this;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public TaskerValidation getValidation() {
        return this.validation;
    }

    public Tasker validation(TaskerValidation validation) {
        this.setValidation(validation);
        return this;
    }

    public void setValidation(TaskerValidation validation) {
        this.validation = validation;
    }

    public TaskerType getTaskerType() {
        return this.taskerType;
    }

    public Tasker taskerType(TaskerType taskerType) {
        this.setTaskerType(taskerType);
        return this;
    }

    public void setTaskerType(TaskerType taskerType) {
        this.taskerType = taskerType;
    }

    public Portfolio getPortfolio() {
        return this.portfolio;
    }

    public void setPortfolio(Portfolio portfolio) {
        this.portfolio = portfolio;
    }

    public Tasker portfolio(Portfolio portfolio) {
        this.setPortfolio(portfolio);
        return this;
    }

    public Address getAddress() {
        return this.address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public Tasker address(Address address) {
        this.setAddress(address);
        return this;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Tasker user(User user) {
        this.setUser(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Tasker)) {
            return false;
        }
        return id != null && id.equals(((Tasker) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Tasker{" +
            "id=" + getId() +
            ", phoneNumber='" + getPhoneNumber() + "'" +
            ", validation='" + getValidation() + "'" +
            ", taskerType='" + getTaskerType() + "'" +
            "}";
    }
}
