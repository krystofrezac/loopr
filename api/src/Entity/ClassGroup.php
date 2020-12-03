<?php


namespace App\Entity;


use App\Annotation\InjectDateTime;
use App\Annotation\InjectLoggedUser;
use App\Entity\Attributes\Tid;
use App\Enum\AclResourceEnum;
use App\Error\ClientError;
use App\Error\ClientErrorType;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity()
 * @ORM\Table(name="`class_group`", uniqueConstraints={
 *     @ORM\UniqueConstraint(name="name_unique_cg", columns={"year", "section"})
 *     })
 */
class ClassGroup implements IGroup
{
    use Tid;

    /** @var int
     * @ORM\Column(type="integer", length=4)
     * @Assert\NotBlank()
     * @Assert\NotNull()
     * @Groups({"classGroup:read", "classGroup:write"})
     */
    private int $year;

    /** @var string
     * @ORM\Column(type="string")
     * @Assert\NotBlank()
     * @Assert\NotNull()
     * @Groups({"classGroup:read", "classGroup:write"})
     */
    private string $section;

    /**
     * @var Collection
     * @ORM\OneToMany(targetEntity="User", mappedBy="classGroup")
     * @Groups({"classGroup:read", "classGroup:write"})
     */
    private Collection $users;

    /** @var User|null Teacher needs to be user with resource GROUP_TEACHER
     * @ORM\ManyToOne(targetEntity="User")
     * @Groups({"classGroup:read", "classGroup:write"})
     */
    private ?User $teacher = null;

    /**
     * @var User
     * @ORM\ManyToOne(targetEntity="User")
     * @Groups({"classGroup:read"})
     */
    private User $createdBy;

    /**
     * @var \DateTime
     * @ORM\Column(type="datetime")
     */
    private \DateTime $createdAt;

    public array $usersToChange = [];

    /**
     * @Groups({"group:read", "group:basic", "subjectHasGroup:read"})
     * @var Collection
     * @ORM\OneToMany(targetEntity="SubjectHasGroup", mappedBy="classGroup")
     */
    private Collection $subjectRelations;

    /**
     * @return Collection
     */
    public function getSubjectRelations(): Collection
    {
        return $this->subjectRelations;
    }

    /**
     * @param Collection $subjectRelations
     * @return ClassGroup
     */
    public function setSubjectRelations(Collection $subjectRelations): ClassGroup
    {
        $this->subjectRelations = $subjectRelations;
        return $this;
    }


    public function __construct()
    {
        $this->users = new ArrayCollection();
    }

    /**
     * @return int
     */
    public function getYear(): int
    {
        return $this->year;
    }

    /**
     * @param int $year
     * @return ClassGroup
     */
    public function setYear(int $year): ClassGroup
    {
        $this->year = $year;
        return $this;
    }

    /**
     * @return string
     */
    public function getSection(): string
    {
        return $this->section;
    }

    /**
     * @param string $section
     * @return ClassGroup
     */
    public function setSection(string $section): ClassGroup
    {
        $this->section = $section;
        return $this;
    }

    /**
     * @return User[]
     */
    public function getUsers(): array
    {
        return $this->users->getValues();
    }

    public function addUser(User $user)
    {
        $this->usersToChange[] = $user;
    }

    public function removeUser(User $user)
    {
        $this->users->removeElement($user);
    }

    /**
     * @return User|null
     */
    public function getTeacher(): ?User
    {
        return $this->teacher;
    }

    /**
     * @param User $teacher
     * @return ClassGroup
     */
    public function setTeacher(User $teacher): ClassGroup
    {
        if (!$teacher->getRole()->hasResource(AclResourceEnum::GROUP_TEACHER)) {
            throw new ClientError(ClientErrorType::USER_IS_NOT_TEACHER);
        }
        $this->teacher = $teacher;
        return $this;
    }

    /**
     * @return User
     */
    public function getCreatedBy(): User
    {
        return $this->createdBy;
    }

    /**
     * @param User $createdBy
     * @InjectLoggedUser(operations={"create"})
     * @return ClassGroup
     */
    public function setCreatedBy(User $createdBy): ClassGroup
    {
        $this->createdBy = $createdBy;
        return $this;
    }

    /**
     * @return \DateTime
     */
    public function getCreatedAt(): \DateTime
    {
        return $this->createdAt;
    }

    /**
     * @param \DateTime $createdAt
     * @InjectDateTime(operations={"create"})
     * @return ClassGroup
     */
    public function setCreatedAt(\DateTime $createdAt): ClassGroup
    {
        $this->createdAt = $createdAt;
        return $this;
    }
}
