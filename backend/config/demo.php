<?php

/**
 * Demo Configuration
 * 
 * This file contains configuration for demo accounts.
 * Change the trainer_code to display different trainers' data in the demo.
 * 
 * Available trainers (from recent data):
 * - "J   Sharp"       (9 entries)
 * - "B H Cox"         (7 entries)
 * - "G   Garcia"      (7 entries)
 * - "E N Foster"      (6 entries)
 * - "J   Ennis"       (6 entries)
 * - "K   Danner"      (5 entries)
 * - "R   Labra"       (5 entries)
 * - "M J Maker"       (5 entries)
 * - "M W McCarthy"    (5 entries)
 * - "T   Drury, Jr."  (5 entries)
 */

return [
    /*
    |--------------------------------------------------------------------------
    | Demo Trainer Code
    |--------------------------------------------------------------------------
    |
    | The trainer_code to use for demo trainer accounts.
    | This must match exactly with the trainer_name in the entries table.
    | Change this value to demo different trainers' data.
    |
    */
    'trainer_code' => env('DEMO_TRAINER_CODE', 'B H Cox'),

    /*
    |--------------------------------------------------------------------------
    | Demo Mode Enabled
    |--------------------------------------------------------------------------
    |
    | When true, demo accounts will use the trainer_code above instead of
    | their own trainer_code. Set to false in production.
    |
    */
    'enabled' => env('DEMO_MODE', true),
];

