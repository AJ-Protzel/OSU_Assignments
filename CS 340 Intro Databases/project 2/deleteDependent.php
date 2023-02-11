<?php
	session_start();
	if(isset($_GET["Dependent_name"]) && !empty(trim($_GET["Dependent_name"]))){
		$_SESSION["Dependent_name"] = $_GET["Dependent_name"];
	}
	require_once "config.php";
	
	if ($_SERVER["REQUEST_METHOD"] == "POST") {
		if(isset($_SESSION["Dependent_name"]) && !empty($_SESSION["Dependent_name"])){ 
			$Dependent_name = $_SESSION['Dependent_name'];
			
			$sql = "DELETE FROM `DEPENDENT` WHERE Dependent_name = ?";
   
			if($stmt = mysqli_prepare($link, $sql)){
				mysqli_stmt_bind_param($stmt, "s", $param_Dependent_name);
 
				$param_Dependent_name = $Dependent_name;
       
				if(mysqli_stmt_execute($stmt)){
					header("location: index.php");
					exit();
				} else{
					echo "Error deleting the Dependent";
				}
			}
		}
		mysqli_stmt_close($stmt);
		mysqli_close($link);
	} else{
		if(empty(trim($_GET["Dependent_name"]))){
			header("location: error.php");
			exit();
		}
	}
?>

<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>View Dependent</title>
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.css">
		<style type="text/css">
			.wrapper{
				width: 500px;
				margin: 0 auto;
			}
		</style>
	</head>

	<body>
		<div class="wrapper">
			<div class="container-fluid">
				<div class="row">
					<div class="col-md-12">
						<div class="page-header">
							<h1>Delete Dependent</h1>
						</div>
						<form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post">
							<div class="alert alert-danger fade in">
								
                            	<input type="hidden" name="Dependent_name" value="<?php echo $Dependent_name; ?>"/>
								<p>Are you sure you want to delete <?php echo ($_SESSION["Dependent_name"]); ?> as a dependent?</p><br>
									<input type="submit" value="Yes" class="btn btn-danger">
									<a href="index.php" class="btn btn-default">No</a>
								</p>
							</div>
						</form>
					</div>
				</div>        
			</div>
		</div>
	</body>
</html>