DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'questions') THEN

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: btree_gist; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS btree_gist WITH SCHEMA public;


--
-- Name: EXTENSION btree_gist; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION btree_gist IS 'support for indexing common datatypes in GiST';


--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--


--
--




--


SET default_tablespace = '';

SET default_table_access_method = heap;

--
--


--

CREATE TABLE IF NOT EXISTS public.alert_events (
    id bigint NOT NULL,
    alert_setting_id bigint NOT NULL,
    alert_level integer NOT NULL,
    original_data jsonb,
    transformed_data_column_name character varying(255),
    is_data_saved boolean DEFAULT true NOT NULL,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);



--
--

CREATE SEQUENCE IF NOT EXISTS public.alert_events_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE IF EXISTS public.alert_events_id_seq OWNED BY public.alert_events.id;


--
--

CREATE TABLE IF NOT EXISTS public.alert_events_transformed_data (
    id bigint NOT NULL,
    value character varying(255),
    level integer NOT NULL,
    alert_event_id bigint NOT NULL,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);



--
--

CREATE SEQUENCE IF NOT EXISTS public.alert_events_transformed_data_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE IF EXISTS public.alert_events_transformed_data_id_seq OWNED BY public.alert_events_transformed_data.id;


--
--

CREATE TABLE IF NOT EXISTS public.alert_level_settings (
    id bigint NOT NULL,
    level integer NOT NULL,
    value character varying(255) NOT NULL,
    alert_setting_id bigint NOT NULL,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);



--
--

CREATE SEQUENCE IF NOT EXISTS public.alert_level_settings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE IF EXISTS public.alert_level_settings_id_seq OWNED BY public.alert_level_settings.id;


--
--

CREATE TABLE IF NOT EXISTS public.alert_notification_settings (
    id bigint NOT NULL,
    method integer NOT NULL,
    recipients character varying(255)[] NOT NULL,
    alert_setting_id bigint NOT NULL,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);



--
--

CREATE SEQUENCE IF NOT EXISTS public.alert_notification_settings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE IF EXISTS public.alert_notification_settings_id_seq OWNED BY public.alert_notification_settings.id;


--
--

CREATE TABLE IF NOT EXISTS public.alert_settings (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    question_id bigint NOT NULL,
    "column" character varying(255) NOT NULL,
    aggregation integer NOT NULL,
    number_of_rows integer NOT NULL,
    operation integer NOT NULL,
    traversal integer NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    frequency_value_in_seconds integer NOT NULL,
    start_time timestamp(0) without time zone NOT NULL,
    scheduled_disabled_config jsonb,
    silent_till timestamp(0) without time zone,
    next_run_time timestamp(0) without time zone,
    status integer,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);



--
--

CREATE SEQUENCE IF NOT EXISTS public.alert_settings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--

ALTER SEQUENCE IF EXISTS public.alert_settings_id_seq OWNED BY public.alert_settings.id;


--
--

CREATE TABLE IF NOT EXISTS public.alerts (
    id integer NOT NULL,
    name character varying(255),
    config jsonb,
    question_id integer,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);



--
--

CREATE SEQUENCE IF NOT EXISTS public.alerts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE IF EXISTS public.alerts_id_seq OWNED BY public.alerts.id;


--
--

CREATE TABLE IF NOT EXISTS public.api_action_logs (
    id integer NOT NULL,
    api_action_id integer,
    url text NOT NULL,
    request_headers jsonb,
    response_headers jsonb,
    request_body text,
    response_body text,
    request_method integer,
    status_code integer,
    variables character varying(255)[],
    user_id integer,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);



--
--

CREATE SEQUENCE IF NOT EXISTS public.api_action_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE IF EXISTS public.api_action_logs_id_seq OWNED BY public.api_action_logs.id;


--
--

CREATE TABLE IF NOT EXISTS public.api_actions (
    id integer NOT NULL,
    question_id integer,
    url text NOT NULL,
    headers jsonb,
    body text,
    method integer,
    name character varying(255),
    color character varying(255),
    open_in_new_tab boolean,
    response_settings jsonb,
    hidden boolean,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    "column" character varying(255),
    on_success integer,
    on_failure integer,
    failure_message character varying(255),
    failure_key character varying(255),
    success_message character varying(255),
    success_key character varying(255),
    action_level integer,
    visualization_id integer,
    loading_message text,
    display_settings jsonb,
    open_option character varying(255)
);



--
--

CREATE SEQUENCE IF NOT EXISTS public.api_actions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE IF EXISTS public.api_actions_id_seq OWNED BY public.api_actions.id;


--
--

CREATE TABLE IF NOT EXISTS public.applications (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);



--
--

CREATE SEQUENCE IF NOT EXISTS public.applications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE IF EXISTS public.applications_id_seq OWNED BY public.applications.id;


--
--

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id bigint NOT NULL,
    whodunit integer,
    action integer,
    additional_data jsonb,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);



--
--

CREATE SEQUENCE IF NOT EXISTS public.audit_logs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE IF EXISTS public.audit_logs_id_seq OWNED BY public.audit_logs.id;


--
--

CREATE TABLE IF NOT EXISTS public.column_values (
    id integer NOT NULL,
    name character varying(255),
    value character varying(255),
    column_id integer,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);



--
--

CREATE SEQUENCE IF NOT EXISTS public.column_values_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE IF EXISTS public.column_values_id_seq OWNED BY public.column_values.id;


--
--

CREATE TABLE IF NOT EXISTS public.columns (
    id integer NOT NULL,
    name character varying(255),
    table_id integer,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    data_type character varying(255),
    description character varying(255),
    primary_key boolean
);



--
--

CREATE SEQUENCE IF NOT EXISTS public.columns_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE IF EXISTS public.columns_id_seq OWNED BY public.columns.id;


--
--

CREATE TABLE IF NOT EXISTS public.dashboard_questions (
    dashboard_id integer,
    question_id integer
);



--
--

CREATE TABLE IF NOT EXISTS public.dashboard_widgets (
    id bigint NOT NULL,
    widget_type character varying(255),
    widget_id bigint,
    dashboard_id bigint,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);



--
--

CREATE SEQUENCE IF NOT EXISTS public.dashboard_widgets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE IF EXISTS public.dashboard_widgets_id_seq OWNED BY public.dashboard_widgets.id;


--
--

CREATE TABLE IF NOT EXISTS public.dashboards (
    id integer NOT NULL,
    title character varying(255),
    update_interval integer,
    last_updated timestamp without time zone,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    description text,
    shareable_link uuid,
    is_shareable_link_public boolean DEFAULT false,
    settings jsonb,
    shared_to character varying(255)[],
    owner_id integer,
    notes_settings jsonb
);



--
--

CREATE SEQUENCE IF NOT EXISTS public.dashboards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE IF EXISTS public.dashboards_id_seq OWNED BY public.dashboards.id;


--
--

CREATE TABLE IF NOT EXISTS public.databases (
    id integer NOT NULL,
    name character varying(255),
    db_type character varying(255),
    config jsonb,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    last_accessed_at timestamp without time zone,
    unique_identifier uuid
);



--
--

CREATE SEQUENCE IF NOT EXISTS public.databases_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE IF EXISTS public.databases_id_seq OWNED BY public.databases.id;


--
--

CREATE TABLE IF NOT EXISTS public.ecto_schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);



--
--

