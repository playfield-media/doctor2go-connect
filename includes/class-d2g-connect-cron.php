<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class D2gConnect_Cron {

    public function queue_doctors() {

        $doctors = get_posts([
            'post_type'      => 'd2g_doctor',
            'posts_per_page' => -1,
            'fields'         => 'ids'
        ]);

        if (!$doctors) {
            return;
        }

        foreach ($doctors as $doctor_id) {
            wp_schedule_single_event( time(), 'd2g_sync_single_doctor', [$doctor_id] );
        }
    }

    public function add_cron_schedules($schedules) {
        $schedules['fifteen_minutes'] = [
            'interval' => 900,
            'display'  => 'Every 15 minutes'
        ];
        return $schedules;
    }
}