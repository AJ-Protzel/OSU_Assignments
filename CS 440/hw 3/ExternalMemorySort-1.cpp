// Adrien Protzel | protzela | protzela@oregonstate.edu
// Curtiss Haldorson | haldorsc | haldorsc@oregonstate.edu

#include <bits/stdc++.h>
using namespace std;

//defines how many buffers are available in the Main Memory 
#define buffer_size 22

struct EmpRecord {
    int eid;
    string ename;
    int age;
    double salary;
};
EmpRecord buffers[buffer_size]; // this structure contains 22 buffers; available as your main memory.

// Grab a single block from the Emp.csv file, in theory if a block was larger than
// one tuple, this function would return an array of EmpRecords and the entire if
// and else statement would be wrapped in a loop for x times based on block size
EmpRecord Grab_Emp_Record(fstream &empin) {
    string line, word;
    EmpRecord  emp;
    // grab entire line
    if (getline(empin, line, '\n')) {
        // turn line into a stream
        stringstream s(line);
        // gets everything in stream up to comma
        getline(s, word,',');
        emp.eid = stoi(word);
        getline(s, word, ',');
        emp.ename = word;
        getline(s, word, ',');
        emp.age = stoi(word);
        getline(s, word, ',');
        emp.salary = stod(word);
        return emp;
    } else {
        emp.eid = -1;
        return emp;
    }
}

//Sorting the buffers in main_memory based on 'eid' and storing the sorted records into a temporary file 
//You can change return type and arguments as you want. 
void Sort_in_Main_Memory(int iteration_size){
    for(int i = 1; i < iteration_size; i++){
		for(int j = i; j != 0; j--){
			if(buffers[j].eid >= buffers[j-1].eid){
				break;
			}
			EmpRecord temp = buffers[j-1];
			buffers[j-1] = buffers[j];
			buffers[j] = temp;
		}
	}
    return;
}

//You can use this function to merge your M-1 runs using the buffers in main memory and storing them in sorted file 'EmpSorted.csv'(Final Output File) 
//You can change return type and arguments as you want. 
void Merge_Runs_in_Main_Memory(int File_Count){
  int M = buffer_size-1;

  fstream Temp_Files_Arr[M];
  for(int i = 0; i <= buffer_size; i++){
    buffers[i].eid = -1;
  }

	ostringstream filename;
	filename << "EmpSorted.csv";
	ofstream outfile(filename.str()); // open sorted file to write to

  for(int i = 0; i < File_Count; ++i){
    if(i <= File_Count){ // load temp files into array
      ostringstream filename2;
      filename2 << "tempdat" << i << ".csv";
      Temp_Files_Arr[i].open(filename2.str(), ios::in);
      buffers[i] = Grab_Emp_Record(Temp_Files_Arr[i]); // populate buffers with first records
    }
    else{ // if record empty, = -1
      buffers[i].eid = -1;
    }
  }

  int val = 0;
  while(val != 99999999){ // loop while no values/indexes where found
    val = 99999999; // reset val to compare
    int index = -1;

    for(int i = 0; i < M; ++i){ // find smallest eid // save index
      if(buffers[i].eid < val && buffers[i].eid != -1){
        val = buffers[i].eid;
        index = i;
      }
    }

    if(index != -1){ // print record
      int foo = round(buffers[index].salary);
      outfile << buffers[index].eid << ',' << buffers[index].ename << ',' << buffers[index].age << ',' << foo;
      
      if(buffers[index].eid != -1){ // grab new record for index that was printed
        buffers[index] = Grab_Emp_Record(Temp_Files_Arr[index]);
      }
    }

    for(int i = 0; i < M; ++i){ // if any record still in buffers, make a space for it
      if(buffers[i].eid != -1){
        outfile << endl;
        break;
      }      
    }
  }
	outfile.close();
}

void Print_Block_File(int file_number, int iteration_size){
	ostringstream filename;
	filename << "tempdat" << file_number << ".csv";
	ofstream outfile(filename.str());
	
  int foo = round(buffers[0].salary);
	outfile << buffers[0].eid << ',' << buffers[0].ename << ',' << buffers[0].age << ',' << foo;
	for(int i = 1; i < iteration_size; i++){ // print record
		if(buffers[i].eid != -1){
			outfile << endl;
      int foo2 = round(buffers[i].salary);
			outfile << buffers[i].eid << ',' << buffers[i].ename << ',' << buffers[i].age << ',' << foo2;
		}
	}
	
	outfile.close();
}

int main() {
  cout << "Starting." << endl;

  // open file streams to read and write
  fstream input_file;
  input_file.open("Emp.csv", ios::in);
  int Output_Block_File_Number = 0;
  int File_Count = 0;
 
  // flags check when relations are done being read
  bool flag = true;
  int cur_size = 0;
  
  /*First Pass: The following loop will read each block put it into main_memory 
    and sort them then will put them into a temporary file for 2nd pass */
  while (flag) {
    // FOR BLOCK IN RELATION EMP

    // grabs a block
    EmpRecord  single_EmpRecord  = Grab_Emp_Record(input_file);
    // checks if filestream is empty
    if (single_EmpRecord.eid == -1) {
      flag = false;
      Sort_in_Main_Memory(cur_size);
      Print_Block_File(Output_Block_File_Number, cur_size);
      File_Count += 1;
    }
    if(cur_size + 1 < buffer_size){
      //Memory is not full store current record into buffers.
      buffers[cur_size] = single_EmpRecord ;
      cur_size += 1;
    }
    else{
      //memory is full now. Sort the blocks in Main Memory and Store it in a temporary file (runs)
      Sort_in_Main_Memory(cur_size);
      Print_Block_File(Output_Block_File_Number, cur_size);
      Output_Block_File_Number++;
      //After sorting start again. Clearing memory and putting the current one into main memory.
      cur_size = 0;
      buffers[cur_size] = single_EmpRecord;
      cur_size += 1;
      File_Count += 1;
    }
  }
  input_file.close();
  Merge_Runs_in_Main_Memory(File_Count);

  cout << "Done.";
  return 0;
}
