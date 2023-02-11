/* Adrien Protzel
 * 10/20/2020
 * Assignment 2: Files & Directories
 * - Reads directory entries.
 * - Finds file in current directory based on user input.
 * - Reads and processes data in the chosen file.
 * - Creates a directory.
 * - Creates new files in new directory and writes data to its files.
 */

#include<stdio.h> // main function
#include<stdlib.h> // main functions
#include<string.h> // string functions
#include<stdbool.h> // bool var
#include<dirent.h> // directory access
#include<sys/stat.h>  // make directory
#include<time.h> // for srand()
#include<fcntl.h> // open()
#include <unistd.h> // write()

const int MAX = 100; // const number for char arrays

//______________________________________________movie
/* struct for movie entry
 */
struct movie{
  char title[100];
  int year;
  char languages[100];
  float rating;

  struct movie *next;
};

//______________________________________________push
/* fills a movie struct and adds next null
 */
void push(struct movie *head, FILE *file){
  char line[MAX];
  fgets(line, MAX, file); // clear first line

  fgets(line, MAX, file);
  char *token;
  token = strtok(line, ",");

  strcpy(head->title, token);
    token = strtok(NULL, ",");
  head->year = atoi(token);
    token = strtok(NULL, ",");
  strcpy(head->languages, token);
    token = strtok(NULL, ",");
  head->rating = atof(token);
    token = strtok(NULL, ",");
  head->next = NULL;

  while(fgets(line, MAX, file)){
    char *token;
    token = strtok(line, ",");

    head->next = (struct movie*) malloc(sizeof(struct movie));
    head = head->next;
    head->next = NULL;

    strcpy(head->title, token);
      token = strtok(NULL, ",");
    head->year = atoi(token);
      token = strtok(NULL, ",");
    strcpy(head->languages, token);
      token = strtok(NULL, ",");
    head->rating = atof(token);
      token = strtok(NULL, ",");
  }
}

//______________________________________________writeFiles
/* prints highest rated movie of each year
 */
void writeFiles(char *directory, struct movie *head){
  char dir[MAX]; // individual file directory
  int year; // current year
  struct movie* tmpHead = head;
  struct movie* tmp;

  while(head != NULL){
    year = head->year;

    sprintf(dir, "%s%d.txt", directory, year);
    open(dir, O_RDWR|O_CREAT, 0640); // create new file with rwxr-x---
    FILE *file = fopen(dir, "w"); // open file

    while(head != NULL){
      tmp = head->next;
      if(head->year == year){ // if head matches year
        fprintf(file, "%s\n", head->title);
      }
      if(tmp != NULL && tmp->year == year){ // if next matches year
        fprintf(file, "%s\n", tmp->title);
        head->next = tmp->next;
        free(tmp);
      }
      head = head->next;
    }
    head = tmpHead->next;
    tmpHead = head;
    fclose(file);
  }
}

//______________________________________________freeList
/* frees the linked list
 */
void freeList(struct movie* head){
  struct movie* tmp;
  while (head != NULL){ // loop list and free
    tmp = head;
    head = head->next;
    free(tmp);
  }
  head = NULL; // free whole list
}

//______________________________________________processFile
/* gets found file name
 * creates and fills linked list with data from file
 * searches year and writes files
 */
void processFile(char *subDirName, char *fileName){
  struct movie* head = (struct movie*)malloc(sizeof(struct movie)); // make data linked list
  FILE *file = fopen(fileName, "r"); // open file found
  push(head, file); // make/fill linked list with data from found file
  fclose(file); // close file

  char fileLocation[MAX];
  sprintf(fileLocation, "./%s/", subDirName);
  writeFiles(fileLocation, head); // print rating

  freeList(head); // free linked list
}

//______________________________________________checkFile
/* checks if file starts with "movies_"
 * checks if file ends with ".csv"
 * returns size of file or 0
 */
int checkFile(char *str){
  if(strncmp(str, "movies_", strlen("movies_")) == 0){ // check prefix
    int strLen = strlen(str);
    int suffixLen = strlen(".csv");
    if((strLen >= suffixLen) && (strcmp(str + (strLen-suffixLen), ".csv") == 0)){ // check suffix
      FILE *file = fopen(str, "r");
      fseek(file, 0L, SEEK_END); // jump to end of file
      int size = ftell(file); // get size of file at end
      fclose(file);
      return size;
    }
  }
  return 0; // file not valid
}

//______________________________________________largeFile
/* finds largest file that starts with movies_
 * processes file
 * returns true
 */
