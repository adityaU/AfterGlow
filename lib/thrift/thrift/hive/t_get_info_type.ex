defmodule(Thrift.Hive.TGetInfoType) do
  @moduledoc("Auto-generated Thrift enum TCLIService.TGetInfoType")
  defmacro(cli_max_driver_connections) do
    0
  end
  defmacro(cli_max_concurrent_activities) do
    1
  end
  defmacro(cli_data_source_name) do
    2
  end
  defmacro(cli_fetch_direction) do
    8
  end
  defmacro(cli_server_name) do
    13
  end
  defmacro(cli_search_pattern_escape) do
    14
  end
  defmacro(cli_dbms_name) do
    17
  end
  defmacro(cli_dbms_ver) do
    18
  end
  defmacro(cli_accessible_tables) do
    19
  end
  defmacro(cli_accessible_procedures) do
    20
  end
  defmacro(cli_cursor_commit_behavior) do
    23
  end
  defmacro(cli_data_source_read_only) do
    25
  end
  defmacro(cli_default_txn_isolation) do
    26
  end
  defmacro(cli_identifier_case) do
    28
  end
  defmacro(cli_identifier_quote_char) do
    29
  end
  defmacro(cli_max_column_name_len) do
    30
  end
  defmacro(cli_max_cursor_name_len) do
    31
  end
  defmacro(cli_max_schema_name_len) do
    32
  end
  defmacro(cli_max_catalog_name_len) do
    34
  end
  defmacro(cli_max_table_name_len) do
    35
  end
  defmacro(cli_scroll_concurrency) do
    43
  end
  defmacro(cli_txn_capable) do
    46
  end
  defmacro(cli_user_name) do
    47
  end
  defmacro(cli_txn_isolation_option) do
    72
  end
  defmacro(cli_integrity) do
    73
  end
  defmacro(cli_getdata_extensions) do
    81
  end
  defmacro(cli_null_collation) do
    85
  end
  defmacro(cli_alter_table) do
    86
  end
  defmacro(cli_order_by_columns_in_select) do
    90
  end
  defmacro(cli_special_characters) do
    94
  end
  defmacro(cli_max_columns_in_group_by) do
    97
  end
  defmacro(cli_max_columns_in_index) do
    98
  end
  defmacro(cli_max_columns_in_order_by) do
    99
  end
  defmacro(cli_max_columns_in_select) do
    100
  end
  defmacro(cli_max_columns_in_table) do
    101
  end
  defmacro(cli_max_index_size) do
    102
  end
  defmacro(cli_max_row_size) do
    104
  end
  defmacro(cli_max_statement_len) do
    105
  end
  defmacro(cli_max_tables_in_select) do
    106
  end
  defmacro(cli_max_user_name_len) do
    107
  end
  defmacro(cli_oj_capabilities) do
    115
  end
  defmacro(cli_xopen_cli_year) do
    10000
  end
  defmacro(cli_cursor_sensitivity) do
    10001
  end
  defmacro(cli_describe_parameter) do
    10002
  end
  defmacro(cli_catalog_name) do
    10003
  end
  defmacro(cli_collation_seq) do
    10004
  end
  defmacro(cli_max_identifier_len) do
    10005
  end
  def(value_to_name(0)) do
    {:ok, :cli_max_driver_connections}
  end
  def(value_to_name(1)) do
    {:ok, :cli_max_concurrent_activities}
  end
  def(value_to_name(2)) do
    {:ok, :cli_data_source_name}
  end
  def(value_to_name(8)) do
    {:ok, :cli_fetch_direction}
  end
  def(value_to_name(13)) do
    {:ok, :cli_server_name}
  end
  def(value_to_name(14)) do
    {:ok, :cli_search_pattern_escape}
  end
  def(value_to_name(17)) do
    {:ok, :cli_dbms_name}
  end
  def(value_to_name(18)) do
    {:ok, :cli_dbms_ver}
  end
  def(value_to_name(19)) do
    {:ok, :cli_accessible_tables}
  end
  def(value_to_name(20)) do
    {:ok, :cli_accessible_procedures}
  end
  def(value_to_name(23)) do
    {:ok, :cli_cursor_commit_behavior}
  end
  def(value_to_name(25)) do
    {:ok, :cli_data_source_read_only}
  end
  def(value_to_name(26)) do
    {:ok, :cli_default_txn_isolation}
  end
  def(value_to_name(28)) do
    {:ok, :cli_identifier_case}
  end
  def(value_to_name(29)) do
    {:ok, :cli_identifier_quote_char}
  end
  def(value_to_name(30)) do
    {:ok, :cli_max_column_name_len}
  end
  def(value_to_name(31)) do
    {:ok, :cli_max_cursor_name_len}
  end
  def(value_to_name(32)) do
    {:ok, :cli_max_schema_name_len}
  end
  def(value_to_name(34)) do
    {:ok, :cli_max_catalog_name_len}
  end
  def(value_to_name(35)) do
    {:ok, :cli_max_table_name_len}
  end
  def(value_to_name(43)) do
    {:ok, :cli_scroll_concurrency}
  end
  def(value_to_name(46)) do
    {:ok, :cli_txn_capable}
  end
  def(value_to_name(47)) do
    {:ok, :cli_user_name}
  end
  def(value_to_name(72)) do
    {:ok, :cli_txn_isolation_option}
  end
  def(value_to_name(73)) do
    {:ok, :cli_integrity}
  end
  def(value_to_name(81)) do
    {:ok, :cli_getdata_extensions}
  end
  def(value_to_name(85)) do
    {:ok, :cli_null_collation}
  end
  def(value_to_name(86)) do
    {:ok, :cli_alter_table}
  end
  def(value_to_name(90)) do
    {:ok, :cli_order_by_columns_in_select}
  end
  def(value_to_name(94)) do
    {:ok, :cli_special_characters}
  end
  def(value_to_name(97)) do
    {:ok, :cli_max_columns_in_group_by}
  end
  def(value_to_name(98)) do
    {:ok, :cli_max_columns_in_index}
  end
  def(value_to_name(99)) do
    {:ok, :cli_max_columns_in_order_by}
  end
  def(value_to_name(100)) do
    {:ok, :cli_max_columns_in_select}
  end
  def(value_to_name(101)) do
    {:ok, :cli_max_columns_in_table}
  end
  def(value_to_name(102)) do
    {:ok, :cli_max_index_size}
  end
  def(value_to_name(104)) do
    {:ok, :cli_max_row_size}
  end
  def(value_to_name(105)) do
    {:ok, :cli_max_statement_len}
  end
  def(value_to_name(106)) do
    {:ok, :cli_max_tables_in_select}
  end
  def(value_to_name(107)) do
    {:ok, :cli_max_user_name_len}
  end
  def(value_to_name(115)) do
    {:ok, :cli_oj_capabilities}
  end
  def(value_to_name(10000)) do
    {:ok, :cli_xopen_cli_year}
  end
  def(value_to_name(10001)) do
    {:ok, :cli_cursor_sensitivity}
  end
  def(value_to_name(10002)) do
    {:ok, :cli_describe_parameter}
  end
  def(value_to_name(10003)) do
    {:ok, :cli_catalog_name}
  end
  def(value_to_name(10004)) do
    {:ok, :cli_collation_seq}
  end
  def(value_to_name(10005)) do
    {:ok, :cli_max_identifier_len}
  end
  def(value_to_name(v)) do
    {:error, {:invalid_enum_value, v}}
  end
  def(name_to_value(:cli_max_driver_connections)) do
    {:ok, 0}
  end
  def(name_to_value(:cli_max_concurrent_activities)) do
    {:ok, 1}
  end
  def(name_to_value(:cli_data_source_name)) do
    {:ok, 2}
  end
  def(name_to_value(:cli_fetch_direction)) do
    {:ok, 8}
  end
  def(name_to_value(:cli_server_name)) do
    {:ok, 13}
  end
  def(name_to_value(:cli_search_pattern_escape)) do
    {:ok, 14}
  end
  def(name_to_value(:cli_dbms_name)) do
    {:ok, 17}
  end
  def(name_to_value(:cli_dbms_ver)) do
    {:ok, 18}
  end
  def(name_to_value(:cli_accessible_tables)) do
    {:ok, 19}
  end
  def(name_to_value(:cli_accessible_procedures)) do
    {:ok, 20}
  end
  def(name_to_value(:cli_cursor_commit_behavior)) do
    {:ok, 23}
  end
  def(name_to_value(:cli_data_source_read_only)) do
    {:ok, 25}
  end
  def(name_to_value(:cli_default_txn_isolation)) do
    {:ok, 26}
  end
  def(name_to_value(:cli_identifier_case)) do
    {:ok, 28}
  end
  def(name_to_value(:cli_identifier_quote_char)) do
    {:ok, 29}
  end
  def(name_to_value(:cli_max_column_name_len)) do
    {:ok, 30}
  end
  def(name_to_value(:cli_max_cursor_name_len)) do
    {:ok, 31}
  end
  def(name_to_value(:cli_max_schema_name_len)) do
    {:ok, 32}
  end
  def(name_to_value(:cli_max_catalog_name_len)) do
    {:ok, 34}
  end
  def(name_to_value(:cli_max_table_name_len)) do
    {:ok, 35}
  end
  def(name_to_value(:cli_scroll_concurrency)) do
    {:ok, 43}
  end
  def(name_to_value(:cli_txn_capable)) do
    {:ok, 46}
  end
  def(name_to_value(:cli_user_name)) do
    {:ok, 47}
  end
  def(name_to_value(:cli_txn_isolation_option)) do
    {:ok, 72}
  end
  def(name_to_value(:cli_integrity)) do
    {:ok, 73}
  end
  def(name_to_value(:cli_getdata_extensions)) do
    {:ok, 81}
  end
  def(name_to_value(:cli_null_collation)) do
    {:ok, 85}
  end
  def(name_to_value(:cli_alter_table)) do
    {:ok, 86}
  end
  def(name_to_value(:cli_order_by_columns_in_select)) do
    {:ok, 90}
  end
  def(name_to_value(:cli_special_characters)) do
    {:ok, 94}
  end
  def(name_to_value(:cli_max_columns_in_group_by)) do
    {:ok, 97}
  end
  def(name_to_value(:cli_max_columns_in_index)) do
    {:ok, 98}
  end
  def(name_to_value(:cli_max_columns_in_order_by)) do
    {:ok, 99}
  end
  def(name_to_value(:cli_max_columns_in_select)) do
    {:ok, 100}
  end
  def(name_to_value(:cli_max_columns_in_table)) do
    {:ok, 101}
  end
  def(name_to_value(:cli_max_index_size)) do
    {:ok, 102}
  end
  def(name_to_value(:cli_max_row_size)) do
    {:ok, 104}
  end
  def(name_to_value(:cli_max_statement_len)) do
    {:ok, 105}
  end
  def(name_to_value(:cli_max_tables_in_select)) do
    {:ok, 106}
  end
  def(name_to_value(:cli_max_user_name_len)) do
    {:ok, 107}
  end
  def(name_to_value(:cli_oj_capabilities)) do
    {:ok, 115}
  end
  def(name_to_value(:cli_xopen_cli_year)) do
    {:ok, 10000}
  end
  def(name_to_value(:cli_cursor_sensitivity)) do
    {:ok, 10001}
  end
  def(name_to_value(:cli_describe_parameter)) do
    {:ok, 10002}
  end
  def(name_to_value(:cli_catalog_name)) do
    {:ok, 10003}
  end
  def(name_to_value(:cli_collation_seq)) do
    {:ok, 10004}
  end
  def(name_to_value(:cli_max_identifier_len)) do
    {:ok, 10005}
  end
  def(name_to_value(k)) do
    {:error, {:invalid_enum_name, k}}
  end
  def(value_to_name!(value)) do
    {:ok, name} = value_to_name(value)
    name
  end
  def(name_to_value!(name)) do
    {:ok, value} = name_to_value(name)
    value
  end
  def(meta(:names)) do
    [:cli_max_driver_connections, :cli_max_concurrent_activities, :cli_data_source_name, :cli_fetch_direction, :cli_server_name, :cli_search_pattern_escape, :cli_dbms_name, :cli_dbms_ver, :cli_accessible_tables, :cli_accessible_procedures, :cli_cursor_commit_behavior, :cli_data_source_read_only, :cli_default_txn_isolation, :cli_identifier_case, :cli_identifier_quote_char, :cli_max_column_name_len, :cli_max_cursor_name_len, :cli_max_schema_name_len, :cli_max_catalog_name_len, :cli_max_table_name_len, :cli_scroll_concurrency, :cli_txn_capable, :cli_user_name, :cli_txn_isolation_option, :cli_integrity, :cli_getdata_extensions, :cli_null_collation, :cli_alter_table, :cli_order_by_columns_in_select, :cli_special_characters, :cli_max_columns_in_group_by, :cli_max_columns_in_index, :cli_max_columns_in_order_by, :cli_max_columns_in_select, :cli_max_columns_in_table, :cli_max_index_size, :cli_max_row_size, :cli_max_statement_len, :cli_max_tables_in_select, :cli_max_user_name_len, :cli_oj_capabilities, :cli_xopen_cli_year, :cli_cursor_sensitivity, :cli_describe_parameter, :cli_catalog_name, :cli_collation_seq, :cli_max_identifier_len]
  end
  def(meta(:values)) do
    [0, 1, 2, 8, 13, 14, 17, 18, 19, 20, 23, 25, 26, 28, 29, 30, 31, 32, 34, 35, 43, 46, 47, 72, 73, 81, 85, 86, 90, 94, 97, 98, 99, 100, 101, 102, 104, 105, 106, 107, 115, 10000, 10001, 10002, 10003, 10004, 10005]
  end
  def(member?(0)) do
    true
  end
  def(member?(1)) do
    true
  end
  def(member?(2)) do
    true
  end
  def(member?(8)) do
    true
  end
  def(member?(13)) do
    true
  end
  def(member?(14)) do
    true
  end
  def(member?(17)) do
    true
  end
  def(member?(18)) do
    true
  end
  def(member?(19)) do
    true
  end
  def(member?(20)) do
    true
  end
  def(member?(23)) do
    true
  end
  def(member?(25)) do
    true
  end
  def(member?(26)) do
    true
  end
  def(member?(28)) do
    true
  end
  def(member?(29)) do
    true
  end
  def(member?(30)) do
    true
  end
  def(member?(31)) do
    true
  end
  def(member?(32)) do
    true
  end
  def(member?(34)) do
    true
  end
  def(member?(35)) do
    true
  end
  def(member?(43)) do
    true
  end
  def(member?(46)) do
    true
  end
  def(member?(47)) do
    true
  end
  def(member?(72)) do
    true
  end
  def(member?(73)) do
    true
  end
  def(member?(81)) do
    true
  end
  def(member?(85)) do
    true
  end
  def(member?(86)) do
    true
  end
  def(member?(90)) do
    true
  end
  def(member?(94)) do
    true
  end
  def(member?(97)) do
    true
  end
  def(member?(98)) do
    true
  end
  def(member?(99)) do
    true
  end
  def(member?(100)) do
    true
  end
  def(member?(101)) do
    true
  end
  def(member?(102)) do
    true
  end
  def(member?(104)) do
    true
  end
  def(member?(105)) do
    true
  end
  def(member?(106)) do
    true
  end
  def(member?(107)) do
    true
  end
  def(member?(115)) do
    true
  end
  def(member?(10000)) do
    true
  end
  def(member?(10001)) do
    true
  end
  def(member?(10002)) do
    true
  end
  def(member?(10003)) do
    true
  end
  def(member?(10004)) do
    true
  end
  def(member?(10005)) do
    true
  end
  def(member?(_)) do
    false
  end
  def(name?(:cli_max_driver_connections)) do
    true
  end
  def(name?(:cli_max_concurrent_activities)) do
    true
  end
  def(name?(:cli_data_source_name)) do
    true
  end
  def(name?(:cli_fetch_direction)) do
    true
  end
  def(name?(:cli_server_name)) do
    true
  end
  def(name?(:cli_search_pattern_escape)) do
    true
  end
  def(name?(:cli_dbms_name)) do
    true
  end
  def(name?(:cli_dbms_ver)) do
    true
  end
  def(name?(:cli_accessible_tables)) do
    true
  end
  def(name?(:cli_accessible_procedures)) do
    true
  end
  def(name?(:cli_cursor_commit_behavior)) do
    true
  end
  def(name?(:cli_data_source_read_only)) do
    true
  end
  def(name?(:cli_default_txn_isolation)) do
    true
  end
  def(name?(:cli_identifier_case)) do
    true
  end
  def(name?(:cli_identifier_quote_char)) do
    true
  end
  def(name?(:cli_max_column_name_len)) do
    true
  end
  def(name?(:cli_max_cursor_name_len)) do
    true
  end
  def(name?(:cli_max_schema_name_len)) do
    true
  end
  def(name?(:cli_max_catalog_name_len)) do
    true
  end
  def(name?(:cli_max_table_name_len)) do
    true
  end
  def(name?(:cli_scroll_concurrency)) do
    true
  end
  def(name?(:cli_txn_capable)) do
    true
  end
  def(name?(:cli_user_name)) do
    true
  end
  def(name?(:cli_txn_isolation_option)) do
    true
  end
  def(name?(:cli_integrity)) do
    true
  end
  def(name?(:cli_getdata_extensions)) do
    true
  end
  def(name?(:cli_null_collation)) do
    true
  end
  def(name?(:cli_alter_table)) do
    true
  end
  def(name?(:cli_order_by_columns_in_select)) do
    true
  end
  def(name?(:cli_special_characters)) do
    true
  end
  def(name?(:cli_max_columns_in_group_by)) do
    true
  end
  def(name?(:cli_max_columns_in_index)) do
    true
  end
  def(name?(:cli_max_columns_in_order_by)) do
    true
  end
  def(name?(:cli_max_columns_in_select)) do
    true
  end
  def(name?(:cli_max_columns_in_table)) do
    true
  end
  def(name?(:cli_max_index_size)) do
    true
  end
  def(name?(:cli_max_row_size)) do
    true
  end
  def(name?(:cli_max_statement_len)) do
    true
  end
  def(name?(:cli_max_tables_in_select)) do
    true
  end
  def(name?(:cli_max_user_name_len)) do
    true
  end
  def(name?(:cli_oj_capabilities)) do
    true
  end
  def(name?(:cli_xopen_cli_year)) do
    true
  end
  def(name?(:cli_cursor_sensitivity)) do
    true
  end
  def(name?(:cli_describe_parameter)) do
    true
  end
  def(name?(:cli_catalog_name)) do
    true
  end
  def(name?(:cli_collation_seq)) do
    true
  end
  def(name?(:cli_max_identifier_len)) do
    true
  end
  def(name?(_)) do
    false
  end
end