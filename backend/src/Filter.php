<?php

namespace App;

class Filter
{
    private $id = null;
    private $bid = null;
    private $start = 0;
    private $limit = 20;
    private $listingType = null;
    private $propertyType = null;
    private $listedByType = null;
    private $cities = null;
    private $areas = null;
    private $phone = null;
    private $minPrice = null;
    private $maxPrice = null;
    private $status = null;
    private $allowDuplicates = true;
    private $assignedTo = null;
    private $bedrooms = null;
    private $sortBy = null;
    private $sortType = null;
    private $bathrooms = null;

    /**
     * @return bool
     */
    public function isAllowDuplicates(): bool
    {
        return $this->allowDuplicates;
    }

    /**
     * @param bool $allowDuplicates
     */
    public function setAllowDuplicates(bool $allowDuplicates): void
    {
        $this->allowDuplicates = $allowDuplicates;
    }

    public static function from($str, $start = 0, $limit = 20) {
        $params = json_decode($str, true);
        $filter = new Filter();

        if (isset($params['cities']) && !empty($params['cities'])) {
            $filter->setCities($params['cities']);
        }

        if (isset($params['areas']) && !empty($params['areas'])) {
            $filter->setAreas($params['areas']);
        }

        if (isset($params['phoneNumber']) && !empty($params['phoneNumber'])) {
            $filter->setPhone(trim($params['phoneNumber']));
        }

        if (isset($params['propertyType']) && !empty($params['propertyType'])) {
            $filter->setPropertyType($params['propertyType']);
        }

        if (isset($params['listedByType']) && !empty($params['listedByType'])) {
            $filter->setListedByType($params['listedByType']);
        }

        if (isset($params['minPrice']) && !empty($params['minPrice'])) {
            $filter->setMinPrice($params['minPrice']);
        }

        if (isset($params['maxPrice']) && !empty($params['maxPrice'])) {
            $filter->setMaxPrice($params['maxPrice']);
        }

        if (isset($params['status']) && !empty($params['status'])) {
            $filter->setStatus($params['status']);
        }

        if (isset($params['allowDuplicates']) && $params['allowDuplicates'] == 0) {
            $filter->setAllowDuplicates(false);
        }

        if (isset($params['assignedTo']) && !empty($params['assignedTo'])) {
            $filter->setAssignedTo($params['assignedTo']);
        }

        if (isset($params['listingType'])) {
            $filter->setListingType($params['listingType']);
        }

        if (isset($params['bedrooms'])) {
            $filter->setBedrooms($params['bedrooms']);
        }
        if (isset($params['bathrooms'])) {
            $filter->setBathrooms($params['bathrooms']);
        }
        if (isset($params['sortBy'])) {
            $filter->setSortBy($params['sortBy']);
        }
        if (isset($params['sortType'])) {
            $filter->setSortType($params['sortType']);
        }
        if (isset($params['id'])) {
            $filter->setId($params['id']);
        }
        if (isset($params['bid'])) {
            $filter->setBid($params['bid']);
        }

        $filter->setStart($start);
        $filter->setLimit($limit);

        return $filter;
    }

    /**
     * @return null
     */
    public function getAssignedTo()
    {
        return $this->assignedTo;
    }

    /**
     * @param null $assignedTo
     */
    public function setAssignedTo($assignedTo): void
    {
        $this->assignedTo = $assignedTo;
    }

    /**
     * @return null
     */
    public function getStatus()
    {
        return $this->status;
    }

    /**
     * @param null $status
     */
    public function setStatus($status): void
    {
        $this->status = $status;
    }

    /**
     * @return int
     */
    public function getStart(): int
    {
        return $this->start;
    }

    /**
     * @param int $start
     */
    public function setStart(int $start): void
    {
        $this->start = $start;
    }

    /**
     * @return int
     */
    public function getLimit(): int
    {
        return $this->limit;
    }

    /**
     * @param int $limit
     */
    public function setLimit(int $limit): void
    {
        $this->limit = $limit;
    }

    /**
     * @return null
     */
    public function getPropertyType()
    {
        return $this->propertyType;
    }

    /**
     * @param null $propertyType
     */
    public function setPropertyType($propertyType): void
    {
        $this->propertyType = $propertyType;
    }

    /**
     * @param null $id
     */
    public function setId($id): void
    {
        $this->id = $id;
    }

    /**
     * @param null $id
     */
    public function setBid($bid): void
    {
        $this->bid = $bid;
    }

    /**
     * @return null
     */
    public function getListedByType()
    {
        return $this->listedByType;
    }

    /**
     * @param null $listedByType
     */
    public function setListedByType($listedByType): void
    {
        $this->listedByType = $listedByType;
    }

    /**
     * @return null
     */
    public function getCities()
    {
        return $this->cities;
    }

    /**
     * @param null $cities
     */
    public function setCities($cities): void
    {
        $this->cities = $cities;
    }

    /**
     * @return null
     */
    public function getAreas()
    {
        return $this->areas;
    }

    /**
     * @param null areas
     */
    public function setAreas($areas): void
    {
        $this->areas = $areas;
    }
    /**
     * @return null
     */
    public function getPhone()
    {
        return $this->phone;
    }

    /**
     * @param null $phone
     */
    public function setPhone($phone): void
    {
        $this->phone = $phone;
    }

    /**
     * @return null
     */
    public function getMinPrice()
    {
        return $this->minPrice;
    }

    /**
     * @param null $minPrice
     */
    public function setMinPrice($minPrice): void
    {
        $this->minPrice = $minPrice;
    }

    /**
     * @return null
     */
    public function getMaxPrice()
    {
        return $this->maxPrice;
    }

    /**
     * @param null $maxPrice
     */
    public function setMaxPrice($maxPrice): void
    {
        $this->maxPrice = $maxPrice;
    }

    /**
     * @return null
     */
    public function getListingType()
    {
        return $this->listingType;
    }

    /**
     * @param null $listingType
     */
    public function setListingType($listingType): void
    {
        $this->listingType = $listingType;
    }

    /**
     * @return null
     */
    public function getBedrooms()
    {
        return $this->bedrooms;
    }

    /**
     * @param null $bedrooms
     */
    public function setBedrooms($bedrooms): void
    {
        $this->bedrooms = $bedrooms;
    }
    /**
     * @param null $sortBy
     */
    public function setSortBy($sortBy): void
    {
        $this->sortBy = $sortBy;
    }

    /**
     * @return null
     */
    public function getSortBy()
    {
        return $this->sortBy;
    }
    /**
     * @param null $sortType
     */
    public function setSortType($sortType): void
    {
        $this->sortType = $sortType;
    }

    /**
     * @return null
     */
    public function getSortType()
    {
        return $this->sortType;
    }

    /**
     * @param null $bathrooms
     */
    public function setBathrooms($bathrooms): void
    {
        $this->bathrooms = $bathrooms;
    }

    /**
     * @return null
     */
    public function getBathrooms()
    {
        return $this->bathrooms;
    }
    /**
     * @return null
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return null
     */
    public function getBid()
    {
        return $this->bid;
    }


}