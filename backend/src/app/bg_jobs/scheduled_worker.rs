use std::{
    collections::{HashMap, HashSet},
    sync::Arc,
    time::Duration,
};

use chrono::{Datelike, NaiveDateTime, TimeZone, Timelike, Weekday};
use serde_json::Value;
use sha2::{Digest, Sha256};

use crate::{
    app::schedule::{Days, JobDetails, Meridiem, TimeDetails},
    repository::models::{Schedule, TimeUnit},
};

use lazy_static::lazy_static;

use super::{
    jobs::{dashboard_mailer::DashboardMailerJob, visualization_mailer::VisualizationMailerJob},
    LongLivedData, Queue,
};
lazy_static! {
    static ref DAY_ENUM_MAPPING: HashMap<Days, Weekday> = {
        let mut m = HashMap::new();
        m.insert(Days::Monday, Weekday::Mon);
        m.insert(Days::Tuesday, Weekday::Tue);
        m.insert(Days::Wednesday, Weekday::Wed);
        m.insert(Days::Thursday, Weekday::Thu);
        m.insert(Days::Friday, Weekday::Fri);
        m.insert(Days::Saturday, Weekday::Sat);
        m.insert(Days::Sunday, Weekday::Sun);
        m
    };
}

pub async fn run(queue: Arc<dyn Queue>, data: Arc<LongLivedData>) {
    loop {
        let queue = queue.clone();
        let jobs = match queue.next_named_jobs().await {
            Ok(jobs) => jobs,
            Err(err) => {
                println!("Scheduled Worker Error: {}", err);
                tokio::time::sleep(Duration::from_millis(500)).await;
                Vec::new()
            }
        };

        let mut already_scheduled: HashSet<String> = HashSet::new();

        for job in jobs {
            already_scheduled.insert(job.name.unwrap_or_default());
        }

        let conn = data.pool.get();
        let jobs = match Schedule::fetch_all_active(&mut conn.unwrap()) {
            Ok(jobs) => jobs,
            Err(err) => {
                println!("Scheduled Worker Error: {}", err);
                tokio::time::sleep(Duration::from_millis(500)).await;
                Vec::new()
            }
        };
        let mut job_information = vec![];
        for job in jobs {
            if job.time_details.is_some() {
                let tds = job.time_details.as_ref().unwrap();
                for td in tds {
                    job_information.push((job.clone(), td.clone()))
                }
            }
        }

        for (job, time_details) in job_information {
            if time_details.clone().is_none()
                || job.job_details.is_none()
                || job.every.is_none()
                || job.time_unit.is_none()
            {
                continue;
            }
            let name = get_name(
                time_details.clone().unwrap(),
                job.job_details.clone().unwrap(),
            );
            let time_details: Result<TimeDetails, serde_json::Error> =
                serde_json::from_value(time_details.clone().unwrap());
            if time_details.is_err() {
                continue;
            }

            let tds = time_details.ok().unwrap();

            if !already_scheduled.contains(&name) {
                let job = job.clone();

                let time_zone: chrono_tz::Tz = job
                    .timezone
                    .clone()
                    .unwrap_or_default()
                    .parse()
                    .unwrap_or(chrono_tz::UTC);
                let scheduled_time = calc_next_scheduled_time(
                    job.every.unwrap(),
                    job.time_unit.as_ref().unwrap().clone(),
                    tds.clone(),
                    job.updated_at,
                    time_zone,
                );

                push_job(
                    queue.clone(),
                    &job,
                    serde_json::to_value(tds).ok().unwrap(),
                    scheduled_time,
                )
                .await;
            }
        }

        tokio::time::sleep(Duration::from_secs(30)).await;
    }
}

async fn push_job(
    queue: Arc<dyn Queue>,
    job: &Schedule,
    time_details: Value,
    scheduled_time: Option<NaiveDateTime>,
) {
    if scheduled_time.is_none() {
        println!("Scheduled Worker Error: No Scheduled Time");
        return;
    }
    let job_details: Result<JobDetails, serde_json::Error> =
        serde_json::from_value(job.job_details.clone().unwrap_or_default());
    if let Err(err) = job_details {
        println!("Scheduled Worker Error: Could Now Schedule Job {}", err);
        return;
    }
    let job_details = job_details.unwrap();
    let recipients: Vec<String> = job
        .recipients
        .clone()
        .unwrap_or_default()
        .iter()
        .filter(|r| r.is_some())
        .map(|r| r.clone().unwrap_or_default())
        .collect();
    let name = get_name(time_details, job.job_details.clone().unwrap_or_default());
    println!(
        "Scheduled Worker: Pushing Job name: {},Schedule Time: {:?}: Job Details {:?}",
        name, scheduled_time, job_details
    );
    let pushed = match job_details {
        JobDetails::Dashboard(details) => {
            queue
                .push_job(
                    super::Message::DashboardMailer(DashboardMailerJob {
                        recipients,
                        dashboard_id: details.dashboard_id,
                    }),
                    Some(name.clone()),
                    scheduled_time,
                )
                .await
        }
        JobDetails::Visualization(details) => {
            queue
                .push_job(
                    super::Message::VisualizationMailer(VisualizationMailerJob {
                        recipients,
                        visualization_id: details.visualization_id,
                        email_content: details.email_content,
                        subject: job
                            .subject
                            .clone()
                            .unwrap_or("Please Download your CSV".to_string()),
                    }),
                    Some(name.clone()),
                    scheduled_time,
                )
                .await
        }
    };
    if pushed.is_err() {
        println!(
            "Scheduled Worker Error: Could Not Push Job {}, name: {}",
            pushed.err().unwrap(),
            name
        );
    }
}

