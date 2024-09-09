<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200416173258 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE lister (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, type VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE listing ADD lister_id INT NOT NULL, DROP listed_by_type, DROP listed_by');
        $this->addSql('ALTER TABLE listing ADD CONSTRAINT FK_CB0048D4D72DD4E7 FOREIGN KEY (lister_id) REFERENCES lister (id)');
        $this->addSql('CREATE INDEX IDX_CB0048D4D72DD4E7 ON listing (lister_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE listing DROP FOREIGN KEY FK_CB0048D4D72DD4E7');
        $this->addSql('DROP TABLE lister');
        $this->addSql('DROP INDEX IDX_CB0048D4D72DD4E7 ON listing');
        $this->addSql('ALTER TABLE listing ADD listed_by_type VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, ADD listed_by VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, DROP lister_id');
    }
}