CREATE TABLE IF NOT EXISTS public.foreign_keys (
    id integer NOT NULL,
    name character varying(255),
    fk_type integer,
    column_id integer,
    foreign_column_id integer,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);



--
--

CREATE SEQUENCE IF NOT EXISTS public.foreign_keys_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE IF EXISTS public.foreign_keys_id_seq OWNED BY public.foreign_keys.id;


--
--

CREATE TABLE IF NOT EXISTS public.generated_alerts (
    id integer NOT NULL,
    alert_id integer,
    status integer,
    failing_conditions jsonb[],
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);



--
--

CREATE SEQUENCE IF NOT EXISTS public.generated_alerts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE IF EXISTS public.generated_alerts_id_seq OWNED BY public.generated_alerts.id;


--
--

CREATE TABLE IF NOT EXISTS public.notes (
    id integer NOT NULL,
    content text NOT NULL,
    dashboard_id integer,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);



--
--

CREATE SEQUENCE IF NOT EXISTS public.notes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE IF EXISTS public.notes_id_seq OWNED BY public.notes.id;


--
--



--
--

CREATE TABLE IF NOT EXISTS public.organization_settings (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    value character varying(255),
    setting_type integer NOT NULL,
    organization_id bigint NOT NULL,
    api_action_id bigint,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);



--
--

CREATE SEQUENCE IF NOT EXISTS public.organization_settings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE IF EXISTS public.organization_settings_id_seq OWNED BY public.organization_settings.id;


--
--

CREATE TABLE IF NOT EXISTS public.organizations (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    google_domain character varying(255) NOT NULL,
    is_deactivated boolean DEFAULT false NOT NULL,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);



--
--

CREATE SEQUENCE IF NOT EXISTS public.organizations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE IF EXISTS public.organizations_id_seq OWNED BY public.organizations.id;


--
--

CREATE TABLE IF NOT EXISTS public.permission_sets (
    id integer NOT NULL,
    name character varying(255),
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);



--
--

CREATE SEQUENCE IF NOT EXISTS public.permission_sets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE IF EXISTS public.permission_sets_id_seq OWNED BY public.permission_sets.id;


--
--

CREATE TABLE IF NOT EXISTS public.permissions (
    id integer NOT NULL,
    permission_set_id integer,
    name character varying(255),
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);



--
--

CREATE SEQUENCE IF NOT EXISTS public.permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

CREATE TABLE IF NOT EXISTS public.question_banks (
    id integer NOT NULL,
    title character varying(255),
    questions integer[],
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);



--
--

CREATE SEQUENCE IF NOT EXISTS public.question_banks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE IF EXISTS public.question_banks_id_seq OWNED BY public.question_banks.id;


--
--

CREATE TABLE IF NOT EXISTS public.question_widgets (
    id integer NOT NULL,
    widget_id integer,
    question_id integer
);



--
--

CREATE SEQUENCE IF NOT EXISTS public.question_widgets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE IF EXISTS public.question_widgets_id_seq OWNED BY public.question_widgets.id;


--
--

CREATE TABLE IF NOT EXISTS public.questions (
    id integer NOT NULL,
    title character varying(255),
    last_updated timestamp without time zone,
    sql text,
    human_sql jsonb,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    query_type integer,
    shareable_link uuid,
    is_shareable_link_public boolean DEFAULT false,
    results_view_settings jsonb,
    columns character varying(255)[],
    cached_results jsonb,
    shared_to character varying(255)[],
    owner_id integer,
    config jsonb
);



--
--

CREATE SEQUENCE IF NOT EXISTS public.questions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE IF EXISTS public.questions_id_seq OWNED BY public.questions.id;


--
--

CREATE TABLE IF NOT EXISTS public.results_cache (
    id bigint NOT NULL,
    key character varying(255),
    sql text,
    data jsonb,
    expiry_time timestamp(0) without time zone,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);



--
--

CREATE SEQUENCE IF NOT EXISTS public.results_cache_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE IF EXISTS public.results_cache_id_seq OWNED BY public.results_cache.id;


--
--

CREATE TABLE IF NOT EXISTS public.rules_engine_permissions (
    id bigint NOT NULL,
    role_id bigint NOT NULL,
    name integer NOT NULL,
    created_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);



--
--

CREATE SEQUENCE IF NOT EXISTS public.rules_engine_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE IF EXISTS public.rules_engine_permissions_id_seq OWNED BY public.rules_engine_permissions.id;


--
--

CREATE TABLE IF NOT EXISTS public.rules_engine_roles (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);



--
--

CREATE SEQUENCE IF NOT EXISTS public.rules_engine_roles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE IF EXISTS public.rules_engine_roles_id_seq OWNED BY public.rules_engine_roles.id;


--
--

CREATE TABLE IF NOT EXISTS public.rules_engine_users (
    id bigint NOT NULL,
    name character varying(255),
    email character varying(255) NOT NULL,
    is_deactivated boolean DEFAULT false NOT NULL,
    profile_pic character varying(255),
    metadata jsonb,
    created_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);



--
--

CREATE SEQUENCE IF NOT EXISTS public.rules_engine_users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE IF EXISTS public.rules_engine_users_id_seq OWNED BY public.rules_engine_users.id;


--
--

CREATE TABLE IF NOT EXISTS public.schedules (
    id bigint NOT NULL,
    every integer,
    time_unit character varying(255),
    time_details jsonb[],
    next_execution_time timestamp(0) without time zone,
    is_running boolean,
    job_details jsonb,
    is_active boolean,
    recipients character varying(255)[],
    timezone character varying(255),
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);



--
--

CREATE SEQUENCE IF NOT EXISTS public.schedules_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE IF EXISTS public.schedules_id_seq OWNED BY public.schedules.id;


--
--

CREATE TABLE IF NOT EXISTS public.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp without time zone
);



--
--

CREATE TABLE IF NOT EXISTS public.searchable_columns (
    id bigint NOT NULL,
    name character varying(255),
    snapshot_id integer,
    value text,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    snapshot_data_identifier uuid
);



--
--

CREATE SEQUENCE IF NOT EXISTS public.searchable_columns_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE IF EXISTS public.searchable_columns_id_seq OWNED BY public.searchable_columns.id;


--
--

CREATE TABLE IF NOT EXISTS public.send_alert_configs (
    id integer NOT NULL,
    alert_id integer,
    message_template character varying(255),
    comm_type integer,
    to_addresses character varying(255)[],
    subject_template character varying(255),
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);



--
--

CREATE SEQUENCE IF NOT EXISTS public.send_alert_configs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE IF EXISTS public.send_alert_configs_id_seq OWNED BY public.send_alert_configs.id;


--
--

CREATE TABLE IF NOT EXISTS public.settings (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    value text,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);



--
--

CREATE SEQUENCE IF NOT EXISTS public.settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE IF EXISTS public.settings_id_seq OWNED BY public.settings.id;


--
--

CREATE TABLE IF NOT EXISTS public.sheet_configs (
    id bigint NOT NULL,
    name character varying(255),
    table_name character varying(255),
    refresh_interval integer,
    sheet_id character varying(255),
    subsheet_id integer,
    api_key_id bigint,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);



--
--

CREATE SEQUENCE IF NOT EXISTS public.sheet_configs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE IF EXISTS public.sheet_configs_id_seq OWNED BY public.sheet_configs.id;


--
--

