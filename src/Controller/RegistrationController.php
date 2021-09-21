<?php

namespace App\Controller;

use DateTime;
use App\Entity\User;
use App\Form\RegistrationFormType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class RegistrationController extends AbstractController
{

    /**
     * Registers a user using JSON data from the frontend.
     *
     * @throws \Exception if {@link DateTime} fails.
     */
    public function register(Request $request, UserPasswordHasherInterface $passwordEncoder): Response
    {
        $user = new User();
        $form = $this->createForm(RegistrationFormType::class, $user);

        $form->submit(
            json_decode($request->getContent(), true)["form"]
        );

        if ($form->isSubmitted() && $form->isValid()) {
            // Encode the plain password.
            $user->setPassword(
                $passwordEncoder->hashPassword(
                    $user,
                    $form->get("master_password")->getData()
                )
            );

            $user->setRegisteredAt(new DateTime(
                "now",
                new \DateTimeZone("Europe/Berlin")
            ));

            $user->setRoles([
                "ROLE_USER"
            ]);

            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($user);
            $entityManager->flush();

            return new Response("", 201);
        } else {
            return $this->json([
                "registration" => false,
                "errors" => (string) $form->getErrors(true)
            ], 400);
        }
    }
}
