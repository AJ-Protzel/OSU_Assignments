#include <iostream>
using namespace std;

void questions();
void extra();

int main() {
  //questions();
  extra();
}

void questions(){
  int P, Q, R;

  cout << ">>ENTER P:";
  cin >> P;
  cout << ">>ENTER Q:";
  cin >> Q;
  cout << ">>ENTER R:";
  cin >> R;
  cout << endl;

  cout << "Question 1: " << ((P == Q) && (Q != R)) << " :((P == Q) && (Q != R))";
  cout << endl;

  cout << "Question 2: " << ((P == Q) && (Q == R)) << " :((P == Q) && (Q == R))";
  cout << endl;

  cout << "Question 3: " << ((P == 1) || (Q == 1)) << " :((P == 1) || (Q == 1))";
  cout << endl;

  cout << "Question 4: " << (((P == 1) && (Q == 1)) || ((Q == 1) && (R == 1)) || ((P == 1) && (R == 1))) << " :(((P == 1) && (Q == 1)) || ((Q == 1) && (R == 1)) || ((P == 1) && (R == 1)))";
  cout << endl;

  cout << endl << endl;
}

void extra(){

  cout << "Enter which is green";
  while()

  bool p[4] = {};
  bool q[4] = {};
  bool r[4] = {};

  for(int i = 0; i < 4; ++i){
    cout << ">>ENTER p" << i << ": ";
    cin >> p[i];
    cout << ">>ENTER q" << i << ": ";
    cin >> q[i];
    cout << ">>ENTER r" << i << ": ";
    cin >> r[i];
  }

  //cout << ();
  cout << endl;
}