fn get_name(time_details: Value, job_details: Value) -> String {
    let input = format!("{}:{}", job_details, time_details);
    let mut hasher = Sha256::new();
    hasher.update(input);
    format!("{:x}", hasher.finalize())
}

fn calc_next_scheduled_time(
    repeat: i32,
    time_unit: TimeUnit,
    time_details: TimeDetails,
    updated_at: NaiveDateTime,
    tz: chrono_tz::Tz,
) -> Option<NaiveDateTime> {
    let now = chrono::Utc::now().with_timezone(&tz).naive_local();
    match time_unit {
        TimeUnit::Hour => next_schedule_time_for_hour(&time_details, now, repeat, updated_at, &tz),
        TimeUnit::Day => next_schedule_time_for_day(&time_details, now, repeat, updated_at, &tz),
        TimeUnit::Week => next_schedule_time_for_week(&time_details, now, repeat, updated_at, &tz),
        TimeUnit::Month => {
            next_schedule_time_for_month(&time_details, now, repeat, updated_at, &tz)
        }
    }
}

fn next_schedule_time_for_day(
    time_details: &TimeDetails,
    now: NaiveDateTime,
    repeat: i32,
    updated_at: NaiveDateTime,
    tz: &chrono_tz::Tz,
) -> Option<NaiveDateTime> {
    if let TimeDetails::Day { hour, minute, am } = time_details {
        let days_past = days_since(updated_at, tz);
        let mut next_day = if days_past == 0 {
            reset_time_to_day(now) + Duration::from_secs(0)
        } else {
            reset_time_to_day(now)
                + Duration::from_secs(
                    (24 * 60 * 60 * ((repeat as i64) - (days_past % (repeat as i64)))) as u64,
                )
        };

        next_day = next_day.with_hour(hour.clone() as u32).unwrap_or(next_day);
        next_day = next_day.with_minute(*minute as u32).unwrap_or(next_day);
        next_day = set_meridiem(next_day, am.clone());

        if next_day < now {
            next_day += Duration::from_secs(60 * 60 * 24);
        }
        return timezoned_datetime_to_utc(next_day, tz);
    }
    return None;
}

fn next_schedule_time_for_hour(
    time_details: &TimeDetails,
    now: NaiveDateTime,
    repeat: i32,
    updated_at: NaiveDateTime,
    tz: &chrono_tz::Tz,
) -> Option<NaiveDateTime> {
    if let TimeDetails::Hour { minute } = *time_details {
        let hours_past = hours_since(updated_at, tz);
        let mut next_time = if hours_past == 0 {
            reset_time_to_hour(now) + Duration::from_secs(0)
        } else {
            reset_time_to_hour(now)
                + Duration::from_secs(
                    (60 * 60 * ((repeat as i64) - (hours_past % (repeat as i64)))) as u64,
                )
                + Duration::from_secs(60 * minute as u64)
        };

        if next_time < now {
            next_time = next_time + Duration::from_secs(60 * 60 * 24);
        }

        return timezoned_datetime_to_utc(next_time, tz);
    }
    return None;
}

fn next_schedule_time_for_week(
    time_details: &TimeDetails,
    now: NaiveDateTime,
    repeat: i32,
    updated_at: NaiveDateTime,
    tz: &chrono_tz::Tz,
) -> Option<NaiveDateTime> {
    if let TimeDetails::Week {
        day,
        hour,
        minute,
        am,
    } = time_details
    {
        let start_week = reset_time_to_week_start(updated_at);
        let this_week = reset_time_to_week_start(now);
        let duration = this_week.signed_duration_since(start_week);

        let num_weeks = duration.num_weeks();

        let mut next_week = if num_weeks == 0 {
            this_week + Duration::from_secs(0)
        } else {
            this_week
                + Duration::from_secs(
                    (((repeat as i64) - (num_weeks % (repeat as i64))) * 60 * 60 * 24 * 7) as u64,
                )
        };

        let desired_day = DAY_ENUM_MAPPING.get(&day).unwrap();

        // Current day of the week
        let current_day = next_week.weekday();

        // Calculate the difference in days
        let diff = (desired_day.num_days_from_monday() as i64)
            - (current_day.num_days_from_monday() as i64);
        let diff = if diff < 0 { diff + 7 } else { diff };

        next_week = next_week + Duration::from_secs((diff * 60 * 60 * 24) as u64);
        next_week = next_week
            .with_hour(hour.clone() as u32)
            .unwrap_or(next_week);
        next_week = next_week
            .with_minute(minute.clone() as u32)
            .unwrap_or(next_week);
        next_week = set_meridiem(next_week, am.clone());
        if next_week < now {
            next_week = next_week + Duration::from_secs(60 * 60 * 24 * 7);
        }
        return timezoned_datetime_to_utc(next_week, tz);
    }
    return None;
}

