#Golf With Friends

A fantastic real-time group scorekeeping application.


###Setup
After first checking out the project, run these commands from the project root:
```
npm install
npm install grunt-cli -g
```

Then run [grunt](http://gruntjs.com/) to assemble the static pages and start a web server.  This web server listens on `localhost:8000` by default.
```
grunt
```

Before deploying with divshot, run `grunt prod` to combine all the javascript files into one.

####[Grunt](http://gruntjs.com/)
`src/` contains all the files that you'll be editing.  `grunt` assembles those files and puts them in the `dist/` folder which is pushed out to divshot when the `divshot push <CONFIG>` command is run.

`src/pages/` contains the partials that go inside the content blocks that are inside of `page.swig` and `base.swig`

`Gruntfile.js` does a lot of things:
  
In default mode:
  + assembles the `src/pages` template files with the master page files and spits out HTML pages into `dist/`
  + combines and minifies `.less` files into `dist/css/all.min.css`
  + runs a web server on `http://localhost:8000/`

In `prod` mode:
  + assembles the `src/pages/` template files with the master page files and spits out HTML pages into `dist/`
  + combines and minifies `.less` files into `dist/css/all.min.css`
  + combines and minifies `.js` files into `dist/js/all.min.js`
  + runs a web server on `http://localhost:8000/`

####[Divshot](https://divshot.com/)
Look over the Divshot [Hosting 101](http://docs.divshot.com/guides/getting-started) and install `divshot-cli`:

```
npm install divshot-cli -g
```

Login to `divshot-cli` using the `divshot login` command.  This should open a browser window where you'll authenticate the divshot cli environment.

#####[Environment Variables](http://docs.divshot.com/guides/environment-variables)
Each of the three Divshot application environments (development, staging, and production) has a `CONFIG` environment variable.  The `CONFIG` environment variable is similar to the `DEBUG` constant in Visual Studo except `CONFIG` reports the environmant name as `development`, `staging`, or `production` instead of a boolean value.

This variable is stored in `app.divshotConfig`.  If you are not browsing the app on `*.divshot.io`, the value of `app.divshotConfig` will always be `development`.

You may also want to check out Divshot's [Builds and Environments](http://docs.divshot.com/guides/builds) page if you'd like to know more about their three-tiered environment system.

#####[Deployment](http://docs.divshot.com/guides/builds#deploying-to-an-environment)
To deploy to [development.golf-with-friends.divshot.io](http://development.golf-with-friends.divshot.io/), run from the repo root:
```
divshot push
```
or (replace `<CONFIG>` with `development`, `staging`, or `production`)
```
divshot push <CONFIG>
```

#####[Promotion](http://docs.divshot.com/guides/builds#promoting-builds-and-rollback)
To promote to [staging](http://staging.golf-with-friends.divshot.io/) or [production](http://golf-with-friends.divshot.io/):
```
divshot promote development staging
```
or
```
divshot promote development production
```
