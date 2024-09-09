<?php

namespace App\Repository;

use App\Entity\ChangeLog;
use App\Entity\Listing;
use App\Entity\Thumbnail;
use App\Filter;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Collections\Criteria;
use Doctrine\Persistence\ManagerRegistry;
use phpDocumentor\Reflection\File;

/**
 * @method Listing|null find($id, $lockMode = null, $lockVersion = null)
 * @method Listing|null findOneBy(array $criteria, array $orderBy = null)
 * @method Listing[]    findAll()
 * @method Listing[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ListingRepository extends ServiceEntityRepository
{
    private $listerRepository;
    private $adminUsersRepository;

    public function __construct(ManagerRegistry $registry, ListerRepository $listerRepository, AdminUsersRepository $adminUsersRepository)
    {
        $this->adminUsersRepository = $adminUsersRepository;
        $this->listerRepository = $listerRepository;
        parent::__construct($registry, Listing::class);
    }

    private function buildCriteria(Filter $filter, $user, $newPhoneNumbers = array())
    {

        $criteria = new Criteria();
        //$criteria->
        if (!empty($filter->getPropertyType())) {
            $criteria->andWhere(Criteria::expr()->eq('propertyType', $filter->getPropertyType()));
        }
        if (!empty($filter->getBid())) {
            $criteria->andWhere(Criteria::expr()->eq('externalId', $filter->getBid()));
        }

        if (!empty($filter->getId())) {
            $criteria->andWhere(Criteria::expr()->eq('id', $filter->getId()));
        }

        if (!empty($filter->getListedByType())) {
            $listers = $this->listerRepository->findBy(['type' => $filter->getListedByType()]);
            $criteria->andWhere(Criteria::expr()->in('lister', $listers));
        }

        if (!empty($filter->getCities())) {
            $criteria->andWhere(Criteria::expr()->in('city', $filter->getCities()));
        }

        if (!empty($filter->getAreas())) {
            $criteria->andWhere(Criteria::expr()->in('area', $filter->getAreas()));
        }

        if (!empty($filter->getPhone())) {
            $criteria->andWhere(Criteria::expr()->contains('phoneNumber', $filter->getPhone()));
        }

        if (!empty($filter->getMinPrice())) {
            $criteria->andWhere(Criteria::expr()->gte('price', $filter->getMinPrice()));
        }

        if (!empty($filter->getMaxPrice())) {
            $criteria->andWhere(Criteria::expr()->lte('price', $filter->getMaxPrice()));
        }

        if (!empty($filter->getStatus())) {
            $criteria->andWhere(Criteria::expr()->in('status', $filter->getStatus()));
        }

        if (!$filter->isAllowDuplicates()) {
            $criteria->andWhere(Criteria::expr()->isNull('duplicateExternalId'));
        }

        if (!empty($filter->getAssignedTo())) {
            $assignedTo = $filter->getAssignedTo();
            if (in_array("Unassigned", $assignedTo)) {
                $assignedTo[] = NULL; //array_push($assignedTo, '');
                //$criteria->orWhere(Criteria::expr()->isNull('assignedTo'));
                $criteria->andWhere($criteria::expr()->orX(
                    Criteria::expr()->isNull('assignedTo'),
                    Criteria::expr()->in('assignedTo', $assignedTo)
                ));
            }
            else{
                $criteria->andWhere(Criteria::expr()->in('assignedTo', $assignedTo));
            }
        }

        if (!empty($filter->getBedrooms())) {
            $criteria->andWhere(Criteria::expr()->in('amountBedrooms', $filter->getBedrooms()));
        }
        if (!empty($filter->getBathrooms())) {
            $criteria->andWhere(Criteria::expr()->in('amountBathrooms', $filter->getBathrooms()));
        }
        if (!isset($user->isAdmin) && !empty($user->getAllowedCities()) && empty($filter->getPhone())) {
            $allowedCities = explode(',', $user->getAllowedCities());
            $criteria->andWhere(Criteria::expr()->in('city', $allowedCities));
        }

        if (!empty($newPhoneNumbers)) {
            $criteria->andWhere(Criteria::expr()->in('phoneNumber', $newPhoneNumbers));
        }

        if (!empty($filter->getListingType())) {
            $criteria->andWhere(Criteria::expr()->in('listingType', $filter->getListingType()));
        }

        return $criteria;
    }

    public function findAreaByCity($cities) {
        $query = $this->createQueryBuilder('l')
            ->select('count(l.area) as num, l.area')
            ->andWhere('l.area IS NOT NULL')
            ->andWhere('l.area != \'\'')
            ->groupBy('l.area');
        if (!empty($cities)) {
            $query->andWhere('l.city in(:cities)');
            $query->setParameter("cities", $cities);
        }
        return $query->getQuery()->getArrayResult();
    }

    public function findByPhone($phone, $listingId) {
        $query = $this->createQueryBuilder('l')
            ->select('l')
            ->andWhere('l.phoneNumber = :phone')
            ->andWhere('l.id != :id')
            ->setParameter('id', $listingId)
            ->setParameter(':phone', $phone);
        return $query->getQuery()->getArrayResult();
    }

    public function findByFilter(Filter $filter, $user, $newPhoneNumbers = array())
    {
        $sortBy = 'id';
        $sortType = 'DESC';

        $criteria = $this->buildCriteria($filter, $user, $newPhoneNumbers);

        $criteria->setFirstResult($filter->getStart());
        $criteria->setMaxResults($filter->getLimit());
        if($filter->getSortBy() == "Listing Date") {
            $sortBy = 'ingested_at';
        }
        if($filter->getSortBy() == "Price") {
            $sortBy = 'price';
        }
        if($filter->getSortBy() == "Listings per phone number") {
        //    $sortBy = 'phoneNumber';
        }
        if($filter->getSortType() == "ascending") {
            $sortType = 'ASC';
        }
        $criteria->orderBy([$sortBy => $sortType]);

        return $this->matching($criteria);




    }

    public function groupByStatus(Filter $filter, $user, $type = null, $required = null)
    {
        $query = $this->createQueryBuilder('l');

        if ($type ==='phone') {
            if($required === 'total') {
                $query->select('COUNT(DISTINCT(l.phoneNumber)) as total');

            }
            else{
                $query->select('COUNT(l.phoneNumber) as count, l.phoneNumber, lr.name');
                $query->leftJoin('l.lister', 'lr');
                $query->groupBy('l.phoneNumber');
            }

        }
        else{
            $query->select('count(l.status) as num, l.status');
            $query->groupBy('l.status');
        }


        if (!empty($filter->getPropertyType())) {
            $query->andWhere('l.propertyType = :propertyType');
            $query->setParameter('propertyType', $filter->getPropertyType());
        }
        if (!empty($filter->getId())) {
            $query->andWhere('l.id = :id');
            $query->setParameter('id', $filter->getId());
        }

        if (!empty($filter->getBid())) {
            $query->andWhere('l.externalId = :id');
            $query->setParameter('id', $filter->getBid());
        }
        if (!empty($filter->getListedByType())) {
            $listers = $this->listerRepository->findBy(['type' => $filter->getListedByType()]);
            $query->andWhere(('l.lister in(:lister)'));
            $query->setParameter('lister', $listers);
        }

        if (!empty($filter->getCities())) {
            $query->andWhere('l.city in(:cities)');
            $query->setParameter('cities', $filter->getCities());

        }

        if (!empty($filter->getPhone())) {
            $query->andWhere('l.phoneNumber = :phoneNumber');
            $query->setParameter('phoneNumber', $filter->getPhone());
        }

        if (!empty($filter->getMinPrice())) {
            $query->andWhere('l.price >= :minPrice');
            $query->setParameter('minPrice', $filter->getMinPrice());
        }

        if (!empty($filter->getMaxPrice())) {
            $query->andWhere('l.price <= :maxPrice');
            $query->setParameter('maxPrice', $filter->getMaxPrice());

        }

        if (!empty($filter->getStatus())) {
            $query->andWhere('l.status in(:status)');
            $query->setParameter('status', $filter->getStatus());
        }

        if (!$filter->isAllowDuplicates()) {
            $query->andWhere('l.duplicateExternalId IS NULL');
        }

        if (!empty($filter->getAssignedTo())) {
            $query->andWhere('l.assignedTo in(:assignedTo)');
            $query->setParameter('assignedTo', $filter->getAssignedTo());
        }

        if (!empty($filter->getBedrooms())) {
            $query->andWhere('l.amountBedrooms in(:bedrooms)');
            $query->setParameter('bedrooms', $filter->getBedrooms());
        }

        if (!empty($filter->getBathrooms())) {
            $query->andWhere('l.amountBathrooms in(:bathrooms)');
            $query->setParameter('bathrooms', $filter->getBathrooms());
        }
        if (!isset($user->isAdmin) && !empty($user->getAllowedCities())) {
            $allowedCities = explode(',', $user->getAllowedCities());
            $query->andWhere('l.city in(:cities1)');
            $query->setParameter('cities1', $allowedCities);
        }
        if (!empty($filter->getListingType())) {
            $query->andWhere('l.listingType in(:listingType)');
            $query->setParameter('listingType', $filter->getListingType());
        }

        if ($type === 'phone') {

            $sortType = 'DESC';

            if($filter->getSortType() == "ascending") {
                $sortType = 'ASC';
            }
            if ($required !== 'total') {
                $query->setFirstResult($filter->getStart());
                $query->setMaxResults($filter->getLimit());
                $query->orderBy('count' , $sortType);
            }

        }
        if ($required === 'total') {
            return $query->getQuery()->getSingleScalarResult();
        }
        return $query->getQuery()->getArrayResult();
    }

    public function getTotalCount(Filter $filter, $user)
    {
        return $this->createQueryBuilder('l')
            ->select('count(l.id)')
            ->addCriteria($this->buildCriteria($filter, $user))
            ->getQuery()
            ->getSingleScalarResult();
    }

    public function getEachPhoneNumberCount ($phoneNumber) {
        return $this->createQueryBuilder('l')
            ->select('count(l.phoneNumber) as num, l.phoneNumber')
            ->groupBy('l.phoneNumber')
            ->andWhere('l.phoneNumber in(:phoneNumber)')
            ->setParameter('phoneNumber', $phoneNumber)
            ->getQuery()
            ->getArrayResult();
    }

    public function getLastScrapeDate()
    {
        return $this->createQueryBuilder('l')
            ->select('max(l.ingestedAt)')
            ->getQuery()
            ->getSingleScalarResult();
    }

    public function save(Listing $listing)
    {
        $em = $this->getEntityManager();
        $em->persist($listing);
        $em->flush();
    }

    public function getOwnershipStatistics()
    {
        return $this->createQueryBuilder('l')
            ->leftJoin('l.lister', 'lr')
            ->select('count(l.id) as num, lr.type, l.city, l.listingType')
            ->groupBy('lr.type, l.city, l.listingType')
            ->andWhere('l.duplicateExternalId IS NULL')
            ->andWhere('l.status != :deleted')
            ->setParameter('deleted', "Deleted")
            ->getQuery()
            ->getArrayResult();
    }

    public function getPriceStatistics($listingType)
    {
        return $this->createQueryBuilder('l')
            ->leftJoin('l.lister', 'lr')
            ->select(' avg(l.price) as averagePrice, l.propertyType, l.city, l.amountBedrooms, l.listingType')
            ->groupBy('l.propertyType, l.city, l.listingType, l.amountBedrooms')
            ->andWhere('l.duplicateExternalId IS NULL')
            ->andWhere('l.city IS NOT NULL')
            ->andWhere('l.city != \'\'')
            ->andWhere('l.status != :deleted')
            ->setParameter('deleted', "Deleted")
            ->andWhere('l.listingType = :listingType')
            ->setParameter('listingType', $listingType)
            ->getQuery()
            ->getArrayResult();
    }

    public function getPriceStatisticsDataPoints($listingType)
    {
        // SELECT avg(price), city, property_type, amount_bedrooms, EXTRACT(YEAR_MONTH FROM l.date_added) as date_month FROM `listing` l WHERE duplicate_external_id is null and listing_type = 'rental' group by EXTRACT(YEAR_MONTH FROM l.date_added), city, property_type, amount_bedrooms

        $query = $this->createQueryBuilder('l')
            ->select(' avg(l.price) as averagePrice, l.propertyType, l.city, l.amountBedrooms, l.listingType, EXTRACT(YEAR_MONTH FROM l.dateAdded) as monthYear')
            ->groupBy('l.propertyType, l.city, l.listingType, l.amountBedrooms, monthYear')
            ->andWhere('l.duplicateExternalId IS NULL')
            ->andWhere('l.city IS NOT NULL')
            ->andWhere('l.city != \'\'')
            ->andWhere('l.listingType = :listingType')
            ->andWhere('l.status != :deleted')
            ->setParameter('deleted', "Deleted")
            ->andWhere('l.dateAdded > DATE_SUB(CURRENT_DATE(), 1, \'YEAR\')')
            ->setParameter('listingType', $listingType)
            ->orderBy('monthYear', 'ASC');

        if ($listingType === "rental") {
            $query->andWhere('l.price < 30000');
        }

        if ($listingType === 'sale') {
            $query->andWhere('l.price > 10000');
        }

        return $query->getQuery()->getArrayResult();
    }

    public function getAllPriceStatisticsDataPoints($listingType)
    {
        // SELECT avg(price), city, property_type, amount_bedrooms, EXTRACT(YEAR_MONTH FROM l.date_added) as date_month FROM `listing` l WHERE duplicate_external_id is null and listing_type = 'rental' group by EXTRACT(YEAR_MONTH FROM l.date_added), city, property_type, amount_bedrooms

        $query = $this->createQueryBuilder('l')
            ->select(' avg(l.price) as averagePrice, l.city, l.amountBedrooms, l.listingType, EXTRACT(YEAR_MONTH FROM l.dateAdded) as monthYear')
            ->groupBy('l.city, l.listingType, l.amountBedrooms, monthYear')
            ->andWhere('l.duplicateExternalId IS NULL')
            ->andWhere('l.city IS NOT NULL')
            ->andWhere('l.city != \'\'')
            ->andWhere('l.listingType = :listingType')
            ->andWhere('l.status != :deleted')
            ->setParameter('deleted', "Deleted")
            ->andWhere('l.dateAdded > DATE_SUB(CURRENT_DATE(), 1, \'YEAR\')')
            ->setParameter('listingType', $listingType)
            ->orderBy('monthYear', 'ASC');

        if ($listingType === "rental") {
            $query->andWhere('l.price < 30000');
        }

        if ($listingType === 'sale') {
            $query->andWhere('l.price > 10000');
        }

        return $query->getQuery()->getArrayResult();
    }

    public function getListingStatisticsDataPoints($listingType)
    {
        // SELECT avg(price), city, property_type, amount_bedrooms, EXTRACT(YEAR_MONTH FROM l.date_added) as date_month FROM `listing` l WHERE duplicate_external_id is null and listing_type = 'rental' group by EXTRACT(YEAR_MONTH FROM l.date_added), city, property_type, amount_bedrooms

        $query = $this->createQueryBuilder('l')
            ->select('MONTH(l.dateAdded) as month, MONTHNAME(l.dateAdded) as name, YEAR(l.dateAdded) as year, COUNT(l.id) as listCount, l.city, l.propertyType')
            ->andWhere('l.listingType = :listingType')
            ->setParameter('listingType', $listingType)
            // ->andWhere('l.dateAdded < CURRENT_DATE()')
            ->andWhere('l.propertyType != \'\'')
            ->andWhere('l.dateAdded > DATE_SUB(CURRENT_DATE(), 11, \'MONTH\')')
            ->groupBy('year, month, l.city, l.propertyType')
            ->orderBy('YEAR(l.dateAdded)', 'ASC');

/*            ->andWhere('l.duplicateExternalId IS NULL')
            ->andWhere('l.city IS NOT NULL')
            ->andWhere('l.city != \'\'')
            ->andWhere('l.listingType = :listingType')
            ->andWhere('l.status != :deleted')
            ->setParameter('deleted', "Deleted")
            ->andWhere('l.dateAdded > DATE_SUB(CURRENT_DATE(), 1, \'YEAR\')')
            ->setParameter('listingType', $listingType)
            ->orderBy('monthYear', 'ASC');*/


        return $query->getQuery()->getArrayResult();
    }

    public function getAllListingStatisticsDataPoints($listingType)
    {
        // SELECT avg(price), city, property_type, amount_bedrooms, EXTRACT(YEAR_MONTH FROM l.date_added) as date_month FROM `listing` l WHERE duplicate_external_id is null and listing_type = 'rental' group by EXTRACT(YEAR_MONTH FROM l.date_added), city, property_type, amount_bedrooms

        $query = $this->createQueryBuilder('l')
            ->select('MONTH(l.dateAdded) as month, MONTHNAME(l.dateAdded) as name, YEAR(l.dateAdded) as year, COUNT(l.id) as listCount, l.city')
            // ->andWhere('l.dateAdded < CURRENT_DATE()')
            ->andWhere('l.listingType = :listingType')
            ->setParameter('listingType', $listingType)

            ->andWhere('l.propertyType != \'\'')
            ->andWhere('l.dateAdded > DATE_SUB(CURRENT_DATE(), 11, \'MONTH\')')
            ->groupBy(' year, month, l.city')
            ->orderBy('YEAR(l.dateAdded)', 'ASC');

        /*            ->andWhere('l.duplicateExternalId IS NULL')
                    ->andWhere('l.city IS NOT NULL')
                    ->andWhere('l.city != \'\'')
                    ->andWhere('l.listingType = :listingType')
                    ->andWhere('l.status != :deleted')
                    ->setParameter('deleted', "Deleted")
                    ->andWhere('l.dateAdded > DATE_SUB(CURRENT_DATE(), 1, \'YEAR\')')
                    ->setParameter('listingType', $listingType)
                    ->orderBy('monthYear', 'ASC');*/


        return $query->getQuery()->getArrayResult();
    }

    public function getPriceStatisticsDataNoBedrooms($listingType)
    {
        // SELECT avg(price), city, property_type, amount_bedrooms, EXTRACT(YEAR_MONTH FROM l.date_added) as date_month FROM `listing` l WHERE duplicate_external_id is null and listing_type = 'rental' group by EXTRACT(YEAR_MONTH FROM l.date_added), city, property_type, amount_bedrooms

        $query = $this->createQueryBuilder('l')
            ->select(' avg(l.price) as averagePrice, l.propertyType, l.city, l.listingType, EXTRACT(YEAR_MONTH FROM l.dateAdded) as monthYear')
            ->groupBy('l.propertyType, l.city, l.listingType, monthYear')
            ->andWhere('l.duplicateExternalId IS NULL')
            ->andWhere('l.city IS NOT NULL')
            ->andWhere('l.city != \'\'')
            ->andWhere('l.status != :deleted')
            ->setParameter('deleted', "Deleted")
            ->andWhere('l.listingType = :listingType')
            ->andWhere('l.dateAdded > DATE_SUB(CURRENT_DATE(), 1, \'YEAR\')')
            ->setParameter('listingType', $listingType)
            ->orderBy('monthYear', 'ASC');

        if ($listingType === "rental") {
            $query->andWhere('l.price < 30000');
        }

        if ($listingType === 'sale') {
            $query->andWhere('l.price > 10000');
        }
        return $query->getQuery()->getArrayResult();
    }

    public function getAllPriceStatisticsDataNoBedrooms($listingType)
    {
        // SELECT avg(price), city, property_type, amount_bedrooms, EXTRACT(YEAR_MONTH FROM l.date_added) as date_month FROM `listing` l WHERE duplicate_external_id is null and listing_type = 'rental' group by EXTRACT(YEAR_MONTH FROM l.date_added), city, property_type, amount_bedrooms

        $query = $this->createQueryBuilder('l')
            ->select(' avg(l.price) as averagePrice, l.city, l.listingType, EXTRACT(YEAR_MONTH FROM l.dateAdded) as monthYear')
            ->groupBy('l.city, l.listingType, monthYear')
            ->andWhere('l.duplicateExternalId IS NULL')
            ->andWhere('l.city IS NOT NULL')
            ->andWhere('l.city != \'\'')
            ->andWhere('l.status != :deleted')
            ->setParameter('deleted', "Deleted")
            ->andWhere('l.listingType = :listingType')
            ->andWhere('l.dateAdded > DATE_SUB(CURRENT_DATE(), 1, \'YEAR\')')
            ->setParameter('listingType', $listingType)
            ->orderBy('monthYear', 'ASC');

        if ($listingType === "rental") {
            $query->andWhere('l.price < 30000');
        }

        if ($listingType === 'sale') {
            $query->andWhere('l.price > 10000');
        }
        return $query->getQuery()->getArrayResult();
    }

    public function delistStaff() {
        $date = new \DateTime();
        $date->modify('-120 hour');
        $query = $this->createQueryBuilder('l')
                    ->select('l.id')
                    ->andWhere("l.assignedAt <= :date")
                    ->andWhere("l.status in(:status)")
                    ->setParameter("status", array('Follow up', 'No answer, try again later'))
                    ->setParameter("date", $date)
                    ->getQuery()
                    ->getArrayResult();
        $ids = array();
        if (sizeof($query) > 0) {
            foreach ($query as &$value) {
               array_push($ids, $value['id']);
            }
            $em = $this->getEntityManager();
            $em->createQuery("UPDATE App\Entity\Listing l1 SET l1.assignedTo = 'Unassigned', l1.assignedAt = null WHERE l1.id IN (:ids)")
                ->setParameter("ids", $ids, \Doctrine\DBAL\Connection::PARAM_STR_ARRAY)
                ->execute();
        }
        return true;
    }

    public function getGroupByOwners($owners) {
        $query = $this->createQueryBuilder('l')
            ->select('ch,lr.name, lr.id')
            ->leftJoin('l.lister', 'lr')
            ->andWhere('l.lister in(:owners)')
            ->setParameter('owners',$owners)
            ->join(ChangeLog::class, 'ch', "with", 'ch.listing = l.id')
            //->groupBy(' l.lister')
            ->getQuery()->getArrayResult();
        //var_dump($query);
        return $query;
    }

    public function getGroupByListingPhone($phoneNumber) {
        $query = $this->createQueryBuilder('l')
            ->select('ch,l.phoneNumber, lr.type')
            ->leftJoin('l.lister', 'lr')
            ->andWhere('l.phoneNumber in(:phone)')
            ->setParameter('phone',$phoneNumber)
            ->join(ChangeLog::class, 'ch', "with", 'ch.listing = l.id')
            ->andWhere("l.status NOT in(:status)")
            ->setParameter("status", array('Follow up', 'No answer, try again later'))
            //->groupBy(' l.lister')
            ->getQuery()->getArrayResult();
        //var_dump($query);
        return $query;
    }



    public function getStaffListingStatus($data) {
        $query =  $this->createQueryBuilder('l')
            ->select('COUNT(l) as statusCount, l.assignedTo, l.status')
            ->leftJoin('l.lister', 'lr')
            ->andWhere('l.assignedTo in(:assignedTo)')
            ->setParameter('assignedTo', $data['assignedTo'])
            ->groupBy('l.assignedTo', 'l.status')
            ->getQuery()->getArrayResult();

        $response = new \stdClass();

        $response->staff = $query;

        $query = $this->createQueryBuilder('l')
            ->select('COUNT(l) as statusCount, l.status')
            ->leftJoin('l.lister', 'lr')
            ->andWhere('l.assignedTo in(:assignedTo)')
            ->setParameter('assignedTo', $data['assignedTo'])
            //->andWhere('l.assignedTo IS NOT NULL')
            //->andWhere('l.assignedTo != \'jackc\'')
            //->andWhere('l.assignedTo != \'daniel\'')
            //->setParameter('assignedTo', $data['assignedTo'])
            ->groupBy( 'l.status')
            ->getQuery()->getArrayResult();
        $response->total = $query;

        return $response;
    }
    public function getGroupByListing($data, $isTotal) {
        $query =     $this->createQueryBuilder('l')
            ->leftJoin('l.lister', 'lr');
        if (!$isTotal) {
            $query->select('COUNT(l) as listCount, lr.name, l.phoneNumber, lr.type');
            if (isset($data['filterBy']) && !empty($data['filterBy'])) {
                $query->andWhere('lr.type = :filter');
                $query->setParameter('filter', $data['filterBy']);
            }
            $query->groupBy('lr.name', 'l.phoneNumber');

            $query->setFirstResult($data['start']);
                $query->setMaxResults($data['limit']);
                $query->orderBy('listCount', 'DESC');
            return $query->getQuery()->getArrayResult();

        }
        else{
            $query->select('COUNT(DISTINCT(lr.name))');
            return $query->getQuery()->getSingleScalarResult();
        }
    }

    public function getAssignedCount($user) {
        $statues = ['Follow up', 'No answer, try again later'];
        $query =     $this->createQueryBuilder('l')
                        ->select('COUNT(l) as count')
                        ->andWhere('l.assignedTo = :user')
                        ->setParameter('user', $user)
                        ->andWhere('l.status in(:status)')
                        ->setParameter('status', $statues);

        return $query->getQuery()->getSingleScalarResult();
    }


}
