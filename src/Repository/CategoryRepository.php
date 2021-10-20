<?php

namespace App\Repository;

use App\Entity\Category;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Query;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Category|null find($id, $lockMode = null, $lockVersion = null)
 * @method Category|null findOneBy(array $criteria, array $orderBy = null)
 * @method Category[]    findAll()
 * @method Category[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CategoryRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Category::class);
    }

    /**
     * Finds a single category by its id and its user id, along with all its related entities(logins, notes etc).
     *
     * @param $id
     * @param $userId
     * @return mixed
     */
    public function fetchRelated($id, $userId): mixed
    {
        return $this->createQueryBuilder("c")
            ->select("login", "note")
            ->where("c.id = :category_id")
            ->leftJoin("App\Entity\Login", "login", Query\Expr\Join::WITH, "login.category = c.id")
            ->leftJoin("App\Entity\Note", "note", Query\Expr\Join::WITH, "note.category = c.id")
            ->andWhere("c.user = :user_id")
            ->setParameters([
                "category_id" => $id,
                "user_id" => $userId
            ])
            ->getQuery()
            ->getResult(Query::HYDRATE_ARRAY);
    }
}
