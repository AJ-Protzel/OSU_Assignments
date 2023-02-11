// gcc -std=gnu99 -o main main.c
./compileall

// all
./p5testscript 50777 50778 > mytestresults 2>&1
./p5testscript 50777 50778

// enc_server
./keygen 20 > key20

// enc_server
./enc_server 50778 &

// enc_client
./enc_client plaintext3 key20 50778

// dec_server
./dec_server 50779 &

// dec_client
./dec_client ciphertext3 key20 50779