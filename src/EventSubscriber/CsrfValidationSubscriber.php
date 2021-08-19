<?php

namespace App\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\RequestEvent;

/**
 * Listens on every request and makes sure the Content-Type header is set to JSON, failing the request if not.
 * Used to disable unnecessary CSRF handling in combination with CORS(see App\CorsSubscriber)
 */
class CsrfValidationSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents()
    {
        return [
            'kernel.request' => 'onKernelRequest',
        ];
    }

    public function onKernelRequest(RequestEvent $event)
    {
        // Don't do anything if it's not the master request.
        if (!$event->isMainRequest()) {
            return;
        }

        $request = $event->getRequest();
        $method = $request->getRealMethod();

        # Check if the request method is anything but OPTIONS.
        if ($method !== Request::METHOD_OPTIONS) {
            # Make sure the Content-Type is set to "application/json".
            if ($request->headers->get("Content-Type") !== "application/json") {
                $response = new JsonResponse([
                    "message" => "Invalid Content-Type"
                ], 415);

                $event->setResponse($response);
            }
        }
    }
}
