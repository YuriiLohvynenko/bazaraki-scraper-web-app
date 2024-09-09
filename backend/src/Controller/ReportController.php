<?php


namespace App\Controller;


use App\Service\ListingService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;


class ReportController
{
    private $listingService;

    public function __construct(ListingService $listingService)
    {
        $this->listingService = $listingService;
    }

    /**
     * @Route("/reporting/ownership", name="reporting_ownership")
     */
    public function ownershipReporting()
    {
        return new JsonResponse($this->listingService->getOwnershipStatistics());
    }

    /**
     * @Route("/reporting/price/{listingType}", name="reporting_price_table")
     */
    public function priceReportingTable(string $listingType)
    {
        return new JsonResponse($this->listingService->getAveragePriceStatistics($listingType));
    }

    /**
     * @Route("/reporting/price/graph/{listingType}", name="reporting_price_graph")
     */
    public function priceReportingGraph(string $listingType)
    {
        return new JsonResponse($this->listingService->getAveragePriceStatisticsDataPoints($listingType));
    }

    /**
     * @Route("/reporting/listing/graph/{listingType}", name="reporting_listing_graph")
     */
    public function listingReportingGraph(string $listingType)
    {
        return new JsonResponse($this->listingService->getListingStatisticsDataPoints($listingType));
    }
}