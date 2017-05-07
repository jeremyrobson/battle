<?php

require_once("dao.php");

class GameAPI {
    public static function getJobActions() {
        $dao = GameDB::singleton();
        $result = $dao->query("
            SELECT * FROM BattleAction
            INNER JOIN JobClass_BattleAction USING (action_id)
            INNER JOIN BattleSpread USING (spread_id)
        ");

        $jobactions = array();

        while ($row = $result->fetch_array()) {
            $jobclass_id = intval($row["jobclass_id"]);
            $jobactions[$jobclass_id][] = array(
                "action_id" => intval($row["action_id"]),
                "spread_id" => intval($row["spread_id"]),
                "name" => $row["name"],
                "type" => $row["type"],
                "speed" => intval($row["speed"]),
                "range" => intval($row["range"]),
                "power" => intval($row["power"]),
                "spread" => json_decode($row["spread"])
            );
        }

        return $jobactions;
    }

    public static function getJobs() {
        $dao = GameDB::singleton();
        $result = $dao->query("
            SELECT * FROM JobClass
        ");

        $jobs = array();
        $jobactions = GameAPI::getJobActions();

        while ($row = $result->fetch_array()) {
            $jobclass_id = intval($row["jobclass_id"]);

            $jobs[$jobclass_id] = array(
                "jobclass_id" => intval($jobclass_id),
                "name" => $row["name"],
                "actions" => @$jobactions[$jobclass_id]
            );
        }
        
        return $jobs;
    }

    public static function getUnits() {
        $dao = GameDB::singleton();
        $result = $dao->query("
            SELECT * FROM BattleUnit
            LEFT JOIN Party ON BattleUnit.party_id = Party.party_id
        ");

        $units = array();
        $jobs = GameAPI::getJobs();

        while ($row = $result->fetch_array()) {
            $unit_id = intval($row["unit_id"]);
            $units[$unit_id] = array(
                "unit_id" => $unit_id,
                "jobclass_id" => intval($row["jobclass_id"]),
                "party_id" => intval( $row["party_id"]),
                "user_id" => intval($row["user_id"]),
                "color" => $row["color"],
                "sprite" => intval($row["sprite"]),
                "job" => @$jobs[intval($row["jobclass_id"])]
            );
        }

        return $units;
    }
}

?>