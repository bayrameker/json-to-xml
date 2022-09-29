<?php

// trait yöntemimi tanımlıyorum ve içerisine çağıracağım methodlarımı tanımlıyorum
trait MethodsTrait {

public static function StrCharArray() {
       return array("Š"=>"S", "š"=>"s", "Ž"=>"Z", "ž"=>"z", "À"=>"A", "Á"=>"A", "Â"=>"A", "Ã"=>"A", "Ä"=>"A", "Å"=>"A", "Æ"=>"A", "Ç"=>"C", "È"=>"E", "É"=>"E",
                                "Ê"=>"E", "Ë"=>"E", "Ì"=>"I", "Í"=>"I", "Î"=>"I", "Ï"=>"I", "Ñ"=>"N", "Ò"=>"O", "Ó"=>"O", "Ô"=>"O", "Õ"=>"O", "Ö"=>"O", "Ø"=>"O", "Ù"=>"U",
                                "Ú"=>"U", "Û"=>"U", "Ü"=>"U", "Ý"=>"Y", "Þ"=>"B", "ß"=>"Ss", "Ğ"=>"G",  "Ş"=>"S" ,"à"=>"a", "á"=>"a", "â"=>"a", "ã"=>"a", "ä"=>"a", "å"=>"a",
                                 "æ"=>"a", "ç"=>"c",
                                "è"=>"e", "é"=>"e", "ê"=>"e", "ë"=>"e", "ì"=>"i", "í"=>"i", "î"=>"i", "ï"=>"i", "ð"=>"o", "ñ"=>"n", "ò"=>"o", "ó"=>"o", "ô"=>"o", "õ"=>"o",
                                "ö"=>"o", "ø"=>"o", "ù"=>"u", "ú"=>"u", "û"=>"u", "ý"=>"y", "þ"=>"b", "ÿ"=>"y", "ğ"=>"g", "ş"=>"s" );
    }

 public static function StrReplace($string,$replace){
            $string = strtr($string, $replace);
            $string = preg_replace("/\s+/", " ", $string);
            $string = str_replace(" ", "_", $string);
                    return $string = preg_replace("/[^a-zA-Z0-9-_.]/", "", $string);
 }  

}

interface Normalize{
    
public function normalize_tag($string);
public function normalize_content($string);

}

// soyut sınıfımı middleware olarak tanımladım
abstract class Middleware implements Normalize{

private $extract_root;
abstract public function proccess($object, $parent = "");
abstract public function convert($json, $main = "");

}

  
    class JsonToXml extends Middleware {
        use MethodsTrait;

        public function __construct($extract_root = false){
            $this->extract_root = $extract_root;
        }

        // Türkçe veya farklı bir karakter için karakterler için string replace yapıyoruz 
        public function normalize_tag($string){
            $replace = MethodsTrait::StrCharArray();
            return MethodsTrait::StrReplace($string,$replace);
        }

            // Elimizdeki string verimizi karakterlere ayırıyoruz
        public function normalize_content($string){
            $string = htmlspecialchars_decode($string, ENT_XML1 | ENT_COMPAT);
            return htmlspecialchars($string, ENT_XML1 | ENT_COMPAT, "UTF-8");
        }

        public function proccess($object, $parent = ""){
            $xml = "";
            foreach($object as $key => $x){
                if((is_null($x) || empty($x)) && $x !== 0){
                    if(is_numeric($key)) $xml .= "<".$this->normalize_tag($parent)." />";
                    else $xml .= "<".$this->normalize_tag($key)." />";
                    unset($object->$key);
                    continue;
                }
                if(is_bool($x)){
                    if(is_numeric($key) == false) $xml .= "<".$this->normalize_tag($key).">";
                    $xml .= $x ? "1" : "0";
                    if(is_numeric($key) == false) $xml .= "</".$this->normalize_tag($key).">";
                    unset($object->$key);
                }
                if(is_string($x)){
                    if(is_numeric($key) == false) $xml .= "<".$this->normalize_tag($key).">";
                    $xml .= $this->normalize_content($x);
                    if(is_numeric($key) == false) $xml .= "</".$this->normalize_tag($key).">";
                    unset($object->$key);
                    continue;
                }
                if(is_array($x)){
                    foreach($x as $x2){
                        if(is_object($x2)){
                            if(is_numeric($key) == false) $xml .= "<".$this->normalize_tag($key).">";
                            $xml .= $this->proccess($x2, $key);
                            if(is_numeric($key) == false) $xml .= "</".$this->normalize_tag($key).">";
                        } else {
                            if(is_numeric($key) == false) $xml .= "<".$this->normalize_tag($key).">";
                            $xml .= $this->normalize_content($x2);
                            if(is_numeric($key) == false) $xml .= "</".$this->normalize_tag($key).">";
                        }
                    }
                    unset($object->$key);
                    continue;
                }
                if(is_object($x)){
                    $xml2 = "";
                    foreach($x as $key2 => $x2){
                        if(!is_object($x2)){
                            if(is_numeric($key2) == false) $xml2 .= "<".$this->normalize_tag($key2).">";
                            $xml2 .= $this->normalize_content($x2);
                            if(is_numeric($key2) == false) $xml2 .= "</".$this->normalize_tag($key2).">";
                        }
                    }
                    if(!empty($xml2)){
                        if(is_numeric($key) == false) $xml .= "<".$this->normalize_tag($key).">";
                        $xml .= $xml2;
                        if(is_numeric($key) == false) $xml .= "</".$this->normalize_tag($key).">";
                    } else {
                        if(is_numeric($key) == false) $xml .= "<".$this->normalize_tag($key).">";
                        $xml .= $this->proccess($x, $key);
                        if(is_numeric($key) == false) $xml .= "</".$this->normalize_tag($key).">";
                    }
                    unset($object->$key);
                    continue;
                }
            }
            return $xml;
        }

        public function convert($json, $main = ""){
            $object = @json_decode($json);
            if(!$object) return false;
            if($this->extract_root){
                $vars = array_keys(get_object_vars($object));
                if(count($vars) == 1){
                    $key = $vars[0];
                    if(is_string($key) && empty($key) == false){
                        $main = $key;
                        if(is_object($object->$key) || is_array($object->$key)) $object = $object->$key;
                    }
                }
            }
            if(empty($main)) $main = "root";
            $xml = "";
            $xml .= "<".$this->normalize_tag($main).">";
            $xml .= $this->proccess($object);
            $xml .= "</".$this->normalize_tag($main).">";
            return $xml;
        }
    }
