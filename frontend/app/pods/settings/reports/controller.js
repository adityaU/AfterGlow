
export default Ember.Controller.extend({
    settings: Ember.computed.alias('model'),

    use_signed_s3_url_in_emails: Ember.computed("settings.isLoaded", function () {
        return this.get('settings').filter((setting) => {
            return (setting.get('name') == "USE_SIGNED_S3_URLS_IN_MAILS")
        })[0]
    }),

    signed_s3_url_timeout: Ember.computed("settings.isLoaded", function () {
        return this.get('settings').filter((setting) => {
            return (setting.get('name') == "S3_SIGNED_URL_TIMEOUT")
        })[0]
    }),

    report_limit_setting: Ember.computed("settings.isLoaded", function () {
        return this.get('settings').filter((setting) => {
            return (setting.get('name') == "MAX_DOWNLOAD_LIMIT")
        })[0]
    }),

    sender_email_id_setting: Ember.computed("settings.isLoaded", function () {
        return this.get('settings').filter((setting) => {
            return (setting.get('name') == "SENDER_EMAIL_ID")
        })[0]
    }),

    email_server_hostname_setting: Ember.computed("settings.isLoaded", function () {
        return this.get('settings').filter((setting) => {
            return (setting.get('name') == "EMAIL_SERVER_HOSTNAME")
        })[0]
    }),

    email_server_setting: Ember.computed("settings.isLoaded", function () {
        return this.get('settings').filter((setting) => {
            return (setting.get('name') == "EMAIL_SERVER")
        })[0]
    }),
    email_port_setting: Ember.computed("settings.isLoaded", function () {
        return this.get('settings').filter((setting) => {
            return (setting.get('name') == "EMAIL_PORT")
        })[0]
    }),

    email_username_setting: Ember.computed("settings.isLoaded", function () {
        return this.get('settings').filter((setting) => {
            return (setting.get('name') == "EMAIL_USERNAME")
        })[0]
    }),

    email_password_setting: Ember.computed("settings.isLoaded", function () {
        return this.get('settings').filter((setting) => {
            return (setting.get('name') == "EMAIL_PASSWORD")
        })[0]
    }),
    aws_access_key_id_setting: Ember.computed("settings.isLoaded", function () {
        return this.get('settings').filter((setting) => {
            return (setting.get('name') == "AWS_ACCESS_KEY_ID")
        })[0]
    }),

    aws_secret_access_key_setting: Ember.computed("settings.isLoaded", function () {
        return this.get('settings').filter((setting) => {
            return (setting.get('name') == "AWS_SECRET_ACCESS_KEY")
        })[0]
    }),

    s3_bucket_setting: Ember.computed("settings.isLoaded", function () {
        return this.get('settings').filter((setting) => {
            return (setting.get('name') == "S3_BUCKET")
        })[0]
    }),
    aws_region_setting: Ember.computed("settings.isLoaded", function () {
        return this.get('settings').filter((setting) => {
            return (setting.get('name') == "AWS_REGION")
        })[0]
    }),

    frontend_limit_setting: Ember.computed("settings.isLoaded", function () {
        return this.get('settings').filter((setting) => {
            return (setting.get('name') == "MAX_FRONTEND_LIMIT")
        })[0]
    }),

    download_allowed_setting: Ember.computed("settings.isLoaded", function () {
        return this.get('settings').filter((setting) => {
            return (setting.get('name') == "DOWNLOAD_ALLOWED")
        })[0]
    }),

    actions: {
        setDownloadAllowedSetting() {
            let currentValue = this.get('download_allowed_setting.value')
            if (currentValue == 'false') {
                this.set('download_allowed_setting.value', "true")
            } else {
                this.set('download_allowed_setting.value', "false")
            }
        },
        setUseSignedS3UrlInEmails() {
            let currentValue = this.get('use_signed_s3_url_in_emails.value')
            if (currentValue == 'false') {
                this.set('use_signed_s3_url_in_emails.value', "true")
            } else {
                this.set('use_signed_s3_url_in_emails.value', "false")
            }
        }
    }
});
