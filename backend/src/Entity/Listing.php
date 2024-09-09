<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\MaxDepth;

/**
 * @ORM\Entity(repositoryClass="App\Repository\ListingRepository")
 * @ORM\Table(name="listing", indexes={@ORM\Index(name="listing_external_id", columns={"external_id"})})
 */
class Listing
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $propertyType;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $title;

    /**
     * @ORM\Column(type="integer")
     */
    private $externalId;

    /**
     * @ORM\Column(type="datetime")
     */
    private $dateAdded;

    /**
     * @ORM\Column(type="integer")
     */
    private $price;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $zipCode;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $city;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $area;

    /**
     * @ORM\Column(type="integer")
     */
    private $amountBedrooms;

    /**
     * @ORM\Column(type="integer")
     */
    private $amountBathrooms;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $description;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $phoneNumber;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Thumbnail", mappedBy="listing")
     * @MaxDepth(1)
     */
    private $thumbnails;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Lister", fetch="EAGER")
     * @ORM\JoinColumn(nullable=false)
     */
    private $lister;

    /**
     * @ORM\Column(type="string", length=1024)
     */
    private $bazarakiUrl;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $lat;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $lon;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $status;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $qlRef;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $assignedTo;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $duplicateExternalId;

    /**
     * @ORM\Column(type="datetime")
     */
    private $ingestedAt;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $assignedAt;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $listingType;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $areaSize;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $propertyCondition;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $commercialPropertyType;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\ChangeLog", mappedBy="listing")
     */
    private $changeLogs;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $notes;


    public function __construct()
    {
        $this->thumbnails = new ArrayCollection();
        $this->changeLogs = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPropertyType(): ?string
    {
        return $this->propertyType;
    }

    public function setPropertyType(string $propertyType): self
    {
        $this->propertyType = $propertyType;

        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getExternalId(): ?int
    {
        return $this->externalId;
    }

    public function setExternalId(int $externalId): self
    {
        $this->externalId = $externalId;

        return $this;
    }

    public function getDateAdded(): ?\DateTimeInterface
    {
        return $this->dateAdded;
    }

    public function setDateAdded(\DateTimeInterface $dateAdded): self
    {
        $this->dateAdded = $dateAdded;

        return $this;
    }

    public function getPrice(): ?int
    {
        return $this->price;
    }

    public function setPrice(int $price): self
    {
        $this->price = $price;

        return $this;
    }

    public function getZipCode(): ?int
    {
        return $this->zipCode;
    }

    public function setZipCode(?int $zipCode): self
    {
        $this->zipCode = $zipCode;

        return $this;
    }

    public function getCity(): ?string
    {
        return $this->city;
    }

    public function setCity(?string $city): self
    {
        $this->city = $city;

        return $this;
    }

    public function getArea(): ?string
    {
        return $this->area;
    }

    public function setArea(?string $area): self
    {
        $this->area = $area;

        return $this;
    }

    public function getAmountBedrooms(): ?int
    {
        return $this->amountBedrooms;
    }

    public function setAmountBedrooms(int $amountBedrooms): self
    {
        $this->amountBedrooms = $amountBedrooms;

        return $this;
    }

    public function getAmountBathrooms(): ?int
    {
        return $this->amountBathrooms;
    }

    public function setAmountBathrooms(int $amountBathrooms): self
    {
        $this->amountBathrooms = $amountBathrooms;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getPhoneNumber(): ?string
    {
        return $this->phoneNumber;
    }

    public function setPhoneNumber(string $phoneNumber): self
    {
        $this->phoneNumber = $phoneNumber;

        return $this;
    }

    /**
     * @return Collection|Thumbnail[]
     */
    public function getThumbnails(): Collection
    {
        return $this->thumbnails;
    }

    public function addThumbnail(Thumbnail $thumbnail): self
    {
        if (!$this->thumbnails->contains($thumbnail)) {
            $this->thumbnails[] = $thumbnail;
            $thumbnail->setListing($this);
        }

        return $this;
    }

    public function removeThumbnail(Thumbnail $thumbnail): self
    {
        if ($this->thumbnails->contains($thumbnail)) {
            $this->thumbnails->removeElement($thumbnail);
            // set the owning side to null (unless already changed)
            if ($thumbnail->getListing() === $this) {
                $thumbnail->setListing(null);
            }
        }

        return $this;
    }

    public function getLister(): ?Lister
    {
        return $this->lister;
    }

    public function setLister(?Lister $lister): self
    {
        $this->lister = $lister;

        return $this;
    }

    public function getBazarakiUrl(): ?string
    {
        return $this->bazarakiUrl;
    }

    public function setBazarakiUrl(string $bazarakiUrl): self
    {
        $this->bazarakiUrl = $bazarakiUrl;

        return $this;
    }

    public function getLat(): ?string
    {
        return $this->lat;
    }

    public function setLat(?string $lat): self
    {
        $this->lat = $lat;

        return $this;
    }

    public function getLon(): ?string
    {
        return $this->lon;
    }

    public function setLon(?string $lon): self
    {
        $this->lon = $lon;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getQlRef(): ?string
    {
        return $this->qlRef;
    }

    public function setQlRef(string $qlRef): self
    {
        $this->qlRef = $qlRef;

        return $this;
    }

    public function getAssignedTo(): ?string
    {
        return $this->assignedTo;
    }

    public function setAssignedTo(?string $assignedTo): self
    {
        $this->assignedTo = $assignedTo;

        return $this;
    }

    public function getDuplicateExternalId(): ?int
    {
        return $this->duplicateExternalId;
    }

    public function setDuplicateExternalId(?int $duplicateExternalId): self
    {
        $this->duplicateExternalId = $duplicateExternalId;

        return $this;
    }

    public function getIngestedAt(): ?\DateTimeInterface
    {
        return $this->ingestedAt;
    }

    public function setIngestedAt(\DateTimeInterface $ingestedAt): self
    {
        $this->ingestedAt = $ingestedAt;

        return $this;
    }

    public function getListingType(): ?string
    {
        return $this->listingType;
    }

    public function setListingType(string $listingType): self
    {
        $this->listingType = $listingType;

        return $this;
    }

    public function getAreaSize(): ?int
    {
        return $this->areaSize;
    }

    public function setAreaSize(?int $areaSize): self
    {
        $this->areaSize = $areaSize;

        return $this;
    }

    public function getPropertyCondition(): ?string
    {
        return $this->propertyCondition;
    }

    public function setPropertyCondition(?string $propertyCondition): self
    {
        $this->propertyCondition = $propertyCondition;

        return $this;
    }

    public function getCommercialPropertyType(): ?string
    {
        return $this->commercialPropertyType;
    }

    public function setCommercialPropertyType(?string $commercialPropertyType): self
    {
        $this->commercialPropertyType = $commercialPropertyType;

        return $this;
    }

    /**
     * @return Collection|ChangeLog[]
     */
    public function getChangeLogs(): Collection
    {
        return $this->changeLogs;
    }

    public function addChangeLog(ChangeLog $changeLog): self
    {
        if (!$this->changeLogs->contains($changeLog)) {
            $this->changeLogs[] = $changeLog;
            $changeLog->setListing($this);
        }

        return $this;
    }

    public function removeChangeLog(ChangeLog $changeLog): self
    {
        if ($this->changeLogs->contains($changeLog)) {
            $this->changeLogs->removeElement($changeLog);
            // set the owning side to null (unless already changed)
            if ($changeLog->getListing() === $this) {
                $changeLog->setListing(null);
            }
        }

        return $this;
    }

    public function getAssignedAt(): ?\DateTimeInterface
    {
        return $this->assignedAt;
    }

    public function setAssignedAt(\DateTimeInterface $assignedAt): self
    {
        $this->assignedAt = $assignedAt;

        return $this;
    }

    public function getNotes(): ?string
    {
        return $this->notes;
    }

    public function setNotes(?string $notes): self
    {
        $this->notes = $notes;

        return $this;
    }
}
