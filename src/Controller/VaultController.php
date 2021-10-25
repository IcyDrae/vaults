<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\Vault;
use App\Repository\VaultRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\SerializerInterface;

class VaultController extends AbstractController
{
    private VaultRepository $repository;

    private SerializerInterface $serializer;

    public function __construct(VaultRepository $repository, SerializerInterface $serializer)
    {
        $this->repository = $repository;
        $this->serializer = $serializer;
    }

    /**
     * Queries the database by the given user id and returns all(if any) found vaults.
     *
     * @return Response
     */
    public function list(): Response
    {
        $responseCode = 200;

        $vaults = $this->repository->findMultipleWithRelationsAmount($this->getUser()?->getId());

        if (empty($vaults)) {
            $responseCode = 404;
        }

        return new JsonResponse($vaults, $responseCode);
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
                        ->find($this->getUser()?->getId());

        $vault = new Vault();
        $vault->setData($requestBody["data"]);
        $vault->setUser($user);

        $entityManager->persist($vault);
        $entityManager->flush();

        $serialized = $this->serializer->serialize($vault, "json", ["attributes"  => [
            "id",
            "data"
        ]]);

        return new Response($serialized, 201);
    }

    /**
     * Updates a single vault with the new encrypted data.
     */
    public function update(Request $request, string $id): Response
    {
        $statusCode = 404;
        $entityManager = $this->getDoctrine()->getManager();
        $requestBody = json_decode($request->getContent(), true);

        $vault = $this->repository->findOneBy([
            "id" => $id,
            "user" => $this->getUser()?->getId()
        ]);

        if (!empty($vault)) {
            $vault->setData($requestBody["data"]);
            $entityManager->flush();

            $statusCode = 200;

            $vault = $this->serializer->serialize($vault, "json", ["attributes"  => [
                "id",
                "data"
            ]]);
        }

        return new Response($vault, $statusCode);
    }

    /**
     * Deletes a single vault by id. Orphaned children will also be deleted.
     */
    public function delete(string $id): Response
    {
        $statusCode = 404;

        $entityManager = $this->getDoctrine()->getManager();

        $vault = $this->repository->findOneBy([
            "id" => $id,
            "user" => $this->getUser()?->getId()
        ]);

        if (!empty($vault)) {
            $entityManager->remove($vault);
            $entityManager->flush();

            $statusCode = 204;
        }

        return new Response("", $statusCode);
    }

    /**
     * Queries the database by the given user id & vault id and returns all(if any) found logins for that vault.
     *
     * @param string $id
     * @return Response
     */
    public function listItems(string $id): Response
    {
        $responseCode = 200;

        $items = $this->repository->fetchRelated($id, $this->getUser()?->getId());
        $items = array_filter($items);
        $items = array_values($items);

        if (empty($items)) {
            $responseCode = 404;
        }

        $itemsResponse = array();
        foreach ($items as $item) {
            array_push($itemsResponse, [
                "id" => $item->getId(),
                "data" => $item->getData(),
                "vault_id" => $item->getVault()->getId(),
                "category_id" => $item->getCategory()?->getId()
            ]);
        }

        return new JsonResponse($itemsResponse, $responseCode);
    }
}
