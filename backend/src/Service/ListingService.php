<?php

namespace App\Service;

use App\Entity\ChangeLog;
use App\Entity\Listing;
use App\Filter;
use App\Repository\ChangeLogRepository;
use App\Repository\ListerRepository;
use App\Repository\ListingRepository;
use App\Repository\AdminUsersRepository;
use phpDocumentor\Reflection\Types\Object_;

class ListingService
{
    private $listingRepository;
    private $changelogRepository;
    private $adminUsersRepository;
    private $listerRepository;


    public function __construct(
        ListingRepository $listingRepository,
        ChangeLogRepository $changeLogRepository,
        ListerRepository $listerRepository,
        AdminUsersRepository $adminUsersRepository
    ){
        $this->adminUsersRepository = $adminUsersRepository;
        $this->listerRepository = $listerRepository;
        $this->listingRepository = $listingRepository;
        $this->changelogRepository = $changeLogRepository;
    }

    public  function getGroupByPhone($data, $user) {
        return [
            'phone' => $this->listingRepository->groupByStatus($data, $user, 'phone'),
            'total' => $this->listingRepository->groupByStatus($data, $user, 'phone', 'total')
            ];
    }

    public function findByFilter(Filter $filter, $user)
    {
        $newPhoneNumbers = array();
        if($filter->getSortBy() == "Listings per phone number") {
            $phoneNumbers = $this->listingRepository->groupByStatus($filter, $user, 'phone');
            $startCount = 0;
            //var_dump($phoneNumbers);
            foreach ($phoneNumbers as $key => $value) {
                $startCount = $startCount + $value['count'];

                if ($filter->getStart() <= $startCount) {
                    array_push($newPhoneNumbers, $value['phoneNumber']);
                }
                if (($filter->getStart() + $filter->getLimit()) < $startCount) {
                    break;
                }
            }
        }

        $listings = $this->listingRepository->findByFilter($filter, $user, $newPhoneNumbers);
        $phoneNumbers = array();
        $owners = array();
        foreach ($listings as $key => $value) {
            array_push($phoneNumbers, $value->getPhoneNumber());
        }
        foreach ($listings as $key => $value) {
            array_push($owners, $value->getLister()->getId());
        }
        return [
            'listings' => $listings,
            'total' => $this->listingRepository->getTotalCount($filter, $user   ),
            'groupByPhoneNumber' => $this->listingRepository->getEachPhoneNumberCount($phoneNumbers),
            'allowedCities' => isset($user->isAdmin)? false: $user->getAllowedCities(),
            'groupByOwners' => $this->listingRepository->getGroupByOwners($owners),
            'groupByListingPhone' => $this->listingRepository->getGroupByListingPhone($phoneNumbers),
            'groupByStatus' => $this->listingRepository->groupByStatus($filter, $user),
            'lastScrapeDate' => $this->listingRepository->getLastScrapeDate(),
        ];
    }

    public function findByCity(array $cities)
    {
        return [
            'areas' => $this->listingRepository->findAreaByCity($cities)
        ];
    }

    public function findByLogs(Filter $filter) {
        return [
            "logs" => $this->changelogRepository->findByLogs($filter),
            "totalCount" => $this->changelogRepository->findTotalCount(),
        ];
    }

