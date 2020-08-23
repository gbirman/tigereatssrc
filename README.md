This webapp is configured for both local development and deployment to [Heroku](https://tigereats-dev.herokuapp.com/). 

To run the app locally, complete the following steps:

- run `pipenv shell` in the `Server` folder to enter the virtual shell.
- run `pipenv sync` to install the requirements for the server code.
- in the `mongo_connect.py` file, go to the flask app declaration code, which can be found immediately after the imports. Select whether you want to use the production build or the development code by uncommenting/commenting the relevant line.
- run `python mongo_connect.py` to serve frontend served on localhost:3000 with npm start command, backend served on localhost:5000 ).
- navigate back the root folder and run `npm start`. This will open [http://localhost:3000](http://localhost:3000) in the browser and you should be good to go. 

To deploy the app:

- in the `mongo_connect.py` file, go to the flask app declaration code, which can be found immediately after the imports. Uncomment the production code and comment out the development code. 
- build the production code by running `npm run build` from the root folder.
- commit and push your changes to the remote branch 
- run `git push heroku {branch}:master`, where `branch` is the name branch you want to deploy to https://tigereats-dev.herokuapp.com/. 
