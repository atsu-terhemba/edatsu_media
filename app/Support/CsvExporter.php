<?php

namespace App\Support;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Symfony\Component\HttpFoundation\StreamedResponse;

class CsvExporter
{
    /**
     * Stream a CSV download from a query, chunked to keep memory flat.
     * Excel / Google Sheets open this directly thanks to the UTF-8 BOM.
     *
     * @param  Builder|QueryBuilder  $query
     * @param  array<string>         $headers   Header row labels
     * @param  callable              $rowMapper fn($row) => array<scalar> matching $headers
     */
    public static function stream($query, array $headers, callable $rowMapper, string $filename): StreamedResponse
    {
        return response()->streamDownload(function () use ($query, $headers, $rowMapper) {
            $out = fopen('php://output', 'w');
            fwrite($out, "\xEF\xBB\xBF");
            fputcsv($out, $headers);

            $query->chunk(500, function ($rows) use ($out, $rowMapper) {
                foreach ($rows as $r) {
                    fputcsv($out, $rowMapper($r));
                }
            });

            fclose($out);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }
}
