<?php

namespace App\Controller;

use App\Filter;
use App\Repository\ListingRepository;
use App\Service\ListingService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;


class LogController {
    /**
     * @Route("/logs", name="logs")
     */
    public function logs(
        ListingService $listingService,
        SerializerInterface $serializer,
        Request $request){

        $filter = Filter::from(
            $request->getContent(),
            $request->query->get('start', 0),
            $request->query->get('limit', 20)
        );

        return new JsonResponse($serializer->serialize($listingService->findByLogs($filter), 'json', [
            'circular_reference_handler' => function ($object) {
                return $object->getId();
            }
        ]), 200, [], true);
    }

}