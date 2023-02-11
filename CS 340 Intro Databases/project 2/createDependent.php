<?php
	session_start();
	ob_start();
	$Essn = $_SESSION["Essn"];
	require_once "config.php";
?>

<?php 
	$Dependent_name = $Relationship = $Sex = $Bdate = $Bdate1 = "";
	$Dependent_name_err = $Relationship_err = $Sex_err = $Essn_err = "" ;

	if($_SERVER["REQUEST_METHOD"] == "POST"){
		if(empty($Essn)){
			$Essn_err = "No Essn.";     
		}
		$Dependent_name = trim($_POST["Dependent_name"]);
		if(empty($Dependent_name)){
			$Dependent_name_err = "Please enter a Dependent_name.";
		} elseif(!filter_var($Dependent_name, FILTER_VALIDATE_REGEXP, array("options"=>array("regexp"=>"/^[a-zA-Z\s]+$/")))){
			$Dependent_name_err = "Please enter a valid Dependent_name.";
		} 
		$Sex = trim($_POST["Sex"]);
		if(empty($Sex)){
			$Sex_err = "Please enter Sex.";     
		}
		$Bdate = trim($_POST["Bdate"]);
		if(empty($Bdate)){
			$SBdate_err = "Please enter birthdate.";     
		}
		$Relationship = trim($_POST["Relationship"]);
		if(empty($Relationship)){
			$Relationship_err = "Please enter a Relationship.";
		} elseif(!filter_var($Relationship, FILTER_VALIDATE_REGEXP, array("options"=>array("regexp"=>"/^[a-zA-Z\s]+$/")))){
			$Relationship_err = "Please enter a valid Relationship.";
		} 
		if(empty($Dependent_name_err) && empty($Relationship_err) && empty($Sex_err) && empty($Essn_err)){
			$sql = "INSERT INTO `DEPENDENT`(Essn, Dependent_name, Sex, Bdate, Relationship) VALUES (?, ?, ?, ?, ?)";
			 
			if($stmt = mysqli_prepare($link, $sql)){
				mysqli_stmt_bind_param($stmt, "issss", $param_Essn, $param_Dependent_name, $param_Sex, $param_Bdate, $param_Relationship);
				
				$param_Essn = $Essn;
				$param_Dependent_name = $Dependent_name;
				$param_Sex = $Sex;
				$param_Bdate = $Bdate;
				$param_Relationship = $Relationship;

				if(mysqli_stmt_execute($stmt)){
					header("location: index.php");
					echo "This is a known bug but I dont know how to fix it: Line 48 in createDependent.php; Manually go back to index.php";
					exit();
				} else{
					echo "<center><h4>Error while creating new dependent</h4></center>";
                    $Dependent_name_err = "Enter a unique name.";
				}
			}
			mysqli_stmt_close($stmt);
		}
		mysqli_close($link);
	}
?>

<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>Company DB P2</title>
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
							<h3>Add a Dependent for Essn = <?php echo $Essn;?></h3>
						</div>

						<p>Please fill this form and submit to add a Dependent record to the database.</p>
						<form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post">
							<div class="form-group <?php echo (!empty($Dependent_name_err)) ? 'has-error' : ''; ?>">
								<label>Dependent's Name</label>
								<input type="text" name="Dependent_name" class="form-control" value="<?php echo $Dependent_name; ?>">
								<span class="help-block"><?php echo $Dependent_name_err;?></span>
							</div>
							<div class="form-group <?php echo (!empty($Relationship_err)) ? 'has-error' : ''; ?>">
								<label>Relationship</label>
								<input type="text" name="Relationship" class="form-control" value="<?php echo $Relationship; ?>">
								<span class="help-block"><?php echo $Relationship_err;?></span>
							</div>
							<div class="form-group <?php echo (!empty($Sex_err)) ? 'has-error' : ''; ?>">
								<label>Sex</label>
								<input type="text" name="Sex" class="form-control" value="<?php echo $Sex; ?>">
								<span class="help-block"><?php echo $Sex_err;?></span>
							</div>  
							<div class="form-group <?php echo (!empty($Bdate_err)) ? 'has-error' : ''; ?>">
								<label>Birth date</label>
								<input type="date" name="Bdate" class="form-control" value="<?php echo date('Y-m-d'); ?>">
								<span class="help-block"><?php echo $Bdate_err;?></span>
							</div>
							<input type="submit" class="btn btn-primary" value="Submit">
							<a href="viewDependents.php" class="btn btn-default">Cancel</a>
						</form>
					</div>
				</div>        
			</div>
		</div>	
	</body>
</html>