<?php

namespace App\Security;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorage;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Security\Http\Authenticator\AbstractLoginFormAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Credentials\PasswordCredentials;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\PassportInterface;
use Symfony\Component\Security\Http\Util\TargetPathTrait;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;

class Authenticator extends AbstractLoginFormAuthenticator
{
    use TargetPathTrait;

    public const LOGIN_ROUTE = "authentication_login";

    private UrlGeneratorInterface $urlGenerator;

    private ContainerInterface $container;

    private SerializerInterface $serializer;

    public function __construct(UrlGeneratorInterface $urlGenerator,
                                ContainerInterface $container,
                                SerializerInterface $serializer)
    {
        $this->urlGenerator = $urlGenerator;
        $this->container = $container;
        $this->serializer = $serializer;
    }

    /**
     * Returns a custom JSON response including the error message and the requested resource.
     *
     * @param Request $request
     * @param AuthenticationException|null $authException
     * @return Response
     */
    public function start(Request $request, AuthenticationException $authException = null): Response
    {
        return new JsonResponse([
            "authenticated" => false,
            "message" => $authException->getMessage(),
            "request_uri" => $request->getRequestUri()
        ], 401);
    }

    public function authenticate(Request $request): PassportInterface
    {
        $body = json_decode($request->getContent(), true)["form"];

        $request->getSession()->set(Security::LAST_USERNAME, $body["login_email"]);

        return new Passport(
            new UserBadge($body["login_email"]),
            new PasswordCredentials($body["login_master_password"])
        );
    }

    /**
     * Returns a custom JSON response including the serialized user.
     *
     * @param Request $request
     * @param TokenInterface $token
     * @param string $firewallName
     * @return Response|null
     */
    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        /**
         * @var TokenStorage $tokenStorage
         */
        $tokenStorage = $this->container->get("security.token_storage");

        $data = [];

        if (
            ($token = $tokenStorage->getToken()) !== null
        ) {
            if (is_object($user = $token->getUser())) {
                $serializedUser = $this->serializer->serialize($user,"json", [AbstractNormalizer::ATTRIBUTES =>
                    [
                        "id",
                        "username",
                        "firstName",
                        "lastName",
                        "userName",
                        "email",
                        "roles",
                        "registeredAt"
                    ]
                ]);

                $data = [
                    "authenticated" => true,
                    "user" => $serializedUser
                ];
            }
        }

        return new JsonResponse($data, 200);
    }

    /**
     * Returns a custom JSON response and the errors that happened.
     *
     * @param Request $request
     * @param AuthenticationException $exception
     * @return Response
     */
    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): Response
    {
        if ($request->hasSession()) {
            $request->getSession()->set(Security::AUTHENTICATION_ERROR, $exception);
        }

        return new JsonResponse([
            "login" => false,
            "errors" => array_filter([
                $exception->getMessage(),
                $exception->getPrevious() ? $exception->getPrevious()->getMessage() : false
            ])
        ], 401);
    }

    protected function getLoginUrl(Request $request): string
    {
        return $this->urlGenerator->generate(self::LOGIN_ROUTE);
    }
}
