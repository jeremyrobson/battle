<?php

error_reporting(E_ALL);
ini_set('display_errors', '1');

require_once("GameAPI.php");

function requestRouter() {

    $action = $_GET["action"];
    $entity = $_GET["entity"];
    $data = array();

    switch ($entity) {
        case "units":
            $data = GameAPI::getUnits();
            break;
    }

    echo json_encode(array_values($data));
}

requestRouter();

?>

