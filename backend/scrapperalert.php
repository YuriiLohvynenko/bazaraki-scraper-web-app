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
$query = "select max(ingested_at) from listing limit 2";

$result = $mysqli->query($query);
$result = $result->fetch_row();
$lastScraperDate = $result[0];
$lastDate = new \DateTime($result[0]);
$d = strtotime("-1 hour");
$date = new \DateTime(date("Y-m-d h:m:i", $d));
$interval = $date->diff($lastDate);
$interval = ($interval->days * 24) + $interval->h;


$email = new Mail();
$email->setFrom("gsm.drg1990@hotmail.com");
$email->setSubject("Scraper alert!");
$email->addTo("mh8936000@gmail.com");
$email->addContent(
    "text/html", '<p>Last scrapped date was  at: </p>' . $lastScraperDate
);
$sendgrid = new \SendGrid($_ENV['SENDGRID_KEY']);
try {
    $response = $sendgrid->send($email);
    print $response->statusCode() . "\n";
    print_r($response->headers());
    print $response->body() . "\n";
} catch (Exception $e) {
    echo 'Caught exception: '. $e->getMessage() ."\n";
}