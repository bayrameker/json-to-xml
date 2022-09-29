<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>JSON to XML</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="colorlib.com">

    <!-- MATERIAL DESIGN ICONIC FONT -->
    <link rel="stylesheet" href="fonts/material-design-iconic-font/css/material-design-iconic-font.css">

    <!-- STYLE CSS -->
    <link rel="stylesheet" href="css/style.css">
  </head>
  <body>
    <div class="wrapper">
            
<div id="wizard">
<?php

    require_once('Jsontoxml.class.php');
  
    $filename = 'uploads/products.json';
if (file_exists($filename)) {
     if (unlink('uploads/products.json')) {
    } 
}
                  
if ( isset($_POST["submit"]) ) {

   if ( isset($_FILES["file"])) {

                  // Yükleme Hatası
            
        if ($_FILES["file"]["error"] > 0) {
            echo "Return Code: " . $_FILES["file"]["error"] . "<br />";
            
        }else {
                  // Yazdırma detayları
                 
             echo "File Upload: " . $_FILES["file"]["name"] . "<br/>";
             echo "File Type: " . $_FILES["file"]["type"] . "<br/>";
             echo "File Size: " . ($_FILES["file"]["size"] / 1024) . " Kb<br/>";
             
                  // Dosyanın olup olmadığını kontrol edelim
                 
             if (file_exists("uploads/" . $_FILES["file"]["name"])) {
            echo $_FILES["file"]["name"] . " dosya yüklendi. ";
            
             }else {     
 
                  // Dosya adımız
           

            if(isset($_POST["dosyaisim"]))
            {
                 $storagename =  $_POST["dosyaisim"];
            }
            else{
                $storagename = "output";
            }

             if(isset( $_POST["dosyauzanti"])){
        $dosyauzanti =  $_POST["dosyauzanti"];
    }
    else{
            $dosyauzanti = "xml";
    }
                  // uploads klasörüne kaydettik 
            move_uploaded_file($_FILES["file"]["tmp_name"], "uploads/".$storagename.".json");
            echo "Dosya Yolu: " . "uploads/" . $_FILES["file"]["name"] . "<br />";
            
            }
            
        }
        
     } else {
             echo "Dosya Seçilmedi. <br />";
             
     }
     
}
else{
    echo "Dosya Yok";
}

    $json = file_get_contents('uploads/'.$storagename.".json");

    $jsontoxml = new JsonToXml();
    $xml = $jsontoxml->convert($json, 'main');
    $handle = fopen("output/".$storagename.".".$dosyauzanti, "w");
    fwrite($handle, $xml);
    fclose($handle);

    echo "<br/>"."Çıktı : output/ ".$storagename.".".$dosyauzanti."<br/>"."<br/>";

    $link="output/".$storagename.".".$dosyauzanti;
?>

<button><a href="<?php $link?>"> Çıkıyı Görüntüle</a></button>

</div>
</div>

    <script src="js/jquery-3.3.1.min.js"></script>

    <!-- JQUERY STEP -->
    <script src="js/jquery.steps.js"></script>

    <script src="js/main.js"></script>
<!-- Template created and distributed by Colorlib -->
</body>
</html>