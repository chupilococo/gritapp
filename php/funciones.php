<?php
    if (isset($_SERVER['HTTP_ORIGIN'])) {  
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");  
        header('Access-Control-Allow-Credentials: true');  
        header('Access-Control-Max-Age: 86400');   
    }  
      
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {  
      
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))  
            header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");  
      
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))  
            header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");  
    }  

$cnx=mysqli_connect('52.26.64.212','wadmin','bernardo05','anjular');
echo mysqli_error($cnx);
$usuarios= function(){
	global $cnx;
	global $_GET;
	$q=<<<sql
	select * from usuarios
	where usuario='$_GET[u]' and pass='$_GET[p]'
	limit 1
	;
sql;
	$us=[];
	$r= mysqli_query($cnx,$q);
	while ($f=mysqli_fetch_assoc($r)){
		$us[]=$f;
	};
	return json_encode($us);
};


$comentarios= function(){
	global $cnx;
	$q=<<<sql
	select * from comentarios
	order by id desc;
sql;
	$us=[];
	$r= mysqli_query($cnx,$q);
	while ($f=mysqli_fetch_assoc($r)){
		$us[]=$f;
	};
	return json_encode($us);
};

$agregar= function(){
	global $cnx;
	$q=<<<sql
	INSERT INTO comentarios
	set quien='$_GET[u]',que='$_GET[t]',publico='$_GET[p]';
sql;

	$r= mysqli_query($cnx,$q);
return mysqli_error($cnx);
};


$newUser= function(){
	global $cnx;
	$q=<<<sql
	INSERT INTO usuarios
	set usuario='$_GET[u]',pass='$_GET[p]';
sql;

$r= mysqli_query($cnx,$q);
$resp=(mysqli_error($cnx))?'el usuario ya existe':'Ya estas dado de alta. Favor de ingresar';
return $resp;
};


if($_GET['f']=='comentarios'){
echo $comentarios();
}else if($_GET['f']=='usuario'){
echo $usuarios();
}else if($_GET['f']=='agregar'){
echo $agregar();
}else if($_GET['f']=='newUser'){
echo $newUser();
}else if($_GET['f']=='comentEdit'){
	throw new Exception("Comentarios editar", 1);
}else{
	throw new Exception("Metodo no soportado", 1);
}
