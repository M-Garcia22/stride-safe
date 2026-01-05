<?php

/**
 * Demo Configuration
 * 
 * This file contains configuration for demo accounts.
 * Change the trainer_code and trainer_name to display different trainers' data.
 * 
 * Available trainers (from recent data):
 * - "J   Sharp"       (9 entries)  -> "J Sharp"
 * - "B H Cox"         (7 entries)  -> "Brad H. Cox" - has owned horses
 * - "G   Garcia"      (7 entries)  -> "G Garcia"
 * - "E N Foster"      (6 entries)  -> "E N Foster"
 * - "J   Ennis"       (6 entries)  -> "J Ennis"
 * - "K   Danner"      (5 entries)  -> "K Danner"
 * - "R   Labra"       (5 entries)  -> "R Labra"
 * - "M J Maker"       (5 entries)  -> "M J Maker"
 * - "M W McCarthy"    (5 entries)  -> "M W McCarthy"
 * - "T   Drury, Jr."  (5 entries)  -> "T Drury Jr."
 */

return [
    /*
    |--------------------------------------------------------------------------
    | Demo Mode Enabled
    |--------------------------------------------------------------------------
    |
    | When true, demo accounts will use the trainer settings below instead of
    | their own. Set to false in production.
    |
    */
    'enabled' => env('DEMO_MODE', true),

    /*
    |--------------------------------------------------------------------------
    | Demo Trainer Code
    |--------------------------------------------------------------------------
    |
    | The trainer_code to use for demo trainer accounts.
    | This must match exactly with the trainer_name in the entries table.
    |
    */
    'trainer_code' => env('DEMO_TRAINER_CODE', 'B H Cox'),

    /*
    |--------------------------------------------------------------------------
    | Demo Trainer Display Name
    |--------------------------------------------------------------------------
    |
    | The display name shown in the UI for demo trainer accounts.
    | This should be the trainer's full name as it appears in tiller_races.
    |
    */
    'trainer_name' => env('DEMO_TRAINER_NAME', 'Brad H. Cox'),
];

