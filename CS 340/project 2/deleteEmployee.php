<?php
	session_start();
	if(isset($_GET["Ssn"]) && !empty(trim($_GET["Ssn"]))){
		$_SESSION["Ssn"] = $_GET["Ssn"];
	}
	require_once "config.php";
	
	if ($_SERVER["REQUEST_METHOD"] == "POST") {
		if(isset($_SESSION["Ssn"]) && !empty($_SESSION["Ssn"])){ 
			$Ssn = $_SESSION['Ssn'];
			
			$sql = "DELETE FROM EMPLOYEE WHERE Ssn = ?";
   
			if($stmt = mysqli_prepare($link, $sql)){
				mysqli_stmt_bind_param($stmt, "s", $param_Ssn);
 
				$param_Ssn = $Ssn;
       
				if(mysqli_stmt_execute($stmt)){
					header("location: index.php");
					exit();
				} else{
					echo "Error deleting the employee";
				}
			}
		}
		mysqli_stmt_close($stmt);
		mysqli_close($link);
	} else{
		if(empty(trim($_GET["Ssn"]))){
			header("location: error.php");
			exit();
		}
	}
?>

<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>View Record</title>
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
							<h1>Delete Record</h1>
						</div>
						<form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post">
							<div class="alert alert-danger fade in">
								<input type="hidden" name="Ssn" value="<?php echo ($_SESSION["Ssn"]); ?>"/>
								<p>Are you sure you want to delete the record for <?php echo ($_SESSION["Ssn"]); ?>?</p><br>
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