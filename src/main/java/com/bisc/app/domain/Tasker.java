package com.bisc.app.domain;

import com.bisc.app.domain.enumeration.TaskerValidation;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
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

    @NotNull
    @Column(name = "when_created", nullable = false)
    private Instant whenCreated;

    @JsonIgnoreProperties(value = { "tasker" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(unique = true)
    private Portfolio portfolio;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "tasker")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "client", "tasker" }, allowSetters = true)
    private Set<Address> addresses = new HashSet<>();

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

    public Instant getWhenCreated() {
        return this.whenCreated;
    }

    public Tasker whenCreated(Instant whenCreated) {
        this.setWhenCreated(whenCreated);
        return this;
    }

    public void setWhenCreated(Instant whenCreated) {
        this.whenCreated = whenCreated;
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

    public Set<Address> getAddresses() {
        return this.addresses;
    }

    public void setAddresses(Set<Address> addresses) {
        if (this.addresses != null) {
            this.addresses.forEach(i -> i.setTasker(null));
        }
        if (addresses != null) {
            addresses.forEach(i -> i.setTasker(this));
        }
        this.addresses = addresses;
    }

    public Tasker addresses(Set<Address> addresses) {
        this.setAddresses(addresses);
        return this;
    }

    public Tasker addAddress(Address address) {
        this.addresses.add(address);
        address.setTasker(this);
        return this;
    }

    public Tasker removeAddress(Address address) {
        this.addresses.remove(address);
        address.setTasker(null);
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
            ", whenCreated='" + getWhenCreated() + "'" +
            "}";
    }
}
