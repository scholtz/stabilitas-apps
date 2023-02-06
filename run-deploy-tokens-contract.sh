python3 onchain/contracts/tokens/Tokens.py || error_code=$?
error_code_int=$(($error_code + 0))
if [ $error_code_int -ne 0 ]; then
    echo "tokens/Tokens.py build failed";
	exit 1;
fi

ts-node src/deploy-tokens-contract.ts || error_code=$?
error_code_int=$(($error_code + 0))
if [ $error_code_int -ne 0 ]; then
  echo "run failed";
	exit 1;
fi
