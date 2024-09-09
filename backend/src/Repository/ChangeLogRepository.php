<?php

namespace App\Repository;

use App\Entity\ChangeLog;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\Listing;
use App\Filter;
use Doctrine\Common\Collections\Criteria;

/**
 * @method ChangeLog|null find($id, $lockMode = null, $lockVersion = null)
 * @method ChangeLog|null findOneBy(array $criteria, array $orderBy = null)
 * @method ChangeLog[]    findAll()
 * @method ChangeLog[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ChangeLogRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ChangeLog::class);
    }

    public function store(ChangeLog $changeLog)
    {
        $em = $this->getEntityManager();
        $em->persist($changeLog);
        $em->flush();
    }

    public function findByLogs($filter) {
        return $this->createQueryBuilder('c')
                    ->leftJoin('c.listing', 'l')
                    ->select('l.id as listingId, c.createdAt, c.changedBy, c.changes')
                    ->setFirstResult($filter->getStart())
                    ->setMaxResults($filter->getLimit())
                    ->orderBy('c.createdAt', 'DESC')
                    ->getQuery()
                    ->getArrayResult();
    }

    public function findByUser($userName) {
        return $this->createQueryBuilder('c')
            ->leftJoin('c.listing', 'l')
            ->select('l.id as listingId, c.createdAt, c.changedBy, c.changes')
            ->andWhere('c.changedBy = :userName')
            ->setParameter('userName', $userName)
            ->andWhere('c.createdAt > DATE_SUB(CURRENT_DATE(), 1, \'day\')')
            ->orderBy('c.createdAt', 'DESC')
            ->getQuery()
            ->getArrayResult();
    }
    public function findTotalCount() {
        return $this->createQueryBuilder('c')
            ->select('count(c.id)')
            ->getQuery()
            ->getSingleScalarResult();
    }

    // /**
    //  * @return ChangeLog[] Returns an array of ChangeLog objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('c.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?ChangeLog
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