CREATE TABLE IF NOT EXISTS public.snapshot_data (
    id bigint NOT NULL,
    "row" jsonb NOT NULL,
    snapshot_id integer,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    identifier uuid
);



--
--

CREATE SEQUENCE IF NOT EXISTS public.snapshot_data_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE IF EXISTS public.snapshot_data_id_seq OWNED BY public.snapshot_data.id;


--
--

CREATE TABLE IF NOT EXISTS public.snapshots (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255),
    columns character varying(255)[],
    question_id integer NOT NULL,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    scheduled boolean,
    "interval" integer,
    starting_at timestamp without time zone,
    status integer,
    should_save_data_to_db boolean,
    should_create_csv boolean,
    should_send_mail_on_completion boolean,
    mail_to character varying(255)[],
    parent_id integer,
    searchable_columns character varying(255)[],
    keep_latest integer
);



--
--

CREATE SEQUENCE IF NOT EXISTS public.snapshots_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE IF EXISTS public.snapshots_id_seq OWNED BY public.snapshots.id;


--
--

CREATE TABLE IF NOT EXISTS public.snippets (
    id bigint NOT NULL,
    name character varying(255),
    text text,
    database_id bigint,
    owner_id bigint,
    expand_on_select boolean,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);



--
--

CREATE SEQUENCE IF NOT EXISTS public.snippets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE IF EXISTS public.snippets_id_seq OWNED BY public.snippets.id;


--
--

CREATE TABLE IF NOT EXISTS public.tables (
    id integer NOT NULL,
    name character varying(255),
    database_id integer,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    readable_table_name character varying(255),
    description character varying(255)
);



--
--

CREATE SEQUENCE IF NOT EXISTS public.tables_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE IF EXISTS public.tables_id_seq OWNED BY public.tables.id;


--
--

CREATE TABLE IF NOT EXISTS public.tag_dashboards (
    id integer NOT NULL,
    tag_id integer,
    dashboard_id integer,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);



--
--

CREATE SEQUENCE IF NOT EXISTS public.tag_dashboards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE IF EXISTS public.tag_dashboards_id_seq OWNED BY public.tag_dashboards.id;


--
--

CREATE TABLE IF NOT EXISTS public.tag_questions (
    id integer NOT NULL,
    tag_id integer,
    question_id integer,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);



--
--

CREATE SEQUENCE IF NOT EXISTS public.tag_questions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE IF EXISTS public.tag_questions_id_seq OWNED BY public.tag_questions.id;


--
--

CREATE TABLE IF NOT EXISTS public.tags (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255),
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    color character varying(255)
);



--
--

CREATE SEQUENCE IF NOT EXISTS public.tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE IF EXISTS public.tags_id_seq OWNED BY public.tags.id;


--
--

CREATE TABLE IF NOT EXISTS public.team_databases (
    id integer NOT NULL,
    database_id integer,
    team_id integer,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);



--
--

CREATE SEQUENCE IF NOT EXISTS public.team_databases_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE IF EXISTS public.team_databases_id_seq OWNED BY public.team_databases.id;


--
--

CREATE TABLE IF NOT EXISTS public.teams (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);



--
--

CREATE SEQUENCE IF NOT EXISTS public.teams_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE IF EXISTS public.teams_id_seq OWNED BY public.teams.id;


--
--

CREATE TABLE IF NOT EXISTS public.user_permission_sets (
    id integer NOT NULL,
    user_id integer,
    permission_set_id integer,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);

--
--

CREATE SEQUENCE IF NOT EXISTS public.user_permission_sets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE IF EXISTS public.user_permission_sets_id_seq OWNED BY public.user_permission_sets.id;


--
--

CREATE TABLE IF NOT EXISTS public.user_settings (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    value character varying(255),
    setting_type integer NOT NULL,
    user_id bigint NOT NULL,
    api_action_id bigint,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);



--
--

CREATE SEQUENCE IF NOT EXISTS public.user_settings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE IF EXISTS public.user_settings_id_seq OWNED BY public.user_settings.id;


--
--

CREATE TABLE IF NOT EXISTS public.user_teams (
    id integer NOT NULL,
    user_id integer,
    team_id integer,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);



--
--

CREATE SEQUENCE IF NOT EXISTS public.user_teams_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE IF EXISTS public.user_teams_id_seq OWNED BY public.user_teams.id;


--
--

CREATE TABLE IF NOT EXISTS public.users (
    id integer NOT NULL,
    first_name character varying(255),
    last_name character varying(255),
    email character varying(255),
    full_name character varying(255),
    profile_pic character varying(255),
    metadata jsonb,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    is_deactivated boolean,
    organization_id bigint,
    password text
);


--

CREATE SEQUENCE IF NOT EXISTS public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE IF EXISTS public.users_id_seq OWNED BY public.users.id;


--
--

CREATE TABLE IF NOT EXISTS public.variables (
    id integer NOT NULL,
    name character varying(255),
    "default" character varying(255),
    var_type character varying(255),
    column_id integer,
    question_id integer,
    dashboard_id integer,
    default_operator character varying(255),
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    question_filter_id integer,
    default_options jsonb[]
);



--
--

CREATE SEQUENCE IF NOT EXISTS public.variables_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE IF EXISTS public.variables_id_seq OWNED BY public.variables.id;


--
--

CREATE TABLE IF NOT EXISTS public.visualizations (
    id bigint NOT NULL,
    name character varying(255),
    settings jsonb,
    query_terms jsonb,
    renderer_type character varying(255),
    question_id bigint,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);



--
--

CREATE SEQUENCE IF NOT EXISTS public.visualizations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE IF EXISTS public.visualizations_id_seq OWNED BY public.visualizations.id;


--
--

CREATE TABLE IF NOT EXISTS public.widget_items (
    id integer NOT NULL,
    text character varying(255),
    config jsonb,
    value character varying(255),
    widget_id integer,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);



--
--

CREATE SEQUENCE IF NOT EXISTS public.widget_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE IF EXISTS public.widget_items_id_seq OWNED BY public.widget_items.id;


--
--

CREATE TABLE IF NOT EXISTS public.widgets (
    id integer NOT NULL,
    column_name character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    renderer integer,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);



--
--

CREATE SEQUENCE IF NOT EXISTS public.widgets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
--

ALTER SEQUENCE IF EXISTS public.widgets_id_seq OWNED BY public.widgets.id;


--
--

ALTER TABLE IF EXISTS ONLY public.alert_events ALTER COLUMN id SET DEFAULT nextval('public.alert_events_id_seq'::regclass);


--
--

ALTER TABLE IF EXISTS ONLY public.alert_events_transformed_data ALTER COLUMN id SET DEFAULT nextval('public.alert_events_transformed_data_id_seq'::regclass);


--
--

ALTER TABLE IF EXISTS ONLY public.alert_level_settings ALTER COLUMN id SET DEFAULT nextval('public.alert_level_settings_id_seq'::regclass);


--
--

ALTER TABLE IF EXISTS ONLY public.alert_notification_settings ALTER COLUMN id SET DEFAULT nextval('public.alert_notification_settings_id_seq'::regclass);


--
--

ALTER TABLE IF EXISTS ONLY public.alert_settings ALTER COLUMN id SET DEFAULT nextval('public.alert_settings_id_seq'::regclass);


--
--

ALTER TABLE IF EXISTS ONLY public.alerts ALTER COLUMN id SET DEFAULT nextval('public.alerts_id_seq'::regclass);


