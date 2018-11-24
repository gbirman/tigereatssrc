# TigerEatsCOS333

## Rules of thumb
* Never work on or push to master directly (pushing directly to master is disabled). Always create a branch and submit a pull request (see below).
* Pull requests can be then merged to the master if there is at least one approval of the pull request.

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
* **Documentation standard**
	- At the very least, each major class/interface should have a comment at the top explaining what it does
	- If a function cannot be explained by itself (e.g., a 100-line function doing very arcane black magic), then a docstring is required to explain what�s the input & output of that blackbox.
