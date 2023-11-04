package com.bisc.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Address.
 */
@Entity
@Table(name = "address")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Address implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Size(min = 3, max = 20)
    @Column(name = "country", length = 20, nullable = false)
    private String country;

    @Size(min = 3, max = 20)
    @Column(name = "city", length = 20, nullable = false)
    private String city;

    @Size(min = 4, max = 20)
    @Column(name = "postal_code", length = 20, nullable = false)
    private String postalCode;

    @Size(min = 3, max = 100)
    @Column(name = "street_address", length = 100, nullable = false)
    private String streetAddress;

    @Size(min = 9, max = 9)
    @Column(name = "vat_number", length = 9)
    private String vatNumber;

    @Column(name = "is_default")
    private Boolean isDefault;

    //@JsonIgnoreProperties(value = { "portfolio", "address", "user" }, allowSetters = true)
    @JoinColumn(unique = true)
    @JsonIgnoreProperties(value = { "taskerType", "portfolio", "user", "address", "phoneNumber", "validation" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY)
    private Tasker tasker;

    //    @JsonIgnoreProperties(value = { "location", "descriptor", "jobDoer" }, allowSetters = true)
    //    @OneToOne(fetch = FetchType.LAZY, mappedBy = "location")
    //    private Job job;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Address id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCountry() {
        return this.country;
    }

    public Address country(String country) {
        this.setCountry(country);
        return this;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getCity() {
        return this.city;
    }

    public Address city(String city) {
        this.setCity(city);
        return this;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getPostalCode() {
        return this.postalCode;
    }

    public Address postalCode(String postalCode) {
        this.setPostalCode(postalCode);
        return this;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getStreetAddress() {
        return this.streetAddress;
    }

    public Address streetAddress(String streetAddress) {
        this.setStreetAddress(streetAddress);
        return this;
    }

    public void setStreetAddress(String streetAddress) {
        this.streetAddress = streetAddress;
    }

    public String getVatNumber() {
        return this.vatNumber;
    }

    public Address vatNumber(String vatNumber) {
        this.setVatNumber(vatNumber);
        return this;
    }

    public void setVatNumber(String vatNumber) {
        this.vatNumber = vatNumber;
    }

    public Boolean getIsDefault() {
        return this.isDefault;
    }

    public Address isDefault(Boolean isDefault) {
        this.setIsDefault(isDefault);
        return this;
    }

    public void setIsDefault(Boolean isDefault) {
        this.isDefault = isDefault;
    }

    public Tasker getTasker() {
        return this.tasker;
    }

    public void setTasker(Tasker tasker) {
        if (this.tasker != null) {
            this.tasker.setAddress(null);
        }
        if (tasker != null) {
            tasker.setAddress(this);
        }
        this.tasker = tasker;
    }

    public Address tasker(Tasker tasker) {
        this.setTasker(tasker);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Address)) {
            return false;
        }
        return id != null && id.equals(((Address) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Address{" +
            "id=" + getId() +
            ", country='" + getCountry() + "'" +
            ", city='" + getCity() + "'" +
            ", postalCode='" + getPostalCode() + "'" +
            ", streetAddress='" + getStreetAddress() + "'" +
            ", vatNumber='" + getVatNumber() + "'" +
            ", isDefault='" + getIsDefault() + "'" +
            "}";
    }
}
