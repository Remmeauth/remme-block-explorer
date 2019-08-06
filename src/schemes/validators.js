export const newAccountValidator = (item, value, callback) => {

  if (value.length !== 12) {
    callback("must be 12 characters.");
  }

  if (value.slice(11,12) === '.') {
    callback("Last character can't be '.'.");
  }

  if (!/^[_a-z1-5"."]*((-|\s)*[_a-z1-5])*$/g.test(value)) {
    callback("[1-5][a-z]['.'] only");
  }

  if (value.slice(0,1) === '.') {
    callback("First character can't be '.'.");
  }

  callback();
};

export const pubKeyValidator = (item, value, callback) => {

  if (value.length !== 53) {
    callback("Invalid Pub Key");
  }

  if (value.slice(0,3) !== 'EOS' && value.slice(0,3) !== 'REM' ) {
    callback("Invalid Pub Key");
  }

  callback();
};
