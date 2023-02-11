/* dec_server
 * - check connection
 * - recive ciphertext and key
 * - sends ciphertext
 */

#include<stdio.h> // main
#include<stdlib.h> // main malloc
#include<unistd.h> // fork // exec
#include<string.h> // string
#include<sys/socket.h> // send(),recv()
#include<netdb.h> // gethostbyname()
#include<netinet/in.h> // sockaddr_in // in_addr
#include<sys/wait.h> // waitpid

#define MAX 150000

//----------------------------------------------------------------checkers
//______________________________________________error
/* Error function used for reporting issues
 */
void error(const char *msg){ 
  fprintf(stderr, "%s", msg);
} 

//______________________________________________checkArgs
/* checks usages and number of args
 */
void checkArgs(int num){
  if(num < 2){
    error("SERVER: BAD: invalid args\n"); 
  }
}

//----------------------------------------------------------------access network
//______________________________________________setupAddressStruct
/* set up the address struct
 */
void setupAddressStruct(struct sockaddr_in* address, int portNumber){
  memset((char*) address, '\0', sizeof(*address)); // clear address struct

  address->sin_family = AF_INET; // set network capable
  address->sin_port = htons(portNumber); // store port number
  address->sin_addr.s_addr = INADDR_ANY; // allow ANY client connect
}

//----------------------------------------------------------------function
//______________________________________________decrypt
/* decrypts message and returns
 */
char *decrypt(char *buffer){
    char *line = calloc((MAX),sizeof(char)); // cipher text
      memset(line, '\0', MAX);
    char *lineC = calloc((MAX),sizeof(char)); // cipher text
      memset(lineC, '\0', MAX);
    char *lineK = calloc((MAX),sizeof(char)); // key
      memset(lineK, '\0', MAX);

    lineC = strtok(buffer, "\n");
    strcat(line, lineC); // add D \n
    strcat(line, "\n"); // add \n after D

    lineC = strtok(NULL, "\n"); // get ciphertext
    lineK = strtok(NULL, "\n"); // get key

    char chars[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ "; // allowed chars
    int cipherIndx;
    int keyIndx;

    for(int i = 0; i < strlen(lineC); ++i){ // loop ciphertext number of times
      for(cipherIndx = 0; lineC[i] != chars[cipherIndx]; ++cipherIndx){} // find num of ciphertext char
      for(keyIndx = 0; lineK[i] != chars[keyIndx]; ++keyIndx){} // find num of key char

      int sum = cipherIndx - keyIndx;
      if(sum < 0){
        sum += 27;
      }
      sum = sum%27;

      strncat(line, &chars[sum], 1); // add decrypted char into cipher line
    }
    
    strcat(line, "\neom\n");

    return line;
}

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
int main(int argc, char *argv[]){
  // ./dec_server portnum
  checkArgs(argc); // pass argc

  int listenSocket = socket(AF_INET, SOCK_STREAM, 0); // open a socket // check success
  if(listenSocket < 0){
    error("SERVER: ERROR opening socket.\n");
    exit(0);
  }

  struct sockaddr_in serverAddress;
  setupAddressStruct(&serverAddress, atoi(argv[1])); // connect to port
  if(bind(listenSocket, (struct sockaddr *)&serverAddress, sizeof(serverAddress)) < 0){ // bind // check success
    error("SERVER: ERROR on binding.\n");
    exit(0);
  }

  struct sockaddr_in clientAddress;
  socklen_t sizeOfClientInfo = sizeof(clientAddress);
  listen(listenSocket, 5); // start listen // up to 5 queue

  while(1){ // accept a connection, blocking if one is not available until one connects
    int sendSocket = accept(listenSocket, (struct sockaddr *)&clientAddress, &sizeOfClientInfo); // accept request -> create connection socket
    if(sendSocket < 0){
      error("SERVER: ERROR on accept.\n");
    }

    pid_t pid;
    char buffer[MAX];
    char inbuffer[MAX];
    int status;
    pid = fork();
    switch (pid){
      case -1: //error
        error("Enc Fork: Failed\n");
      break;

      case 0: // child
        memset(buffer, '\0', sizeof(buffer));
        do{ // send all of message
          memset(inbuffer, '\0', sizeof(inbuffer));
          int read = recv(sendSocket, inbuffer, sizeof(inbuffer), 0); // get sent
          if(read < 0){
            error("SERVER: ERROR reading from socket.\n");
          }
          if(buffer[0] == '\0'){
            strcpy(buffer, inbuffer);
          }
          else{
            strcat(buffer, inbuffer);
          }
        }while(strstr(buffer, "eom\n") == NULL);

        if(buffer[0] == 'D'){
          strcpy(buffer, decrypt(buffer)); // decrypt ciphertext
        }
        else{
          strcpy(buffer, "B\neom\n");
        }

        int i = 0;
        int size = strlen(buffer);
        int sizeLeft = size;
        while(i < size){ // send all of message
          int sent = send(sendSocket, buffer, sizeLeft, 0); // send to server
          if(sent < 0){
            error("CLIENT: ERROR writing to socket.\n");
          }
          i += sent;
          sizeLeft -= sent;
        }
        memset(buffer, '\0', sizeof(buffer));
        close(sendSocket);
      break;

      default: // parent
        waitpid(pid, &status, 0);
      break;
    }
  }

  close(listenSocket);

  return 0;
}
