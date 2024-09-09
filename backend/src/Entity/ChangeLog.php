<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\ChangeLogRepository")
 */
class ChangeLog
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Listing", inversedBy="changeLogs")
     * @ORM\JoinColumn(nullable=false)
     */
    private $listing;

    /**
     * @ORM\Column(type="datetime")
     */
    private $createdAt;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $changedBy;

    /**
     * @ORM\Column(type="text")
     */
    private $changes;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getListing(): ?Listing
    {
        return $this->listing;
    }

    public function setListing(?Listing $listing): self
    {
        $this->listing = $listing;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getChangedBy(): ?string
    {
        return $this->changedBy;
    }

    public function setChangedBy(string $changedBy): self
    {
        $this->changedBy = $changedBy;

        return $this;
    }

    public function getChanges()
    {
        return $this->changes;
    }

    public function setChanges($changes): self
    {
        $this->changes = $changes;

        return $this;
    }
}
