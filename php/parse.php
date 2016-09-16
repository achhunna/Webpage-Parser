<?php

$url = urldecode($_POST["url"]);
echo file_get_contents($url);

?>
