python3 onchain/contracts/reserve/Reserve.py || error_code=$?
error_code_int=$(($error_code + 0))
if [ $error_code_int -ne 0 ]; then
    echo "reserve/Reserve.py build failed";
	exit 1;
fi

ts-node src/deploy-reserve-contract.ts || error_code=$?
error_code_int=$(($error_code + 0))
if [ $error_code_int -ne 0 ]; then
  echo "run failed";
	exit 1;
fi
