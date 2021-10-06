<?php

namespace App\Controller;

use App\Entity\Login;
use App\Entity\User;
use App\Entity\Vault;
use App\Repository\LoginRepository;
use Doctrine\ORM\NonUniqueResultException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\SerializerInterface;

class LoginController extends AbstractController
{
    private LoginRepository $repository;

    private SerializerInterface $serializer;

    public function __construct(LoginRepository $repository, SerializerInterface $serializer)
    {
        $this->repository = $repository;
        $this->serializer = $serializer;
    }

    /**
     * Given encrypted data and a user id that owns it, persists that data as a new entity.
     *
     * @param Request $request
     * @return Response
     */
    public function create(Request $request): Response
    {
        $requestBody = json_decode($request->getContent(), true);
        $entityManager = $this->getDoctrine()->getManager();

        $user = $this->getDoctrine()
                        ->getRepository(User::class)
                        ->find($requestBody["userId"]);

        $vault = $this->getDoctrine()
                        ->getRepository(Vault::class)
                        ->find($requestBody["vaultId"]);

        $login = new Login();
        $login->setData($requestBody["data"]);
        $login->setUser($user);
        $login->setVault($vault);

        $entityManager->persist($login);
        $entityManager->flush();

        $serialized = $this->serializer->serialize($login, "json", ["attributes"  => [
            "id",
            "data"
        ]]);

        return new Response($serialized, 201);
    }

    /**
     * Updates a single login with the new encrypted data.
     *
     * @throws NonUniqueResultException
     */
    public function update(Request $request, string $id): Response
    {
        $statusCode = 404;
        $entityManager = $this->getDoctrine()->getManager();
        $requestBody = json_decode($request->getContent(), true);

        $login = $this->repository->findSingleByUserId($id, $requestBody["userId"]);

        if (!empty($login)) {
            $login->setData($requestBody["data"]);
            $entityManager->flush();

            $statusCode = 200;
        }

        $serialized = $this->serializer->serialize($login, "json", ["attributes"  => [
            "id",
            "data"
        ]]);

        return new Response($serialized, $statusCode);
    }

    /**
     * Deletes a single login by id.
     *
     * @throws NonUniqueResultException
     */
    public function delete(Request $request, string $id): Response
    {
        $statusCode = 404;
        $requestBody = json_decode($request->getContent(), true);
        $userId = $requestBody["userId"];

        $entityManager = $this->getDoctrine()->getManager();

        $login = $this->repository->findSingleByUserId($id, $userId);

        if (!empty($login)) {
            $entityManager->remove($login);
            $entityManager->flush();

            $statusCode = 204;
        }

        return new Response("", $statusCode);
    }
}
