<?php


namespace App\Events;


use App\Entity\User;
use Doctrine\Persistence\ObjectManager;
use Symfony\Contracts\EventDispatcher\Event;

class NewUserCreatedEvent
{
    public const NAME = 'user.created';

    protected string $email;
    private string $id;
    protected string $password;

    /**
     * NewUserCreatedEvent constructor.
     * @param User $user
     * @param string $password
     */
    public function __construct(User $user, string $password)
    {
        $this->email = $user->getEmail();
        $this->password = $password;
        $this->id = $user->getId();
    }

    /**
     * @return string
     */
    public function getEmail(): string
    {
        return $this->email;
    }

    /**
     * @return string
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    /**
     * @return string
     */
    public function getId(): string
    {
        return $this->id;
    }

    public function get(ObjectManager $em): User
    {
        return $em->find(User::class, $this->id);
    }


}
