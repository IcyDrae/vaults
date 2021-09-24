<?php

namespace App\Repository;

use App\Entity\Vault;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

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
    public function findByUserId(int $id): array
    {
        $countExpression = "COUNT(logins) AS logins_amount";
        $whereCondition = "vaults.user = $id AND logins.vault = vaults.id";

        return $this->createQueryBuilder("vaults")
            ->select("vaults, $countExpression")
            ->from("App\Entity\Login", "logins")
            ->where($whereCondition)
            ->groupBy("vaults.id")
            ->getQuery()
            ->getResult(\Doctrine\ORM\Query::HYDRATE_ARRAY);
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
