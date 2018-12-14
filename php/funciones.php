<?php
if (isset($_SERVER['HTTP_ORIGIN'])) {
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");  
        header('Access-Control-Allow-Credentials: true');  
        header('Access-Control-Max-Age: 86400');   
    }  
      
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])){
            header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        }
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])){
            header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
        }
    }

$cnx=mysqli_connect('52.26.64.212','wadmin','bernardo05','anjular');
echo mysqli_error($cnx);
$usuarios= function(){
	global $cnx;
	global $_GET;
	$q= "	select * from usuarios
	where usuario='$_GET[u]' and pass='$_GET[p]'
	limit 1
	;";
	$us=[];
	$r= mysqli_query($cnx,$q);
	while ($f=mysqli_fetch_assoc($r)){
		$us[]=$f;
	};
	return json_encode($us);
};


$comentarios= function(){
	global $cnx;
	$q= "	select * from comentarios
	order by id desc;";
	$us=[];
	$r= mysqli_query($cnx,$q);
	while ($f=mysqli_fetch_assoc($r)){
		$us[]=$f;
	};
	return json_encode($us);
};

$getComent= function($id){
	global $cnx;
	$q= "	select * from comentarios
	where id =$id
	limit 1;";
	$r= mysqli_query($cnx,$q);
	$f=mysqli_fetch_assoc($r);
	return json_encode($f);
};
$delComent= function($id){
	global $cnx;
	$q= "	DELETE from comentarios
	where id =$id
	limit 1;";
	$r= mysqli_query($cnx,$q);
	return json_encode($r);
};

$agregar= function(){
	global $cnx;
	$q= "	INSERT INTO comentarios
	set quien='$_GET[u]',que='$_GET[t]',publico='$_GET[p]';";

	$r= mysqli_query($cnx,$q);
return mysqli_error($cnx);
};


$newUser= function(){
	global $cnx;
	$q= "	INSERT INTO usuarios
	set usuario='$_GET[u]',pass='$_GET[p]';";

$r= mysqli_query($cnx,$q);
$resp=(mysqli_error($cnx))?'el usuario ya existe':'Ya estas dado de alta. Favor de ingresar';
return $resp;
};


if(isset($_GET['f'])){
    $_funcion=$_GET['f'];
    if($_funcion=='comentarios'){
        echo $comentarios();
    }else if($_funcion=='usuario'){
        echo $usuarios();
    }else if($_funcion=='agregar'){
        echo $agregar();
    }else if($_funcion=='newUser'){
        echo $newUser();
    }else if($_funcion=='comentEdit'){
        echo $getComent($_GET['u']);
    }else if($_funcion=='comentDel'){
        echo $delComent($_GET['u']);
    }else{
        throw new Exception("Metodo no soportado", 1);
    }
}else{
    throw new Exception("no se especifico ningun metodo");
}