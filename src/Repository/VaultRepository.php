<?php

namespace App\Repository;

use App\Entity\Vault;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\ORM\Query;
use Symfony\Component\Uid\Uuid;

/**
 * @method Vault|null find($id, $lockMode = null, $lockVersion = null)
 * @method Vault|null findOneBy(array $criteria, array $orderBy = null)
 * @method Vault[]    findAll()
 * @method Vault[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class VaultRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Vault::class);
    }

    /**
     * Queries using the user id and includes the relations amount.
     *
     * @return Vault[] Returns an array of Vault objects.
     */
    public function findMultipleWithRelationsAmount(Uuid $userId): array
    {
        $vaults = [];

        $query = $this->findBy([
            "user" => $userId
        ]);

        foreach ($query as $result) {
            $loginsAmount = $result->getLogins()->count();
            $notesAmount = $result->getNotes()->count();
            $itemsAmount = $loginsAmount + $notesAmount;

            array_push($vaults, [
                "id" => $result->getId(),
                "data" => $result->getData(),
                "items_amount" => $itemsAmount
            ]);
        }

        return $vaults;
    }

    /**
     * Finds a single vault by its id and its user id, along with all its related entities(logins, notes etc).
     *
     * @param $id
     * @param $userId
     * @return mixed
     */
    public function fetchRelated($id, $userId): mixed
    {
        return $this->createQueryBuilder("v")
            ->select("login", "note")
            ->where("v.id = :vault_id")
            ->leftJoin("App\Entity\Login", "login", Query\Expr\Join::WITH, "login.vault = v.id")
            ->leftJoin("App\Entity\Note", "note", Query\Expr\Join::WITH, "note.vault = v.id")
            ->andWhere("v.user = :user_id")
            ->setParameter("vault_id", $id, "uuid")
            ->setParameter("user_id", $userId, "uuid")
            ->getQuery()
            ->getResult();
    }
}
