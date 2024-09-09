<?php

namespace App\Repository;

use App\Entity\AdminUsers;
use App\Entity\Staff;
use App\Entity\StaffLoginHistory;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\ORM\EntityManagerInterface;
use http\Client\Curl\User;

/**
 * @method Staff|null find($id, $lockMode = null, $lockVersion = null)
 * @method Staff|null findOneBy(array $criteria, array $orderBy = null)
 * @method Staff[]    findAll()
 * @method Staff[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class StaffRepository extends ServiceEntityRepository
{
    private $entityManager;

    public function __construct(ManagerRegistry $registry, EntityManagerInterface $entityManager)
    {
        parent::__construct($registry, Staff::class);
        $this->entityManager = $entityManager;

    }

    public function createNewUser($user, $admin) {

        $allowedCities = implode(",",$user->allowedCities);
        $newUser = new Staff();
        $newUser->setEmail($user->email);
        $newUser->setName($user->name);
        $newUser->setPassword($user->password);
        $newUser->setPhoneNumber($user->phoneNumber);
        $newUser->setStatus(1);
        $newUser->setAllowedCities($allowedCities);
        $newUser->setCreatedBy($admin);
        $newUser->setCreatedAt(new \DateTime());
        $newUser->setUpdatedAt(new \DateTime());

        $this->entityManager->persist($newUser);

        $this->entityManager->flush();
        return true;
    }

    public function updateUser($user, $admin) {
        if(is_array($user->allowedCities)){
            $allowedCities = implode(",",$user->allowedCities);
        }
        else{
            $allowedCities = $user->allowedCities;
        }
        $newUser = $this->entityManager->getRepository(Staff::class)->find($user->id);
        $newUser->setEmail($user->email);
        $newUser->setName($user->name);
        $newUser->setPassword($user->password);
        $newUser->setPhoneNumber($user->phoneNumber);
        $newUser->setStatus(1);
        $newUser->setAllowedCities($allowedCities);
        $newUser->setCreatedBy($admin);
        $newUser->setCreatedAt(new \DateTime());
        $newUser->setUpdatedAt(new \DateTime());

        $this->entityManager->persist($newUser);
        $this->entityManager->flush();
        return true;
    }

    public function updateUserPassword($user) {
        $newUser = $this->entityManager->getRepository(Staff::class)->find($user->userId);
        $newUser->setPassword($user->newPassword);
        $this->entityManager->persist($newUser);
        $this->entityManager->flush();
        return true;
    }



    // /**
    //  * @return Staff[] Returns an array of Staff objects
    //  */

    public function findByEmailPwd($user)
    {
        return $this->createQueryBuilder('s')
            ->select('s.id, s.email, s.name')
            ->andWhere('s.email = :email')
            ->setParameter('email', $user->email)
            ->andWhere('s.password = :pass')
            ->setParameter('pass', $user->password)
            ->andWhere('s.status = 1')
            ->getQuery()
            ->getArrayResult()
        ;
    }
    public function findByStatus() {
        return $this->createQueryBuilder('s')
            ->select('s.id, s.email, s.name, s.phoneNumber, s.allowedCities, s.created_at, s.password, s.status')
            ->andWhere('s.name != \'daniel\'')
            ->andWhere('s.name != \'Jackc\'')
            ->andWhere('s.name != \'Steve\'')
            ->orderBy('s.name', "ASC")
            ->getQuery()
            ->getArrayResult()
            ;
    }

    /*
    public function findOneBySomeField($value): ?Staff
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