    public function updateListing(int $listingId, array $data, string $userName, $isAdmin = false)
    {

        if (isset($data['status']) && $data['status'] == "Deleted") {
            $changeLogs = $this->changelogRepository->findByUser($userName);
            $counter = 0;
            foreach ($changeLogs as $key => $value) {
                $changes = $value['changes'];
                if (!empty($changes)) {
                    $changes = json_decode($changes, true);
                    if(isset($changes['status']) && $changes['status']['new'] == "Deleted") {
                        ++$counter;
                    }
                }
            }
            if ($counter >= 20) {
                return "Max delete limit reached, please try tomorrow";
            }
        }

        $listing = $this->listingRepository->find($listingId);
        if (($listing->getAssignedTo() == null || $listing->getAssignedTo() == 'Unassigned')) {
            if ($data['assignedTo']) {
                $count = $this->listingRepository->getAssignedCount($data['assignedTo']);
                if ($count >= 20) {
                    return "Assign count exceeded";
                }
            }
        }
        $changelog = $this->createChangelog($listing, $data, $userName);
        $listing->getLister()->setType($data['lister']['type']);
        $listing->setPrice($data['price']);
        $listing->setPropertyType($data['propertyType']);
        $listing->setArea($data['area']);
        $listing->setCity($data['city']);
        $listing->setAmountBedrooms($data['amountBedrooms']);
        $listing->setPhoneNumber($data['phoneNumber']);
        $listing->setQlRef($data['qlRef']);
        if ($data['assignedTo'] && ($listing->getAssignedTo() == null || $listing->getAssignedTo() == 'Unassigned' || ($isAdmin) )) {
            $listing->setAssignedTo($data['assignedTo']);
            if ($data['assignedTo'] != 'Unassigned') {
                $listing->setAssignedAt(new \DateTime());
            }
        }
        $listing->setStatus($data['status']);
        $listing->setNotes($data['notes']);
        $listing->setDuplicateExternalId($data['duplicateExternalId']);
        $listing->setListingType($data['listingType']);
        if (isset($data['status']) && $data['status'] == "Answered, agent") {
            $lister =  $this->listerRepository->find($listing->getLister());

            $lister->setType('Agent');
            $this->listerRepository->save($lister);
        }

        $this->listingRepository->save($listing);
        if (!empty($changelog)) {
            $this->changelogRepository->store($changelog);

        }


        if (isset($data['notesSelect']) && $data['notesSelect'] === 'Apply for all listing for this lister' && !empty($data['notes'])) {
            $listings = $this->listingRepository->findByPhone($data['phoneNumber'], $listingId);
            foreach ($listings as $key => $value) {
                $listing = $this->listingRepository->find($value['id']);
                if (!empty($listing->getNotes())) {
                    $notes = json_decode($listing->getNotes());
                    $currentNotes = json_decode($data['notes']);
                    $notes->all = $currentNotes->all;
                    $notes = json_encode($notes);
                    $listing->setNotes($notes);
                }
                else {
                    $notes = new \stdClass();
                    $currentNotes = json_decode($data['notes']);
                    $notes->all = $currentNotes->all;
                    $listing->setNotes($data['notes']);
                }
                $this->listingRepository->save($listing);
            }
        }
        if (isset($data['applyToAllListing']) && $data['applyToAllListing'] == true) {
            $listings = $this->listingRepository->findByPhone($data['phoneNumber'], $listingId);
            foreach ($listings as $key => $value) {
                $listing = $this->listingRepository->find($value['id']);
                $listing->setNotes($data['notes']);
                $listing->setStatus($data['status']);
                $this->listingRepository->save($listing);
            }
        }
        return;
    }

    public function delistStaff()
    {
        $this->listingRepository->delistStaff();
    }



    private function createChangelog(Listing $listing, $data, $userName)
    {
        $changed = [];

        if ($listing->getListingType() != $data['listingType']) {
            $changed['listingType']['old'] = $listing->getListingType();
            $changed['listingType']['new'] = $data['listingType'];
        }

        if ($listing->getLister()->getType() != $data['lister']['type']) {
            $changed['listerType']['old'] = $listing->getLister()->getType();
            $changed['listerType']['new'] = $data['lister']['type'];
        }

        if ($listing->getPrice() != $data['price']) {
            $changed['price']['old'] = $listing->getPrice();
            $changed['price']['new'] = $data['price'];
        }

        if ($listing->getPropertyType() != $data['propertyType']) {
            $changed['propertyType']['old'] = $listing->getPropertyType();
            $changed['propertyType']['new'] = $data['propertyType'];
        }

        if ($listing->getArea() != $data['area']) {
            $changed['area']['old'] = $listing->getArea();
            $changed['area']['new'] = $data['area'];
        }

        if ($listing->getPhoneNumber() != $data['phoneNumber']) {
            $changed['phoneNumber']['old'] = $listing->getPhoneNumber();
            $changed['phoneNumber']['new'] = $data['phoneNumber'];
        }

        if ($listing->getListingType() != $data['assignedTo'] && !empty($data['assignedTo'])) {
            $changed['assignedTo']['old'] = $listing->getAssignedTo();
            $changed['assignedTo']['new'] = $data['assignedTo'];
        }

        if ($listing->getStatus() != $data['status']) {
            $changed['status']['old'] = $listing->getStatus();
            $changed['status']['new'] = $data['status'];
        }

        if ($listing->getDuplicateExternalId() != $data['duplicateExternalId']) {
            $changed['duplicateExternalId']['old'] = $listing->getDuplicateExternalId();
            $changed['duplicateExternalId']['new'] = $data['duplicateExternalId'];
        }

        if (empty($changed)) {
            return null;
        }
        $changeLog = new ChangeLog();
        $changeLog->setListing($listing);
        $changeLog->setCreatedAt(new \DateTime());
        $changeLog->setChanges(json_encode($changed));
        $changeLog->setChangedBy($userName);

        return $changeLog;
    }

