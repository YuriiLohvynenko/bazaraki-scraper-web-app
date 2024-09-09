<?php

namespace App\Controller;

use App\Filter;
use App\Repository\ListingRepository;
use App\Service\ListingService;
use App\Service\StaffService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\Serializer\SerializerInterface;
use App\Controller\TokenAuthenticateController;

class ListingController implements TokenAuthenticateController
{
    /**
     * @Route("/listings", name="listings")
     */
    public function listings(
        ListingService $listingService,
        SerializerInterface $serializer,
        Request $request){
        $filter = Filter::from(
            $request->getContent(),
            $request->query->get('start', 0),
            $request->query->get('limit', 20)
        );

        return new JsonResponse($serializer->serialize($listingService->findByFilter($filter, $this->user), 'json', [
            'circular_reference_handler' => function ($object) {
                return $object->getId();
            }
        ]), 200, [], true);
    }


    /**
     * @Route("/listing/group", name="listing_group")
     */
    public function groupByOwner(
        ListingService $listingService,
        SerializerInterface $serializer,
        Request $request) {

        $data = json_decode($request->getContent(), true);

        $data['start'] = $request->query->get('start', 0);
        $data['limit'] = $request->query->get('limit', 20);
        $result = $listingService->getGroupByListing($data);

        return new JsonResponse($serializer->serialize($result, 'json', [
            'circular_reference_handler' => function ($object) {
                return $object->getId();
            }
        ]), 200, [], true);
        return new JsonResponse([]);
    }
    /**
     * @Route("/listing/phone", name="listing_phone")
     */
    public function groupByPhone(
        ListingService $listingService,
        SerializerInterface $serializer,
        Request $request) {

        $filter = Filter::from(
            $request->getContent(),
            $request->query->get('start', 0),
            $request->query->get('limit', 20)
        );

        $data['start'] = $request->query->get('start', 0);
        $data['limit'] = $request->query->get('limit', 20);
        $result = $listingService->getGroupByPhone($filter, $this->user);

        return new JsonResponse($serializer->serialize($result, 'json', [
            'circular_reference_handler' => function ($object) {
                return $object->getId();
            }
        ]), 200, [], true);
        return new JsonResponse([]);
    }

    /**
     * @Route("/listing/{listingId}", name="update_listing")
     */
    public function updateListing(
        ListingService $listingService,
        Request $request,
        int $listingId) {
        $response = new \stdClass();
        $data = json_decode($request->getContent(), true);
        $isAdmin = false;
        if (isset($this->user->isAdmin)) {
            $isAdmin = true;
        }
        $updateData = $listingService->updateListing($listingId, $data, $this->user->getName(), $isAdmin);
        if (!empty($updateData)) {
            $response->message = $updateData;
            return new JsonResponse($response, 400);
        }
        return new JsonResponse([]);
    }

    /**
     * @Route("/area", name="areas")
     */
    public function getArea(
        ListingService $listingService,
        SerializerInterface $serializer,
        Request $request){

        $cities = $request->getContent();
        $cities = json_decode($cities, false);
        if (empty($cities->cities)) {
            $cities = array();
        }
        else{
            $cities = $cities->cities;
        }
        return new JsonResponse($serializer->serialize($listingService->findByCity($cities), 'json', [
            'circular_reference_handler' => function ($object) {
                return $object->getId();
            }
        ]), 200, [], true);
    }

    /**
     * @Route("/listing/staff/status", name="listing_staff_status")
     */
    public function statusPerStaff(
        ListingService $listingService,
        SerializerInterface $serializer,
        Request $request) {

        $data = json_decode($request->getContent(), true);
        $result = $listingService->getStaffListingStatus($data);

        return new JsonResponse($result, 200);
    }


    /**
     * @Route("/staff/users", name="staff_users")
     */
    public function getUsers(
        StaffService $staffService,
        SerializerInterface $serializer,
        Request $request)
    {
        $response = new \stdClass();

        $staffUser = $staffService->getUsers();
        $response = new \stdClass();
        $response->users = base64_encode(json_encode($staffUser, true));
        return new JsonResponse($response, 200);
    }

    /**
     * @Route("/staff/user/password/update", name="staff_user_password_update")
     */
    public function updateUserPassword(
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
        $newUser = $staffService->updateUserPassword($userData);
        if (!is_bool($newUser)) {
            $response->message = $newUser;
            return new JsonResponse($response, 400);;
        }
        $response->message = "Successfully changed password";
        return new JsonResponse($response, 200);
    }

}