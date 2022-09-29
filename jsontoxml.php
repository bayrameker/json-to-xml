<?php
    header('Content-Type: application/xml; charset=utf-8');

    require_once('Jsontoxml.class.php');


    $json = file_get_contents('uploads/products.json');

    $jsontoxml = new JsonToXml();
    $xml = $jsontoxml->convert($json, 'main');
    echo $xml;
    $handle = fopen(__DIR__ ."../output/output.xml", "w");
    fwrite($handle, $xml);
    fclose($handle);
?>