    public function getOwnershipStatistics()
    {
        $data = $this->listingRepository->getOwnershipStatistics();

        $ret = [
            'totals' => [
                'total' => [
                    'num' => 0,
                    'agent' => 0,
                    'agentPct' => 0,
                    'owner' => 0,
                    'ownerPct' => 0,
                    'developer' => 0,
                    'developerPct' => 0,
                ],
            ],
        ];

        foreach ($data as $d) {
            $ret['totals']['total']['num'] += $d['num'];

            if ($d['type'] === 'Agent') {
                $ret['totals']['total']['agent'] += $d['num'];
            }

            if ($d['type'] === 'Owner') {
                $ret['totals']['total']['owner'] += $d['num'];
            }

            if ($d['type'] === 'Developer') {
                $ret['totals']['total']['developer'] += $d['num'];
            }

            if (!isset($ret['totals'][$d['listingType']])) {
                $ret['totals'][$d['listingType']] = [
                    'num' => 0,
                    'agent' => 0,
                    'agentPct' => 0,
                    'owner' => 0,
                    'ownerPct' => 0,
                    'developer' => 0,
                    'developerPct' => 0,
                ];
            }

            $ret['totals'][$d['listingType']]['num'] += $d['num'];

            if ($d['type'] === 'Agent') {
                $ret['totals'][$d['listingType']]['agent'] += $d['num'];
            }

            if ($d['type'] === 'Owner') {
                $ret['totals'][$d['listingType']]['owner'] += $d['num'];
            }

            if ($d['type'] === 'Developer') {
                $ret['totals'][$d['listingType']]['developer'] += $d['num'];
            }

            $ret['totals'][$d['listingType']]['agentPct'] = round($ret['totals'][$d['listingType']]['agent'] / $ret['totals'][$d['listingType']]['num'] * 100);
            $ret['totals'][$d['listingType']]['ownerPct'] = round($ret['totals'][$d['listingType']]['owner'] / $ret['totals'][$d['listingType']]['num'] * 100);
            $ret['totals'][$d['listingType']]['developerPct'] = round($ret['totals'][$d['listingType']]['developer'] / $ret['totals'][$d['listingType']]['num'] * 100);

            if (!isset($ret[$d['city']][$d['listingType']])) {
                $ret[$d['city']][$d['listingType']] = [
                    'num' => 0,
                    'agent' => 0,
                    'agentPct' => 0,
                    'owner' => 0,
                    'ownerPct' => 0,
                    'developer' => 0,
                    'developerPct' => 0,
                ];
            }

            $ret[$d['city']][$d['listingType']]['num'] += $d['num'];

            if ($d['type'] === 'Agent') {
                $ret[$d['city']][$d['listingType']]['agent'] += $d['num'];
            }

            if ($d['type'] === 'Owner') {
                $ret[$d['city']][$d['listingType']]['owner'] += $d['num'];
            }

            if ($d['type'] === 'Developer') {
                $ret[$d['city']][$d['listingType']]['developer'] += $d['num'];
            }

            $ret[$d['city']][$d['listingType']]['agentPct'] = round($ret[$d['city']][$d['listingType']]['agent'] / $ret[$d['city']][$d['listingType']]['num'] * 100);
            $ret[$d['city']][$d['listingType']]['ownerPct'] = round($ret[$d['city']][$d['listingType']]['owner'] / $ret[$d['city']][$d['listingType']]['num'] * 100);
            $ret[$d['city']][$d['listingType']]['developerPct'] = round($ret[$d['city']][$d['listingType']]['developer'] / $ret[$d['city']][$d['listingType']]['num'] * 100);
        }

        $ret['totals']['total']['agentPct'] = round($ret['totals']['total']['agent'] / $ret['totals']['total']['num'] * 100);
        $ret['totals']['total']['ownerPct'] = round($ret['totals']['total']['owner'] / $ret['totals']['total']['num'] * 100);
        $ret['totals']['total']['developerPct'] = round($ret['totals']['total']['developer'] / $ret['totals']['total']['num'] * 100);

        return $ret;
    }

