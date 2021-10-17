<?php

namespace App\Controller;

use App\Entity\Note;
use App\Entity\User;
use App\Entity\Vault;
use App\Repository\NoteRepository;
use Doctrine\ORM\NonUniqueResultException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\SerializerInterface;

class NoteController extends AbstractController
{
    private NoteRepository $repository;

    private SerializerInterface $serializer;

    public function __construct(NoteRepository $repository, SerializerInterface $serializer)
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

        $note = new Note();
        $note->setData($requestBody["data"]);
        $note->setUser($user);
        $note->setVault($vault);

        $entityManager->persist($note);
        $entityManager->flush();

        $serialized = $this->serializer->serialize($note, "json", ["attributes"  => [
            "id",
            "data"
        ]]);

        return new Response($serialized, 201);
    }

    /**
     * Updates a single note with the new encrypted data.
     *
     * @throws NonUniqueResultException
     */
    public function update(Request $request, string $id): Response
    {
        $statusCode = 404;
        $entityManager = $this->getDoctrine()->getManager();
        $requestBody = json_decode($request->getContent(), true);

        $note = $this->repository->findOneBy([
            "id" => $id,
            "user" => $requestBody["userId"]
        ]);

        if (!empty($note)) {
            $note->setData($requestBody["data"]);
            $entityManager->flush();

            $statusCode = 200;
        }

        $serialized = $this->serializer->serialize($note, "json", ["attributes"  => [
            "id",
            "data"
        ]]);

        return new Response($serialized, $statusCode);
    }

    /**
     * Deletes a single note by id.
     *
     * @throws NonUniqueResultException
     */
    public function delete(Request $request, string $id): Response
    {
        $statusCode = 404;
        $requestBody = json_decode($request->getContent(), true);
        $userId = $requestBody["userId"];

        $entityManager = $this->getDoctrine()->getManager();

        $note = $this->repository->findOneBy([
            "id" => $id,
            "user" => $userId
        ]);

        if (!empty($note)) {
            $entityManager->remove($note);
            $entityManager->flush();

            $statusCode = 204;
        }

        return new Response("", $statusCode);
    }
}
