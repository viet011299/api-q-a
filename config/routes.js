/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': {
    view: 'homepage'
  },
  //auth
  'post /auth/registration': 'AuthController.registration',
  'post /auth/login': 'AuthController.login',
  'post /auth/getInfor': 'AuthController.getInfor',
  'post /auth/myauth': 'AuthController.myauth',
  'post /auth/editpassword': 'AuthController.editpassword',

  //admin
  'post /admin/getAll': 'AdminController.getAll',
  'post /admin/changeRole': 'AdminController.changeRole',
  'post /admin/create': 'AdminController.create',
  'post /admin/resetpassword': 'AdminController.resetpassword',
  'post /admin/history': 'AdminController.history',
  'post /admin/listall': 'AdminController.listall',

  //section
  'post /section/create': 'SectionCotroller.create',
  'post /section/list': 'SectionCotroller.list',
  'post /section/viewsec': 'SectionCotroller.viewsec',
  'post /section/edit': 'SectionCotroller.edit',
  'post /section/delete': 'SectionCotroller.delete',
  'post /section/closesec': 'SectionCotroller.closesec',
  'post /section/opensec': 'SectionCotroller.opensec',

  //question
  'post /question/list': 'QuestionController.list',
  'post /question/viewquestion': 'QuestionController.viewquestion',
  'post /question/create': 'QuestionController.create',
  'post /question/edit': 'QuestionController.edit',
  'post /question/delete': 'QuestionController.delete',

  //anw
  'post /answer/create': 'AnswerController.create',
  'post /answer/edit': 'AnswerController.edit',
  'post /answer/delete': 'AnswerController.delete',

  //survey
  'post /survey/create': 'SurveyController.create',
  'post /survey/viewsurvey': 'SurveyController.viewsurvey',
  'post /survey/delete': 'SurveyController.delete',
  'post /survey/open': 'SurveyController.open',
  'post /survey/close': 'SurveyController.close',
  'post /survey/doSurvey': 'SurveyController.doSurvey',
  'post /survey/statistics': 'SurveyController.statistics',

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};
