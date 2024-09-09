<?php


namespace App\Command;

use App\Entity\Lister;
use App\Entity\Listing;
use App\Entity\Thumbnail;
use App\Repository\ListerRepository;
use App\Repository\ListingRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

ini_set('memory_limit', '4095M');

class ImportJsonCommand extends Command
{
    protected static $defaultName = 'app:import-json';

    private $entityManager;
    private $listerRepository;
    private $listingRepository;

    public function __construct(
        EntityManagerInterface $entityManager,
        ListerRepository $listerRepository,
        ListingRepository $listingRepository
    ){
        $this->entityManager = $entityManager;
        $this->listerRepository = $listerRepository;
        $this->listingRepository = $listingRepository;
        parent::__construct();
    }

    protected function configure()
    {
        $this->addArgument("json_file");
    }


    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $this->entityManager->beginTransaction();
        $jsonFile = json_decode(file_get_contents($input->getArgument('json_file')), true);
        $listers = [];

        $allListers = $this->listerRepository->findAll();

        foreach ($allListers as $lister) {
            $listers[$lister->getName()] = $lister;
        }

        $newListers = 0;
        $imported = 0;
        $skipped = 0;

        foreach ($jsonFile['items'] as $externalId => $item) {
            if (!is_null($this->listingRepository->findOneBy(['externalId' => $externalId]))) {
                $skipped++;
                continue;
            }

            if (!isset($item['listing_type'])) {
                $skipped++;
                continue;
            }

            $output->writeln('Importing: ' . $externalId);

            $listing = new Listing();

            if (strlen($item['district']) > 255) {
                $item['district'] = '-';
            }

            $lister = isset($listers[$item['user']]) ? $listers[$item['user']] : null;

            if (is_null($lister)) {
                $lister = new Lister();
                $lister->setName($item['user']);
                $lister->setType($item['owner']);

                $this->entityManager->persist($lister);
                $listers[$item['user']] = $lister;

                $newListers++;
            }

            if (!isset($item['area_size'])) {
                $item['area_size'] = 0;
            }

            $listing
                ->setExternalId($externalId)
                ->setTitle($item['title'])
                ->setCity($item['city'])
                ->setArea($item['district'])
                ->setZipCode(intval($item['post_code']))
                ->setPropertyType($item['type'])
                ->setAmountBedrooms(intval($item['bedrooms']))
                ->setAmountBathrooms(intval($item['bathrooms']))
                ->setDescription($item['description'])
                ->setPrice(intval($item['price']))
                ->setLister($lister)
                ->setPhoneNumber($item['phone'])
                ->setBazarakiUrl($item['url'])
                ->setLat($item['latitude'])
                ->setLon($item['longitude'])
                ->setDateAdded(new \DateTime($item['date_added']))
                ->setStatus('Follow up')
                ->setIngestedAt(new \DateTime())
                ->setAreaSize(intval($item['area_size']))
                ->setListingType($item['listing_type']);

            if ($listing->getListingType() == 'commercial_sale') {
                $listing->setPropertyCondition($item['condition'] ?? null);
                $listing->setCommercialPropertyType($item['comm_type']);
            }

            if ($listing->getListingType() == 'sale') {
                $listing->setPropertyCondition($item['condition'] ?? null);
            }

            foreach ($item['images'] as $path) {
                $thumbnail = new Thumbnail();
                $thumbnail->setPath($path);
                $thumbnail->setListing($listing);

                $this->entityManager->persist($thumbnail);
            }

            $this->entityManager->persist($listing);
            $imported++;
            unset($listing);
        }

        $this->entityManager->commit();
        $this->entityManager->flush();

        $output->writeln(sprintf("Imported %d new listings, skipped %d that already existed", $imported, $skipped));
        $output->writeln(sprintf("Imported %d new owners/agents", $newListers));
        return 0;
    }
}