--
--

ALTER TABLE IF EXISTS ONLY public.api_action_logs ALTER COLUMN id SET DEFAULT nextval('public.api_action_logs_id_seq'::regclass);


--
--

ALTER TABLE IF EXISTS ONLY public.api_actions ALTER COLUMN id SET DEFAULT nextval('public.api_actions_id_seq'::regclass);


--
--

ALTER TABLE IF EXISTS ONLY public.applications ALTER COLUMN id SET DEFAULT nextval('public.applications_id_seq'::regclass);


--
--

ALTER TABLE IF EXISTS ONLY public.audit_logs ALTER COLUMN id SET DEFAULT nextval('public.audit_logs_id_seq'::regclass);


--
--

ALTER TABLE IF EXISTS ONLY public.column_values ALTER COLUMN id SET DEFAULT nextval('public.column_values_id_seq'::regclass);


--
--

ALTER TABLE IF EXISTS ONLY public.columns ALTER COLUMN id SET DEFAULT nextval('public.columns_id_seq'::regclass);


--
--

ALTER TABLE IF EXISTS ONLY public.dashboard_widgets ALTER COLUMN id SET DEFAULT nextval('public.dashboard_widgets_id_seq'::regclass);


--
--

ALTER TABLE IF EXISTS ONLY public.dashboards ALTER COLUMN id SET DEFAULT nextval('public.dashboards_id_seq'::regclass);


--
--

ALTER TABLE IF EXISTS ONLY public.databases ALTER COLUMN id SET DEFAULT nextval('public.databases_id_seq'::regclass);


--
--

ALTER TABLE IF EXISTS ONLY public.foreign_keys ALTER COLUMN id SET DEFAULT nextval('public.foreign_keys_id_seq'::regclass);


--
--

ALTER TABLE IF EXISTS ONLY public.generated_alerts ALTER COLUMN id SET DEFAULT nextval('public.generated_alerts_id_seq'::regclass);


--
--

ALTER TABLE IF EXISTS ONLY public.notes ALTER COLUMN id SET DEFAULT nextval('public.notes_id_seq'::regclass);


--
--



--
--

ALTER TABLE IF EXISTS ONLY public.organization_settings ALTER COLUMN id SET DEFAULT nextval('public.organization_settings_id_seq'::regclass);


--
--

ALTER TABLE IF EXISTS ONLY public.organizations ALTER COLUMN id SET DEFAULT nextval('public.organizations_id_seq'::regclass);


--
--

ALTER TABLE IF EXISTS ONLY public.permission_sets ALTER COLUMN id SET DEFAULT nextval('public.permission_sets_id_seq'::regclass);


--
--

ALTER TABLE IF EXISTS ONLY public.permissions ALTER COLUMN id SET DEFAULT nextval('public.permissions_id_seq'::regclass);


--
--

ALTER TABLE IF EXISTS ONLY public.question_banks ALTER COLUMN id SET DEFAULT nextval('public.question_banks_id_seq'::regclass);


--
--

ALTER TABLE IF EXISTS ONLY public.question_widgets ALTER COLUMN id SET DEFAULT nextval('public.question_widgets_id_seq'::regclass);


--
--

ALTER TABLE IF EXISTS ONLY public.questions ALTER COLUMN id SET DEFAULT nextval('public.questions_id_seq'::regclass);


--
--

ALTER TABLE IF EXISTS ONLY public.results_cache ALTER COLUMN id SET DEFAULT nextval('public.results_cache_id_seq'::regclass);


--
--

ALTER TABLE IF EXISTS ONLY public.rules_engine_permissions ALTER COLUMN id SET DEFAULT nextval('public.rules_engine_permissions_id_seq'::regclass);


--
--

ALTER TABLE IF EXISTS ONLY public.rules_engine_roles ALTER COLUMN id SET DEFAULT nextval('public.rules_engine_roles_id_seq'::regclass);


--
--

ALTER TABLE IF EXISTS ONLY public.rules_engine_users ALTER COLUMN id SET DEFAULT nextval('public.rules_engine_users_id_seq'::regclass);


--
--

ALTER TABLE IF EXISTS ONLY public.schedules ALTER COLUMN id SET DEFAULT nextval('public.schedules_id_seq'::regclass);


--
--

ALTER TABLE IF EXISTS ONLY public.searchable_columns ALTER COLUMN id SET DEFAULT nextval('public.searchable_columns_id_seq'::regclass);


--
--

ALTER TABLE IF EXISTS ONLY public.send_alert_configs ALTER COLUMN id SET DEFAULT nextval('public.send_alert_configs_id_seq'::regclass);


--
--

ALTER TABLE IF EXISTS ONLY public.settings ALTER COLUMN id SET DEFAULT nextval('public.settings_id_seq'::regclass);


--
--

ALTER TABLE IF EXISTS ONLY public.sheet_configs ALTER COLUMN id SET DEFAULT nextval('public.sheet_configs_id_seq'::regclass);


--
--

ALTER TABLE IF EXISTS ONLY public.snapshot_data ALTER COLUMN id SET DEFAULT nextval('public.snapshot_data_id_seq'::regclass);


--
--

ALTER TABLE IF EXISTS ONLY public.snapshots ALTER COLUMN id SET DEFAULT nextval('public.snapshots_id_seq'::regclass);


--
--

ALTER TABLE IF EXISTS ONLY public.snippets ALTER COLUMN id SET DEFAULT nextval('public.snippets_id_seq'::regclass);


--
--

ALTER TABLE IF EXISTS ONLY public.tables ALTER COLUMN id SET DEFAULT nextval('public.tables_id_seq'::regclass);


--
--

ALTER TABLE IF EXISTS ONLY public.tag_dashboards ALTER COLUMN id SET DEFAULT nextval('public.tag_dashboards_id_seq'::regclass);


--
--

ALTER TABLE IF EXISTS ONLY public.tag_questions ALTER COLUMN id SET DEFAULT nextval('public.tag_questions_id_seq'::regclass);


--
--

ALTER TABLE IF EXISTS ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);


--
--

ALTER TABLE IF EXISTS ONLY public.team_databases ALTER COLUMN id SET DEFAULT nextval('public.team_databases_id_seq'::regclass);


--
--

ALTER TABLE IF EXISTS ONLY public.teams ALTER COLUMN id SET DEFAULT nextval('public.teams_id_seq'::regclass);


--
--

ALTER TABLE IF EXISTS ONLY public.user_permission_sets ALTER COLUMN id SET DEFAULT nextval('public.user_permission_sets_id_seq'::regclass);


--
--

ALTER TABLE IF EXISTS ONLY public.user_settings ALTER COLUMN id SET DEFAULT nextval('public.user_settings_id_seq'::regclass);


--
--

ALTER TABLE IF EXISTS ONLY public.user_teams ALTER COLUMN id SET DEFAULT nextval('public.user_teams_id_seq'::regclass);


--
--

ALTER TABLE IF EXISTS ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
--

ALTER TABLE IF EXISTS ONLY public.variables ALTER COLUMN id SET DEFAULT nextval('public.variables_id_seq'::regclass);


--
--

ALTER TABLE IF EXISTS ONLY public.visualizations ALTER COLUMN id SET DEFAULT nextval('public.visualizations_id_seq'::regclass);


--
--

ALTER TABLE IF EXISTS ONLY public.widget_items ALTER COLUMN id SET DEFAULT nextval('public.widget_items_id_seq'::regclass);


