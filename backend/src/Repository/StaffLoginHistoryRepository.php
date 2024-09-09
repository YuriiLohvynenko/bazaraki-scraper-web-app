<?php

namespace App\Repository;

use App\Entity\StaffLoginHistory;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method StaffLoginHistory|null find($id, $lockMode = null, $lockVersion = null)
 * @method StaffLoginHistory|null findOneBy(array $criteria, array $orderBy = null)
 * @method StaffLoginHistory[]    findAll()
 * @method StaffLoginHistory[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class StaffLoginHistoryRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, StaffLoginHistory::class);
    }

    public function getStaffHistory($start, $limit) {
        return $this->createQueryBuilder('slh')
                ->leftJoin('slh.staffId', 's')
                ->select('s.name as name', 'slh.ip', 'slh.loggedInAt', 'slh.id')
                ->orderBy('slh.loggedInAt', "DESC")
                ->setFirstResult($start)
                ->setMaxResults($limit)
                ->getQuery()
                ->getArrayResult();
    }

    public function getStaffHistoryCount(){
        return $this->createQueryBuilder('slh')
                ->select('count(slh.id) as totalCount')
                ->getQuery()
                ->getSingleScalarResult();
    }

    // /**
    //  * @return StaffLoginHistory[] Returns an array of StaffLoginHistory objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('s.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?StaffLoginHistory
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
