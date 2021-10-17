<?php

namespace App\Repository;

use App\Entity\Vault;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\ORM\Query;

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
            ->setParameters([
                "vault_id" => $id,
                "user_id" => $userId
            ])
            ->getQuery()
            ->getResult(Query::HYDRATE_ARRAY);
    }
}
