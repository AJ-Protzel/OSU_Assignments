
// Write a C++ program that uses recursion to create the Fibonacci Table as in the example below 

#include <iostream>
using namespace std;

int fib(int n);
//****************************************************************************************Main
int main() {
  int N;
  do{
    cout << "Enter fib number: ";
    cin >> N;
  }while(N <= 0);

  for(int i = 0; i < N; ++i){ // display and call fib sequence
    cout << i+1 << ". " << fib(i) << endl;
  }

  cout << endl << endl;

  int a, b, c;
  cout << "Enter first number: ";
    cin >> a;
  cout << "Enter second number: ";
    cin >> b;
  cout << endl;

  c = a / b;
  for(int i = 0; c != 0; ++i){ // calc GCF
    //cout << a << " " << b << " " << c << endl;
    a = b;
    b = c;
    c = a / b;
  }
  //cout << "GCF is " << a << " " << b << " " << c << " ";
  cout << "GCF is: " << b;

  return 0;
}
//-----------------------------------------------------------------------------------Functions
//-------------------------------------------------------------------------------fib
int fib(int n){
  if(n == 0 || n == 1) return 1;

  return fib(n - 1) + fib(n - 2);
}