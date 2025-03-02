/*
 * Datart
 * <p>
 * Copyright 2021
 * <p>
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * <p>
 * http://www.apache.org/licenses/LICENSE-2.0
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package datart.data.provider.jdbc.adapters;

import datart.core.base.PageInfo;
import datart.core.base.consts.Const;
import datart.core.base.consts.ValueType;
import datart.core.base.exception.Exceptions;
import datart.core.common.BeanUtils;
import datart.core.common.ReflectUtils;
import datart.core.data.provider.*;
import datart.data.provider.JdbcDataProvider;
import datart.data.provider.calcite.dialect.CustomSqlDialect;
import datart.data.provider.jdbc.JdbcDriverInfo;
import datart.data.provider.jdbc.JdbcProperties;
import datart.data.provider.calcite.dialect.FetchAndOffsetSupport;
import datart.data.provider.jdbc.DataTypeUtils;
import datart.data.provider.jdbc.SqlScriptRender;
import datart.data.provider.local.LocalDB;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.apache.calcite.avatica.util.Casing;
import org.apache.calcite.sql.SqlDialect;
import org.apache.commons.lang3.StringUtils;
import org.springframework.util.CollectionUtils;

import javax.sql.DataSource;
import java.io.Closeable;
import java.lang.reflect.Constructor;
import java.sql.*;
import java.util.*;

@Slf4j
@Setter
@Getter
public class JdbcDataProviderAdapter implements Closeable {

    private static final String SQL_DIALECT_PACKAGE = "datart.data.provider.calcite.dialect";

    protected static final String COUNT_SQL = "SELECT COUNT(*) FROM (%s) V_T";

    protected static final String PKTABLE_CAT = "PKTABLE_CAT";

    protected static final String PKTABLE_NAME = "PKTABLE_NAME";

    protected static final String PKCOLUMN_NAME = "PKCOLUMN_NAME";

    protected static final String FKCOLUMN_NAME = "FKCOLUMN_NAME";

    protected DataSource dataSource;

    protected JdbcProperties jdbcProperties;

    protected JdbcDriverInfo driverInfo;

    protected boolean init;

    protected SqlDialect sqlDialect;

    public final void init(JdbcProperties jdbcProperties, JdbcDriverInfo driverInfo) {
        try {
            this.jdbcProperties = jdbcProperties;
            this.driverInfo = driverInfo;
            this.dataSource = JdbcDataProvider.getDataSourceFactory().createDataSource(jdbcProperties);
        } catch (Exception e) {
            log.error("data provider init error", e);
            Exceptions.e(e);
        }
        this.init = true;
    }

    public boolean test(JdbcProperties properties) {
        BeanUtils.validate(properties);
        try {
            Class.forName(properties.getDriverClass());
        } catch (ClassNotFoundException e) {
            String errMsg = "Driver class not found " + properties.getDriverClass();
            log.error(errMsg, e);
            Exceptions.e(e);
        }
        try {
            DriverManager.getConnection(properties.getUrl(), properties.getUser(), properties.getPassword());
        } catch (SQLException sqlException) {
            Exceptions.e(sqlException);
        }
        return true;
    }

    public Set<String> readAllDatabases() throws SQLException {

        Set<String> catalogs = new HashSet<>();

        try (Connection conn = getConn()) {
            String catalog = conn.getCatalog();
            if (StringUtils.isNotBlank(catalog)) {
                return Collections.singleton(catalog);
            }
            DatabaseMetaData metadata = conn.getMetaData();
            try (ResultSet rs = metadata.getCatalogs()) {
                while (rs.next()) {
                    String catalogName = rs.getString(1);
                    catalogs.add(catalogName);
                }
            }
            return catalogs;
        }
    }

    public Set<String> readAllTables(String database) throws SQLException {
        try (Connection conn = getConn()) {
            Set<String> tables = new HashSet<>();
            DatabaseMetaData metadata = conn.getMetaData();
            try (ResultSet rs = metadata.getTables(database, conn.getSchema(), "%", new String[]{"TABLE", "VIEW"})) {
                while (rs.next()) {
                    String tableName = rs.getString(3);
                    tables.add(tableName);
                }
            }
            return tables;
        }
    }

    public Set<Column> readTableColumn(String database, String table) throws SQLException {
        try (Connection conn = getConn()) {
            Set<Column> columnSet = new HashSet<>();
            DatabaseMetaData metadata = conn.getMetaData();
            Map<String, Map<String, String>> importedKeys = getImportedKeys(metadata, database, table);
            ResultSet columns = metadata.getColumns(database, null, table, null);
            while (columns.next()) {
                Column column = readTableColumn(columns);
                Map<String, String> pKeys = importedKeys.get(column.getName());
                if (pKeys != null) {
                    column.setPkDatabase(pKeys.get(PKTABLE_CAT));
                    column.setPkTable(pKeys.get(PKTABLE_NAME));
                    column.setPkColumn(pKeys.get(PKCOLUMN_NAME));
                }
                columnSet.add(column);
            }
            return columnSet;
        }
    }

    protected Column readTableColumn(ResultSet columnMetadata) throws SQLException {
        Column column = new Column();
        column.setName(columnMetadata.getString(4));
        column.setType(DataTypeUtils.sqlType2DataType(columnMetadata.getString(6)));
        return column;
    }

    /**
     * 获取表的外键关系
     */
    protected Map<String, Map<String, String>> getImportedKeys(DatabaseMetaData metadata, String database, String table) throws SQLException {
        HashMap<String, Map<String, String>> keyMap = new HashMap<>();
        ResultSet importedKeys = metadata.getImportedKeys(database, null, table);
        while (importedKeys.next()) {
            HashMap<String, String> keys = new HashMap<>();
            keys.put(PKTABLE_CAT, importedKeys.getString(PKTABLE_CAT));
            keys.put(PKTABLE_NAME, importedKeys.getString(PKTABLE_NAME));
            keys.put(PKCOLUMN_NAME, importedKeys.getString(PKCOLUMN_NAME));
            keyMap.put(importedKeys.getString(FKCOLUMN_NAME), keys);
        }
        return keyMap;
    }

    /**
     * 直接执行，返回所有数据，用于支持已经支持分页的数据库，或者不需要分页的查询。
     *
     * @param sql 直接提交至数据源执行的SQL，通常已经包含了分页
     * @return 全量数据
     * @throws SQLException SQL执行异常
     */
    protected Dataframe execute(String sql) throws SQLException {
        try (Connection conn = getConn()) {
            try (Statement statement = conn.createStatement()) {
                try (ResultSet rs = statement.executeQuery(sql)) {
                    return parseResultSet(rs);
                }
            }
        }
    }

    /**
     * 用于未支持SQL分页的数据库，使用通用的分页方案进行分页。
     *
     * @param selectSql 提交至数据源执行的SQL
     * @param pageInfo  需要执行的分页信息
     * @return 分页后的数据
     * @throws SQLException SQL执行异常
     */
    protected Dataframe execute(String selectSql, PageInfo pageInfo) throws SQLException {
        Dataframe dataframe;
        try (Connection conn = getConn()) {
            try (Statement statement = conn.createStatement()) {
                statement.setFetchSize((int) Math.min(pageInfo.getPageSize(), 10_000));
                try (ResultSet resultSet = statement.executeQuery(selectSql)) {
                    try {
                        resultSet.absolute((int) Math.min(pageInfo.getTotal(), (pageInfo.getPageNo() - 1) * pageInfo.getPageSize()));
                    } catch (Exception e) {
                        int count = 0;
                        while (count < (pageInfo.getPageNo() - 1) * pageInfo.getPageSize() && resultSet.next()) {
                            count++;
                        }
                    }
                    dataframe = parseResultSet(resultSet, pageInfo.getPageSize());
                    return dataframe;
                }
            }
        }
    }

    public Dataframe execute(QueryScript script, ExecuteParam executeParam) throws Exception {
        //If server aggregation is enabled, query the full data before performing server aggregation
        if (executeParam.isServerAggregate()) {
            return executeInLocal(script, executeParam);
        } else {
            return executeOnSource(script, executeParam);
        }
    }

    /**
     * 单独执行一次查询获取总数据量，用于分页
     *
     * @param sql 不包含分页的SQL
     * @return 总记录数
     */
    public int executeCountSql(String sql) throws SQLException {
        try (Connection connection = getConn()) {
            PreparedStatement preparedStatement = connection.prepareStatement(String.format(COUNT_SQL, sql));
            ResultSet resultSet = preparedStatement.executeQuery();
            resultSet.next();
            return resultSet.getInt(1);
        }
    }

    protected Connection getConn() throws SQLException {
        return dataSource.getConnection();
    }

    @Override
    public void close() {
        if (dataSource == null) {
            return;
        }
        JdbcDataProvider.getDataSourceFactory().destroy(dataSource);
    }

    public boolean supportPaging() {
        return sqlDialect instanceof FetchAndOffsetSupport;
    }

    public SqlDialect getSqlDialect() {
        if (sqlDialect != null) {
            return sqlDialect;
        }
        if (StringUtils.isNotBlank(driverInfo.getSqlDialect())) {
            try {
                Class<?> clz = Class.forName(driverInfo.getSqlDialect());
                Class<?> superclass = clz.getSuperclass();
                if (superclass.equals(CustomSqlDialect.class)) {
                    Constructor<?> constructor = clz.getConstructor(JdbcDriverInfo.class);
                    sqlDialect = (CustomSqlDialect) constructor.newInstance(driverInfo);
                } else {
                    sqlDialect = (SqlDialect) clz.newInstance();
                }
            } catch (Exception ignored) {
                log.warn("Sql dialect " + driverInfo.getSqlDialect() + " not found, use default sql dialect");
            }
        }
        if (sqlDialect == null) {
            try {
                sqlDialect = SqlDialect.DatabaseProduct.valueOf(driverInfo.getDbType().toUpperCase()).getDialect();
            } catch (Exception ignored) {
                log.warn("DBType " + driverInfo.getDbType() + " mismatched, use custom sql dialect");
                sqlDialect = new CustomSqlDialect(driverInfo);
            }
        }
        // set case not change
        try {
            ReflectUtils.setFiledValue(sqlDialect, "unquotedCasing", Casing.UNCHANGED);
            ReflectUtils.setFiledValue(sqlDialect, "quotedCasing", Casing.UNCHANGED);
        } catch (Exception e) {
            log.warn("sql dialect config error for " + driverInfo.getSqlDialect());
        }

        return sqlDialect;
    }

    protected Dataframe parseResultSet(ResultSet rs) throws SQLException {
        return parseResultSet(rs, Long.MAX_VALUE);
    }

    protected Dataframe parseResultSet(ResultSet rs, long count) throws SQLException {
        Dataframe dataframe = new Dataframe();
        List<Column> columns = getColumns(rs);
        ArrayList<List<Object>> rows = new ArrayList<>();
        int c = 0;
        while (rs.next()) {
            ArrayList<Object> row = new ArrayList<>();
            rows.add(row);
            for (int i = 1; i < columns.size() + 1; i++) {
                row.add(rs.getObject(i));
            }
            c++;
            if (c >= count) {
                break;
            }
        }
        dataframe.setColumns(columns);
        dataframe.setRows(rows);
        return dataframe;
    }

    protected List<Column> getColumns(ResultSet rs) throws SQLException {
        ArrayList<Column> columns = new ArrayList<>();
        for (int i = 1; i <= rs.getMetaData().getColumnCount(); i++) {
            String columnTypeName = rs.getMetaData().getColumnTypeName(i);
            String columnName = rs.getMetaData().getColumnLabel(i);
            ValueType valueType = DataTypeUtils.sqlType2DataType(columnTypeName);
            columns.add(new Column(columnName, valueType));
        }
        return columns;
    }

    /**
     * 本地执行，从数据源拉取全量数据，在本地执行聚合操作
     */
    protected Dataframe executeInLocal(QueryScript script, ExecuteParam executeParam) throws Exception {
        SqlScriptRender render = new SqlScriptRender(script
                , executeParam
                , getSqlDialect());

        String sql = render.render(false, false, false);
        Dataframe data = execute(sql);
        if (!CollectionUtils.isEmpty(script.getSchema())) {
            for (Column column : data.getColumns()) {
                column.setType(script.getSchema().getOrDefault(column.getName(), column).getType());
            }
        }
        data.setName(script.toQueryKey());
        return LocalDB.executeLocalQuery(null, executeParam, Collections.singletonList(data));
    }

    /**
     * 在数据源执行，组装完整SQL，提交至数据源执行
     */
    protected Dataframe executeOnSource(QueryScript script, ExecuteParam executeParam) throws Exception {

        Dataframe dataframe;
        String sql;

        SqlScriptRender render = new SqlScriptRender(script
                , executeParam
                , getSqlDialect()
                , jdbcProperties.isEnableSpecialSql());

        if (supportPaging()) {
            sql = render.render(true, true, false);
            log.debug(sql);
            dataframe = execute(sql);
        } else {
            sql = render.render(true, false, false);
            log.debug(sql);
            dataframe = execute(sql, executeParam.getPageInfo());
        }
        // fix page info
        if (executeParam.getPageInfo().isCountTotal()) {
            int total = executeCountSql(render.render(true, false, true));
            executeParam.getPageInfo().setTotal(total);
            dataframe.setPageInfo(executeParam.getPageInfo());
        }
        dataframe.setScript(sql);
        return dataframe;
    }

}
