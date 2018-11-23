# TigerEatsCOS333

## Rules of thumb
* Never push to master directly (and it is disabled). Always create a branch and submit a pull request.
* Pull requests can be then merged to the master condition on
   1. All tests are passed (run `make lint` to make sure it passes all tests on your local)
   2. At least one approval of the pull request.

## How to contribute?
* Start with the latest master (`git pull origin`)
* Create a branch (`git checkout -b BRANCH_NAME`)
* write some code, commit, and push to remote 
    * `git add .`
    * `git commit -m 'some message'`
    * `git push origin --set-upstream BRANCH_NAME` <- for the first time, or just `git push origin`
* Go to Bitbucket and create a pull request.
* Don't use 'Pandas' library!

## Better Python Coding Practice
* Use an advanced IDE, such as PyCharm or VS Studio, so that you get lint warnings.
* Write [Pythonic code](https://docs.python-guide.org/writing/style/)
* Write unit test (ideally we should have > 80% test coverage)
    - but, be judicious about your time.
    - tests should at least cover the functions expose to the outside  
* Use lint tools (e.g., `flake8`, `pylint`, `mypy`), please refer to `make lint` for details.
* **Documentation standard**
	- We don’t need to enforce comment (i.e., not all methods need comments). Enforcing comment (in this case, use `pydoc`) does not help, because a non-sense comment will pass `pydoc`, but will not help human understanding the code.
	- At the very least, each major class/interface should have a comment at the top explaining what it does
	- If a code can be explained by itself, people would prefer to read the code instead of reading the comment, because comments usually does not get updated (or copy-pasted) together with the code.
	- If a code cannot explain by itself (e.g., a 100-line function doing very arcane black magic), then a docstring is required to explain what’s the input & output of that blackbox.

## Other Refs
* [AWS API Gateway GET with lambda](https://docs.aws.amazon.com/apigateway/latest/developerguide/integrating-api-with-aws-services-lambda.html#api-as-lambda-proxy-expose-get-method-with-query-strings-to-call-lambda-function)
* [Package management via Serverless](https://serverless.com/blog/serverless-python-packaging/)
