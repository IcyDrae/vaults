<?php

namespace App\Form;

use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\IsTrue;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;

class RegistrationFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add("first_name")
            ->add("last_name")
            ->add("username")
            ->add("email")
            ->add("master_password", RepeatedType::class, [
                "type" => PasswordType::class,
                "mapped" => false,
                "invalid_message" => "The password fields must match.",
                "required" => true,
                "first_name" => "password",
                "second_name" => "password_confirmation",
                "attr" => ["autocomplete" => "new-password"],
                "constraints" => [
                    new NotBlank([
                        "message" => "Please enter a password",
                    ]),
                    new Length([
                        "min" => 16,
                        "minMessage" => "Your password should be at least {{ limit }} characters",
                        // max length allowed by Symfony for security reasons
                        "max" => 256,
                    ]),
                ],
            ])
            ->add("terms_and_conditions", CheckboxType::class, [
                "mapped" => false,
                "constraints" => [
                    new IsTrue([
                        "message" => "You must agree to our terms.",
                    ]),
                ],
            ]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            "data_class" => User::class,
            "csrf_protection" => false,
            "allow_extra_fields" => true
        ]);
    }
}