fn timezoned_datetime_to_utc(datetime: NaiveDateTime, tz: &chrono_tz::Tz) -> Option<NaiveDateTime> {
    match tz.from_local_datetime(&datetime) {
        chrono::LocalResult::None => None,
        chrono::LocalResult::Single(datetime) => Some(datetime.naive_utc()),
        chrono::LocalResult::Ambiguous(_, _) => None,
    }
}

fn next_schedule_time_for_month(
    time_details: &TimeDetails,
    now: NaiveDateTime,
    repeat: i32,
    updated_at: NaiveDateTime,
    tz: &chrono_tz::Tz,
) -> Option<NaiveDateTime> {
    if let TimeDetails::Month {
        date,
        hour,
        minute,
        am,
    } = time_details
    {
        let start_month = reset_time_to_month_start(updated_at);
        let this_month = reset_time_to_month_start(now);
        let num_months = month_difference(&start_month, &this_month);

        let mut next_month = if num_months == 0 {
            this_month + Duration::from_secs(0)
        } else {
            this_month
                + Duration::from_secs(((repeat - (num_months % repeat)) * 60 * 60 * 24 * 30) as u64)
        };
        next_month = reset_time_to_month_start(next_month);
        set_date_and_time_for_month(&mut next_month, date, hour, minute, am);
        if next_month < now {
            next_month = next_month + Duration::from_secs(60 * 60 * 24 * 30);
            set_date_and_time_for_month(&mut next_month, date, hour, minute, am);
        }
        return timezoned_datetime_to_utc(next_month, tz);
    }
    return None;
}

fn set_date_and_time_for_month(
    next_month: &mut NaiveDateTime,
    date: &u8,
    hour: &u8,
    minute: &u8,
    am: &Meridiem,
) {
    let mut datetime = next_month
        .with_day(date.clone() as u32)
        .unwrap_or(*next_month);
    datetime = datetime.with_hour(hour.clone() as u32).unwrap_or(datetime);
    datetime = datetime
        .with_minute(minute.clone() as u32)
        .unwrap_or(datetime);
    datetime = set_meridiem(datetime, am.clone());
    *next_month = datetime;
}

fn month_difference(start: &NaiveDateTime, end: &NaiveDateTime) -> i32 {
    let mut months = (end.year() - start.year()) * 12 + (end.month() as i32 - start.month() as i32);

    // Subtract one month if the day component of the start is greater than the end
    if start.day() > end.day() {
        months -= 1;
    }

    months
}

fn hours_since(time: NaiveDateTime, tz: &chrono_tz::Tz) -> i64 {
    let now = chrono::Utc::now().with_timezone(tz).naive_utc();
    let duration = now - time;
    duration.num_hours()
}

fn days_since(time: NaiveDateTime, tz: &chrono_tz::Tz) -> i64 {
    let now = chrono::Utc::now().with_timezone(tz).naive_utc();
    let duration = now - time;
    duration.num_days()
}

fn reset_time_to_month_start(mut datetime: NaiveDateTime) -> NaiveDateTime {
    datetime = datetime.with_day(1).unwrap();
    datetime = datetime.with_hour(0).unwrap();
    datetime = datetime.with_minute(0).unwrap();
    datetime = datetime.with_second(0).unwrap();
    datetime = datetime.with_nanosecond(0).unwrap();
    datetime
}

fn reset_time_to_week_start(datetime: NaiveDateTime) -> NaiveDateTime {
    let weekday = datetime.weekday();
    let days_since_monday = weekday.num_days_from_monday();
    let start_of_week = datetime - chrono::Duration::days(days_since_monday.into());

    // Set the time to 00:00:00
    start_of_week.date().and_hms(0, 0, 0)
}

fn reset_time_to_hour(mut datetime: NaiveDateTime) -> NaiveDateTime {
    datetime = datetime.with_minute(0).unwrap();
    datetime = datetime.with_second(0).unwrap();
    datetime = datetime.with_nanosecond(0).unwrap();
    datetime
}

fn reset_time_to_day(mut datetime: NaiveDateTime) -> NaiveDateTime {
    datetime = datetime.with_hour(0).unwrap();
    datetime = datetime.with_minute(0).unwrap();
    datetime = datetime.with_second(0).unwrap();
    datetime = datetime.with_nanosecond(0).unwrap();
    datetime
}

fn set_meridiem(datetime: NaiveDateTime, meridiem: Meridiem) -> NaiveDateTime {
    let hour = datetime.hour();

    match meridiem {
        Meridiem::AM if hour >= 12 => datetime - chrono::Duration::hours(12),
        Meridiem::PM if hour < 12 => datetime + chrono::Duration::hours(12),
        _ => datetime, // No change needed
    }
}
