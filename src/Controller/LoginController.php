<?php

namespace App\Controller;

use App\Entity\Category;
use App\Entity\Login;
use App\Entity\User;
use App\Entity\Vault;
use App\Repository\LoginRepository;
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
        $categoryId = $requestBody["categoryId"];
        $entityManager = $this->getDoctrine()->getManager();

        $user = $this->getDoctrine()
                        ->getRepository(User::class)
                        ->find($this->getUser()?->getId());

        $vault = $this->getDoctrine()
                        ->getRepository(Vault::class)
                        ->find($requestBody["vaultId"]);

        $login = new Login();
        $login->setData($requestBody["data"]);
        $login->setUser($user);
        $login->setVault($vault);

        if (!empty($categoryId)) {
            $category = $this->getDoctrine()
                ->getRepository(Category::class)
                ->find($categoryId);

            $login->setCategory($category);
        }

        if ($categoryId == 0) {
            $login->setCategory(null);
        }

        $entityManager->persist($login);
        $entityManager->flush();

        $login = array(
            "id" => $login->getId(),
            "data" => $login->getData(),
            "vault_id" => $login->getVault()->getId(),
            "category_id" => $login->getCategory()?->getId()
        );

        return new JsonResponse($login, 201);
    }

    /**
     * Updates a single login with the new encrypted data.
     */
    public function update(Request $request, string $id): Response
    {
        $statusCode = 404;
        $entityManager = $this->getDoctrine()->getManager();
        $requestBody = json_decode($request->getContent(), true);
        $categoryId = $requestBody["categoryId"];

        $login = $this->repository->findOneBy([
            "id" => $id,
            "user" => $this->getUser()?->getId()
        ]);

        if (!empty($login)) {
            $login->setData($requestBody["data"]);

            if (!empty($categoryId)) {
                $category = $this->getDoctrine()
                    ->getRepository(Category::class)
                    ->find($categoryId);

                $login->setCategory($category);
            }

            if ($categoryId == 0) {
                $login->setCategory(null);
            }

            $entityManager->flush();

            $statusCode = 200;
            $login = array(
                "id" => $login->getId(),
                "data" => $login->getData(),
                "vault_id" => $login->getVault()->getId(),
                "category_id" => $login->getCategory()?->getId()
            );
        }

        return new JsonResponse($login, $statusCode);
    }

    /**
     * Deletes a single login by id.
     */
    public function delete(string $id): Response
    {
        $statusCode = 404;

        $entityManager = $this->getDoctrine()->getManager();

        $login = $this->repository->findOneBy([
            "id" => $id,
            "user" => $this->getUser()?->getId()
        ]);

        if (!empty($login)) {
            $entityManager->remove($login);
            $entityManager->flush();

            $statusCode = 204;
        }

        return new Response("", $statusCode);
    }
}
