/* Adrien Protzel
 * 11/16/2020
 * Assignment : Multi-threaded Producer Consumer Pipeline
 * - Input Thread 1, reads in lines of characters from the standard input.
 * - Line Separator Thread 2, replaces every line separator in the input by a space.
 * - Plus Sign thread 3, replaces every pair of plus signs, i.e., "++", by a "^".
 * - Output Thread 4, writes this processed data to standard output as lines of exactly 80 characters.
 */

#include<stdio.h> // main
#include<stdlib.h> // main malloc
#include<string.h> // string
#include<stdbool.h> // bool
#include<pthread.h> // threads

#define MAXBUFF 1000 // max characters input
#define MAXCHAR 80 // max characters output
#define MAXIN 50 // max inputs

//----------------------------------------------------------------Buffers
//______________________________________________buff1
pthread_mutex_t mutex_1 = PTHREAD_MUTEX_INITIALIZER; // mutex state
char *buffer_1[MAXIN]; // buffer
int pd_idx_1 = 0; // put down index
int pu_idx_1 = 0; // pick up index
int count_1 = 0; // how many entries
pthread_cond_t full_1 = PTHREAD_COND_INITIALIZER; // is empty state

//______________________________________________buff2
pthread_mutex_t mutex_2 = PTHREAD_MUTEX_INITIALIZER; // mutex state
char *buffer_2[MAXIN]; // buffer
int pd_idx_2 = 0; // put down index
int pu_idx_2 = 0; // pick up index
int count_2 = 0; // how many entries
pthread_cond_t full_2 = PTHREAD_COND_INITIALIZER; // is empty state

//______________________________________________buff3
pthread_mutex_t mutex_3 = PTHREAD_MUTEX_INITIALIZER; // mutex state
char *buffer_3[MAXIN]; // buffer
int pd_idx_3 = 0; // put down index
int pu_idx_3 = 0; // pick up index
int count_3 = 0; // how many entries
pthread_cond_t full_3 = PTHREAD_COND_INITIALIZER; // is empty state

//-----------------------------------------------------------Input Thread
//______________________________________________getInput
/* reads in stdin line
 */
char *getInput(){
  char *line = NULL;
  size_t buff = MAXBUFF;

  getline(&line, &buff, stdin); // get user input line

  return line;
}

//______________________________________________put1
/* put line into buffer 1
 */
void put1(char *put_line_1){
  pthread_mutex_lock(&mutex_1); // lock mutex
  buffer_1[pd_idx_1] = put_line_1; // put line into buffer
  pd_idx_1++; // increment put down
  count_1++; // increment number of lines still in buff
  pthread_cond_signal(&full_1); // singal buff not empty
  pthread_mutex_unlock(&mutex_1); // unlock mutex
}

//______________________________________________inputLine
/* reads in stdin line
 */
void *inputLine(){
  size_t buff = MAXBUFF;
  char *input_line = (char*) malloc((buff+1)*sizeof(char)); 

  do{
    input_line = getInput();
    put1(input_line);
  }while(strcmp("STOP\n", input_line) != 0);

  //fprintf(stdout, ">INPUT DONE\n");
  return NULL;
}

//--------------------------------------------------------Separate Thread
//______________________________________________get1
/* get line from buffer 1
 */
char *get1(){
  pthread_mutex_lock(&mutex_1); // lock mutex
  while (count_1 == 0){ // wait for buffer to have line
    pthread_cond_wait(&full_1, &mutex_1);
  }
  char *get_line_1 = buffer_1[pu_idx_1]; // get line
  pu_idx_1++; // increment pick up
  count_1--; // increment number of lines still in buff
  pthread_mutex_unlock(&mutex_1); // unlock the mutex

  return get_line_1;
}

//______________________________________________put2
/* put line into buffer 2
 */
void put2(char *put_line_2){
  pthread_mutex_lock(&mutex_2); // lock mutex
  buffer_2[pd_idx_2] = put_line_2; // put line into buffer
  pd_idx_2++; // increment put down
  count_2++; // increment number of lines still in buff
  pthread_cond_signal(&full_2); // singal buff not empty
  pthread_mutex_unlock(&mutex_2); // unlock mutex
}

//______________________________________________separateLine
/* replaces \n with space
 */
void *separateLine(){
  size_t buff = MAXBUFF;
  char *separate_line = (char*) malloc((buff+1)*sizeof(char)); 
  bool done = false;

  while(done == false){
    separate_line = get1();
    if(strcmp("STOP\n", separate_line) == 0){
      done = true;
    }
    else{
      int len = strlen(separate_line);
      if(separate_line[len-1] == '\n'){ // replace \n with space
        separate_line[len-1] = ' ';
      }
    }
    
    put2(separate_line);
  }
  
  //fprintf(stdout, ">SEPARATE DONE\n");
  return NULL;
}

