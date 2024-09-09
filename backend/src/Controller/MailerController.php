<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use App\Repository\ListingRepository;

use Symfony\Component\Routing\Annotation\Route;


class MailerController extends AbstractController
{
    private $listingRepository;
    public function __construct(
        ListingRepository $listingRepository
    ){
        $this->listingRepository = $listingRepository;
    }

    /**
     * @Route("/scrapperalert")
     */
    public function sendEmail(MailerInterface $mailer)
    {
        $lastScraperDate = $this->listingRepository->getLastScrapeDate();
        $lastDate = new \DateTime($lastScraperDate);
        $d = strtotime("-1 hour");
        $date = new \DateTime(date("Y-m-d h:m:i", $d));
        $interval = $date->diff($lastDate);
        $interval = ($interval->days * 24) + $interval->h;

        $email = (new Email())
            ->from('gsm.drg1990@hotmail.com')
            ->to('mh8936000@gmail.com')
            //->cc('cc@example.com')
            //->bcc('bcc@example.com')
            //->replyTo('fabien@example.com')
            //->priority(Email::PRIORITY_HIGH)
            ->subject('Scraper alert!')
            //->text('Last scrapped date was!')
            ->html('<p>Last scrapped date was : </p>' . $lastScraperDate);
        if ($interval > 1) {
            $mailer->send($email);
        }
        return new JsonResponse([], 200);

        // ...
    }
}
