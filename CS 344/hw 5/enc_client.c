/* enc_client
 * - check args
 * - create socket and connect to server port
 * - sends plaintext to enc_server
 * - recives ciphertext from enc_server
 * - output ciphertext to stdout
 */

#include<stdio.h> // main
#include<stdlib.h> // main malloc
#include<unistd.h> // fork // exec
#include<string.h> // string
#include<stdbool.h> // bool
#include<sys/socket.h> // send(),recv()
#include<netdb.h> // gethostbyname()

#define MAX 150000

//______________________________________________error
/* Error function used for reporting issues
 */
void error(const char *msg, int i){ 
  fprintf(stderr, "%s", msg);
  exit(i); 
} 

//______________________________________________getLength
/* get length of file
 */
int getLength(char *file){
  FILE* fp;
  int size;

  fp = fopen(file, "r");
  if(fp == NULL){ // check exists
    error("CLIENT: File Not Found\n", 1); 
  }
  else{
    fseek(fp, 0L, SEEK_END); 
    size = ftell(fp); // get size of file
    fseek(fp, 0, SEEK_SET);
  }
  fclose(fp); 

  return size;
}

//----------------------------------------------------------------checkers
//______________________________________________checkArgs
/* checks usages and number of args
 */
void checkArgs(int num){
  if(num < 4){
    error("CLIENT: BAD: invalid args\n", 0); 
  }
}

//______________________________________________checkLength
/* checks length of plaintext and key
 */
void checkLength(int sizeP, int sizeK){
  if(sizeK < sizeP){
    error("CLIENT: BAD: key is too small\n", 1); 
  }
}

//______________________________________________checkChars
/* checks valid chars in plaintext and key
 */
void checkChars(char *plaintext, char *key){
  char chars[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ "; // allowed chars
  int charslen = strlen(chars); // length of chars (27)
  FILE *fp;
  char ch;
  bool allowed; // if char is allowed

  fp = fopen(plaintext, "r");
  if(fp == NULL){ // check exists
    error("CLIENT: File Not Found\n", 0);  
  }
  else{
    while((ch = fgetc(fp)) != EOF && ch != '\n'){ // read through file, each char
      allowed = false;
      for(int i = 0; i < charslen; ++i){ // check if char is allowed
        if(ch == chars[i]){
          allowed = true;
        }
      }
      if(allowed == false){ // char is not allowed
        error("CLIENT: BAD: unallowed character in plaintext\n", 1); 
      }
    }
  }
  fclose(fp);

  fp = fopen(key, "r");
  if(fp == NULL){ // check exists
    error("CLIENT: File Not Found\n", 0);  
  }
  else{
    while ((ch = fgetc(fp)) != EOF && ch != '\n'){ // read through file, each char
      allowed = false;
      for(int i = 0; i < charslen; ++i){ // check if char is allowed
        if(ch == chars[i]){
          allowed = true;
        }
      }
      if(allowed == false){ // char is not allowed
        error("CLIENT: BAD: unallowed character in key\n", 1); 
      }
    }
  }
  fclose(fp);
}

//----------------------------------------------------------------access network
//______________________________________________setupAddressStruct
/* Set up the address struct
 */
void setupAddressStruct(struct sockaddr_in* address, int portNumber, char* hostname){
  memset((char*) address, '\0', sizeof(*address)); // clear address struct

  address->sin_family = AF_INET; // set network capable
  address->sin_port = htons(portNumber); // store port number
  struct hostent* hostInfo = gethostbyname(hostname); // get DNS entry of hostname // check success
  if(hostInfo == NULL){ 
    error("CLIENT: ERROR, no such portNumber\n", 0); 
  }
  
  memcpy((char*) &address->sin_addr.s_addr, hostInfo->h_addr_list[0], hostInfo->h_length); // copy first IP from DNS to sin_addr.s_addr
}

//----------------------------------------------------------------function
//______________________________________________makeMsg
/* concats plaintext and key to send
 */
void makeMsg(char *buffer, char *plaintext, int sizeP, char *key, int sizeK){
  FILE* fp;
  char line[MAX];

  strcpy(buffer, "E\n");

  fp = fopen(plaintext, "r"); // get from plaintext
  fgets(line, sizeP, fp);
  fclose(fp); 

  strcat(buffer, line);
  strcat(buffer, "\n");

  memset(line, '\0', sizeof(line)); // clear line

  fp = fopen(key, "r"); // get from key
  fgets(line, sizeK, fp);
  fclose(fp); 

  strcat(buffer, line);
  strcat(buffer, "\n");
  strcat(buffer, "eom\n");
}

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
int main(int argc, char *argv[]){
  // ./enc_client plaintext1 key $encport
  checkArgs(argc); // pass argc
    int sizeP = getLength(argv[1]); // size of plaintext
    int sizeK = getLength(argv[2]); // size of key
  checkLength(sizeP, sizeK); // pass plaintext(argv[1]) and key(argv[2])
  checkChars(argv[1], argv[2]); // pass plaintext(argv[1]) and key(argv[2])
  
  int sendSocket = socket(AF_INET, SOCK_STREAM, 0); // open a socket // check success
  if(sendSocket < 0){
    error("CLIENT: ERROR opening socket\n", 0);
  }

  struct sockaddr_in serverAddress;
  setupAddressStruct(&serverAddress, atoi(argv[3]), "localhost"); // connect to port // check success
  if(connect(sendSocket, (struct sockaddr*)&serverAddress, sizeof(serverAddress)) < 0){
    char errormsg[50];
    snprintf(errormsg, 50, "CLIENT: ERROR connecting to port %d\n", argv[3]); // puts string into buffer
    error(errormsg, 2);
  }

  //         E  \n plaintext \n   key   \n  eom \n  \0
  int size = 1 + 1 + sizeP + 1 + sizeK + 1 + 3 + 1 + 1;
  char *buffer = (char*) malloc((size)*sizeof(char));
  makeMsg(buffer, argv[1], sizeP, argv[2], sizeK);

  int sent = send(sendSocket, buffer, strlen(buffer), 0); // send to server
  if(sent < 0){
    error("CLIENT: ERROR writing to socket\n", 0);
  }
  
  memset(buffer, '\0', sizeof(buffer)); // receive message, clear buffer

  while(strstr(buffer, "eom\n") == NULL){
    char inbuffer[MAX];
    memset(inbuffer, '\0', sizeof(inbuffer));

    int read = recv(sendSocket, inbuffer, sizeof(inbuffer), 0); // receive from server 
    if(read < 0){
      error("SERVER: ERROR reading from socket\n", 0);
    }
    if(buffer[0] == '\0'){
      strcpy(buffer, inbuffer);
    }
    else{
      strcat(buffer, inbuffer);
    }
  }

  char *from = strtok(buffer, "\n");
  if(from[0] == 'B'){ // check if from enc
    error("ENC CLIENT: Message not from enc.\n", 2);
  }
  else{
    fprintf(stdout, "%s\n", strtok(NULL, "\n")); // remove eom and print
  }

  close(sendSocket);

  return 0;
}