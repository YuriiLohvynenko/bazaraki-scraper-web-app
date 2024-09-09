<?php

namespace App\Repository;

use App\Entity\AdminUsers;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use DoctrineExtensions\Query\Mysql\Date;
use Doctrine\ORM\EntityManagerInterface;


/**
 * @method AdminUsers|null find($id, $lockMode = null, $lockVersion = null)
 * @method AdminUsers|null findOneBy(array $criteria, array $orderBy = null)
 * @method AdminUsers[]    findAll()
 * @method AdminUsers[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AdminUsersRepository extends ServiceEntityRepository
{
    private $entityManager;

    public function __construct(ManagerRegistry $registry, EntityManagerInterface $entityManager)
    {
        parent::__construct($registry, AdminUsers::class);
        $this->entityManager = $entityManager;

    }
    public function createNewUser($user) {



        $newUser = new AdminUsers();
        $newUser->setEmail($user->email);
        $newUser->setName($user->name);
        $newUser->setPassword($user->password);
        $newUser->setPhoneNumber($user->phoneNumber);
        $newUser->setStatus(1);
        $newUser->setCreatedAt(new \DateTime());
        $newUser->setUpdatedAt(new \DateTime());

        $this->entityManager->persist($newUser);
        $this->entityManager->flush();
        return true;
    }

    public function findByEmailPwd($user)
    {
        return $this->createQueryBuilder('a')
            ->select('a.id, a.email, a.name')
            ->andWhere('a.email = :email')
            ->setParameter('email', $user->email)
            ->andWhere('a.password = :pass')
            ->setParameter('pass', $user->password)
            ->getQuery()
            ->getArrayResult()
            ;
    }


    // /**
    //  * @return AdminUsers[] Returns an array of AdminUsers objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('a.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?AdminUsers
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
