<?php


namespace App\Controller;

use App\Filter;
use App\Repository\ListingRepository;
use App\Service\AdminService;
use App\Service\ListingService;
use App\Service\StaffService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\HttpKernel\Event\ControllerEvent;


class StaffController
{
    /**
     * @Route("/staff/user/add", name="staff_user_add")
     */
    public function addUser(
        StaffService $staffService,
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
        $newUser = $staffService->createUser($userData);
        if (!is_bool($newUser)) {
            $response->message = $newUser;
            return new JsonResponse($response, 400);;
        }
        $response->message = "Succesfully created user";
        return new JsonResponse($serializer->serialize($response, 'json', [
            'circular_reference_handler' => function ($object) {
                return $object->getId();
            }
        ]), 200, [], true);
    }

    /**
     * @Route("/staff/user/update", name="staff_user_update")
     */
    public function updateUser(
        StaffService $staffService,
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
        $newUser = $staffService->updateUser($userData);
        if (!is_bool($newUser)) {
            $response->message = $newUser;
            return new JsonResponse($response, 400);;
        }
        $response->message = "Succesfully created user";
        return new JsonResponse($serializer->serialize($response, 'json', [
            'circular_reference_handler' => function ($object) {
                return $object->getId();
            }
        ]), 200, [], true);
    }

    /**
     * @Route("/staff/user/validate", name="staff_user_validate")
     */
    public function validateUser(
        StaffService $staffService,
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
        $staffUser = $staffService->getUser($userData);
        if (!is_array($staffUser) || empty($staffUser)) {
            $response->message = "Invalid credentials or account does not exist";
            return new JsonResponse($response, 400);;
        }
        $response->message = "";
        $response->id = $staffUser[0]['id'];
        $response->email = $staffUser[0]['email'];
        $response->name = $staffUser[0]['name'];
        return new JsonResponse($response, 200);
    }

    /**
     * @Route("/listing/staff/delist", name="listing_delist")
     */
    public function delistingFromStaff(
        ListingService $listingService,
        Request $request) {

        $listingService->delistStaff();

        return new JsonResponse([]);
    }

    /**
     * @Route("/staff/user/password/forgot", name="staff_user_password_forgot")
     */
    public function forgotPassword(
        StaffService $staffService,
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
        $newUser = $staffService->forgotPassword($userData);
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

}