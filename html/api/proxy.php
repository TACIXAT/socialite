<?php
include_once '/var/www/php/include/db_connect.php';
include_once '/var/www/php/include/functions.php';

sec_session_start(false);
$logged_in = login_check($mysqli);
if (!$logged_in) {
    http_response_code(401);
    die('{"status":"error", "msg":"Session problem!"}');
}

if (is_ajax()) {
    if (empty($_POST["seasurf"]) || $_POST["seasurf"] != $_SESSION["csrf_token"]) {
        http_response_code(401);
        die('{"status":"error", "msg":"Missing or invalid CSRF token! If you\'re not a hacker you should probably contact us."}');
    }

    if (!empty($_POST["action"])) { //Checks if action value exists
        $_POST["apiKey"] = get_api_key($mysqli);
        $action = $_POST["action"];
        switch($action) { //Switch case for value of action
            case "create_vertex": 
                $result = create_vertex(); 
                echo $result;
                exit();
            case "search_vertices":
                $result = search_vertices();
                echo $result;
                exit();
            case "get_vertex_types":
                $result = get_vertex_types();
                echo $result;
                exit();
            case "get_type_properties":
                $result = get_type_properties();
                echo $result;
                exit();
            case "update_vertex":
                $result = update_vertex();
                echo $result;
                exit();
            case "delete_vertex":
                $result = delete_vertex();
                echo $result;
                exit();
            case "create_edge":
                $result = create_edge();
                echo $result;
                exit();
            case "delete_edge":
                $result = delete_edge();
                echo $result;
                exit();
            case "get_neighbors":
                $result = get_neighbors();
                echo $result;
                exit();
            case "search_connected_to":
                $result = search_connected_to();
                echo $result;
                exit();
            default:
                http_response_code(400);
                die('{"status":"error", "msg":"Action not found!"}');
        }
    } else {
        http_response_code(400);
        die('{"status":"error", "msg":"No action set!"}');
    }
} else {
    http_response_code(400);
    die('{"status":"error", "msg":"Not AJAX!"}');
}

function search_vertices() {
    return post_url("https://localhost:8443/IntelligenceGraph/api/utility/search_vertices/");
}

function get_vertex_types() {
    return post_url("https://localhost:8443/IntelligenceGraph/api/utility/get_vertex_types/");
}

function get_type_properties() {
    return post_url("https://localhost:8443/IntelligenceGraph/api/utility/get_type_properties/");
}

function update_vertex() {
    return post_url("https://localhost:8443/IntelligenceGraph/api/utility/update_vertex/");
}

function delete_vertex() {
    return post_url("https://localhost:8443/IntelligenceGraph/api/utility/delete_vertex/");
}

function create_edge() {
    return post_url("https://localhost:8443/IntelligenceGraph/api/utility/create_edge/");
}

function delete_edge() {
    return post_url("https://localhost:8443/IntelligenceGraph/api/utility/delete_edge/");
}

function get_neighbors() {
    return post_url("https://localhost:8443/IntelligenceGraph/api/utility/get_neighbors/");
}

function search_connected_to() {
    return post_url("https://localhost:8443/IntelligenceGraph/api/utility/search_connected_to/");
}

function post_url($url) {
    $json_data = json_encode($_POST);
    $options = array(
        'http' => array(
            'method'  => 'POST',
            'header'  => "Content-type: application/json\r\n".
                         "Connection: close\r\n" .
                         "Content-length: " . strlen($json_data) . "\r\n",
            'content' => $json_data,
        ),
        'ssl' => array(
            'verify_peer' => false,
        ),
    );

    $context = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    return $result;
}

function create_vertex(){
    $json_data = json_encode($_POST);
    $url = "https://localhost:8443/IntelligenceGraph/api/utility/create_vertex/";
    $options = array(
        'http' => array(
            'method'  => 'POST',
            'header'  => "Content-type: application/json\r\n".
                         "Connection: close\r\n" .
                         "Content-length: " . strlen($json_data) . "\r\n",
            'content' => $json_data,
        ),
        'ssl' => array(
            'verify_peer' => false,
        ),
    );

    $context = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    return $result;
}
?>
