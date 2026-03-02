package com.webproject.backend;

import java.sql.Connection;
import java.sql.DatabaseMetaData;
import javax.sql.DataSource;
import org.mockito.Mockito;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;

@TestConfiguration
public class TestConfig {

  @Bean
  @Primary
  public DataSource dataSource() throws Exception {
    DatabaseMetaData metaData = Mockito.mock(DatabaseMetaData.class);
    Mockito.when(metaData.getDatabaseProductName()).thenReturn("PostgreSQL");

    Connection connection = Mockito.mock(Connection.class);
    Mockito.when(connection.getMetaData()).thenReturn(metaData);

    DataSource dataSource = Mockito.mock(DataSource.class);
    Mockito.when(dataSource.getConnection()).thenReturn(connection);

    return dataSource;
  }
}
