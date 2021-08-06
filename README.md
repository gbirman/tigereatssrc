This webapp is configured for both local development and deployment to [Heroku](https://tigereats-dev.herokuapp.com/). 

To run the app locally, complete the following steps:

- run `pipenv install` in the `Server` folder and the root folder to install requirements. 
- in the `mongo_connect.py` file, go to the flask app declaration code, which can be found immediately after the imports. Select whether you want to use the production build or the development code by setting the `mode` variable to "prod" or "dev". Note that setting the `debug` argument to True in the module main method will allow for hot server reloads.
- run `pipenv run python mongo_connect.py` to start listening on localhost port 5000.
- navigate back the root folder and run `npm start`. This will open [http://localhost:3000](http://localhost:3000) in the browser and you should be good to go. 

To deploy the app:

- in the `mongo_connect.py` file, go to the flask app declaration code, which can be found immediately after the imports. Change `mode` variable to "prod".
- The following steps are all included in `deploy.sh`:
  - build the production code by running `npm run build` from the root folder.
  - Move `favicons/favicon-16x16.png` to the `build/static/media` folder.
  - commit and push your changes to the remote branch 
  - run `git push heroku master` if you are deploying the master branch, or `git push heroku {branch}:master`, where `branch` is the name branch you want to deploy to https://tigereats-dev.herokuapp.com/. This assumes you have heroku configured as a remote. You can set this up by following the instructions [here](https://devcenter.heroku.com/articles/git)
