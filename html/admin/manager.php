<?php 

include_once '/var/www/php/include/db_connect.php';
include_once '/var/www/php/include/functions.php';
 
sec_session_start();
$logged_in = login_check($mysqli);

$allow = array("108.3.175.118");

if(!$logged_in || $_SESSION['user_id'] != 1 || !in_array($_SERVER['REMOTE_ADDR'], $allow)) {
    die('{"msg":"Fuck off!"}');
} 

function get_invite_list($target, $email, $mysqli) {
    $stmt = $mysqli->prepare("SELECT id, requested, email FROM members WHERE invited IS NULL");
    if($stmt) {
        $stmt->execute();    
        $stmt->store_result();

        $stmt->bind_result($user_id, $timestamp, $email);
        while($stmt->fetch()) {
            printf("%d %s %s\n", $user_id, $requested, $email);
        }
    }

    $stmt->close();
    return 0;
}

get_invite_list();

?>