--
--

ALTER TABLE IF EXISTS ONLY public.widgets ALTER COLUMN id SET DEFAULT nextval('public.widgets_id_seq'::regclass);


--
--

--
--

ALTER TABLE IF EXISTS ONLY public.alert_events
    ADD CONSTRAINT alert_events_pkey PRIMARY KEY (id);


--
--

ALTER TABLE IF EXISTS ONLY public.alert_events_transformed_data
    ADD CONSTRAINT alert_events_transformed_data_pkey PRIMARY KEY (id);


--
--

ALTER TABLE IF EXISTS ONLY public.alert_level_settings
    ADD CONSTRAINT alert_level_settings_pkey PRIMARY KEY (id);


--
--

ALTER TABLE IF EXISTS ONLY public.alert_notification_settings
    ADD CONSTRAINT alert_notification_settings_pkey PRIMARY KEY (id);


--
--

ALTER TABLE IF EXISTS ONLY public.alert_settings
    ADD CONSTRAINT alert_settings_pkey PRIMARY KEY (id);


--
--

ALTER TABLE IF EXISTS ONLY public.alerts
    ADD CONSTRAINT alerts_pkey PRIMARY KEY (id);


--
--

ALTER TABLE IF EXISTS ONLY public.api_action_logs
    ADD CONSTRAINT api_action_logs_pkey PRIMARY KEY (id);


--
--

ALTER TABLE IF EXISTS ONLY public.api_actions
    ADD CONSTRAINT api_actions_pkey PRIMARY KEY (id);


--
--

ALTER TABLE IF EXISTS ONLY public.applications
    ADD CONSTRAINT applications_pkey PRIMARY KEY (id);


--
--

ALTER TABLE IF EXISTS ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
--

ALTER TABLE IF EXISTS ONLY public.column_values
    ADD CONSTRAINT column_values_pkey PRIMARY KEY (id);


--
--

ALTER TABLE IF EXISTS ONLY public.columns
    ADD CONSTRAINT columns_pkey PRIMARY KEY (id);


--
--

ALTER TABLE IF EXISTS ONLY public.dashboard_widgets
    ADD CONSTRAINT dashboard_widgets_pkey PRIMARY KEY (id);


--
--

ALTER TABLE IF EXISTS ONLY public.dashboards
    ADD CONSTRAINT dashboards_pkey PRIMARY KEY (id);


--
--

ALTER TABLE IF EXISTS ONLY public.databases
    ADD CONSTRAINT databases_pkey PRIMARY KEY (id);


--
--

ALTER TABLE IF EXISTS ONLY public.ecto_schema_migrations
    ADD CONSTRAINT ecto_schema_migrations_pkey PRIMARY KEY (version);


--
--

ALTER TABLE IF EXISTS ONLY public.foreign_keys
    ADD CONSTRAINT foreign_keys_pkey PRIMARY KEY (id);


--
--

ALTER TABLE IF EXISTS ONLY public.generated_alerts
    ADD CONSTRAINT generated_alerts_pkey PRIMARY KEY (id);


--
--

ALTER TABLE IF EXISTS ONLY public.notes
    ADD CONSTRAINT notes_pkey PRIMARY KEY (id);


--
--

--
--

ALTER TABLE IF EXISTS ONLY public.organization_settings
    ADD CONSTRAINT organization_settings_pkey PRIMARY KEY (id);


--
--

ALTER TABLE IF EXISTS ONLY public.organizations
    ADD CONSTRAINT organizations_pkey PRIMARY KEY (id);


--
--

ALTER TABLE IF EXISTS ONLY public.permission_sets
    ADD CONSTRAINT permission_sets_pkey PRIMARY KEY (id);


--
--

ALTER TABLE IF EXISTS ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
--

ALTER TABLE IF EXISTS ONLY public.question_banks
    ADD CONSTRAINT question_banks_pkey PRIMARY KEY (id);


--
--

ALTER TABLE IF EXISTS ONLY public.question_widgets
    ADD CONSTRAINT question_widgets_pkey PRIMARY KEY (id);


--
--

ALTER TABLE IF EXISTS ONLY public.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (id);


--
--

ALTER TABLE IF EXISTS ONLY public.results_cache
    ADD CONSTRAINT results_cache_pkey PRIMARY KEY (id);


--
--

ALTER TABLE IF EXISTS ONLY public.rules_engine_permissions
    ADD CONSTRAINT rules_engine_permissions_pkey PRIMARY KEY (id);


--
--

ALTER TABLE IF EXISTS ONLY public.rules_engine_roles
    ADD CONSTRAINT rules_engine_roles_pkey PRIMARY KEY (id);


--
--

ALTER TABLE IF EXISTS ONLY public.rules_engine_users
    ADD CONSTRAINT rules_engine_users_pkey PRIMARY KEY (id);


--
--

ALTER TABLE IF EXISTS ONLY public.schedules
    ADD CONSTRAINT schedules_pkey PRIMARY KEY (id);


--
--

ALTER TABLE IF EXISTS ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
--

ALTER TABLE IF EXISTS ONLY public.searchable_columns
    ADD CONSTRAINT searchable_columns_pkey PRIMARY KEY (id);


--
--

ALTER TABLE IF EXISTS ONLY public.send_alert_configs
    ADD CONSTRAINT send_alert_configs_pkey PRIMARY KEY (id);


--
--

ALTER TABLE IF EXISTS ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);


--
--

ALTER TABLE IF EXISTS ONLY public.sheet_configs
    ADD CONSTRAINT sheet_configs_pkey PRIMARY KEY (id);


--
--

ALTER TABLE IF EXISTS ONLY public.snapshot_data
    ADD CONSTRAINT snapshot_data_pkey PRIMARY KEY (id);


--
--

ALTER TABLE IF EXISTS ONLY public.snapshots
    ADD CONSTRAINT snapshots_pkey PRIMARY KEY (id);


--
--

ALTER TABLE IF EXISTS ONLY public.snippets
    ADD CONSTRAINT snippets_pkey PRIMARY KEY (id);


--
--

ALTER TABLE IF EXISTS ONLY public.tables
    ADD CONSTRAINT tables_pkey PRIMARY KEY (id);


--
--

ALTER TABLE IF EXISTS ONLY public.tag_dashboards
    ADD CONSTRAINT tag_dashboards_pkey PRIMARY KEY (id);


--
--

ALTER TABLE IF EXISTS ONLY public.tag_questions
    ADD CONSTRAINT tag_questions_pkey PRIMARY KEY (id);


--
--

ALTER TABLE IF EXISTS ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
--

ALTER TABLE IF EXISTS ONLY public.team_databases
    ADD CONSTRAINT team_databases_pkey PRIMARY KEY (id);


--
--

ALTER TABLE IF EXISTS ONLY public.teams
    ADD CONSTRAINT teams_pkey PRIMARY KEY (id);


--
--

ALTER TABLE IF EXISTS ONLY public.user_permission_sets
    ADD CONSTRAINT user_permission_sets_pkey PRIMARY KEY (id);


--
--

ALTER TABLE IF EXISTS ONLY public.user_settings
    ADD CONSTRAINT user_settings_pkey PRIMARY KEY (id);


--
--

ALTER TABLE IF EXISTS ONLY public.user_teams
    ADD CONSTRAINT user_teams_pkey PRIMARY KEY (id);


