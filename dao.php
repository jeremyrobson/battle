<?php

class GameDB extends mysqli {

    public $conn;

    public function __construct() {
        @parent::__construct("localhost", "root", "asdfasdf", "battledb", "3306", false);

        if (mysqli_connect_errno()) {
            throw new exception(mysqli_connect_error(), mysqli_connect_errno()); 
        }
    }

    public static function singleton() {
        return new GameDB();
    }

    public function query($query) {
        if (!$this->real_query($query)) {
            throw new exception($this->error, $this->errno);
        }

        $result = new mysqli_result($this);
        return $result;
    }


}



?>