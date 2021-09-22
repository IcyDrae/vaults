<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;

class VaultController extends AbstractController
{
    public function list(): Response
    {
        return new Response();
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