--
--

ALTER TABLE IF EXISTS ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
--

ALTER TABLE IF EXISTS ONLY public.variables
    ADD CONSTRAINT variables_pkey PRIMARY KEY (id);


--
--

ALTER TABLE IF EXISTS ONLY public.visualizations
    ADD CONSTRAINT visualizations_pkey PRIMARY KEY (id);


--
--

ALTER TABLE IF EXISTS ONLY public.widget_items
    ADD CONSTRAINT widget_items_pkey PRIMARY KEY (id);


--
--

ALTER TABLE IF EXISTS ONLY public.widgets
    ADD CONSTRAINT widgets_pkey PRIMARY KEY (id);


--
--

CREATE UNIQUE INDEX IF NOT EXISTS alert_level_settings_level_alert_setting_id_index ON public.alert_level_settings USING btree (level, alert_setting_id);


--
--

CREATE UNIQUE INDEX IF NOT EXISTS alert_notification_settings_method_recipients_alert_setting_id_ ON public.alert_notification_settings USING btree (method, recipients, alert_setting_id);


--
--

CREATE UNIQUE INDEX IF NOT EXISTS applications_name_index ON public.applications USING btree (name);


--
--

CREATE INDEX IF NOT EXISTS column_name_trgram_index ON public.columns USING gin (name public.gin_trgm_ops);


--
--

CREATE INDEX IF NOT EXISTS column_values_column_id_index ON public.column_values USING btree (column_id);


--
--

CREATE UNIQUE INDEX IF NOT EXISTS column_values_column_id_value_index ON public.column_values USING btree (column_id, value);


--
--

CREATE INDEX IF NOT EXISTS columns_name_trgram_index ON public.columns USING gin (name public.gin_trgm_ops);


--
--

CREATE INDEX IF NOT EXISTS columns_table_id_index ON public.columns USING btree (table_id);


--
--

CREATE INDEX IF NOT EXISTS dashboard_title_trgram_index ON public.dashboards USING gin (title public.gin_trgm_ops);


--
--

CREATE INDEX IF NOT EXISTS dashboards_owner_id_index ON public.dashboards USING btree (owner_id);


--
--

CREATE INDEX IF NOT EXISTS dashboards_shared_to_index ON public.dashboards USING gin (shared_to);


--
--

CREATE INDEX IF NOT EXISTS database_name_trgram_index ON public.databases USING gin (name public.gin_trgm_ops);


--
--

CREATE UNIQUE INDEX IF NOT EXISTS fk_column_id_foreign_column_id_index ON public.foreign_keys USING btree (column_id, foreign_column_id);


--
--

CREATE UNIQUE INDEX IF NOT EXISTS organization_settings_name_organization_id_index ON public.organization_settings USING btree (name, organization_id);


--
--

CREATE UNIQUE INDEX IF NOT EXISTS organizations_google_domain_index ON public.organizations USING btree (google_domain);


--
--

CREATE UNIQUE INDEX IF NOT EXISTS organizations_name_index ON public.organizations USING btree (name);


--
--

CREATE UNIQUE INDEX IF NOT EXISTS permission_sets_name_index ON public.permission_sets USING btree (name);


--
--

CREATE UNIQUE INDEX IF NOT EXISTS permissions_name_permission_set_id_index ON public.permissions USING btree (name, permission_set_id);


--
--

CREATE INDEX IF NOT EXISTS questions_owner_id_index ON public.questions USING btree (owner_id);


--
--

CREATE INDEX IF NOT EXISTS questions_shared_to_index ON public.questions USING gin (shared_to);


--
--

CREATE INDEX IF NOT EXISTS questions_sql_trgram_index ON public.questions USING gin (sql public.gin_trgm_ops);


--
--

CREATE INDEX IF NOT EXISTS questions_title_trgram_index ON public.questions USING gin (title public.gin_trgm_ops);


--
--

CREATE INDEX IF NOT EXISTS results_cache_key_sql_index ON public.results_cache USING btree (key, sql);


--
--

CREATE UNIQUE INDEX IF NOT EXISTS rules_engine_permissions_role_id_name_index ON public.rules_engine_permissions USING btree (role_id, name);


--
--

CREATE UNIQUE INDEX IF NOT EXISTS rules_engine_roles_name_index ON public.rules_engine_roles USING btree (name);


--
--

CREATE UNIQUE INDEX IF NOT EXISTS rules_engine_users_email_index ON public.rules_engine_users USING btree (email);


--
--

CREATE INDEX IF NOT EXISTS schedules_is_active_is_running_next_execution_time_index ON public.schedules USING btree (is_active, is_running, next_execution_time);


--
--

CREATE INDEX IF NOT EXISTS searchable_columns_name_snapshot_id_value_trgram_index ON public.searchable_columns USING gist (snapshot_id, name, value public.gist_trgm_ops);


--
--

CREATE INDEX IF NOT EXISTS searchable_columns_snapshot_id_name_value_index ON public.searchable_columns USING btree (snapshot_id, name, value);


--
--

CREATE UNIQUE INDEX IF NOT EXISTS settings_name_index ON public.settings USING btree (name);


--
--

CREATE INDEX IF NOT EXISTS sheet_configs_api_key_id_index ON public.sheet_configs USING btree (api_key_id);


--
--

CREATE INDEX IF NOT EXISTS snapshot_data_identifier_index ON public.snapshot_data USING btree (identifier);


--
--

CREATE INDEX IF NOT EXISTS snapshot_data_snapshot_id_index ON public.snapshot_data USING btree (snapshot_id);


--
--

CREATE INDEX IF NOT EXISTS snapshots_question_id_index ON public.snapshots USING btree (question_id);


--
--

CREATE UNIQUE INDEX IF NOT EXISTS snapshots_question_id_starting_at_index ON public.snapshots USING btree (question_id, starting_at);


--
--

CREATE INDEX IF NOT EXISTS snippets_database_id_index ON public.snippets USING btree (database_id);


--
--

CREATE UNIQUE INDEX IF NOT EXISTS snippets_name_database_id_index ON public.snippets USING btree (name, database_id);


--
--

CREATE INDEX IF NOT EXISTS snippets_owner_id_index ON public.snippets USING btree (owner_id);


--
--

CREATE INDEX IF NOT EXISTS snippets_text_trgram_index ON public.snippets USING gin (text public.gin_trgm_ops);


--
--

CREATE INDEX IF NOT EXISTS table_name_trgram_index ON public.tables USING gin (name public.gin_trgm_ops);


--
--

CREATE INDEX IF NOT EXISTS tables_database_id_index ON public.tables USING btree (database_id);


--
--

CREATE INDEX IF NOT EXISTS tables_name_trgram_index ON public.tables USING gin (name public.gin_trgm_ops);


--
--

CREATE UNIQUE INDEX IF NOT EXISTS tag_dashboards_tag_id_dashboard_id_index ON public.tag_dashboards USING btree (tag_id, dashboard_id);


--
--

CREATE UNIQUE INDEX IF NOT EXISTS tag_questions_tag_id_question_id_index ON public.tag_questions USING btree (tag_id, question_id);


--
--

CREATE UNIQUE INDEX IF NOT EXISTS tags_name_index ON public.tags USING btree (name);


--
--

CREATE UNIQUE INDEX IF NOT EXISTS team_databases_database_id_team_id_index ON public.team_databases USING btree (database_id, team_id);


