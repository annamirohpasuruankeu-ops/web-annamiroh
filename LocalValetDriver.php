<?php

use Valet\Drivers\ValetDriver;

class LocalValetDriver extends ValetDriver
{
    /**
     * Tentukan apakah driver ini cocok untuk menjalankan situs.
     */
    public function serves(string $sitePath, string $siteName, string $uri): bool
    {
        return true;
    }

    /**
     * Tentukan apakah request yang masuk adalah file statis (seperti CSS/JS).
     */
    public function isStaticFile(string $sitePath, string $siteName, string $uri): string|false
    {
        if (file_exists($staticFilePath = $sitePath.$uri) && !is_dir($staticFilePath)) {
            return $staticFilePath;
        }

        return false;
    }

    /**
     * Arahkan semua request non-statis ke file index.php di root utama.
     */
    public function frontControllerPath(string $sitePath, string $siteName, string $uri): string
    {
        return $sitePath.'/index.php';
    }
}