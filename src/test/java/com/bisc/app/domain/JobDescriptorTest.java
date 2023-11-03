package com.bisc.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.bisc.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class JobDescriptorTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(JobDescriptor.class);
        JobDescriptor jobDescriptor1 = new JobDescriptor();
        jobDescriptor1.setId(1L);
        JobDescriptor jobDescriptor2 = new JobDescriptor();
        jobDescriptor2.setId(jobDescriptor1.getId());
        assertThat(jobDescriptor1).isEqualTo(jobDescriptor2);
        jobDescriptor2.setId(2L);
        assertThat(jobDescriptor1).isNotEqualTo(jobDescriptor2);
        jobDescriptor1.setId(null);
        assertThat(jobDescriptor1).isNotEqualTo(jobDescriptor2);
    }
}
