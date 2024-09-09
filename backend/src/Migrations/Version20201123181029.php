<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20201123181029 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE listing CHANGE zip_code zip_code INT DEFAULT NULL, CHANGE city city VARCHAR(255) DEFAULT NULL, CHANGE area area VARCHAR(255) DEFAULT NULL, CHANGE lat lat VARCHAR(255) DEFAULT NULL, CHANGE lon lon VARCHAR(255) DEFAULT NULL, CHANGE assigned_to assigned_to VARCHAR(255) DEFAULT NULL, CHANGE duplicate_external_id duplicate_external_id INT DEFAULT NULL, CHANGE area_size area_size INT DEFAULT NULL, CHANGE property_condition property_condition VARCHAR(255) DEFAULT NULL, CHANGE commercial_property_type commercial_property_type VARCHAR(255) DEFAULT NULL, CHANGE assigned_at assigned_at DATETIME DEFAULT NULL');
        $this->addSql('ALTER TABLE staff CHANGE phone_number phone_number VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE staff_login_history DROP INDEX UNIQ_747B135E2A13690, ADD INDEX IDX_747B135E2A13690 (staff_id_id)');
        $this->addSql('ALTER TABLE staff_login_history CHANGE logged_in_at logged_in_at DATETIME DEFAULT NULL, CHANGE ip ip VARCHAR(255) DEFAULT NULL');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE listing CHANGE zip_code zip_code INT DEFAULT NULL, CHANGE city city VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`, CHANGE area area VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`, CHANGE lat lat VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`, CHANGE lon lon VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`, CHANGE assigned_to assigned_to VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`, CHANGE duplicate_external_id duplicate_external_id INT DEFAULT NULL, CHANGE assigned_at assigned_at DATETIME DEFAULT \'NULL\', CHANGE area_size area_size INT DEFAULT NULL, CHANGE property_condition property_condition VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`, CHANGE commercial_property_type commercial_property_type VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('ALTER TABLE staff CHANGE phone_number phone_number VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('ALTER TABLE staff_login_history DROP INDEX IDX_747B135E2A13690, ADD UNIQUE INDEX UNIQ_747B135E2A13690 (staff_id_id)');
        $this->addSql('ALTER TABLE staff_login_history CHANGE logged_in_at logged_in_at DATETIME DEFAULT \'NULL\', CHANGE ip ip VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`');
    }
}
