<?php

namespace App\EventListener;

use Symfony\Component\HttpKernel\Event\ResponseEvent;

/**
 * Listens on every request and sets the "Access-Control-Allow-Origin" & other headers.
 */
class RequestListener
{
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
    private function setCorsHeaders(ResponseEvent $event)
    {
        // Don't do anything if it's not the main request.
        if (!$event->isMainRequest()) {
            return;
        }

        $response = $event->getResponse();

        $response->headers->add([
            "Access-Control-Allow-Origin" => $_ENV["ALLOWED_ORIGIN"],
        ]);

        if ($_SERVER["REQUEST_METHOD"] == "OPTIONS") {
            $response->headers->add([
                "Access-Control-Allow-Method" => "OPTIONS, GET, POST, PUT, DELETE",
                "Access-Control-Allow-Headers" => "DNT, X-User-Token, Keep-Alive, User-Agent, X-Requested-With, If-Modified-Since, Cache-Control, Content-Type",
                'Access-Control-Max-Age' => 1728000,
                "Content-Type" => "application/json",
                'Content-Length' => 0
            ]);
        }
    }

}
