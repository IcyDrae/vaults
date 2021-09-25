<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\Vault;
use App\Repository\VaultRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class VaultController extends AbstractController
{
    private VaultRepository $repository;

    public function __construct(VaultRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Queries the database by the given user id and returns all(if any) found vaults.
     *
     * @param Request $request
     * @return Response
     */
    public function list(Request $request): Response
    {
        $responseCode = 200;

        $vaults = $this->repository->findByUserId(
            $request->get("userId")
        );

        if (empty($vaults)) {
            $responseCode = 404;
        }

        return new JsonResponse([
            "vaults" => $vaults
        ], $responseCode);
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

        $vault = new Vault();
        $vault->setData($requestBody["data"]);
        $vault->setUser($user);

        $entityManager->persist($vault);
        $entityManager->flush();

        return new Response("", 201);
    }

    public function edit(string $id): Response
    {
        return new Response();
    }

    public function delete(string $id): Response
    {
        return new Response();
    }
}