bool largeFile(){
  bool fileFound = false;

  struct dirent *entry; // pointer into curr directory entry 
  DIR *directory = opendir("."); // opens curr directory
    if (directory == NULL){ 
      printf("Directory could not open.\n" ); 
      return false; 
    } 

  char fileName[MAX]; // file name tracker
  int fileSize = 0; // file size tracker, for largest
  int size = 0; // size of current file

  while((entry = readdir(directory)) != NULL){ // loop through entries in curr directory
    size = checkFile(entry->d_name);
    if(size != 0){ // valid file found
      if(size > fileSize){ // compare tracked file
        strcpy(fileName, entry->d_name);
        fileSize = size;
        fileFound = true;
      }
    }
  }
  if(fileFound == false){
    printf("No valid files found\n");
    return true;
  }
  printf("Largest file is %s\n", fileName);
  closedir(directory);

  // 25/10 is just longer than max string size combination
  char subDirName[MAX]; // file namr
  int randNum = rand() % 100000; // rand number
  sprintf(subDirName, "protzela.movies.%d", randNum);
  mkdir(subDirName, 0750); // 000 rwx r0x 000

  printf("Now processing %s.\n", fileName);
  processFile(subDirName, fileName); // write out files

  return true;
}

//______________________________________________smallFile
/* finds smallest file that starts with movies_
 * processes file
 * returns true
 */
bool smallFile(){
  bool fileFound = false;

  struct dirent *entry; // pointer into curr directory entry 
  DIR *directory = opendir("."); // opens curr directory
    if (directory == NULL){ 
      printf("Directory could not open.\n"); 
      return false; 
    } 

  char fileName[MAX]; // file name tracker
  int fileSize = 999999; // file size tracker, for smallest
  int size = 0;

  while((entry = readdir(directory)) != NULL){ // loop through entries in curr directory
    size = checkFile(entry->d_name);
    if(size != 0){ // valid file found
      if(size < fileSize){ // compare tracked file
        strcpy(fileName, entry->d_name);
        fileSize = size;
        fileFound = true;
      }
    }
  }
  if(fileFound == false){
    printf("No valid files found\n");
    return true;
  }
  printf("Smallest file is %s\n", fileName);
  closedir(directory);

  // 25/10 is just longer than max string size combination
  char subDirName[MAX]; // file namr
  int randNum = rand() % 100000; // rand number
  sprintf(subDirName, "protzela.movies.%d", randNum);
  mkdir(subDirName, 0750); // 000 rwx r0x 000

  printf("Now processing %s.\n", fileName);
  processFile(subDirName, fileName); // write out files

  return true;
}

//______________________________________________inputFile
/* input name of file
 * checks if exists, if no: return false
 * print input name
 * else returns true
 */
bool inputFile(){
  struct dirent *entry; // pointer into curr directory entry 
  DIR *directory = opendir("."); // opens curr directory
    if (directory == NULL){ 
      printf("Directory could not open.\n" ); 
      return false; 
    } 

  char fileName[MAX]; // file name tracker
  bool validName = false;

  printf("Enter a file name\n");
  printf("ENTER:");
  scanf("%s", fileName);
  printf("\n");

  while(((entry = readdir(directory)) != NULL) && !validName){ // loop through entries in curr directory
    if(strcmp(fileName, entry->d_name) == 0){ // check file names
      validName = true;
    }
  }

  if(validName == false){
    printf("\nFile name not found.\n");
    return false;
  }
  printf("%s found.\n", fileName);
  closedir(directory);

  // 25/10 is just longer than max string size combination
  char subDirName[MAX]; // file namr
  int randNum = rand() % 100000; // rand number
  sprintf(subDirName, "protzela.movies.%d", randNum);
  mkdir(subDirName, 0750); // 000 rwx r0x 000

  printf("Now processing %s.\n", fileName);
  processFile(subDirName, fileName); // write out files

  return true;
}

//______________________________________________sExit
/* prints goodbye message
 * returns false to end main loop
 */
bool sExit(){
  printf("Bye Bye.\n");

  return false;
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++Main
int main(){ 
  srand(time(0)); // start random seed
  printf("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");

  char input[MAX];
  bool again = true;
  bool valid = false;

  while(again){
    printf("\n\n\n\n\n\n\n\n\n\n\n\n");
    printf("__________________________\n");
    printf("Enter a choice\n");
    printf("[1]:Select a file\n");
    printf("[2]:Exit\n");
    printf("ENTER:");

    scanf("%s", input);

    if(strcmp(input, "1") == 0){ // main loop: select a file
      while(!valid){
        printf("_________________\n");
        printf("Enter a choice\n");
        printf("[1]:Largest file\n");
        printf("[2]:Smallest file\n");
        printf("[3]:Name a file\n");
        printf("ENTER:");

        scanf("%s", input);
        printf("\n");

        if(strcmp(input, "1") == 0){ // inner loop: select large file
          valid = largeFile();
        }
        else if(strcmp(input, "2") == 0){ // inner loop: select small file
          valid = smallFile();
        }
        else if(strcmp(input, "3") == 0){ // inner loop: select input file
          valid = inputFile();
        }
        else{ // inner loop: select input error
          printf("%s is not a valid input.\n", input);
        }
      }
      valid = false; // reset inner loop
    }
    else if(strcmp(input, "2") == 0){ // main loop: exit
      again = sExit();
    }
    else{ // main loop: input error
      printf("%s is not a valid input.\n", input);
    }
  }
  return 0; 
} 
