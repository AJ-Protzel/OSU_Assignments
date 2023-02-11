#include <iostream>
using namespace std;

void table();

int main() {
  int P, Q, R;

  cout << ">>ENTER P:";
  cin >> P;
  cout << ">>ENTER Q:";
  cin >> Q;
  cout << ">>ENTER R:";
  cin >> R;
  cout << endl;

  table();

  cout << P << "  " << Q << "  " << R << " | " << (((P == 1) && (Q == 1)) || ((Q == 1) && (R == 1)) || ((P == 1) && (R == 1)));
}

void table(){
  cout << "P  Q  R | x" << endl;
  cout << "-----------" << endl;
  cout << "1  1  1 | 1" << endl;
  cout << "1  1  0 | 1" << endl;
  cout << "1  0  0 | 0" << endl;
  cout << "0  0  0 | 0" << endl;
  cout << "0  0  1 | 0" << endl;
  cout << "0  1  1 | 1" << endl;
  cout << "1  0  1 | 1" << endl;
  cout << "0  1  0 | 0" << endl;
  cout << "-----------" << endl;
}