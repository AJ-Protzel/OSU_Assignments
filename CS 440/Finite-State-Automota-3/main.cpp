#include <iostream>
using namespace std;

int state(int s, char c);

int main(){
  string word; // = "bbb";
  cout << "Input = ";
  getline(cin,word);

  char symbol;
  int s = 0;

  for(int i = 0; i < word.size(); i++){
    symbol = word[i];
    s = state(s,symbol);
  }
  
  if(s == 3)
    cout << "\n accepted";
  else
    cout << "\n rejected";
  
  return 0;
}

int state(int s, char c){
  int ns;
  switch (s){
    case 0: if(c == ' '){ns = 0; break;}
            else if(c == 'a'){ns = 0; break;}
            else if(c == 'b'){ns = 1; break;}
    case 1: if(c == 'a'){ns = 1; break;}
            else if(c == 'b'){ns = 2; break;}
    case 2: if(c == 'a'){ns = 2; break;}
            else if(c == 'b'){ns = 3; break;}
    case 3: if(c == 'a'){ns = 3; break;}
            else if(c == 'b'){ns = 0; break;}
  }
  
  return ns;
}