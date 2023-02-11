<?php
	session_start();	
	require_once "config.php";
 
    $Dependent_name = $Bdate = $Sex = $Relationship = "";
    $Dependent_name_err = $Bdate_err = $Sex_err  = $Relationship_err = "" ;

    if(isset($_GET["Essn"]) && !empty(trim($_GET["Essn"])) && isset($_GET["Dependent_name"]) && !empty(trim($_GET["Dependent_name"]))){
        $_SESSION["Essn"] = $_GET["Essn"];
        $_SESSION["Dependent_name"] = $_GET["Dependent_name"];

        $sql1 = "SELECT * FROM `DEPENDENT` WHERE Essn = ? AND Dependent_name = ?";
    
        if($stmt1 = mysqli_prepare($link, $sql1)){
            mysqli_stmt_bind_param($stmt1, "ss", $param_Essn, $param_Old_Name);      
            $param_Essn = trim($_GET["Essn"]);
            $param_Old_Name = trim($_GET["Dependent_name"]);

            if(mysqli_stmt_execute($stmt1)){
                $result1 = mysqli_stmt_get_result($stmt1);
                if(mysqli_num_rows($result1) > 0){
                    $row = mysqli_fetch_array($result1);
                    $Dependent_name = $row['Dependent_name'];
                    $Bdate = $row['Bdate'];
                    $Sex = $row['Sex'];
                    $Relationship = $row['Relationship'];
                }
            }
        }
    }

    if($_SERVER["REQUEST_METHOD"] == "POST"){
        $Essn = $_SESSION["Essn"];
        $Old_name = $_SESSION["Dependent_name"];
        $Dependent_name = trim($_POST["Dependent_name"]);

        if(empty($Dependent_name)){
            $Dependent_name_err = "Please enter a name.";
        } elseif(!filter_var($Dependent_name, FILTER_VALIDATE_REGEXP, array("options"=>array("regexp"=>"/^[a-zA-Z\s]+$/")))){
            $Dependent_name_err = "Please enter a valid name.";
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
        
        if(empty($Dependent_name_err) && empty($Sex_err) && empty($Relationship_err)){
            $sql = "UPDATE `DEPENDENT` SET Dependent_name=?, Bdate=?, Sex=?, Relationship=? WHERE Essn=? AND Dependent_name=?";

            if($stmt = mysqli_prepare($link, $sql)){
                mysqli_stmt_bind_param($stmt, "ssssis", $param_Dependent_name, $param_Bdate, $param_Sex, $param_Relationship, $param_Essn, $param_Old_Name);
                $param_Dependent_name = $Dependent_name;
                $param_Relationship = $Relationship;
                $param_Essn = $Essn;
                $param_Bdate = $Bdate;
                $param_Sex = $Sex;
                $param_Old_Name = $Old_name;
                
                if(mysqli_stmt_execute($stmt)){
                    header("location: index.php");
                    exit();
                } else{
                    echo "<center><h2>Error when updating</center></h2>";
                }
            }        
            mysqli_stmt_close($stmt);
        }
        mysqli_close($link);
    } 
    
    else {
        if(isset($_SESSION["Essn"]) && !empty(trim($_SESSION["Essn"])) && isset($_SESSION["Dependent_name"]) && !empty(trim($_SESSION["Dependent_name"]))){
            $_SESSION["Essn"] = $_GET["Essn"];
            $_SESSION["Dependent_name"] = $_GET["Dependent_name"];

            $sql1 = "SELECT * FROM `DEPENDENT` WHERE Essn = ? and Dependent_name = ?";
    
            if($stmt1 = mysqli_prepare($link, $sql1)){
                mysqli_stmt_bind_param($stmt1, "ss", $param_Essn, $param_Old_Name);      
                $param_Essn = trim($_GET["Essn"]);
                $param_Old_Name = trim($_GET["Dependent_name"]);

                if(mysqli_stmt_execute($stmt1)){
                    $result1 = mysqli_stmt_get_result($stmt1);
                    if(mysqli_num_rows($result1) == 1){
                        $row = mysqli_fetch_array($result1);
                        $Dependent_name = $row['Dependent_name'];
                        $Bdate = $row['Bdate'];
                        $Sex = $row['Sex'];
                        $Relationship = $row['Relationship'];
                    } else{
                        header("location: error.php");
                        exit();
                    }
                    
                } else{
                    echo "Error in Essn while updating";
                }
            }
            mysqli_stmt_close($stmt);
            mysqli_close($link);
        }  else{
            header("location: error.php");
            exit();
        }	
    }
?>
 
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>College DB P2</title>
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
                            <h3>Update Dependent, <?php echo $_GET["Dependent_name"]; ?> </H3>
                        </div>
                        <p>Please edit values and submit to update.
                        <form action="<?php echo htmlspecialchars(basename($_SERVER['REQUEST_URI'])); ?>" method="post">
                            <div class="form-group <?php echo (!empty($Dependent_name_err)) ? 'has-error' : ''; ?>">
                                <label>Name</label>
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
                            <div class="form-group <?php echo (!empty($Birth_err)) ? 'has-error' : ''; ?>">
                                <label>Birth date</label>
                                <input type="date" name="Bdate" class="form-control" value="<?php echo date('Y-m-d'); ?>">
                                <span class="help-block"><?php echo $Birth_err;?></span>
                            </div>
                            <div>
                                <input type="submit" class="btn btn-success pull-left" value="Update Dependent">	
                                &nbsp;
                                <a href="viewDependents.php" class="btn btn-primary">List Dependents</a>
                            </div>
                        </form>
                    </div>
                </div>        
            </div>
        </div>
    </body>
</html>