    public function getAveragePriceStatistics($listingType)
    {
        $data = $this->listingRepository->getPriceStatistics($listingType);
        $ret = [];

        foreach ($data as $d) {
            if (!isset($ret[$d['propertyType']])) {
                $ret[$d['propertyType']] = [
                    'totals' => [
                        'all' => [
                            'sum' => $d['averagePrice'],
                            'num' => 1,
                            'avg' => round($d['averagePrice']),
                        ]
                    ],
                ];
            } else {
                $ret[$d['propertyType']]['totals']['all']['sum'] += $d['averagePrice'];
                $ret[$d['propertyType']]['totals']['all']['num'] += 1;
                $ret[$d['propertyType']]['totals']['all']['avg'] = round($ret[$d['propertyType']]['totals']['all']['sum'] / $ret[$d['propertyType']]['totals']['all']['num']);
            }

            if (!isset($ret[$d['propertyType']]['totals'][$d['amountBedrooms']])) {
                $ret[$d['propertyType']]['totals'][$d['amountBedrooms']] = [
                    'sum' => $d['averagePrice'],
                    'num' => 1,
                    'avg' => round($d['averagePrice']),
                ];
            } else {
                $ret[$d['propertyType']]['totals'][$d['amountBedrooms']]['sum'] += $d['averagePrice'];
                $ret[$d['propertyType']]['totals'][$d['amountBedrooms']]['num'] += 1;
                $ret[$d['propertyType']]['totals'][$d['amountBedrooms']]['avg'] = round($ret[$d['propertyType']]['totals'][$d['amountBedrooms']]['sum'] / $ret[$d['propertyType']]['totals'][$d['amountBedrooms']]['num']);
            }

            if (!isset($ret[$d['propertyType']][$d['city']])) {
                $ret[$d['propertyType']][$d['city']] = [
                    'all' => [
                        'sum' => $d['averagePrice'],
                        'num' => 1,
                        'avg' => round($d['averagePrice']),
                    ]
                ];
            } else {
                $ret[$d['propertyType']][$d['city']]['all']['sum'] += $d['averagePrice'];
                $ret[$d['propertyType']][$d['city']]['all']['num'] += 1;
                $ret[$d['propertyType']][$d['city']]['all']['avg'] = round($ret[$d['propertyType']][$d['city']]['all']['sum'] / $ret[$d['propertyType']][$d['city']]['all']['num']);
            }

            $ret[$d['propertyType']][$d['city']][$d['amountBedrooms']] = round($d['averagePrice']);
        }

        return $ret;
    }

    public function getAveragePriceStatisticsDataPoints($listingType)
    {
        $data = $this->listingRepository->getPriceStatisticsDataPoints($listingType);
        $allData = $this->listingRepository->getAllPriceStatisticsDataPoints($listingType);
        $dataNoBedrooms = $this->listingRepository->getPriceStatisticsDataNoBedrooms($listingType);
        $dataAllNoBedrooms = $this->listingRepository->getAllPriceStatisticsDataNoBedrooms($listingType);

        $ret = [];
        //$ret['All']['data'][]
        //var_dump($dataAllNoBedrooms);
        foreach ($dataAllNoBedrooms as $dp) {
            $d = $this->formatDate($dp['monthYear']);

            $ret['All']['data']['all'][$dp['monthYear']][$dp['city']] = round($dp['averagePrice']);
            $ret['All']['data']['all'][$dp['monthYear']]['name'] = $d;
        }
        foreach ($allData as $dp) {
            $d = $this->formatDate($dp['monthYear']);

            $ret['All']['data'][$dp['amountBedrooms']][$dp['monthYear']][$dp['city']] = round($dp['averagePrice']);
            $ret['All']['data'][$dp['amountBedrooms']][$dp['monthYear']]['name'] = $d;

//            $ret[$dp['propertyType']]['data'][$dp['amountBedrooms']][] = [l
//                $dp['city'] => round($dp['averagePrice']),
//                'name' => $this->formatDate($dp['monthYear']),
//            ];

            if (!isset($ret['All']['cities']) || !in_array($dp['city'], $ret['All']['cities'])) {
                $ret['All']['cities'][] = $dp['city'];
            }
        }
        foreach ($dataNoBedrooms as $dp) {
            $d = $this->formatDate($dp['monthYear']);

            $ret[$dp['propertyType']]['data']['all'][$dp['monthYear']][$dp['city']] = round($dp['averagePrice']);
            $ret[$dp['propertyType']]['data']['all'][$dp['monthYear']]['name'] = $d;
        }

        foreach ($data as $dp) {
            $d = $this->formatDate($dp['monthYear']);

            $ret[$dp['propertyType']]['data'][$dp['amountBedrooms']][$dp['monthYear']][$dp['city']] = round($dp['averagePrice']);
            $ret[$dp['propertyType']]['data'][$dp['amountBedrooms']][$dp['monthYear']]['name'] = $d;

//            $ret[$dp['propertyType']]['data'][$dp['amountBedrooms']][] = [l
//                $dp['city'] => round($dp['averagePrice']),
//                'name' => $this->formatDate($dp['monthYear']),
//            ];

            if (!isset($ret[$dp['propertyType']]['cities']) || !in_array($dp['city'], $ret[$dp['propertyType']]['cities'])) {
                $ret[$dp['propertyType']]['cities'][] = $dp['city'];
            }
        }



        return $ret;
    }

