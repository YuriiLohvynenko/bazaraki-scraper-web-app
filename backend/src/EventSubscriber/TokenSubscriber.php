<?php
namespace App\EventSubscriber;

use App\Controller\TokenAuthenticateController;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ControllerEvent;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\KernelEvents;
use App\Repository\StaffRepository;
use App\Repository\AdminUsersRepository;

class TokenSubscriber implements EventSubscriberInterface
{
    private $staffRepository;
    public $user;
    private $adminUsersRepository;
    public function __construct(StaffRepository $staffRepository, AdminUsersRepository $adminUsersRepository)
    {
        $this->staffRepository = $staffRepository;
        $this->adminUsersRepository = $adminUsersRepository;
    }

    public function onKernelController(ControllerEvent $event)
    {
        $controller = $event->getController();
        // when a controller class defines multiple action methods, the controller
        // is returned as [$controllerInstance, 'methodName']
        if (is_array($controller)) {
            $controller = $controller[0];
        }

        if ($controller instanceof TokenAuthenticateController) {
            $token = $event->getRequest()->headers->get('Authorization');

            if (empty($token)) {
                throw new AccessDeniedHttpException('This action needs a valid token!');
            }
            $isAdmin = strpos( $token, 'Admin');
            if ($isAdmin === 0) {
                $token = explode(" ", $token);

                $user = $this->adminUsersRepository->find($token[1]);
                $user->isAdmin = true;

            }else
            {
                $user = $this->staffRepository->find($token);
            }
            $controller->user = $user;
        }
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::CONTROLLER => 'onKernelController',
        ];
    }
}