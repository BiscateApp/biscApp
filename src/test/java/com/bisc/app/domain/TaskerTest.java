package com.bisc.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.bisc.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TaskerTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Tasker.class);
        Tasker tasker1 = new Tasker();
        tasker1.setId(1L);
        Tasker tasker2 = new Tasker();
        tasker2.setId(tasker1.getId());
        assertThat(tasker1).isEqualTo(tasker2);
        tasker2.setId(2L);
        assertThat(tasker1).isNotEqualTo(tasker2);
        tasker1.setId(null);
        assertThat(tasker1).isNotEqualTo(tasker2);
    }
}
