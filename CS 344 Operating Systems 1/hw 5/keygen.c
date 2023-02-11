/* keygen
 * - recive a number of characrers to randomly generate
 * - recive file name to output to
 */

#include<stdio.h> // main
#include<stdlib.h> // main malloc
#include<string.h> // string
#include<time.h> // rand time set

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
int main(int argc, char *argv[]){
  // ./keygen int > filename
  srand(time(NULL)); // set time

  char chars[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ "; // allowed chars
  int charslen = strlen(chars); // length of chars (27)
  int n; // random number

  if(argv[1] && (atoi(argv[1]) > 0)){ // if valid length is given
    int num = atoi(argv[1]); // pointer to int

    for(int i = 0; i < num; i++){ // loop random number length times
      n = rand() % charslen;
      fprintf(stdout, "%c", chars[n]);
    }
    fprintf(stdout, "\n");
  }
  else{
    fprintf(stderr,"Invalid argv in keygen\n"); 
    exit(0); 
  }

  return 0;
}