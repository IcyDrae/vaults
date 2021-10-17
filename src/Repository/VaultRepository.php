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
     * Queries based on the user id and returns an array.
     *
     * @return Vault[] Returns an array of Vault objects.
     */
    public function findMultipleByUserId(int $id): array
    {
        return $this->createQueryBuilder("v")
            ->select("v.id, v.data, COUNT(login.vault) AS logins_amount")
            ->leftJoin("App\Entity\Login", "login", "WITH", "v.id = login.vault")
            ->where("v.user = :user_id")
            ->setParameter("user_id", $id)
            ->groupBy("v.id")
            ->getQuery()
            ->getResult(Query::HYDRATE_SCALAR);
    }

    /**
     * Finds a single vault by its id and its user id. Returns only one result.
     *
     * @param $id
     * @param $userId
     * @return mixed
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function findSingleByUserId($id, $userId): mixed
    {
        return $this->createQueryBuilder("v")
            ->select("v")
            ->where("v.id = :vault_id")
            ->andWhere("v.user = :user_id")
            ->setParameters([
                "vault_id" => $id,
                "user_id" => $userId
            ])
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * Finds a single vault by its id and its user id, along with all its related entities(logins, notes etc). Returns only one result.
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

    /*
    public function findOneBySomeField($value): ?Vault
    {
        return $this->createQueryBuilder('v')
            ->andWhere('v.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
