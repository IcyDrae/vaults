<?php

namespace App\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Event\KernelEvent;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\Event\ResponseEvent;

/**
 * Listens on every request, response & exception and sets CORS headers.
 */
class CorsSubscriber implements EventSubscriberInterface
{

    public static function getSubscribedEvents()
    {
        return [
            'kernel.request' => ['onKernelRequest', 9999],
            'kernel.response' => ['onKernelResponse', 9999],
            'kernel.exception' => ['onKernelException', 9999],
        ];
    }

    public function onKernelException(ExceptionEvent $event): void
    {
        if ($event->getResponse()) {
            $this->setCorsHeaders($event);
        }
    }

    public function onKernelRequest(RequestEvent $event)
    {
        if (!$event->isMainRequest()) {
            return;
        }

        $request = $event->getRequest();

        $method = $request->getRealMethod();

        if ($method === Request::METHOD_OPTIONS) {
            $response = new Response();
            $event->setResponse($response);
        }
    }

    public function onKernelResponse(ResponseEvent $event)
    {
        $this->setCorsHeaders($event);
    }

    /**
     * Sets the needed headers to let the frontend(which is hosted on another hostname) make requests.
     * The global env variable is set in the .env files.
     *
     * @param ResponseEvent $event
     */
    private function setCorsHeaders(KernelEvent $event)
    {
        if (!$event->isMainRequest()) {
            return;
        }

        $response = $event->getResponse();

        $response->headers->add([
            "Access-Control-Allow-Origin" => $_ENV["ALLOWED_ORIGIN"],
            "Access-Control-Allow-Methods" => "GET, POST, PUT, PATCH, DELETE, OPTIONS",
            "Access-Control-Allow-Credentials" => "true",
            "Access-Control-Allow-Headers" => "DNT, Keep-Alive, User-Agent, X-Requested-With, If-Modified-Since, Cache-Control, Content-Type",
            "Access-Control-Max-Age" => 1728000,
            "Content-Type" => "application/json",
        ]);
    }

}