    public function getListingStatisticsDataPoints($listingType) {
        $data = $this->listingRepository->getListingStatisticsDataPoints($listingType);
        $allData = $this->listingRepository->getAllListingStatisticsDataPoints($listingType);
        $results = [];
        foreach ($allData as $d) {
            $real_monthname = "Jan";
            if ($d['month'] == '1') {
                $real_monthname = "Jan";
            }
            else if ($d['month'] == '2') {
                $real_monthname = "Feb";
            }
            else if ($d['month'] == '3') {
                $real_monthname = "Mar";
            }
            else if ($d['month'] == '4') {
                $real_monthname = "Apr";
            }
            else if ($d['month'] == '5') {
                $real_monthname = "May";
            }
            else if ($d['month'] == '6') {
                $real_monthname = "Jun";
            }
            else if ($d['month'] == '7') {
                $real_monthname = "Jul";
            }
            else if ($d['month'] == '8') {
                $real_monthname = "Aug";
            }
            else if ($d['month'] == '9') {
                $real_monthname = "Sep";
            }
            else if ($d['month'] == '10') {
                $real_monthname = "Oct";
            }
            else if ($d['month'] == '11') {
                $real_monthname = "Nov";
            }
            else if ($d['month'] == '12') {
                $real_monthname = "Dec";
            }
            $results['All']['data'][$d['name']][$d['city']] = $d['listCount'];
            $results['All']['data'][$d['name']]['name'] = $real_monthname. ' '.$d['year'];
            if (!isset($results['All']['cities']) || !in_array($d['city'], $results['All']['cities'])) {
                $results['All']['cities'][] = $d['city'];
            }
        }
        foreach ($data as $d) {
            $real_monthname = "Jan";
            if ($d['month'] == '1') {
                $real_monthname = "Jan";
            }
            else if ($d['month'] == '2') {
                $real_monthname = "Feb";
            }
            else if ($d['month'] == '3') {
                $real_monthname = "Mar";
            }
            else if ($d['month'] == '4') {
                $real_monthname = "Apr";
            }
            else if ($d['month'] == '5') {
                $real_monthname = "May";
            }
            else if ($d['month'] == '6') {
                $real_monthname = "Jun";
            }
            else if ($d['month'] == '7') {
                $real_monthname = "Jul";
            }
            else if ($d['month'] == '8') {
                $real_monthname = "Aug";
            }
            else if ($d['month'] == '9') {
                $real_monthname = "Sep";
            }
            else if ($d['month'] == '10') {
                $real_monthname = "Oct";
            }
            else if ($d['month'] == '11') {
                $real_monthname = "Nov";
            }
            else if ($d['month'] == '12') {
                $real_monthname = "Dec";
            }
            $results[$d['propertyType']]['data'][$d['name']][$d['city']] = $d['listCount'];
            $results[$d['propertyType']]['data'][$d['name']]['name'] = $real_monthname. ' '.$d['year'];
            if (!isset($results[$d['propertyType']]['cities']) || !in_array($d['city'], $results[$d['propertyType']]['cities'])) {
                $results[$d['propertyType']]['cities'][] = $d['city'];
            }
        }
        //var_dump($results);
        return $results;
    }

    private function formatDate($input)
    {
        return substr($input, 0, 4) . '-' . substr($input, 4, 2);
    }

    public function getStaffListingStatus($data) {
        return $this->listingRepository->getStaffListingStatus($data);
    }
    public function getGroupByListing($data) {
        return [
            'listings' => $this->listingRepository->getGroupByListing($data, false),
            'total' => $this->listingRepository->getGroupByListing($data, true)
        ];
    }



}