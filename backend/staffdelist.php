<?php


require __DIR__ . '/vendor/autoload.php';
use SendGrid\Mail\Mail;




$dotenvs = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenvs->load();
$mysqli = mysqli_connect($_ENV['DATABASE_HOST'], $_ENV['DATABASE_USER'], $_ENV['DATABASE_PASSWORD'], $_ENV['DATABASE_DB'], $_ENV['DATABASE_PORT']);

if (!$mysqli) {
    die("Connection failed: " . mysqli_connect_error());
}
echo "Connected Successfully.";

$date = new \DateTime();
$date->modify('-72 hour');
$date = $date->format('Y-m-d H:i:s');
function resultToArray($result) {
    $rows = array();
    while($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
    return $rows;
}

$statusArr = array('Follow up', 'No answer, try again later');
$query = "select id from listing where DATE(assigned_at) <= '".$date."'";
$query = $query."and status IN ('Follow up', 'No answer, try again later')";
$result = $mysqli->query($query);
$result = resultToArray($result);
$ids = array();
if (sizeof($result) > 0) {
    foreach ($result as $value) {
        array_push($ids, $value['id']);
    }
    $query = "UPDATE listing set assigned_to = 'Unassigned', assigned_at = null WHERE id IN (".implode(',',$ids).")";
    $result = $mysqli->query($query);
    //$result = $result->fetch_assoc();
}