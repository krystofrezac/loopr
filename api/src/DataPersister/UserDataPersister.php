<?php


namespace App\DataPersister;


use ApiPlatform\Core\DataPersister\ContextAwareDataPersisterInterface;
use App\Entity\ClassGroup;
use App\Entity\User;
use App\Entity\UserPrivateData;
use App\Events\NewUserCreatedEvent;
use Doctrine\Persistence\ManagerRegistry;
use Nette\Utils\Random;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Validator\Constraints\Uuid;

class UserDataPersister implements ContextAwareDataPersisterInterface
{

    private ContextAwareDataPersisterInterface $decorated;
    private UserPasswordEncoderInterface $encoder;
    protected MessageBusInterface $messageBus;
    private ManagerRegistry $managerRegistery;

    public function __construct(
        ContextAwareDataPersisterInterface $decorated,
        UserPasswordEncoderInterface $encoder,
        MessageBusInterface $messageBus,
        ManagerRegistry $managerRegistry
    ) {
        $this->decorated = $decorated;
        $this->encoder = $encoder;
        $this->messageBus = $messageBus;
        $this->managerRegistery = $managerRegistry;
    }

    public function supports($data, array $context = []): bool
    {
        return $this->decorated->supports($data, $context);
    }

    public function persist($data, array $context = [])
    {
        if ($data instanceof User && ($context['graphql_operation_name'] ?? null) == 'create') {
            $password = $data->getRawPassword() ?? Random::generate(15);
            $data->setPassword($this->encoder->encodePassword($data, $password));

            //private data object init
            $private = new UserPrivateData();
            $private->setUser($data);
            $data->setPrivateData($private);
            $this->managerRegistery->getManager()->persist($private);
            $result = $this->decorated->persist($data, $context);
            $this->managerRegistery->getManager()->flush();
            $event = new NewUserCreatedEvent($result, $password);
            $this->messageBus->dispatch($event);
        } elseif ($data instanceof User && ($context['graphql_operation_name'] ?? null) == 'edit') {
            if ($data->getRawPassword()) {
                $data->setPassword($this->encoder->encodePassword($data, $data->getRawPassword()));
            }
            $result = $this->decorated->persist($data, $context);
        } else {
            $result = $this->decorated->persist($data, $context);
        }

        return $result;
    }

    public function remove($data, array $context = [])
    {
        return $this->decorated->remove($data, $context);
    }
}