--
--

CREATE UNIQUE INDEX IF NOT EXISTS teams_name_index ON public.teams USING btree (name);


--
--

CREATE UNIQUE INDEX IF NOT EXISTS user_permission_sets_user_id_permission_set_id_index ON public.user_permission_sets USING btree (user_id, permission_set_id);


--
--

CREATE UNIQUE INDEX IF NOT EXISTS user_settings_name_user_id_index ON public.user_settings USING btree (name, user_id);


--
--

CREATE UNIQUE INDEX IF NOT EXISTS user_teams_user_id_team_id_index ON public.user_teams USING btree (user_id, team_id);


--
--

CREATE UNIQUE INDEX IF NOT EXISTS users_email_index ON public.users USING btree (email);


--
--

CREATE INDEX IF NOT EXISTS users_email_trgram_index ON public.users USING gin (email public.gin_trgm_ops);


--
--

CREATE UNIQUE INDEX IF NOT EXISTS variables_name_question_id_index ON public.variables USING btree (name, question_id);


--
--

CREATE INDEX IF NOT EXISTS visualizations_question_id_index ON public.visualizations USING btree (question_id);


--
--

CREATE INDEX IF NOT EXISTS widgets_name_trgram_index ON public.widgets USING gin (name public.gin_trgm_ops);



--
--

ALTER TABLE IF EXISTS ONLY public.alert_events
    ADD CONSTRAINT alert_events_alert_setting_id_fkey FOREIGN KEY (alert_setting_id) REFERENCES public.alert_settings(id) ON DELETE CASCADE;


--
--

ALTER TABLE IF EXISTS ONLY public.alert_events_transformed_data
    ADD CONSTRAINT alert_events_transformed_data_alert_event_id_fkey FOREIGN KEY (alert_event_id) REFERENCES public.alert_events(id) ON DELETE CASCADE;


--
--

ALTER TABLE IF EXISTS ONLY public.alert_level_settings
    ADD CONSTRAINT alert_level_settings_alert_setting_id_fkey FOREIGN KEY (alert_setting_id) REFERENCES public.alert_settings(id) ON DELETE CASCADE;


--
--

ALTER TABLE IF EXISTS ONLY public.alert_notification_settings
    ADD CONSTRAINT alert_notification_settings_alert_setting_id_fkey FOREIGN KEY (alert_setting_id) REFERENCES public.alert_settings(id) ON DELETE CASCADE;


--
--

ALTER TABLE IF EXISTS ONLY public.alert_settings
    ADD CONSTRAINT alert_settings_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE;


--
--

ALTER TABLE IF EXISTS ONLY public.alerts
    ADD CONSTRAINT alerts_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id);


--
--

ALTER TABLE IF EXISTS ONLY public.api_action_logs
    ADD CONSTRAINT api_action_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
--

ALTER TABLE IF EXISTS ONLY public.api_actions
    ADD CONSTRAINT api_actions_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE;


--
--

ALTER TABLE IF EXISTS ONLY public.column_values
    ADD CONSTRAINT column_values_column_id_fkey FOREIGN KEY (column_id) REFERENCES public.columns(id) ON DELETE CASCADE;


--
--

ALTER TABLE IF EXISTS ONLY public.columns
    ADD CONSTRAINT columns_table_id_fkey FOREIGN KEY (table_id) REFERENCES public.tables(id) ON DELETE CASCADE;


--
--

ALTER TABLE IF EXISTS ONLY public.dashboard_questions
    ADD CONSTRAINT dashboard_questions_dashboard_id_fkey FOREIGN KEY (dashboard_id) REFERENCES public.dashboards(id);


--
--

ALTER TABLE IF EXISTS ONLY public.dashboard_questions
    ADD CONSTRAINT dashboard_questions_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id);


--
--

ALTER TABLE IF EXISTS ONLY public.dashboard_widgets
    ADD CONSTRAINT dashboard_widgets_dashboard_id_fkey FOREIGN KEY (dashboard_id) REFERENCES public.dashboards(id) ON DELETE CASCADE;


--
--

ALTER TABLE IF EXISTS ONLY public.dashboards
    ADD CONSTRAINT dashboards_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id);


--
--

ALTER TABLE IF EXISTS ONLY public.foreign_keys
    ADD CONSTRAINT foreign_keys_column_id_fkey FOREIGN KEY (column_id) REFERENCES public.columns(id) ON DELETE CASCADE;


--
--

ALTER TABLE IF EXISTS ONLY public.foreign_keys
    ADD CONSTRAINT foreign_keys_foreign_column_id_fkey FOREIGN KEY (foreign_column_id) REFERENCES public.columns(id) ON DELETE CASCADE;


--
--

ALTER TABLE IF EXISTS ONLY public.generated_alerts
    ADD CONSTRAINT generated_alerts_alert_id_fkey FOREIGN KEY (alert_id) REFERENCES public.alerts(id);


--
--

ALTER TABLE IF EXISTS ONLY public.notes
    ADD CONSTRAINT notes_dashboard_id_fkey FOREIGN KEY (dashboard_id) REFERENCES public.dashboards(id) ON DELETE CASCADE;


--
--

ALTER TABLE IF EXISTS ONLY public.organization_settings
    ADD CONSTRAINT organization_settings_api_action_id_fkey FOREIGN KEY (api_action_id) REFERENCES public.api_actions(id) ON DELETE CASCADE;


--
--

ALTER TABLE IF EXISTS ONLY public.organization_settings
    ADD CONSTRAINT organization_settings_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
--

ALTER TABLE IF EXISTS ONLY public.permissions
    ADD CONSTRAINT permissions_permission_set_id_fkey FOREIGN KEY (permission_set_id) REFERENCES public.permission_sets(id) ON DELETE CASCADE;


--
--

ALTER TABLE IF EXISTS ONLY public.question_widgets
    ADD CONSTRAINT question_widgets_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id);


--
--

ALTER TABLE IF EXISTS ONLY public.question_widgets
    ADD CONSTRAINT question_widgets_widget_id_fkey FOREIGN KEY (widget_id) REFERENCES public.widgets(id);


--
--

ALTER TABLE IF EXISTS ONLY public.questions
    ADD CONSTRAINT questions_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id);


--
--

ALTER TABLE IF EXISTS ONLY public.rules_engine_permissions
    ADD CONSTRAINT rules_engine_permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.rules_engine_roles(id);


--
--

ALTER TABLE IF EXISTS ONLY public.searchable_columns
    ADD CONSTRAINT searchable_columns_snapshot_id_fkey FOREIGN KEY (snapshot_id) REFERENCES public.snapshots(id) ON DELETE CASCADE;


--
--

ALTER TABLE IF EXISTS ONLY public.send_alert_configs
    ADD CONSTRAINT send_alert_configs_alert_id_fkey FOREIGN KEY (alert_id) REFERENCES public.alerts(id);


--
--

ALTER TABLE IF EXISTS ONLY public.sheet_configs
    ADD CONSTRAINT sheet_configs_api_key_id_fkey FOREIGN KEY (api_key_id) REFERENCES public.user_settings(id);


--
--

ALTER TABLE IF EXISTS ONLY public.snapshot_data
    ADD CONSTRAINT snapshot_data_snapshot_id_fkey FOREIGN KEY (snapshot_id) REFERENCES public.snapshots(id) ON DELETE CASCADE;


--
--

