#!/usr/bin/php
<?php
/**
 * ovh-api-archive: View or compare an API archive from OVH, SYS, KS, or RunAbove.
 *
 * @author Jean-Philippe Blary (@blary_jp)
 * @url https://github.com/blaryjp/ovh-api-archive
 * @license MIT
 */

date_default_timezone_set('Europe/Paris');

// define('BASEPATH', '../sandbox/apidiff/dataset/');
define('BASEPATH', '../dataset/');
define('TODAY', date("Y-m-d"));
define('YESTERDAY', date("Y-m-d", time() - 60 * 60 * 24));

$OVH = 'https://api.ovh.com/1.0';
$SYS = 'https://eu.soyoustart.com/fr/manager/api/1.0';
$KS  = 'https://www.kimsufi.com/fr/manager/api/1.0';
$RA  = 'https://manager.runabove.com/api/1.0';

// ---

// Some log
function logger ($str) {
    // echo $str;
    file_put_contents(BASEPATH . 'msg.log', $str, FILE_APPEND);
};

// Get API JSONs
function getApis ($api_type, $api_basepath) {

    $timer_main = microtime(true);
    logger("-----\n[START $api_type] Get all schemas.\n");

    $dir = BASEPATH . $api_type . '/' . TODAY;

    // Create the dir for today
    if (!file_exists($dir)) {
        mkdir($dir, 0755);
    }

    // Get API main schema, and save it
    $api_root = file_get_contents($api_basepath);
    file_put_contents($dir . '/API.json', $api_root);

    // Get all API schemas, defined in the main schema, and save them
    $decoded_api_root = json_decode($api_root);
    foreach ($decoded_api_root->apis as $k => $api) {
        $timer = microtime(true);
        logger("GET $api->path... ");

        $matches = array();
        preg_match('/\/(\w+)$/', $api->path, $matches);
        file_put_contents($dir . '/' . $matches[1] . '.json', file_get_contents($api_basepath . $api->path . '.json'));

        logger("[" . (microtime(true) - $timer) . "s]\n");
    }

    // Save the current date into the "all.json" file
    $all_dir = BASEPATH . $api_type . '/all.json';
    if (!file_exists($all_dir)) {
        file_put_contents($all_dir, '[]');
    }
    $decoded_all_file = json_decode(file_get_contents($all_dir));
    if (!in_array(TODAY, $decoded_all_file)) {
        $decoded_all_file[] = TODAY;
        file_put_contents($all_dir, json_encode($decoded_all_file));
    }

    logger("[END $api_type] Get all schemas. [" . (microtime(true) - $timer_main) . "s]\n");

    unset($timer_main, $timer, $dir, $api_root, $decoded_api_root, $matches, $all_dir, $decoded_all_file);
};


// Check if there are a diff from yesterday
function getApiDiff ($api_type) {

    $timer_main = microtime(true);
    logger("-----\n[START $api_type] Check for diff between " . YESTERDAY . " and " . TODAY . ".\n");

    $dir_from = BASEPATH . $api_type . '/' . YESTERDAY;
    $dir_to = BASEPATH . $api_type . '/' . TODAY;
    $diff = false;

    // Perform a comparaison only if we have the files of the previous day
    if (file_exists($dir_from . '/API.json')) {

        $api_from = file_get_contents($dir_from . '/API.json');
        $api_to = file_get_contents($dir_to . '/API.json');

        // First check if there is a new API
        if (strcmp($api_from, $api_to) === 0) {     // 0 = no diff

            // Compare yesterday and today schemas
            $decoded_api_to = json_decode($api_to);
            foreach ($decoded_api_to->apis as $k => $api) {
                $matches = array();
                preg_match('/\/(\w+)$/', $api->path, $matches);
                $from = file_get_contents($dir_from . '/' . $matches[1] . '.json');
                $to = file_get_contents($dir_to . '/' . $matches[1] . '.json');
                if (strcmp($from, $to) !== 0) {
                    $diff = true;
                    break;
                }
            }
        } else {
            $diff = true;
        }

    } else {
        $diff = true;
    }

    // If difference, save the daye into the "diff.json" file
    $diff_dir = BASEPATH . $api_type . '/diff.json';
    if (!file_exists($diff_dir)) {
        file_put_contents($diff_dir, '[]');
    }

    if ($diff) {
        logger("Difference found!\n");

        $decoded_diff_file = json_decode(file_get_contents($diff_dir));
        if (!in_array(TODAY, $decoded_diff_file)) {
            $decoded_diff_file[] = TODAY;
            file_put_contents($diff_dir, json_encode($decoded_diff_file));
        }
    } else {
        logger("NO difference found!\n");
    }

    logger("[END $api_type] Check for diff between " . YESTERDAY . " and " . TODAY . ". [" . (microtime(true) - $timer_main) . "s]\n");

    unset($timer_main, $timer, $dir_from, $dir_to, $api_from, $api_to, $diff, $decoded_api_to, $matches, $from, $to, $diff_dir, $decoded_diff_file);
};

// ---

// Let's go!

$timer_main = microtime(true);
logger("Job started for " . TODAY . " at " . date("c") . ".\n");

getApis('ovh', $OVH);
getApis('sys', $SYS);
getApis('ks', $KS);
getApis('ra', $RA);

getApiDiff('ovh');
getApiDiff('sys');
getApiDiff('ks');
getApiDiff('ra');

logger("Job finished for " . TODAY . " at " . date("c") . ". Total time: " . (microtime(true) - $timer_main) . "s.\n");

// ---

unset($OVH, $SYS, $KS, $RA, $timer_main);

exit();

?>
