/* Use: swish.swi-prolog.org */

/* Adrien Protzel  */
/* Zinn Morton     */
/* Huy Nguyen      */
/* Alaric Hartsock */
/* Adam Oberg      */

/* Exercise 1 */
redefine_system_predicate(when).

when(275,10).
when(261,12).
when(381,11).
when(398,12).
when(399,12).

where(275,owen102).
where(261,dear118).
where(381,cov216).
where(398,dear118).
where(399,cov216).

enroll(mary,275).
enroll(john,275).
enroll(mary,261).
enroll(john,381).
enroll(jim,399).

/* a */
/*schedule(mary,P,T) -- P=owen102,T=10 P=dear118,T=12*/
/*schedule(S,cov216,T) -- S=john,T=11 S=jim,T=12*/
schedule(S, P, T) :- enroll(S,X), where(X,P), when(X,T).

/* b */
/*usage(cov216,T) -- T=11 T=12*/
usage(P, T) :- where(X,P), when(X,T).

/* c */
/*conflict(275,X) -- false*/
conflict(X1, X2) :- where(X1,P), when(X1,T), where(X2,P), when(X2,T), X1\=X2.

/* d */
/*meet(jim,Y) -- john*/
/*meet(jim,mary) -- false*/
meet(S1, S2) :- enroll(S1,X), enroll(S2,X), S1\=S2.
meet(S1, S2) :- enroll(S1,X1), when(X1,T1), where(X1,P1), 
                enroll(S2,X2), when(X2,T2), where(X2,P1), 
                S1\=S2, (T1=:=T2-1;T1=:=T2+1).




                
/* Exercise 2 */
/* a */
/*rdup([1,2,3,3,4,5],M) -- M=[1,2,3,4,5]*/
rdup([L|R], M) :- (
    L=[] -> append([],[],M);
    R=[] -> append([L],[],M);
    member(L,R) -> rdup(R,N), append([],N,M);
    not(member(L,R)) -> rdup(R,N), append([L],N,M)
).

/* b */
/*flat([a,b,[c,d],[],[[[e]]],f],L) -- L=[a,b,c,d,e,f]*/
flat([], L) :- append([],[],L).
flat([L|R], [L|X]) :- L\=[], L\=[_|_], flat(R,X).
flat([L|R], LI) :- flat(L,X1), flat(R,X2), append(X1,X2,LI).

/* c */
/*project([2,4,5],[a,b,c,d],L) -- L=[b,d]*/
subtractall([], S) :- append([],[],S).
subtractall([L|R], S) :- subtractall(R, X), Y is L-1, append([Y], X, S).

project([], _, L) :- append([],[],L).
project(_, [], L) :- append([],[],L).
project([1|L1R], [L2L|L2R], L) :- subtractall(L1R,X), project(X,L2R,Y), append([L2L],Y,L), !.
project(L1, [_|L2R], L) :- subtractall(L1,X), project(X,L2R,L).
