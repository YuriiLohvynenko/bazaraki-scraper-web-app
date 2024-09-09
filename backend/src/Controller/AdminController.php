<?php

namespace App\Controller;

use App\Filter;
use App\Repository\ListingRepository;
use App\Service\AdminService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\Serializer\SerializerInterface;

class AdminController
{
    /**
     * @Route("/admin/user/add", name="admin_user_add")
     */
    public function addUser(
        AdminService $adminService,
        SerializerInterface $serializer,
        Request $request){
        $response = new \stdClass();
        $userData = $request->getContent();
        $userData = json_decode($userData);
        if (empty($userData)) {

            $response->message = "Empty request data";
            return new JsonResponse($response, 400);;
        }
        $newUser = $adminService->createUser($userData);
        if (!is_bool($newUser)) {
            $response->message = $newUser;
            return new JsonResponse($response, 400);;
        }
        $response->message = "Successfully created user";
        return new JsonResponse($serializer->serialize($response, 'json', [
            'circular_reference_handler' => function ($object) {
                return $object->getId();
            }
        ]), 200, [], true);
    }

    /**
     * @Route("/admin/user", name="admin_user")
     */
    public function getUser(
        AdminService $adminService,
        SerializerInterface $serializer,
        Request $request)
    {
        $response = new \stdClass();
        $userData = $request->getContent();
        $userData = json_decode($userData);
        if (empty($userData)) {

            $response->message = "Empty request data";
            return new JsonResponse($response, 400);;
        }
        $adminUser = $adminService->getUser($userData);
        if (!is_array($adminUser) || empty($adminUser)) {
            $response->message = "Invalid credentials or account does not exist";
            return new JsonResponse($response, 400);
        }
        $response->message = "";
        $response->id = $adminUser[0]['id'];
        $response->email = $adminUser[0]['email'];
        $response->name = $adminUser[0]['name'];
        $response->isAdmin = true;
        return new JsonResponse($response, 200);
    }

    /**
     * @Route("/admin/staff/history", name="admin_staff_history")
     */
    public function getStaffHistory(
        AdminService $adminService,
        SerializerInterface $serializer,
        Request $request)
    {
        $response = new \stdClass();

        $response->results = $adminService->getStaffHistory($request->query->get('start', 0), $request->query->get('limit', 20));
        $response->totalCount = $adminService->getStaffHistoryCount();
        return new JsonResponse($response, 200);

    }
}