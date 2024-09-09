<?php

namespace App\Entity;

use App\Repository\StaffLoginHistoryRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=StaffLoginHistoryRepository::class)
 */
class StaffLoginHistory
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity=Staff::class, cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     */
    private $staffId;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $loggedInAt;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $ip;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStaffId(): ?Staff
    {
        return $this->staffId;
    }

    public function setStaffId(Staff $staffId): self
    {
        $this->staffId = $staffId;

        return $this;
    }

    public function getLoggedInAt(): ?\DateTimeInterface
    {
        return $this->loggedInAt;
    }

    public function setLoggedInAt(?\DateTimeInterface $loggedInAt): self
    {
        $this->loggedInAt = $loggedInAt;

        return $this;
    }

    public function getIp(): ?string
    {
        return $this->ip;
    }

    public function setIp(?string $ip): self
    {
        $this->ip = $ip;

        return $this;
    }
}
