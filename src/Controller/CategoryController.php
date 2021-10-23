<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\Category;
use App\Entity\Vault;
use App\Repository\CategoryRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\SerializerInterface;

class CategoryController extends AbstractController
{
    private CategoryRepository $repository;

    private SerializerInterface $serializer;

    public function __construct(CategoryRepository $repository, SerializerInterface $serializer)
    {
        $this->repository = $repository;
        $this->serializer = $serializer;
    }

    /**
     * Queries the database by the given user id and returns all(if any) found categories.
     *
     * @param Request $request
     * @return Response
     */
    public function list(Request $request): Response
    {
        $responseCode = 200;

        $categories = $this->repository->findBy([
            "user" => $request->get("userId")
        ]);

        if (empty($categories)) {
            $responseCode = 404;
        }

        $categories = $this->serializer->serialize($categories, "json", ["attributes"  => [
            "id",
            "data"
        ]]);

        return new Response($categories, $responseCode);
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

        $category = new Category();
        $category->setData($requestBody["data"]);
        $category->setUser($user);
        $category->setVault($vault);

        $entityManager->persist($category);
        $entityManager->flush();

        $serialized = $this->serializer->serialize($category, "json", ["attributes"  => [
            "id",
            "data"
        ]]);

        return new Response($serialized, 201);
    }

    /**
     * Updates a single category with the new encrypted data.
     */
    public function update(Request $request, string $id): Response
    {
        $statusCode = 404;
        $entityManager = $this->getDoctrine()->getManager();
        $requestBody = json_decode($request->getContent(), true);

        $category = $this->repository->findOneBy([
            "id" => $id,
            "user" => $requestBody["userId"]
        ]);

        if (!empty($category)) {
            $category->setData($requestBody["data"]);
            $entityManager->flush();

            $statusCode = 200;

            $category = $this->serializer->serialize($category, "json", ["attributes"  => [
                "id",
                "data"
            ]]);
        }

        return new Response($category, $statusCode);
    }

    /**
     * Deletes a single vault by id. Orphaned children will also be deleted.
     */
    public function delete(Request $request, string $id): Response
    {
        $statusCode = 404;
        $requestBody = json_decode($request->getContent(), true);
        $userId = $requestBody["userId"];

        $entityManager = $this->getDoctrine()->getManager();

        $category = $this->repository->findOneBy([
            "id" => $id,
            "user" => $userId
        ]);

        if (!empty($category)) {
            $entityManager->remove($category);
            $entityManager->flush();

            $statusCode = 204;
        }

        return new Response("", $statusCode);
    }

    /**
     * Queries the database by the given user id & vault id and returns all(if any) found logins for that vault.
     *
     * @param Request $request
     * @param string $id
     * @param string $userId
     * @return Response
     */
    public function listItems(Request $request, string $id): Response
    {
        $responseCode = 200;
        $requestBody = json_decode($request->getContent(), true);
        $userId = $requestBody["userId"];

        $items = $this->repository->fetchRelated($id, $userId);
        $items = array_filter($items);
        $items = array_values($items);

        if (empty($items)) {
            $responseCode = 404;
        }

        $serializedItems = $this->serializer->serialize($items, "json", ["attributes"  => [
            "id",
            "data"
        ]]);

        return new Response($serializedItems, $responseCode);
    }
}
