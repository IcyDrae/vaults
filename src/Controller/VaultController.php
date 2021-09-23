<?php

namespace App\Controller;

use App\Entity\Vault;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class VaultController extends AbstractController
{
    /**
     * Queries the repository by the given user id and returns all(if any) found vaults.
     *
     * @param Request $request
     * @return Response
     */
    public function list(Request $request): Response
    {
        $vaults = $this->getDoctrine()
                        ->getRepository(Vault::class)
                        ->findByUserId($request->get("userId"));

        return new JsonResponse([
            "vaults" => $vaults
        ]);
    }

    public function create(): Response
    {
        return new Response();
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
