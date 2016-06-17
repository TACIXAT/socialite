<?php
include_once 'graph_config.php';

function is_ajax() {
  return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
}
 
function sec_session_start($regenerate=true) {
    $session_name = 'sec_session_id';   // Set a custom session name
    $secure = SECURE;
    // This stops JavaScript being able to access the session id.
    $httponly = true;
    // Forces sessions to only use cookies.
    if (ini_set('session.use_only_cookies', 1) === FALSE) {
        header("Location: ../error.php?err=Could not initiate a safe session (ini_set)");
        exit();
    }
    // Gets current cookies params.
    $cookieParams = session_get_cookie_params();
    session_set_cookie_params($cookieParams["lifetime"],
        $cookieParams["path"], 
        $cookieParams["domain"], 
        $secure,
        $httponly);
    // Sets the session name to the one set above.
    session_name($session_name);
    session_start();            // Start the PHP session 
    if($regenerate) {
        session_regenerate_id(true);    // regenerated the session, delete the old one. 
    }
}

function login($email, $password, $mysqli) {
    // Using prepared statements means that SQL injection is not possible. 
    if ($stmt = $mysqli->prepare("SELECT id, username, password, salt 
        FROM members
       WHERE email = ?
        LIMIT 1")) {
        $stmt->bind_param('s', $email);  // Bind "$email" to parameter.
        $stmt->execute();    // Execute the prepared query.
        $stmt->store_result();
 
        // get variables from result.
        $stmt->bind_result($user_id, $username, $db_password, $salt);
        $stmt->fetch();
 
        // hash the password with the unique salt.
        $password = hash('sha512', $password . $salt);
        if ($stmt->num_rows == 1) {
            // If the user exists we check if the account is locked
            // from too many login attempts 
 
            if (checkbrute($user_id, $mysqli) == true) {
                // Account is locked 
                // Send an email to user saying their account is locked
                return false;
            } else {
                // Check if the password in the database matches
                // the password the user submitted.
                if ($db_password == $password) {
                    // Password is correct!
                    // Get the user-agent string of the user.
                    $user_browser = $_SERVER['HTTP_USER_AGENT'];
                    // XSS protection as we might print this value
                    $user_id = preg_replace("/[^0-9]+/", "", $user_id);
                    $_SESSION['user_id'] = $user_id;
                    // XSS protection as we might print this value
                    $username = preg_replace("/[^a-zA-Z0-9_\-]+/", 
                                                                "", 
                                                                $username);
                    $_SESSION['username'] = $username;
                    $_SESSION['login_string'] = hash('sha512', 
                              $password . $user_browser);

                    // Login successful.
                    return true;
                } else {
                    // Password is not correct
                    // We record this attempt in the database
                    $now = time();
                    $mysqli->query("INSERT INTO login_attempts(user_id, time)
                                    VALUES ('$user_id', '$now')");
                    return false;
                }
            }
        } else {
            // No user exists.
            return false;
        }
    }
}

function get_vertex_count($api_key) {
    $url = "https://localhost:8443/IntelligenceGraph/api/utility/count_user_vertices/";
    $data = array("apiKey" => $api_key);
    $json_data = json_encode($data);
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

function checkbrute($user_id, $mysqli) {
    // Get timestamp of current time 
    $now = time();
 
    // All login attempts are counted from the past 2 hours. 
    $valid_attempts = $now - (2 * 60 * 60);
 
    if ($stmt = $mysqli->prepare("SELECT time 
                             FROM login_attempts 
                             WHERE user_id = ? 
                            AND time > '$valid_attempts'")) {
        $stmt->bind_param('i', $user_id);
 
        // Execute the prepared query. 
        $stmt->execute();
        $stmt->store_result();
 
        // If there have been more than 5 failed logins 
        if ($stmt->num_rows > 5) {
            return true;
        } else {
            return false;
        }
    }
}

function first_login($mysqli) {
    $query = "SELECT first_login FROM members WHERE id = ? AND first_login IS NULL LIMIT 1";
    $user_id = $_SESSION['user_id'];

    if ($stmt = $mysqli->prepare($query)) {
        $stmt->bind_param('i', $user_id);
        $stmt->execute();   // Execute the prepared query.
        $stmt->store_result();

        if($stmt->num_rows == 0) 
            return false;

        $query = "UPDATE members SET first_login = NOW() WHERE id = ?";
        $stmt = $mysqli->prepare($query);
        if(!$stmt) {
            error_log(__FILE__ . ":" . __LINE__);
            return true;
        }

        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $stmt->close();
        return true; 
    }

    return false;
}

function login_check($mysqli) {
    // Check if all session variables are set 
    if (isset($_SESSION['user_id'], 
                        $_SESSION['username'], 
                        $_SESSION['login_string'])) {
 
        $user_id = $_SESSION['user_id'];
        $login_string = $_SESSION['login_string'];
        $username = $_SESSION['username'];
 
        // Get the user-agent string of the user.
        $user_browser = $_SERVER['HTTP_USER_AGENT'];
 
        if ($stmt = $mysqli->prepare("SELECT password 
                                      FROM members 
                                      WHERE id = ? LIMIT 1")) {
            // Bind "$user_id" to parameter. 
            $stmt->bind_param('i', $user_id);
            $stmt->execute();   // Execute the prepared query.
            $stmt->store_result();
 
            if ($stmt->num_rows == 1) {
                // If the user exists get variables from result.
                $stmt->bind_result($password);
                $stmt->fetch();
                $login_check = hash('sha512', $password . $user_browser);
 
                if ($login_check == $login_string) {
                    // Logged In!!!! 
                    return true;
                } else {
                    // Not logged in 
                    return false;
                }
            } else {
                // Not logged in 
                return false;
            }
        } else {
            // Not logged in 
            return false;
        }
    } else {
        // Not logged in 
        return false;
    }
}

function esc_url($url) {
 
    if ('' == $url) {
        return $url;
    }
 
    $url = preg_replace('|[^a-z0-9-~+_.?#=!&;,/:%@$\|*\'()\\x80-\\xff]|i', '', $url);
 
    $strip = array('%0d', '%0a', '%0D', '%0A');
    $url = (string) $url;
 
    $count = 1;
    while ($count) {
        $url = str_replace($strip, '', $url, $count);
    }
 
    $url = str_replace(';//', '://', $url);
 
    $url = htmlentities($url);
 
    $url = str_replace('&amp;', '&#038;', $url);
    $url = str_replace("'", '&#039;', $url);
 
    if ($url[0] !== '/') {
        // We're only interested in relative links from $_SERVER['PHP_SELF']
        return '';
    } else {
        return $url;
    }
}

function update_api_key_in_graph($email, $api_key, $mysqli) {
    $username = get_user_info('username', $email, $mysqli);
    $url = "https://localhost:8443/IntelligenceGraph/api/utility/update_api_key/";
    $data = new stdClass();
    $data->username = $username;
    $data->apiKey = $api_key;
    $data->password = GRAPH_API_KEY_PASSWORD;
    $json_data = json_encode($data);

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
    if (substr($result, 0, 7) === "SUCCESS") {
        return true;
    }

    return $result;
}

function add_user_to_graph($email, $api_key, $mysqli) {
    $url = "https://localhost:8443/IntelligenceGraph/api/utility/create_user/";
    $data = new stdClass();
    $data->username = get_user_info('username', $email, $mysqli);
    $data->apiKey = $api_key;
    $data->password = GRAPH_API_KEY_PASSWORD;
    $json_data = json_encode($data);

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
    if (substr($result, 0, 7) === "SUCCESS") {
        return true;
    }

    return $result;
}


function create_api_key($email, $mysqli) {
    $data = secure_random_string(256);
    $api_key = md5($data);
    $user_id = get_user_info('user_id', $email, $mysqli);

    if($user_id == 0) {
       return '';
    }

    $stmt = $mysqli->prepare("INSERT INTO api_keys VALUES ( ? , ? )");
    if($stmt) {
        $stmt->bind_param('is', $user_id, $api_key);
        if($stmt->execute()) {
            $stmt->close();
            return $api_key;
        }
    }
    $stmt->close();
    return '';
}

function update_api_key($email, $mysqli) {
    $data = secure_random_string(256);
    $api_key = md5($data);
    $user_id = get_user_info('user_id', $email, $mysqli);

    if($user_id == 0) {
       return ''; 
    }

    $stmt = $mysqli->prepare("UPDATE api_keys SET api_key = ? WHERE user_id = ?");
    if($stmt) {
        $stmt->bind_param('si', $api_key, $user_id);
        if($stmt->execute()) {
            $stmt->close();
            return $api_key;
        }
    }
    $stmt->close();
    return '';
}

function get_api_key($mysqli) {
    $user_id = $_SESSION['user_id'];

    if(!isset($user_id))
        return '';

    $stmt = $mysqli->prepare("SELECT api_key FROM api_keys WHERE user_id = ? LIMIT 1");
    if($stmt) {
        $stmt->bind_param('i', $user_id);
        if(!$stmt->execute()) {
            $stmt->close();
            return '';
        }
        $stmt->store_result();

        if($stmt->num_rows == 1) {
            $stmt->bind_result($api_key);
            $stmt->fetch();
            $stmt->close();
            return $api_key;
        }
    }
 
    $stmt->close();
    return '';    
}

// target can be 'username' or 'user_id'
function get_user_info($target, $email, $mysqli) {
    $stmt = $mysqli->prepare("SELECT id, username FROM members WHERE email = ? LIMIT 1");
    if($stmt) {
        $stmt->bind_param('s', $email);  // Bind "$email" to parameter.
        $stmt->execute();    // Execute the prepared query.
        $stmt->store_result();

        // get variables from result.
        if ($stmt->num_rows == 1) {
            $stmt->bind_result($user_id, $username);
            $stmt->fetch();
            $stmt->close();
            switch($target) {
                case 'username':
                    return $username;
                case 'user_id':
                    return $user_id;
                default:
                    return 0;
            }
        }
    }

    $stmt->close();
    return 0;
}

function rand_string($length, $charset='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^*(){}":;?,./|-_=+`~') {
    $str = '';
    $count = strlen($charset);
    while ($length--) {
        $str .= $charset[mt_rand(0, $count-1)];
    }
    return $str;
}

if (!function_exists('http_response_code')) {
    function http_response_code($code = NULL) {
        if ($code !== NULL) {
            switch ($code) {
                case 100: $text = 'Continue'; break;
                case 101: $text = 'Switching Protocols'; break;
                case 200: $text = 'OK'; break;
                case 201: $text = 'Created'; break;
                case 202: $text = 'Accepted'; break;
                case 203: $text = 'Non-Authoritative Information'; break;
                case 204: $text = 'No Content'; break;
                case 205: $text = 'Reset Content'; break;
                case 206: $text = 'Partial Content'; break;
                case 300: $text = 'Multiple Choices'; break;
                case 301: $text = 'Moved Permanently'; break;
                case 302: $text = 'Moved Temporarily'; break;
                case 303: $text = 'See Other'; break;
                case 304: $text = 'Not Modified'; break;
                case 305: $text = 'Use Proxy'; break;
                case 400: $text = 'Bad Request'; break;
                case 401: $text = 'Unauthorized'; break;
                case 402: $text = 'Payment Required'; break;
                case 403: $text = 'Forbidden'; break;
                case 404: $text = 'Not Found'; break;
                case 405: $text = 'Method Not Allowed'; break;
                case 406: $text = 'Not Acceptable'; break;
                case 407: $text = 'Proxy Authentication Required'; break;
                case 408: $text = 'Request Time-out'; break;
                case 409: $text = 'Conflict'; break;
                case 410: $text = 'Gone'; break;
                case 411: $text = 'Length Required'; break;
                case 412: $text = 'Precondition Failed'; break;
                case 413: $text = 'Request Entity Too Large'; break;
                case 414: $text = 'Request-URI Too Large'; break;
                case 415: $text = 'Unsupported Media Type'; break;
                case 500: $text = 'Internal Server Error'; break;
                case 501: $text = 'Not Implemented'; break;
                case 502: $text = 'Bad Gateway'; break;
                case 503: $text = 'Service Unavailable'; break;
                case 504: $text = 'Gateway Time-out'; break;
                case 505: $text = 'HTTP Version not supported'; break;
                default:
                    exit('Unknown http status code "' . htmlentities($code) . '"');
                break;
            }

            $protocol = (isset($_SERVER['SERVER_PROTOCOL']) ? $_SERVER['SERVER_PROTOCOL'] : 'HTTP/1.0');
            header($protocol . ' ' . $code . ' ' . $text);
            $GLOBALS['http_response_code'] = $code;
        } else {
            $code = (isset($GLOBALS['http_response_code']) ? $GLOBALS['http_response_code'] : 200);
        }

        return $code;
    }
}

function secure_random_string($len = 1024) {
    // if a secure randomness generator exists and we don't have a buggy PHP version use it.
    if (function_exists('openssl_random_pseudo_bytes') &&
        (version_compare(PHP_VERSION, '5.3.4') >= 0 || substr(PHP_OS, 0, 3) !== 'WIN')) {
        $str = bin2hex(openssl_random_pseudo_bytes(($len / 2) + 1, $strong));
        if ($strong == true)
            return substr($str, 0, $len);
    }
    //collect any entropy available in the system along with a number
    //of time measurements or operating system randomness.
    $str = '';
    $bits_per_round = 2;
    $msec_per_round = 400;
    $hash_len = 20; // SHA-1 Hash length
    $total = ceil($len / 2); // total bytes of entropy to collect
    do {
        $bytes = ($total > $hash_len) ? $hash_len : $total;
        $total -= $bytes;
        //collect any entropy available from the PHP system and filesystem
        $entropy = rand().uniqid(mt_rand(), true);
        $entropy .= implode('', @fstat(fopen(__FILE__, 'r')));
        $entropy .= memory_get_usage();
        if (@is_readable('/dev/urandom') && ($handle = @fopen('/dev/urandom', 'rb'))) {
            $entropy .= @fread($handle, $bytes);@
            fclose($handle);
        } else {
            // Measure the time that the operations will take on average
            for ($i = 0; $i < 3; $i++) {
                $c1 = microtime() * 1000000;
                $var = sha1(mt_rand());
                for ($j = 0; $j < 50; $j++) {
                    $var = sha1($var);
                }
                $c2 = microtime() * 1000000;
                $entropy .= $c1.$c2;
            }
            if ($c1 > $c2) $c2 += 1000000;
            // Based on the above measurement determine the total rounds
            // in order to bound the total running time.
            $rounds = (int)(($msec_per_round / ($c2 - $c1)) * 50);
            // Take the additional measurements. On average we can expect
            // at least $bits_per_round bits of entropy from each measurement.
            $iter = $bytes * (int)(ceil(8 / $bits_per_round));
            for ($i = 0; $i < $iter; $i++)
                {
                    $c1 = microtime();
                    $var = sha1(mt_rand());
                    for ($j = 0; $j < $rounds; $j++) {
                        $var = sha1($var);
                    }
                    $c2 = microtime();
                    $entropy .= $c1.$c2;
                }
        }
        // We assume sha1 is a deterministic extractor for the $entropy variable.
        $str .= sha1($entropy);
    } while ($len > strlen($str));
    return substr($str, 0, $len);
}
