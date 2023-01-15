<?php
	session_start();
	require_once "config.php";
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>College DB P2</title>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
        <style type="text/css">
            .wrapper{
                width: 70%;
                margin:0 auto;
            }
            .page-header h2{
                margin-top: 0;
            }
            table tr td:last-child a{
                margin-right: 15px;
            }
        </style>

        <script type="text/javascript">
            $(document).ready(function(){
                $('[data-toggle="tooltip"]').tooltip();   
            });
            $('.selectpicker').selectpicker();
        </script>
    </head>

    <body>
        <div class="wrapper">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-md-12">
                        <div class="page-header clearfix">
                            <h2 class="pull-left">View Dependents</h2>
                            <a href="createDependent.php" class="btn btn-success pull-right">Add Dependent</a>
                        </div>
                        <?php
                            if(isset($_GET["Ssn"]) && !empty(trim($_GET["Ssn"]))){
                                $_SESSION["Essn"] = $_GET["Ssn"];
                            }
                            if(isset($_SESSION["Essn"]) ){
                                $sql = "SELECT Dependent_name, Sex, Bdate, Relationship FROM `DEPENDENT` D WHERE D.Essn = ?";
                                if($stmt = mysqli_prepare($link, $sql)){
                                    mysqli_stmt_bind_param($stmt, "s", $param_Essn);      
                                    $param_Essn = ($_SESSION["Essn"]);
                                    if(mysqli_stmt_execute($stmt)){
                                        $result = mysqli_stmt_get_result($stmt);
                                
                                        echo"<h4> Dependents for ESSN = ".$param_Essn."</h4><p>";
                                        if(mysqli_num_rows($result) > 0){
                                            echo "<table class='table table-bordered table-striped'>";
                                                echo "<thead>";
                                                    echo "<tr>";
                                                        echo "<th width=50%>Dependent's Name</th>";
                                                        echo "<th>Sex</th>";
                                                        echo "<th>Birthdate</th>";
                                                        echo "<th>Relationship</th>";
                                                        echo "<th>Action</th>";
                                                    echo "</tr>";
                                                echo "</thead>";
                                                echo "<tbody>";							
                                                while($row = mysqli_fetch_array($result)){
                                                    echo "<tr>";
                                                    echo "<td>" . $row['Dependent_name'] . "</td>";
                                                    echo "<td>" . $row['Sex'] . "</td>";
                                                    echo "<td>" . $row['Bdate'] . "</td>";
                                                    echo "<td>" . $row['Relationship'] . "</td>";									
                                                    echo "<td>";
                                                        echo "<a href='updateDependent.php?Essn=".$param_Essn."&Dependent_name=".$row['Dependent_name']."' title='Update Dependent' data-toggle='tooltip'><span class='glyphicon glyphicon-pencil'></span></a>";
                                                        echo "<a href='deleteDependent.php?Dependent_name=".$row['Dependent_name']."' title='Delete Dependent' data-toggle='tooltip'><span class='glyphicon glyphicon-trash'></span></a>";
                                                    echo "</tr>";
                                                }
                                                echo "</tbody>";                            
                                            echo "</table>";				
                                            mysqli_free_result($result);
                                        } else {
                                            echo "No Dependents. ";
                                        }
                                            mysqli_free_result($result);
                                    } else{
                                        header("location: error.php");
                                        exit();
                                    }
                                }     
                                mysqli_stmt_close($stmt);
                                mysqli_close($link);
                            } else{
                                header("location: error.php");
                                exit();
                            }
                        ?>
                        <p><a href="index.php" class="btn btn-primary">Back</a></p>
                    </div>
    </body>
</html>