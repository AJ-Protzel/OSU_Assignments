#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#include<stdbool.h> 
#include<ctype.h>

const int MAX = 500;

//______________________________________________movie
// struct for movie entry
struct movie{
  char title[500];
  int year;
  char languages[500];
  float rating;

  struct movie *next;
};

//______________________________________________push
// fills a movie struct and adds next null
int push(struct movie *curr, FILE *file){
  int num = 1;
  char line[MAX];
  fgets(line, MAX, file); // clear first line

  fgets(line, MAX, file);
  char *token;
  token = strtok(line, ",");

  strcpy(curr->title, token);
    token = strtok(NULL, ",");
  curr->year = atoi(token);
    token = strtok(NULL, ",");
  strcpy(curr->languages, token);
    token = strtok(NULL, ",");
  curr->rating = atof(token);
    token = strtok(NULL, ",");
  curr->next = NULL;

  while(fgets(line, MAX, file)){
    char *token;
    token = strtok(line, ",");

    curr->next = (struct movie*) malloc(sizeof(struct movie));
    curr = curr->next;
    curr->next = NULL;

    strcpy(curr->title, token);
      token = strtok(NULL, ",");
    curr->year = atoi(token);
      token = strtok(NULL, ",");
    strcpy(curr->languages, token);
      token = strtok(NULL, ",");
    curr->rating = atof(token);
      token = strtok(NULL, ",");
      num++;
  }
  return num;
}

//______________________________________________printList
// prints out from each node
void printList(struct movie *curr){
  while (curr != NULL) {
    printf("%s ", curr->title);
    printf("%d ", curr->year);
    printf("%s ", curr->languages);
    printf("%1.1f\n", curr->rating);
    curr = curr->next;
  }
}

//______________________________________________sYear
// prints title of movies in specified year
void sYear(struct movie *curr, char *str){
  bool found = false;
  int num = atoi(str);
  while(curr != NULL){
    if(num == curr->year){
      printf("• %s\n", curr->title);
      found = true;
    }
    curr = curr->next;
  }
  if(found == false){
    printf("No movies from that year found.\n");
  }
}

//______________________________________________sRating
// prints highest rated movie of each year
void sRating(struct movie *curr){
  struct movie* tmpHead = (struct movie*)malloc(sizeof(struct movie));
  struct movie* head = tmpHead;

  strcpy(tmpHead->title, curr->title);
  tmpHead->year = curr->year;
  strcpy(tmpHead->languages, curr->languages);
  tmpHead->rating = curr->rating;
  tmpHead->next = NULL;

  curr = curr->next;

  while(curr != NULL){ // make linked list copy
    tmpHead->next = (struct movie*) malloc(sizeof(struct movie));
    tmpHead = tmpHead->next;
    tmpHead->next = NULL;
    
    strcpy(tmpHead->title, curr->title);
    tmpHead->year = curr->year;
    strcpy(tmpHead->languages, curr->languages);
    tmpHead->rating = curr->rating;

    curr = curr->next;
  }

  tmpHead = head;
  int year;
  struct movie* tmp = tmpHead;
  
  while(tmpHead != NULL){
    tmp = tmpHead;
    year = tmpHead->year;
    while(tmpHead != NULL){
      if(tmpHead->year == year){
        if(tmpHead->rating > tmp->rating){
          tmp = tmpHead;
        }
      }
      tmpHead = tmpHead->next;
    }

    printf("•%d [%1.1f]: %s\n", year, tmp->rating, tmp->title);
    tmpHead = head;

    while(tmpHead != NULL){
      tmp = tmpHead->next;
      if(tmp != NULL && tmp->year == year){
        tmpHead->next = tmp->next;
        free(tmp);
      }
      tmpHead = tmpHead->next;
    }
    tmpHead = head->next;
    head = tmpHead;
  }
}

//______________________________________________sLanguages
// prints all title with a specified language
void sLanguage(struct movie *curr, char *str){
  bool found = false;
  while(curr != NULL){
    if(strstr(curr->languages, str)){
      printf("•%d: %s\n", curr->year, curr->title);
      found = true;
    }
    curr = curr->next;
  }
  if(found == false){
    printf("No movie found in %s.\n", str);
  }
}

//______________________________________________sExit
// ends program
void sExit(){
  printf("Bye Bye.\n");
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//*****************************************************************************Main
int main(int argc, char *argv[]){ 
  struct movie* head = (struct movie*)malloc(sizeof(struct movie)); 
  if(argc < 2){
    printf("Error opening file\n");
    return EXIT_FAILURE;
  }

  FILE *file = fopen(argv[1], "r");
  if(file == NULL){
    
    exit(1);
  }
  else{
    int num = push(head, file);
    printf("Processed file %s and parsed data for %d movies\n", argv[1], num);
  }

  printf("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
  
  char n[MAX]; // choice input
  char str[MAX]; // specifier input

  while(strcmp(n, "4\n")){
    printf("\n>----- Movie Finder -----<\n");
    printf("__________________________\n");
    printf("Enter a choice\n");
    printf("[1]:Search by year\n");
    printf("[2]:Search by ratings\n");
    printf("[3]:Search by languages\n");
    printf("[4]:Exit\n");
    printf("ENTER:");

    fgets(n, sizeof(n), stdin);
    printf("\n");

    if(strcmp(n, "1\n") == 0){
      printf("Enter a year: ");
      fgets(str, MAX, stdin);
      printf("\n");

      sYear(head, str);
    }
    else if(strcmp(n, "2\n") == 0){
      sRating(head);
    }
    else if(strcmp(n, "3\n") == 0){
      printf("Enter a language: ");
      fgets(str, MAX, stdin);
      printf("\n");

      for(int i = 0; str[i]; ++i){ // set str tolower
        str[i] = (tolower(str[i]));
      }
      str[0] = toupper(str[0]); // upper first letter
      char* pos;
      if((pos = strchr(str, '\n')) != NULL){ // remove \n
        *pos = '\0';
      }

      sLanguage(head, str);
    }
    else if(strcmp(n, "4\n") == 0){
      sExit();
    }
    else{
      printf("That is not a valid input.\n");
    }
  }

  return 0; 
} 