ALTER TABLE IF EXISTS ONLY public.snapshots
    ADD CONSTRAINT snapshots_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.snapshots(id);


--
--

ALTER TABLE IF EXISTS ONLY public.snapshots
    ADD CONSTRAINT snapshots_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE;


--
--

ALTER TABLE IF EXISTS ONLY public.snippets
    ADD CONSTRAINT snippets_database_id_fkey FOREIGN KEY (database_id) REFERENCES public.databases(id) ON DELETE CASCADE;


--
--

ALTER TABLE IF EXISTS ONLY public.snippets
    ADD CONSTRAINT snippets_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id);


--
--

ALTER TABLE IF EXISTS ONLY public.tables
    ADD CONSTRAINT tables_database_id_fkey FOREIGN KEY (database_id) REFERENCES public.databases(id) ON DELETE CASCADE;


--
--

ALTER TABLE IF EXISTS ONLY public.tag_dashboards
    ADD CONSTRAINT tag_dashboards_dashboard_id_fkey FOREIGN KEY (dashboard_id) REFERENCES public.dashboards(id);


--
--

ALTER TABLE IF EXISTS ONLY public.tag_dashboards
    ADD CONSTRAINT tag_dashboards_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id);


--
--

ALTER TABLE IF EXISTS ONLY public.tag_questions
    ADD CONSTRAINT tag_questions_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id);


--
--

ALTER TABLE IF EXISTS ONLY public.tag_questions
    ADD CONSTRAINT tag_questions_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id);


--
--

ALTER TABLE IF EXISTS ONLY public.team_databases
    ADD CONSTRAINT team_databases_database_id_fkey FOREIGN KEY (database_id) REFERENCES public.databases(id) ON DELETE CASCADE;


--
--

ALTER TABLE IF EXISTS ONLY public.team_databases
    ADD CONSTRAINT team_databases_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;


--
--

ALTER TABLE IF EXISTS ONLY public.user_permission_sets
    ADD CONSTRAINT user_permission_sets_permission_set_id_fkey FOREIGN KEY (permission_set_id) REFERENCES public.permission_sets(id) ON DELETE CASCADE;


--
--

ALTER TABLE IF EXISTS ONLY public.user_permission_sets
    ADD CONSTRAINT user_permission_sets_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
--

ALTER TABLE IF EXISTS ONLY public.user_settings
    ADD CONSTRAINT user_settings_api_action_id_fkey FOREIGN KEY (api_action_id) REFERENCES public.api_actions(id) ON DELETE CASCADE;


--
--

ALTER TABLE IF EXISTS ONLY public.user_settings
    ADD CONSTRAINT user_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
--

ALTER TABLE IF EXISTS ONLY public.user_teams
    ADD CONSTRAINT user_teams_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;


--
--

ALTER TABLE IF EXISTS ONLY public.user_teams
    ADD CONSTRAINT user_teams_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
--

ALTER TABLE IF EXISTS ONLY public.users
    ADD CONSTRAINT users_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;


--
--

ALTER TABLE IF EXISTS ONLY public.variables
    ADD CONSTRAINT variables_column_id_fkey FOREIGN KEY (column_id) REFERENCES public.columns(id) ON DELETE CASCADE;


--
--

ALTER TABLE IF EXISTS ONLY public.variables
    ADD CONSTRAINT variables_dashboard_id_fkey FOREIGN KEY (dashboard_id) REFERENCES public.dashboards(id) ON DELETE CASCADE;


--
--

ALTER TABLE IF EXISTS ONLY public.variables
    ADD CONSTRAINT variables_question_filter_id_fkey FOREIGN KEY (question_filter_id) REFERENCES public.questions(id);


--
--

ALTER TABLE IF EXISTS ONLY public.variables
    ADD CONSTRAINT variables_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE;


--
--

ALTER TABLE IF EXISTS ONLY public.visualizations
    ADD CONSTRAINT visualizations_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id);


--
--

ALTER TABLE IF EXISTS ONLY public.widget_items
    ADD CONSTRAINT widget_items_widget_id_fkey FOREIGN KEY (widget_id) REFERENCES public.widgets(id) ON DELETE CASCADE;


INSERT INTO public.permission_sets (id, name, inserted_at, updated_at) VALUES (1, 'Admin', now(), now());
INSERT INTO public.permission_sets (id, name, inserted_at, updated_at) VALUES (2, 'Viewer', now(), now());
INSERT INTO public.permission_sets (id, name, inserted_at, updated_at) VALUES (3, 'Creator', now(), now());


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: adityau
--

INSERT INTO public.permissions (id, permission_set_id, name, inserted_at, updated_at) VALUES (1, 1, 'Dashboard.show', now(), now());
INSERT INTO public.permissions (id, permission_set_id, name, inserted_at, updated_at) VALUES (2, 1, 'Question.show', now(), now());
INSERT INTO public.permissions (id, permission_set_id, name, inserted_at, updated_at) VALUES (3, 2, 'Dashboard.show', now(), now());
INSERT INTO public.permissions (id, permission_set_id, name, inserted_at, updated_at) VALUES (4, 2, 'Question.show', now(), now());
INSERT INTO public.permissions (id, permission_set_id, name, inserted_at, updated_at) VALUES (5, 3, 'Dashboard.show', now(), now());
INSERT INTO public.permissions (id, permission_set_id, name, inserted_at, updated_at) VALUES (6, 3, 'Dashboard.edit', now(), now());
INSERT INTO public.permissions (id, permission_set_id, name, inserted_at, updated_at) VALUES (7, 3, 'Dashboard.create', now(), now());
INSERT INTO public.permissions (id, permission_set_id, name, inserted_at, updated_at) VALUES (8, 3, 'Dashboard.delete', now(), now());
INSERT INTO public.permissions (id, permission_set_id, name, inserted_at, updated_at) VALUES (9, 3, 'Question.show', now(), now());
INSERT INTO public.permissions (id, permission_set_id, name, inserted_at, updated_at) VALUES (10, 3, 'Question.edit', now(), now());
INSERT INTO public.permissions (id, permission_set_id, name, inserted_at, updated_at) VALUES (11, 3, 'Question.create', now(), now());
INSERT INTO public.permissions (id, permission_set_id, name, inserted_at, updated_at) VALUES (12, 3, 'Question.delete', now(), now());
INSERT INTO public.permissions (id, permission_set_id, name, inserted_at, updated_at) VALUES (13, 1, 'Dashboard.edit', now(), now());
INSERT INTO public.permissions (id, permission_set_id, name, inserted_at, updated_at) VALUES (14, 1, 'Dashboard.create', now(), now());
INSERT INTO public.permissions (id, permission_set_id, name, inserted_at, updated_at) VALUES (15, 1, 'Dashboard.delete', now(), now());
INSERT INTO public.permissions (id, permission_set_id, name, inserted_at, updated_at) VALUES (16, 1, 'Question.edit', now(), now());
INSERT INTO public.permissions (id, permission_set_id, name, inserted_at, updated_at) VALUES (17, 1, 'Question.create', now(), now());
INSERT INTO public.permissions (id, permission_set_id, name, inserted_at, updated_at) VALUES (18, 1, 'Question.delete', now(), now());
INSERT INTO public.permissions (id, permission_set_id, name, inserted_at, updated_at) VALUES (19, 1, 'Settings.all', now(), now());

--
-- PostgreSQL database dump complete
--

 END IF;
END $$;
