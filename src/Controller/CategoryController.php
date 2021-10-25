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
     * @return Response
     */
    public function list(): Response
    {
        $responseCode = 200;

        $categories = $this->repository->findBy([
            "user" => $this->getUser()?->getId()
        ]);

        if (empty($categories)) {
            $responseCode = 404;
        }

        $categoriesResponse = array();

        foreach ($categories as $category) {
             array_push($categoriesResponse,
                 [
                     "id" => $category->getId(),
                     "data" => $category->getData(),
                     "vault_id" => $category->getVault()->getId()
                 ]
            );
        }

        return new JsonResponse($categoriesResponse, $responseCode);
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
        $vault = $this->getDoctrine()
            ->getRepository(Vault::class)
            ->find($requestBody["vaultId"]);

        $category = new Category();
        $category->setData($requestBody["data"]);
        $category->setUser($user);
        $category->setVault($vault);

        $entityManager->persist($category);
        $entityManager->flush();

        $category = array(
            "id" => $category->getId(),
            "data" => $category->getData(),
            "vault_id" => $category->getVault()->getId()
        );

        return new JsonResponse($category, 201);
    }

    /**
     * Deletes a single vault by id. Orphaned children will also be deleted.
     */
    public function delete(string $id): Response
    {
        $statusCode = 404;

        $entityManager = $this->getDoctrine()->getManager();

        $category = $this->repository->findOneBy([
            "id" => $id,
            "user" => $this->getUser()?->getId()
        ]);

        if (!empty($category)) {
            $entityManager->remove($category);
            $entityManager->flush();

            $statusCode = 204;
        }

        return new Response("", $statusCode);
    }
}
