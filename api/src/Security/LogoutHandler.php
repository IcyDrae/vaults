<?php


namespace App\Security;


use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Http\Logout\LogoutSuccessHandlerInterface;

class LogoutHandler implements LogoutSuccessHandlerInterface
{

    /**
     * Sends a 204 status code as an API and don't redirect like in a normal flow.
     */
    public function onLogoutSuccess(Request $request): Response
    {
        return new Response('', 204);
    }
}
