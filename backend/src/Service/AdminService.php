<?php

namespace App\Service;

use App\Entity\ChangeLog;
use App\Entity\AdminUsers;
use App\Filter;
use App\Repository\AdminUsersRepository;
use App\Repository\StaffRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Repository\StaffLoginHistoryRepository;

class AdminService
{
    private $adminUsersRepository;
    private $staffRepository;
    private $staffLoginHistoryRepository;

    public function __construct(
        StaffRepository $staffRepository,
        AdminUsersRepository $adminUsersRepository,
        StaffLoginHistoryRepository $staffLoginHistoryRepository
    )
    {
        $this->staffRepository = $staffRepository;
        $this->adminUsersRepository = $adminUsersRepository;
        $this->staffLoginHistoryRepository = $staffLoginHistoryRepository;
    }

    private function validateNewAdminUser($userData) {
        //var_dump($userData->email);
        $existingUserCheck = $this->adminUsersRepository->findByEmail($userData->email);
        $staffUserCheck = $this->staffRepository->findByEmail($userData->email);
        if (!empty($existingUserCheck) || !empty($staffUserCheck)) {
            return "User Already exists";
        }

        if (empty($userData->name) || empty($userData->email) || empty($userData->password) || empty($userData->phoneNumber)) {
            return "Required attribute name/email/phonenumber is missing";
        }
        return true;
    }

    public function createUser($userData) {
        $isValidUser = $this->validateNewAdminUser($userData);
        if (!is_bool($isValidUser)) {
            return $isValidUser;
        }
        $newUser = $this->adminUsersRepository->createNewUser($userData);
        return true;
    }

    public function getUser($userData) {
        if (empty($userData->email) || empty($userData->password)) {
            return "Email and Password required";
        }
        $user = $this->adminUsersRepository->findByEmailPwd($userData);
        return $user;
    }

    public function getStaffHistory($start, $limit) {
        return $this->staffLoginHistoryRepository->getStaffHistory($start, $limit);
    }

    public  function getStaffHistoryCount(){
        return $this->staffLoginHistoryRepository->getStaffHistoryCount();
    }

}