//------------------------------------------------------------Plus Thread
//______________________________________________get2
/* get line from buffer 2
 */
char *get2(){
  pthread_mutex_lock(&mutex_2); // lock mutex
  while (count_2 == 0){ // wait for buffer to have line
    pthread_cond_wait(&full_2, &mutex_2);
  }
  char *get_line_2 = buffer_2[pu_idx_2]; // get line
  pu_idx_2++; // increment pick up
  count_2--; // increment number of lines still in buff
  pthread_mutex_unlock(&mutex_2); // unlock the mutex

  return get_line_2;
}

//______________________________________________put3
/* put line into buffer 3
 */
void put3(char *put_line_3){
  pthread_mutex_lock(&mutex_3); // lock mutex
  buffer_3[pd_idx_3] = put_line_3; // put line into buffer
  pd_idx_3++; // increment put down
  count_3++; // increment number of lines still in buff
  pthread_cond_signal(&full_3); // singal buff not empty
  pthread_mutex_unlock(&mutex_3); // unlock mutex
}

//______________________________________________plusLine
/* replaces ++ and \n with ^ and space
 */
void *plusLine(){
  size_t buff = MAXBUFF;
  char *plus_line = (char*) malloc((buff+1)*sizeof(char)); 
  bool done = false;

  while(done == false){
    plus_line = get2();
    if(strcmp("STOP\n", plus_line) == 0){
      done = true;
    }
    else{
      char var[] = "++";
      int varLen = strlen(var); 
      int count = 0;
      int i;

      for(i = 0; plus_line[i] != '\0'; ++i){ // count how many times ++ shows up
        if(strstr(&plus_line[i], var) == &plus_line[i]){ 
          count++; 
          i += varLen-1; 
        } 
      } 

      char *tmp;
      for(;count > 0; count--){ // replace count of ++
        i = 0;
        tmp = strstr(plus_line, var); // finds next ++
        while(tmp[i+1] != '\0'){ // remove first + from ++ found
          tmp[i] = tmp[i+1];
          i++;
        }
        tmp[i] = '\0'; // set end to space
        strncpy (tmp, "^", 1); // replace ++ with ^
      }
    }
    
    put3(plus_line);
  }

  //fprintf(stdout, ">PLUS DONE\n");
  return NULL;
}

//----------------------------------------------------------Output Thread
//______________________________________________get3
/* get line from buffer 3
 */
char *get3(){
  pthread_mutex_lock(&mutex_3); // lock mutex
  while (count_3 == 0){ // wait for buffer to have line
    pthread_cond_wait(&full_3, &mutex_3);
  }
  char *get_line_3 = buffer_3[pu_idx_3]; // get line
  pu_idx_3++; // increment pick up
  count_3--; // increment number of lines still in buff
  pthread_mutex_unlock(&mutex_3); // unlock the mutex

  return get_line_3;
}

//______________________________________________outputLine
/* replaces ++ and \n with ^ and space
 */
void *outputLine(){
  size_t maxbuff = MAXBUFF;
  char *output_line = (char*) malloc((maxbuff+1)*sizeof(char));
  char *Mline = (char*) malloc((maxbuff+1)*sizeof(char));
  size_t buff = MAXCHAR; // max output size
  bool done = false;

  while(done == false){
    output_line = get3();
    if(strcmp("STOP\n", output_line) == 0){
      done = true;
    }
    if(Mline != NULL){
      strcat(Mline, output_line); // attach to Mline
    }
    else{
      Mline = output_line; // initialize Mline
    }

    while(strlen(Mline) >= buff){
      for(int i = 0; i < buff; ++i){ // print out only 80 chars
        fprintf(stdout, "%c", Mline[i]);
      }
      fprintf(stdout, "\n");
      memmove(Mline, Mline+buff, strlen(Mline)-buff+1); // remove printed chars
    }
  }

  //fprintf(stdout, ">OUTPUT DONE\n");
  return NULL;
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++Main
int main(int argc, char **argv){
  srand(time(0));

  pthread_t input_t, separate_t, plus_t, output_t;

  // start
  pthread_create(&input_t, NULL, inputLine, NULL);
  pthread_create(&separate_t, NULL, separateLine, NULL);
  pthread_create(&plus_t, NULL, plusLine, NULL);
  pthread_create(&output_t, NULL, outputLine, NULL);

  // end
  pthread_join(input_t, NULL);
  pthread_join(separate_t, NULL);
  pthread_join(plus_t, NULL);
  pthread_join(output_t, NULL);

  return 0;
}