<?php

namespace App\Service;

use App\Controller\StaffController;
use App\Entity\Staff;
use App\Entity\StaffLoginHistory;
use App\Repository\AdminUsersRepository;
use App\Repository\StaffRepository;
use Doctrine\ORM\EntityManagerInterface;


class StaffService
{
    private $staffRepository;
    private $adminUsersRepository;
    private $entityManager;
    public function __construct(
        StaffRepository $staffRepository,
        AdminUsersRepository $adminUsersRepository,
        EntityManagerInterface $entityManager
    )
    {
        $this->staffRepository = $staffRepository;
        $this->adminUsersRepository = $adminUsersRepository;
        $this->entityManager = $entityManager;
    }

    private function validateNewUser($userData, $isUpdate) {
        if ($isUpdate) {
            $existingUserCheck = false;
            $existingUserNameCheck = false;
        }
        else{
            $existingUserCheck = $this->staffRepository->findByEmail($userData->email);
            $existingUserNameCheck = $this->staffRepository->findByName($userData->name);
        }
        $adminUserCheck = $this->adminUsersRepository->findByEmail($userData->email);
        if ($userData->password) {
            $uppercase = preg_match('@[A-Z]@', $userData->password);
            $lowercase = preg_match('@[a-z]@', $userData->password);
            $number    = preg_match('@[0-9]@', $userData->password);

            if(!$uppercase || !$lowercase || !$number || strlen($userData->password) < 8) {
                //if ($isUpdate){
                    return "Password should be atleast 8 characters and should contain one capital, one small letter and numeric value";
                //}
            }
        }
        if (!empty($existingUserCheck) || !empty($existingUserNameCheck) || !empty($adminUserCheck)) {
            return "User Already exists";
        }

        if (empty($userData->name) || empty($userData->email) || empty($userData->password) || empty($userData->phoneNumber) || empty($userData->adminId || empty($userData->allowedCities))) {
            return "Required attribute name/email/phonenumber is missing";
        }

        return true;
    }

    public function createUser($userData) {
        $isValidUser = $this->validateNewUser($userData, false);
        if (!is_bool($isValidUser)) {
            return $isValidUser;
        }
        $adminData = $this->adminUsersRepository->find($userData->adminId);

        if(empty($adminData)) {
            return "Invalid Admin user";
        }
        $newUser = $this->staffRepository->createNewUser($userData, $adminData);
        return true;
    }

    public function updateUser($userData) {
        $isValidUser = $this->validateNewUser($userData, true);
        if (!is_bool($isValidUser)) {
            return $isValidUser;
        }

        $adminData = $this->adminUsersRepository->find($userData->adminId);

        if(empty($adminData)) {
            return "Invalid Admin user";
        }
        $newUser = $this->staffRepository->updateUser($userData, $adminData);
        return true;
    }

    public function updateUserPassword($userData) {
        //$isValidUser = $this->validateNewUser($userData, true);

        if ($userData->newPassword) {
            if ($userData->newPassword) {
                $uppercase = preg_match('@[A-Z]@', $userData->newPassword);
                $lowercase = preg_match('@[a-z]@', $userData->newPassword);
                $number    = preg_match('@[0-9]@', $userData->newPassword);

                if(!$uppercase || !$lowercase || !$number || strlen($userData->newPassword) < 8) {
                    //if ($isUpdate){
                    return "Password should be atleast 8 characters and should contain one capital, one small letter and numeric value";
                    //}
                }
            }
        }
        $user = $this->staffRepository->find($userData->userId);
        if (empty($user)) {
            return "Invalid Staff";
        }
        if ($user->getPassword() !== $userData->password) {
            return "Invalid old password";
        }
        return $this->staffRepository->updateUserPassword($userData);
    }

    public function forgotPassword($userData) {
        $isValidUser = $this->validateNewUser($userData, true);
        if (is_bool($isValidUser)) {
            return "User not found";
        }

        $headers   = [
            'MIME-Version' => 'MIME-Version: 1.0',
            'Content-type' => 'text/plain; charset=UTF-8',
            'From' => "from@example.com",
            'Reply-To' => "replyto@example.com",
            'X-Mailer' => 'PHP/' . phpversion(),
        ];

        $sendMail = mail($userData->email, "Reset your password", "This is a test message sent from bazaralo. It originated from the IP address asdasd. If you received this email, that means that the PHP mail function is working on this server", $headers);
        return true;
    }

    public function get_client_ip() {
        $ipaddress = null;
        if (isset($_SERVER['HTTP_CLIENT_IP']))
            $ipaddress = $_SERVER['HTTP_CLIENT_IP'];
        else if(isset($_SERVER['HTTP_X_FORWARDED_FOR']))
            $ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
        else if(isset($_SERVER['HTTP_X_FORWARDED']))
            $ipaddress = $_SERVER['HTTP_X_FORWARDED'];
        else if(isset($_SERVER['HTTP_FORWARDED_FOR']))
            $ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
        else if(isset($_SERVER['HTTP_FORWARDED']))
            $ipaddress = $_SERVER['HTTP_FORWARDED'];
        else if(isset($_SERVER['REMOTE_ADDR']))
            $ipaddress = $_SERVER['REMOTE_ADDR'];
        else
            $ipaddress = 'UNKNOWN';
        return $ipaddress;
    }


    public function getUser($userData) {
        if (empty($userData->email) || empty($userData->password)) {
            return "Email and Password required";
        }
        $user = $this->staffRepository->findByEmailPwd($userData);
        if (!empty($user)) {
            $staffHistory = new StaffLoginHistory();
            $staffHistory->setStaffId($this->entityManager->getRepository(Staff::class)->find($user[0]['id']));
            $staffHistory->setLoggedInAt(new \DateTime());
            $staffHistory->setIp($this->get_client_ip());
            $this->entityManager->persist($staffHistory);

            $this->entityManager->flush();

        }
        return $user;
    }

    public function getUsers() {
        $user = $this->staffRepository->findByStatus();
        return $user;
    }
}