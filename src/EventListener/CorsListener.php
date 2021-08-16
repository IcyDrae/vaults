<?php

namespace App\EventListener;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Event\KernelEvent;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;

/**
 * Listens on every request, response & exception and sets CORS headers.
 */
class CorsListener implements EventSubscriberInterface
{
    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::REQUEST => ['onKernelRequest', 9999],
            KernelEvents::RESPONSE => ['onKernelResponse', 9999],
            KernelEvents::EXCEPTION => ['onKernelException', 9999],
        ];
    }

    public function onKernelException(ExceptionEvent $event): void
    {
        $this->setCorsHeaders($event);
    }

    public function onKernelRequest(RequestEvent $event)
    {
        // Don't do anything if it's not the master request.
        if (!$event->isMainRequest()) {
            return;
        }

        $method = $event->getRequest()
                        ->getRealMethod();

        if (Request::METHOD_OPTIONS === $method) {
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
     * The global env variable is set from the .env files.
     *
     * @param ResponseEvent $event
     */
    private function setCorsHeaders(KernelEvent $event)
    {
        // Don't do anything if it's not the main request.
        if (!$event->isMainRequest()) {
            return;
        }

        $response = $event->getResponse();

        $response->headers->add([
            "Access-Control-Allow-Origin" => $_ENV["ALLOWED_ORIGIN"],
            "Access-Control-Allow-Method" => "OPTIONS, GET, POST, PUT, DELETE",
            "Access-Control-Allow-Headers" => "DNT, Keep-Alive, User-Agent, X-Requested-With, If-Modified-Since, Cache-Control, Content-Type",
            "Access-Control-Max-Age" => 1728000,
            "Content-Type" => "application/json",
        ]);
    }
}
